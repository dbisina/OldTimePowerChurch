import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSermonSchema, insertAnnouncementSchema, insertSubscriberSchema } from "@shared/schema";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import mammoth from "mammoth";
import { v2 as cloudinary } from "cloudinary";
// @ts-ignore - pdf-parse is a CommonJS module
import pdf from "pdf-parse";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Configure Cloudinary (credentials must be set in environment variables)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Generate a URL-friendly slug from a title string
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

// Configure multer for memory storage (we don't save files, just extract text)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/msword' // .doc (may not parse well)
    ];
    if (allowedTypes.includes(file.mimetype) || 
        file.originalname.endsWith('.docx') || 
        file.originalname.endsWith('.pdf')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOCX files are allowed'));
    }
  }
});

// Configure multer for image uploads - use memory storage for Cloudinary
const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit for images
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, GIF, and WebP images are allowed'));
    }
  }
});

// Auth middleware
function authenticateToken(req: Request, res: Response, next: Function) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  
  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }
    (req as any).user = user;
    next();
  });
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // ==================== AUTH ROUTES ====================
  
  // Login
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      // Update last login
      await storage.updateUser(user.id, { lastLogin: new Date() } as any);
      
      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });
  
  // Register (initial admin setup - disable after first user)
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const { username, email, password, role = "admin" } = req.body;
      
      if (!username || !email || !password) {
        return res.status(400).json({ error: "Username, email and password are required" });
      }
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "User with this email already exists" });
      }
      
      const existingUsername = await storage.getUserByUsername(username);
      if (existingUsername) {
        return res.status(400).json({ error: "Username already taken" });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const user = await storage.createUser({
        username,
        email,
        password: hashedPassword,
        role,
      });
      
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      res.status(201).json({
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
        }
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Registration failed" });
    }
  });
  
  // Verify token
  app.get("/api/auth/verify", authenticateToken, (req: Request, res: Response) => {
    res.json({ valid: true, user: (req as any).user });
  });

  // ==================== PUBLIC ROUTES ====================
  
  // Sermons
  app.get("/api/sermons", async (req: Request, res: Response) => {
    try {
      const { featured, serviceDay } = req.query;
      let sermons;
      
      if (featured === "true") {
        sermons = await storage.getFeaturedSermons();
      } else if (serviceDay) {
        sermons = await storage.getSermonsByServiceDay(serviceDay as string);
      } else {
        sermons = await storage.getAllSermons();
      }
      
      res.json(sermons);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sermons" });
    }
  });

  app.get("/api/sermons/:slug", async (req: Request, res: Response) => {
    try {
      // Try to find by slug first, then by ID for backwards compatibility
      let sermon = await storage.getSermonBySlug(req.params.slug);
      if (!sermon) {
        sermon = await storage.getSermon(req.params.slug);
      }
      if (!sermon) {
        return res.status(404).json({ error: "Sermon not found" });
      }
      res.json(sermon);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sermon" });
    }
  });

  // Announcements
  app.get("/api/announcements", async (req: Request, res: Response) => {
    try {
      const { active, pinned } = req.query;
      let announcements;
      
      if (active === "true") {
        announcements = await storage.getActiveAnnouncements();
      } else if (pinned === "true") {
        announcements = await storage.getPinnedAnnouncements();
      } else {
        announcements = await storage.getAllAnnouncements();
      }
      
      res.json(announcements);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch announcements" });
    }
  });

  app.get("/api/announcements/:slug", async (req: Request, res: Response) => {
    try {
      // Try to find by slug first, then by ID for backwards compatibility
      let announcement = await storage.getAnnouncementBySlug(req.params.slug);
      if (!announcement) {
        announcement = await storage.getAnnouncement(req.params.slug);
      }
      if (!announcement) {
        return res.status(404).json({ error: "Announcement not found" });
      }
      res.json(announcement);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch announcement" });
    }
  });

  // Newsletter subscription
  app.post("/api/subscribe", async (req: Request, res: Response) => {
    try {
      const { name, email, preferredServiceDay } = req.body;
      
      // Check if already subscribed
      const existing = await storage.getSubscriberByEmail(email);
      if (existing) {
        if (existing.status === "unsubscribed") {
          // Reactivate subscription
          await storage.updateSubscriber(existing.id, { status: "active" });
          return res.json({ message: "Subscription reactivated" });
        }
        return res.status(400).json({ error: "Email already subscribed" });
      }
      
      const subscriber = await storage.createSubscriber({
        name,
        email,
        source: "website",
        preferredServiceDay,
        status: "active",
        tags: ["newsletter"],
      });
      
      res.status(201).json({ message: "Subscribed successfully", id: subscriber.id });
    } catch (error) {
      res.status(500).json({ error: "Failed to subscribe" });
    }
  });

  // ==================== ADMIN ROUTES ====================
  
  // YouTube metadata endpoint
  app.get("/api/youtube/metadata", async (req: Request, res: Response) => {
    try {
      const { url } = req.query;
      if (!url || typeof url !== "string") {
        return res.status(400).json({ error: "URL is required" });
      }
      
      // Extract video ID
      const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
        /^([a-zA-Z0-9_-]{11})$/,
      ];
      let videoId: string | null = null;
      for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) {
          videoId = match[1];
          break;
        }
      }
      
      if (!videoId) {
        return res.status(400).json({ error: "Invalid YouTube URL" });
      }
      
      // Fetch oEmbed data (no API key needed)
      const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
      const response = await fetch(oembedUrl);
      
      if (!response.ok) {
        return res.status(404).json({ error: "Video not found" });
      }
      
      const data = await response.json();
      
      res.json({
        title: data.title || "",
        author: data.author_name || "",
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        videoId,
      });
    } catch (error) {
      console.error("YouTube metadata error:", error);
      res.status(500).json({ error: "Failed to fetch video metadata" });
    }
  });
  
  // Document text extraction endpoint (for sermon outlines)
  app.post("/api/extract-document", upload.single('document'), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      
      const buffer = req.file.buffer;
      const filename = req.file.originalname.toLowerCase();
      let extractedText = "";
      
      if (filename.endsWith('.docx')) {
        // Parse DOCX using mammoth
        const result = await mammoth.extractRawText({ buffer });
        extractedText = result.value;
      } else if (filename.endsWith('.pdf')) {
        // Parse PDF using pdf-parse
        const data = await pdf(buffer);
        extractedText = data.text;
      } else {
        return res.status(400).json({ error: "Unsupported file format. Please upload a DOCX or PDF file." });
      }
      
      // Clean up the extracted text
      extractedText = extractedText
        .replace(/\r\n/g, '\n')  // Normalize line endings
        .replace(/\n{3,}/g, '\n\n')  // Remove excessive blank lines
        .trim();
      
      if (!extractedText) {
        return res.status(400).json({ error: "Could not extract text from document. The file might be empty or corrupted." });
      }
      
      res.json({
        text: extractedText,
        filename: req.file.originalname,
        size: req.file.size,
      });
    } catch (error) {
      console.error("Document extraction error:", error);
      res.status(500).json({ error: "Failed to extract text from document" });
    }
  });

  // Image upload endpoint (for announcement graphics) - uploads to Cloudinary
  app.post("/api/upload-image", imageUpload.single('image'), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image uploaded" });
      }
      
      // Upload to Cloudinary
      const result = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "otpc-announcements", // Organize in a folder
            resource_type: "image",
            transformation: [
              { quality: "auto:good" }, // Automatic quality optimization
              { fetch_format: "auto" }, // Automatic format selection (webp, etc.)
            ],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(req.file!.buffer);
      });
      
      res.json({
        url: result.secure_url,
        publicId: result.public_id,
        filename: req.file.originalname,
        size: req.file.size,
        width: result.width,
        height: result.height,
      });
    } catch (error) {
      console.error("Image upload error:", error);
      res.status(500).json({ error: "Failed to upload image" });
    }
  });
  
  // Admin Sermons
  app.post("/api/admin/sermons", async (req: Request, res: Response) => {
    try {
      // Generate slug from title
      const baseSlug = slugify(req.body.title || 'sermon');
      let slug = baseSlug;
      let counter = 1;
      
      // Ensure unique slug
      while (await storage.getSermonBySlug(slug)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      
      // Convert date string to Date object
      const body = {
        ...req.body,
        slug,
        date: req.body.date ? new Date(req.body.date) : new Date(),
      };
      
      const result = insertSermonSchema.safeParse(body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid sermon data", details: result.error });
      }
      
      const sermon = await storage.createSermon(result.data);
      res.status(201).json(sermon);
    } catch (error) {
      console.error("Create sermon error:", error);
      res.status(500).json({ error: "Failed to create sermon" });
    }
  });

  app.put("/api/admin/sermons/:id", async (req: Request, res: Response) => {
    try {
      const sermon = await storage.updateSermon(req.params.id, req.body);
      if (!sermon) {
        return res.status(404).json({ error: "Sermon not found" });
      }
      res.json(sermon);
    } catch (error) {
      res.status(500).json({ error: "Failed to update sermon" });
    }
  });

  app.delete("/api/admin/sermons/:id", async (req: Request, res: Response) => {
    try {
      const success = await storage.deleteSermon(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Sermon not found" });
      }
      res.json({ message: "Sermon deleted" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete sermon" });
    }
  });

  // Admin Announcements
  app.post("/api/admin/announcements", async (req: Request, res: Response) => {
    try {
      // Generate slug from title
      const baseSlug = slugify(req.body.title || 'announcement');
      let slug = baseSlug;
      let counter = 1;
      
      // Ensure unique slug
      while (await storage.getAnnouncementBySlug(slug)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      
      // Convert date strings to Date objects
      const body = {
        ...req.body,
        slug,
        publishedAt: req.body.publishedAt ? new Date(req.body.publishedAt) : new Date(),
        expiresAt: req.body.expiresAt ? new Date(req.body.expiresAt) : null,
      };
      
      const result = insertAnnouncementSchema.safeParse(body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid announcement data", details: result.error });
      }
      
      const announcement = await storage.createAnnouncement(result.data);
      res.status(201).json(announcement);
    } catch (error) {
      res.status(500).json({ error: "Failed to create announcement" });
    }
  });

  app.put("/api/admin/announcements/:id", async (req: Request, res: Response) => {
    try {
      // Convert date strings to Date objects
      const body = {
        ...req.body,
        publishedAt: req.body.publishedAt ? new Date(req.body.publishedAt) : undefined,
        expiresAt: req.body.expiresAt ? new Date(req.body.expiresAt) : null,
      };
      
      const announcement = await storage.updateAnnouncement(req.params.id, body);
      if (!announcement) {
        return res.status(404).json({ error: "Announcement not found" });
      }
      res.json(announcement);
    } catch (error) {
      res.status(500).json({ error: "Failed to update announcement" });
    }
  });

  app.delete("/api/admin/announcements/:id", async (req: Request, res: Response) => {
    try {
      const success = await storage.deleteAnnouncement(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Announcement not found" });
      }
      res.json({ message: "Announcement deleted" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete announcement" });
    }
  });

  // Admin Subscribers
  app.get("/api/admin/subscribers", async (req: Request, res: Response) => {
    try {
      const { active } = req.query;
      const subscribers = active === "true" 
        ? await storage.getActiveSubscribers()
        : await storage.getAllSubscribers();
      res.json(subscribers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch subscribers" });
    }
  });

  app.post("/api/admin/subscribers", async (req: Request, res: Response) => {
    try {
      const result = insertSubscriberSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid subscriber data", details: result.error });
      }
      
      const subscriber = await storage.createSubscriber(result.data);
      res.status(201).json(subscriber);
    } catch (error) {
      res.status(500).json({ error: "Failed to create subscriber" });
    }
  });

  app.put("/api/admin/subscribers/:id", async (req: Request, res: Response) => {
    try {
      const subscriber = await storage.updateSubscriber(req.params.id, req.body);
      if (!subscriber) {
        return res.status(404).json({ error: "Subscriber not found" });
      }
      res.json(subscriber);
    } catch (error) {
      res.status(500).json({ error: "Failed to update subscriber" });
    }
  });

  app.delete("/api/admin/subscribers/:id", async (req: Request, res: Response) => {
    try {
      const success = await storage.deleteSubscriber(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Subscriber not found" });
      }
      res.json({ message: "Subscriber deleted" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete subscriber" });
    }
  });

  // Admin Users
  app.get("/api/admin/users", async (req: Request, res: Response) => {
    try {
      const users = await storage.getAllUsers();
      // Don't send password hashes
      const safeUsers = users.map(({ password, ...user }) => user);
      res.json(safeUsers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  // Dashboard Stats
  app.get("/api/admin/stats", async (req: Request, res: Response) => {
    try {
      const [sermons, announcements, subscribers] = await Promise.all([
        storage.getAllSermons(),
        storage.getAllAnnouncements(),
        storage.getAllSubscribers(),
      ]);
      
      const now = new Date();
      const activeAnnouncements = announcements.filter(a => {
        const published = new Date(a.publishedAt) <= now;
        const notExpired = !a.expiresAt || new Date(a.expiresAt) > now;
        return published && notExpired;
      });
      
      res.json({
        totalSermons: sermons.length,
        featuredSermons: sermons.filter(s => s.featured).length,
        totalAnnouncements: announcements.length,
        activeAnnouncements: activeAnnouncements.length,
        totalSubscribers: subscribers.length,
        activeSubscribers: subscribers.filter(s => s.status === "active").length,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  return httpServer;
}
