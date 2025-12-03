import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  LogOut,
  BookOpen,
  Megaphone,
  Users,
  Settings,
  Plus,
  Edit2,
  Trash2,
  BarChart3,
  Mail,
  Calendar,
  Video,
  Image as ImageIcon,
  Star,
  Pin,
  Clock,
  Download,
  CheckCircle2,
  TrendingUp,
  FileText,
  Upload,
  Loader2,
  Music,
  MessageCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Sermon {
  id: string;
  title: string;
  preacher: string;
  serviceDay: string;
  date: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  startSec: number;
  endSec: number;
  excerpt?: string;
  outline?: string;
  featured: boolean;
  scriptures?: string[];
  tags?: string[];
}

interface Announcement {
  id: string;
  title: string;
  type: "graphic" | "non_graphic";
  contentHtml?: string;
  graphicUrl?: string;
  publishedAt: string;
  expiresAt?: string;
  pinned: boolean;
  sendEmail?: boolean;
}

interface Subscriber {
  id: string;
  email: string;
  name: string;
  subscribedAt: string;
  status: "active" | "unsubscribed";
  preferredServiceDay?: string;
}

interface WorshipPrayer {
  id: string;
  title: string;
  category: "worship" | "prayer";
  videoUrl?: string;
  startSec: number;
  endSec?: number;
  lyrics?: string;
  chordChart?: string;
  attachments?: string[];
  createdAt: string;
}

interface Stats {
  totalSermons: number;
  featuredSermons: number;
  totalAnnouncements: number;
  activeAnnouncements: number;
  totalSubscribers: number;
  activeSubscribers: number;
}

// Helper to extract YouTube video ID
function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// Helper to format seconds to MM:SS
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Helper to parse time string to seconds
function parseTimeToSeconds(timeStr: string): number {
  const parts = timeStr.split(':').map(p => parseInt(p) || 0);
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 0;
}

export default function AdminDashboardPage() {
  const [, setLocation] = useLocation();
  const [adminUser, setAdminUser] = useState<{ email: string; username: string; role: string } | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  
  // State for content
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [worshipPrayerItems, setWorshipPrayerItems] = useState<WorshipPrayer[]>([]);

  // Dialog states
  const [sermonDialogOpen, setSermonDialogOpen] = useState(false);
  const [announcementDialogOpen, setAnnouncementDialogOpen] = useState(false);
  const [worshipPrayerDialogOpen, setWorshipPrayerDialogOpen] = useState(false);
  
  const [editingSermon, setEditingSermon] = useState<Sermon | null>(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [editingWorshipPrayer, setEditingWorshipPrayer] = useState<WorshipPrayer | null>(null);

  // Form states
  const [sermonForm, setSermonForm] = useState({
    title: "",
    preacher: "",
    serviceDay: "sun",
    date: "",
    videoUrl: "",
    thumbnailUrl: "",
    startTime: "0:00",
    endTime: "",
    excerpt: "",
    outline: "",
    featured: false,
    scriptures: "",
    tags: "",
  });

  const [outlineUploading, setOutlineUploading] = useState(false);
  const [graphicUploading, setGraphicUploading] = useState(false);

  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    contentHtml: "",
    type: "non_graphic" as "graphic" | "non_graphic",
    publishedAt: new Date().toISOString().split('T')[0],
    expiresAt: "",
    pinned: false,
    graphicUrl: "",
    sendEmail: false,
  });

  const [worshipPrayerForm, setWorshipPrayerForm] = useState({
    title: "",
    category: "worship" as "worship" | "prayer",
    videoUrl: "",
    startTime: "0:00",
    endTime: "",
    lyrics: "",
    chordChart: "",
  });

  const { toast } = useToast();

  // Helper to get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem("adminToken");
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    };
  };

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const userStr = localStorage.getItem("adminUser");

    if (!token) {
      setLocation("/login");
      return;
    }

    // Verify token is still valid
    fetch("/api/auth/verify", {
      headers: { "Authorization": `Bearer ${token}` },
    }).then(res => {
      if (!res.ok) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        setLocation("/login");
        return;
      }
    }).catch(() => {
      // Token verification failed, but continue if we have user data
    });

    if (userStr) {
      try {
        setAdminUser(JSON.parse(userStr));
      } catch {
        setAdminUser(null);
      }
    }
    fetchData();
  }, [setLocation]);

  const fetchData = async () => {
    try {
      const headers = getAuthHeaders();
      const [sermonsRes, announcementsRes, subscribersRes, worshipRes, statsRes] = await Promise.all([
        fetch("/api/sermons"),
        fetch("/api/announcements"),
        fetch("/api/admin/subscribers", { headers }),
        fetch("/api/worship-prayer"),
        fetch("/api/admin/stats", { headers }),
      ]);

      if (sermonsRes.ok) {
        const data = await sermonsRes.json();
        setSermons(data);
      }
      if (announcementsRes.ok) {
        const data = await announcementsRes.json();
        setAnnouncements(data);
      }
      if (subscribersRes.ok) {
        const data = await subscribersRes.json();
        setSubscribers(data);
      }
      if (worshipRes.ok) {
        const data = await worshipRes.json();
        setWorshipPrayerItems(data);
      }
      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data);
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch data", variant: "destructive" });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    toast({ title: "Logged out successfully" });
    setLocation("/");
  };

  // Sermon handlers
  const openAddSermonDialog = () => {
    setEditingSermon(null);
    setSermonForm({
      title: "",
      preacher: "",
      serviceDay: "sun",
      date: "",
      videoUrl: "",
      thumbnailUrl: "",
      startTime: "0:00",
      endTime: "",
      excerpt: "",
      outline: "",
      featured: false,
      scriptures: "",
      tags: "",
    });
    setSermonDialogOpen(true);
  };

  // Auto-fetch YouTube metadata
  const fetchYouTubeMetadata = async (url: string) => {
    if (!url) return;
    
    try {
      const response = await fetch(`/api/youtube/metadata?url=${encodeURIComponent(url)}`);
      if (response.ok) {
        const data = await response.json();
        // Only auto-fill if fields are empty
        setSermonForm(prev => ({
          ...prev,
          title: prev.title || data.title || "",
          preacher: prev.preacher || data.author || "",
          thumbnailUrl: prev.thumbnailUrl || data.thumbnail || "",
        }));
        toast({ title: "Video info loaded", description: data.title });
      }
    } catch (error) {
      // Silently fail - user can still enter manually
    }
  };

  // Handle document upload for sermon outline
  const handleOutlineDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const isValidType = allowedTypes.includes(file.type) || 
                        file.name.toLowerCase().endsWith('.docx') || 
                        file.name.toLowerCase().endsWith('.pdf');
    
    if (!isValidType) {
      toast({ 
        title: "Invalid file type", 
        description: "Please upload a PDF or DOCX file", 
        variant: "destructive" 
      });
      return;
    }
    
    setOutlineUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('document', file);
      
      const response = await fetch('/api/extract-document', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to extract document');
      }
      
      const data = await response.json();
      
      setSermonForm(prev => ({
        ...prev,
        outline: data.text,
      }));
      
      toast({ 
        title: "Document processed", 
        description: `Extracted text from ${data.filename}` 
      });
    } catch (error) {
      toast({ 
        title: "Error", 
        description: error instanceof Error ? error.message : "Failed to process document", 
        variant: "destructive" 
      });
    } finally {
      setOutlineUploading(false);
      // Reset file input
      e.target.value = '';
    }
  };

  // Handle image upload for announcement graphic
  const handleGraphicImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({ 
        title: "Invalid file type", 
        description: "Please upload a JPEG, PNG, GIF, or WebP image", 
        variant: "destructive" 
      });
      return;
    }
    
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({ 
        title: "File too large", 
        description: "Please upload an image smaller than 5MB", 
        variant: "destructive" 
      });
      return;
    }
    
    setGraphicUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to upload image');
      }
      
      const data = await response.json();
      
      setAnnouncementForm(prev => ({
        ...prev,
        graphicUrl: data.url,
      }));
      
      toast({ 
        title: "Image uploaded", 
        description: `Successfully uploaded ${data.filename}` 
      });
    } catch (error) {
      toast({ 
        title: "Error", 
        description: error instanceof Error ? error.message : "Failed to upload image", 
        variant: "destructive" 
      });
    } finally {
      setGraphicUploading(false);
      // Reset file input
      e.target.value = '';
    }
  };

  const openEditSermonDialog = (sermon: Sermon) => {
    setEditingSermon(sermon);
    setSermonForm({
      title: sermon.title,
      preacher: sermon.preacher,
      serviceDay: sermon.serviceDay,
      date: new Date(sermon.date).toISOString().split('T')[0],
      videoUrl: sermon.videoUrl || "",
      thumbnailUrl: sermon.thumbnailUrl || "",
      startTime: formatTime(sermon.startSec),
      endTime: formatTime(sermon.endSec || 0),
      excerpt: sermon.excerpt || "",
      outline: sermon.outline || "",
      featured: sermon.featured,
      scriptures: sermon.scriptures?.join(", ") || "",
      tags: sermon.tags?.join(", ") || "",
    });
    setSermonDialogOpen(true);
  };

  const handleSaveSermon = async () => {
    if (!sermonForm.title || !sermonForm.preacher || !sermonForm.date) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }

    const payload = {
      title: sermonForm.title,
      preacher: sermonForm.preacher,
      serviceDay: sermonForm.serviceDay,
      date: new Date(sermonForm.date).toISOString(),
      videoUrl: sermonForm.videoUrl || null,
      thumbnailUrl: sermonForm.thumbnailUrl || null,
      startSec: parseTimeToSeconds(sermonForm.startTime),
      endSec: sermonForm.endTime ? parseTimeToSeconds(sermonForm.endTime) : null,
      excerpt: sermonForm.excerpt || null,
      outline: sermonForm.outline || null,
      featured: sermonForm.featured,
      scriptures: sermonForm.scriptures ? sermonForm.scriptures.split(',').map(s => s.trim()) : [],
      tags: sermonForm.tags ? sermonForm.tags.split(',').map(s => s.trim()) : [],
      outlineRichText: null,
      outlineDocUrl: null,
      createdBy: null,
    };

    try {
      const url = editingSermon ? `/api/admin/sermons/${editingSermon.id}` : "/api/admin/sermons";
      const method = editingSermon ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast({ title: "Success", description: `Sermon ${editingSermon ? "updated" : "created"} successfully` });
        setSermonDialogOpen(false);
        fetchData();
      } else {
        throw new Error("Failed to save sermon");
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to save sermon", variant: "destructive" });
    }
  };

  const handleDeleteSermon = async (id: string) => {
    if (!confirm("Are you sure you want to delete this sermon?")) return;

    try {
      const response = await fetch(`/api/admin/sermons/${id}`, { method: "DELETE" });
      if (response.ok) {
        toast({ title: "Sermon deleted successfully" });
        fetchData();
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete sermon", variant: "destructive" });
    }
  };

  // Announcement handlers
  const openAddAnnouncementDialog = () => {
    setEditingAnnouncement(null);
    setAnnouncementForm({
      title: "",
      contentHtml: "",
      type: "non_graphic",
      publishedAt: new Date().toISOString().split('T')[0],
      expiresAt: "",
      pinned: false,
      graphicUrl: "",
      sendEmail: false,
    });
    setAnnouncementDialogOpen(true);
  };

  const openEditAnnouncementDialog = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setAnnouncementForm({
      title: announcement.title,
      contentHtml: announcement.contentHtml || "",
      type: announcement.type,
      publishedAt: new Date(announcement.publishedAt).toISOString().split('T')[0],
      expiresAt: announcement.expiresAt ? new Date(announcement.expiresAt).toISOString().split('T')[0] : "",
      pinned: announcement.pinned,
      graphicUrl: announcement.graphicUrl || "",
      sendEmail: false,
    });
    setAnnouncementDialogOpen(true);
  };

  const handleSaveAnnouncement = async () => {
    if (!announcementForm.title || !announcementForm.publishedAt) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }

    const payload = {
      title: announcementForm.title,
      type: announcementForm.type,
      contentHtml: announcementForm.contentHtml || null,
      graphicUrl: announcementForm.graphicUrl || null,
      publishedAt: new Date(announcementForm.publishedAt).toISOString(),
      expiresAt: announcementForm.expiresAt ? new Date(announcementForm.expiresAt).toISOString() : null,
      pinned: announcementForm.pinned,
      sendEmail: announcementForm.sendEmail,
    };

    try {
      const url = editingAnnouncement ? `/api/admin/announcements/${editingAnnouncement.id}` : "/api/admin/announcements";
      const method = editingAnnouncement ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast({ title: "Success", description: `Announcement ${editingAnnouncement ? "updated" : "created"} successfully` });
        setAnnouncementDialogOpen(false);
        fetchData();
      } else {
        throw new Error("Failed to save announcement");
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to save announcement", variant: "destructive" });
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;

    try {
      const response = await fetch(`/api/admin/announcements/${id}`, { method: "DELETE" });
      if (response.ok) {
        toast({ title: "Announcement deleted successfully" });
        fetchData();
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete announcement", variant: "destructive" });
    }
  };

  // Worship/Prayer handlers
  const openAddWorshipPrayerDialog = () => {
    setEditingWorshipPrayer(null);
    setWorshipPrayerForm({
      title: "",
      category: "worship",
      videoUrl: "",
      startTime: "0:00",
      endTime: "",
      lyrics: "",
      chordChart: "",
    });
    setWorshipPrayerDialogOpen(true);
  };

  const openEditWorshipPrayerDialog = (item: WorshipPrayer) => {
    setEditingWorshipPrayer(item);
    setWorshipPrayerForm({
      title: item.title,
      category: item.category,
      videoUrl: item.videoUrl || "",
      startTime: formatTime(item.startSec),
      endTime: formatTime(item.endSec || 0),
      lyrics: item.lyrics || "",
      chordChart: item.chordChart || "",
    });
    setWorshipPrayerDialogOpen(true);
  };

  const handleSaveWorshipPrayer = async () => {
    if (!worshipPrayerForm.title || !worshipPrayerForm.category) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }

    const payload = {
      title: worshipPrayerForm.title,
      category: worshipPrayerForm.category,
      videoUrl: worshipPrayerForm.videoUrl || null,
      startSec: parseTimeToSeconds(worshipPrayerForm.startTime),
      endSec: worshipPrayerForm.endTime ? parseTimeToSeconds(worshipPrayerForm.endTime) : null,
      lyrics: worshipPrayerForm.lyrics || null,
      chordChart: worshipPrayerForm.chordChart || null,
      attachments: [],
    };

    try {
      const url = editingWorshipPrayer ? `/api/admin/worship-prayer/${editingWorshipPrayer.id}` : "/api/admin/worship-prayer";
      const method = editingWorshipPrayer ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast({ title: "Success", description: `Item ${editingWorshipPrayer ? "updated" : "created"} successfully` });
        setWorshipPrayerDialogOpen(false);
        fetchData();
      } else {
        throw new Error("Failed to save item");
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to save item", variant: "destructive" });
    }
  };

  const handleDeleteWorshipPrayer = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const response = await fetch(`/api/admin/worship-prayer/${id}`, { method: "DELETE" });
      if (response.ok) {
        toast({ title: "Item deleted successfully" });
        fetchData();
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete item", variant: "destructive" });
    }
  };

  const handleExportSubscribers = () => {
    const csv = [
      ["Name", "Email", "Status", "Preferred Service Day", "Subscribed At"],
      ...subscribers.map(s => [
        s.name,
        s.email,
        s.status,
        s.preferredServiceDay || "",
        new Date(s.subscribedAt).toLocaleDateString(),
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen pt-20 pb-12 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="font-serif text-5xl font-bold text-primary mb-2">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground text-lg">Welcome back, {adminUser?.username || adminUser?.email || 'Admin'}</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-primary/30 hover:bg-destructive/20 hover:border-destructive/50 hover:text-destructive transition-all"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card className="relative overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 shadow-lg hover:shadow-xl transition-all">
            <CardHeader className="pb-3 relative">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                <span>Total Sermons</span>
                <div className="p-2 rounded-full bg-primary/20">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-4xl font-bold text-primary">
                {stats?.totalSermons || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <Star className="h-3 w-3" />
                {stats?.featuredSermons || 0} featured
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-primary/10 to-accent/5 border-primary/20 shadow-lg hover:shadow-xl transition-all">
            <CardHeader className="pb-3 relative">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                <span>Announcements</span>
                <div className="p-2 rounded-full bg-secondary/20">
                  <Megaphone className="h-5 w-5 text-secondary-foreground dark:text-secondary" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-4xl font-bold text-secondary-foreground dark:text-secondary">
                {stats?.totalAnnouncements || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                {stats?.activeAnnouncements || 0} active
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-500/10 to-green-500/5 border-emerald-500/20 shadow-lg hover:shadow-xl transition-all">
            <CardHeader className="pb-3 relative">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                <span>Subscribers</span>
                <div className="p-2 rounded-full bg-emerald-500/20">
                  <Mail className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                {stats?.totalSubscribers || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {stats?.activeSubscribers || 0} active
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border-cyan-500/20 shadow-lg hover:shadow-xl transition-all">
            <CardHeader className="pb-3 relative">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                <span>Analytics</span>
                <div className="p-2 rounded-full bg-cyan-500/20">
                  <BarChart3 className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-4xl font-bold text-cyan-600 dark:text-cyan-400">
                {((stats?.activeSubscribers || 0) / Math.max(stats?.totalSubscribers || 1, 1) * 100).toFixed(0)}%
              </div>
              <p className="text-xs text-muted-foreground mt-2">Engagement rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="sermons" className="w-full">
          <TabsList className="w-full md:w-auto bg-muted/50 border border-border p-1.5 mb-8 flex flex-wrap gap-1">
            <TabsTrigger
              value="sermons"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all"
            >
              <BookOpen className="h-4 w-4" />
              <span>Sermons</span>
            </TabsTrigger>
            <TabsTrigger
              value="announcements"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all"
            >
              <Megaphone className="h-4 w-4" />
              <span>Announcements</span>
            </TabsTrigger>
            <TabsTrigger
              value="subscribers"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all"
            >
              <Mail className="h-4 w-4" />
              <span>Newsletter</span>
            </TabsTrigger>
            <TabsTrigger
              value="worship-prayer"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all"
            >
              <Music className="h-4 w-4" />
              <span>Worship & Prayer</span>
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Sermons Tab */}
          <TabsContent value="sermons" className="mt-0 space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-foreground">Sermon Management</h2>
                <p className="text-muted-foreground mt-1">Create and manage sermon content with video time-ranges</p>
              </div>
              <Dialog open={sermonDialogOpen} onOpenChange={setSermonDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="bg-primary text-primary-foreground border-0 shadow-lg hover:bg-primary/90 transition-all"
                    onClick={openAddSermonDialog}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Sermon
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-background border-border max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl text-foreground">
                      {editingSermon ? "Edit Sermon" : "Add New Sermon"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingSermon ? "Update sermon details and video time-range" : "Create a new sermon entry with YouTube time-range"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-5">
                    <div>
                      <Label className="mb-2 block">Title *</Label>
                      <Input
                        value={sermonForm.title}
                        onChange={(e) => setSermonForm({ ...sermonForm, title: e.target.value })}
                        placeholder="The Power of Persistent Prayer"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="mb-2 block">Preacher *</Label>
                        <Input
                          value={sermonForm.preacher}
                          onChange={(e) => setSermonForm({ ...sermonForm, preacher: e.target.value })}
                          placeholder="Pastor John"
                        />
                      </div>
                      <div>
                        <Label className="mb-2 block">Service Day *</Label>
                        <Select value={sermonForm.serviceDay} onValueChange={(value) => setSermonForm({ ...sermonForm, serviceDay: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sun">Sunday - Saviour's Exaltation</SelectItem>
                            <SelectItem value="tue">Tuesday - Scripture Expository</SelectItem>
                            <SelectItem value="fri">Friday - Spirit Empowerment</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label className="mb-2 block">Date *</Label>
                      <Input
                        type="date"
                        value={sermonForm.date}
                        onChange={(e) => setSermonForm({ ...sermonForm, date: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label className="mb-2 flex items-center gap-2">
                        <Video className="h-4 w-4" />
                        YouTube URL *
                      </Label>
                      <Input
                        value={sermonForm.videoUrl}
                        onChange={(e) => setSermonForm({ ...sermonForm, videoUrl: e.target.value })}
                        onBlur={(e) => fetchYouTubeMetadata(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                      />
                      <p className="text-muted-foreground text-xs mt-1">Paste a YouTube URL and we'll auto-fill the title</p>
                    </div>

                    {/* Video Preview */}
                    {sermonForm.videoUrl && extractYouTubeVideoId(sermonForm.videoUrl) && (
                      <div className="rounded-xl overflow-hidden border-2 border-border shadow-lg">
                        <iframe
                          width="100%"
                          height="320"
                          src={`https://www.youtube.com/embed/${extractYouTubeVideoId(sermonForm.videoUrl)}?start=${parseTimeToSeconds(sermonForm.startTime)}${sermonForm.endTime ? `&end=${parseTimeToSeconds(sermonForm.endTime)}` : ''}`}
                          title="YouTube video preview"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                        <div className="bg-muted p-3 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 inline mr-2" />
                          Preview shows video from {sermonForm.startTime} {sermonForm.endTime && `to ${sermonForm.endTime}`}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="mb-2 block">Start Time (MM:SS) *</Label>
                        <Input
                          value={sermonForm.startTime}
                          onChange={(e) => setSermonForm({ ...sermonForm, startTime: e.target.value })}
                          placeholder="0:00"
                        />
                      </div>
                      <div>
                        <Label className="mb-2 block">End Time (MM:SS)</Label>
                        <Input
                          value={sermonForm.endTime}
                          onChange={(e) => setSermonForm({ ...sermonForm, endTime: e.target.value })}
                          placeholder="45:30"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="mb-2 block">Excerpt</Label>
                      <Textarea
                        value={sermonForm.excerpt}
                        onChange={(e) => setSermonForm({ ...sermonForm, excerpt: e.target.value })}
                        placeholder="Brief description of the sermon..."
                        className="min-h-[80px]"
                      />
                    </div>

                    {/* Sermon Outline Section */}
                    <div className="space-y-3">
                      <Label className="mb-2 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Sermon Outline
                      </Label>
                      
                      {/* Document Upload */}
                      <div className="flex items-center gap-3">
                        <div className="relative flex-1">
                          <input
                            id="outline-upload"
                            type="file"
                            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            onChange={handleOutlineDocumentUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            disabled={outlineUploading}
                            aria-label="Upload sermon outline document"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full justify-start gap-2"
                            disabled={outlineUploading}
                          >
                            {outlineUploading ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Extracting text...
                              </>
                            ) : (
                              <>
                                <Upload className="h-4 w-4" />
                                Upload DOCX or PDF
                              </>
                            )}
                          </Button>
                        </div>
                        {sermonForm.outline && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setSermonForm({ ...sermonForm, outline: "" })}
                            className="text-destructive hover:text-destructive"
                          >
                            Clear
                          </Button>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Upload a document to automatically extract the outline text. Only PDF and DOCX files are supported.
                      </p>
                      
                      {/* Outline Text Editor */}
                      <Textarea
                        value={sermonForm.outline}
                        onChange={(e) => setSermonForm({ ...sermonForm, outline: e.target.value })}
                        placeholder="Sermon outline will appear here after uploading a document, or type/paste directly..."
                        className="min-h-[200px] font-mono text-sm"
                      />
                      
                      {/* Preview */}
                      {sermonForm.outline && (
                        <div className="rounded-lg border border-border p-4 bg-muted/30">
                          <p className="text-xs font-medium text-muted-foreground mb-2">Preview ({sermonForm.outline.length} characters)</p>
                          <div className="text-sm max-h-[150px] overflow-y-auto whitespace-pre-wrap">
                            {sermonForm.outline.slice(0, 500)}
                            {sermonForm.outline.length > 500 && "..."}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="mb-2 block">Scriptures (comma-separated)</Label>
                        <Input
                          value={sermonForm.scriptures}
                          onChange={(e) => setSermonForm({ ...sermonForm, scriptures: e.target.value })}
                          placeholder="John 3:16, Romans 8:28"
                        />
                      </div>
                      <div>
                        <Label className="mb-2 block">Tags (comma-separated)</Label>
                        <Input
                          value={sermonForm.tags}
                          onChange={(e) => setSermonForm({ ...sermonForm, tags: e.target.value })}
                          placeholder="prayer, faith, revival"
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-4 rounded-lg bg-primary/10 border border-border">
                      <Switch
                        id="featured"
                        checked={sermonForm.featured}
                        onCheckedChange={(checked) => setSermonForm({ ...sermonForm, featured: checked })}
                      />
                      <Label htmlFor="featured" className="cursor-pointer flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        Mark as Featured Sermon
                      </Label>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={handleSaveSermon}
                        className="flex-1 bg-primary text-primary-foreground border-0 shadow-lg hover:bg-primary/90"
                      >
                        {editingSermon ? "Update" : "Create"} Sermon
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setSermonDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="border-border shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Preacher</TableHead>
                      <TableHead>Service Day</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time Range</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sermons.map((sermon) => (
                      <TableRow key={sermon.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {sermon.featured && <Star className="h-4 w-4 text-primary fill-primary" />}
                            {sermon.title}
                          </div>
                        </TableCell>
                        <TableCell>{sermon.preacher}</TableCell>
                        <TableCell>
                          <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                            {sermon.serviceDay === 'sun' ? 'Sun' : sermon.serviceDay === 'tue' ? 'Tue' : 'Fri'}
                          </span>
                        </TableCell>
                        <TableCell>{new Date(sermon.date).toLocaleDateString()}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatTime(sermon.startSec)} - {sermon.endSec ? formatTime(sermon.endSec) : '∞'}
                        </TableCell>
                        <TableCell>
                          <a
                            href={sermon.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline text-sm flex items-center gap-1"
                          >
                            <Video className="h-3 w-3" />
                            Watch
                          </a>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 hover:bg-primary/20 hover:text-primary"
                              onClick={() => openEditSermonDialog(sermon)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 hover:bg-destructive/20 hover:text-destructive"
                              onClick={() => handleDeleteSermon(sermon.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          {/* Announcements Tab */}
          <TabsContent value="announcements" className="mt-0 space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-foreground">Announcement Management</h2>
                <p className="text-muted-foreground mt-1">Create graphic or text-only announcements</p>
              </div>
              <Dialog open={announcementDialogOpen} onOpenChange={setAnnouncementDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="bg-primary text-primary-foreground border-0 shadow-lg hover:bg-primary/90 transition-all"
                    onClick={openAddAnnouncementDialog}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Announcement
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-background/95 backdrop-blur-xl border-border max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl text-foreground">
                      {editingAnnouncement ? "Edit Announcement" : "Create New Announcement"}
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                      {editingAnnouncement ? "Update announcement details" : "Create a new church announcement"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-5">
                    <div>
                      <Label className="text-foreground mb-2 block">Title *</Label>
                      <Input
                        value={announcementForm.title}
                        onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                        placeholder="Holiday Service Schedule"
                        className="bg-background/50 border-border focus:border-primary text-foreground placeholder:text-muted-foreground"
                      />
                    </div>

                    {/* Announcement Type Selection */}
                    <div className="space-y-3">
                      <Label className="text-foreground mb-2 block">Announcement Type *</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setAnnouncementForm({ ...announcementForm, type: "non_graphic", graphicUrl: "" })}
                          className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${
                            announcementForm.type === "non_graphic"
                              ? "border-primary bg-primary/10 shadow-lg"
                              : "border-border hover:border-primary/50 bg-background/50"
                          }`}
                        >
                          <div className={`p-3 rounded-full ${announcementForm.type === "non_graphic" ? "bg-primary/20" : "bg-muted"}`}>
                            <FileText className={`h-6 w-6 ${announcementForm.type === "non_graphic" ? "text-primary" : "text-muted-foreground"}`} />
                          </div>
                          <div className="text-center">
                            <p className={`font-medium ${announcementForm.type === "non_graphic" ? "text-primary" : "text-foreground"}`}>Text Only</p>
                            <p className="text-xs text-muted-foreground mt-1">Simple text announcement</p>
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setAnnouncementForm({ ...announcementForm, type: "graphic" })}
                          className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${
                            announcementForm.type === "graphic"
                              ? "border-primary bg-primary/10 shadow-lg"
                              : "border-border hover:border-primary/50 bg-background/50"
                          }`}
                        >
                          <div className={`p-3 rounded-full ${announcementForm.type === "graphic" ? "bg-primary/20" : "bg-muted"}`}>
                            <ImageIcon className={`h-6 w-6 ${announcementForm.type === "graphic" ? "text-primary" : "text-muted-foreground"}`} />
                          </div>
                          <div className="text-center">
                            <p className={`font-medium ${announcementForm.type === "graphic" ? "text-primary" : "text-foreground"}`}>With Graphic</p>
                            <p className="text-xs text-muted-foreground mt-1">Includes an image/flyer</p>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Graphic Image - Only shown for graphic type */}
                    {announcementForm.type === "graphic" && (
                      <div className="space-y-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
                        <Label className="text-foreground flex items-center gap-2">
                          <ImageIcon className="h-4 w-4" />
                          Graphic Image *
                        </Label>
                        
                        {/* Upload from Computer */}
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-foreground">Upload from Computer</p>
                          <div className="flex items-center gap-3">
                            <div className="relative flex-1">
                              <input
                                id="graphic-upload"
                                type="file"
                                accept="image/jpeg,image/png,image/gif,image/webp"
                                onChange={handleGraphicImageUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                disabled={graphicUploading}
                                aria-label="Upload announcement graphic"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                className="w-full justify-start gap-2"
                                disabled={graphicUploading}
                              >
                                {graphicUploading ? (
                                  <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Uploading...
                                  </>
                                ) : (
                                  <>
                                    <Upload className="h-4 w-4" />
                                    Choose Image (JPEG, PNG, GIF, WebP)
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">Max file size: 5MB. Recommended: 16:9 or 1:1 aspect ratio.</p>
                        </div>

                        {/* Divider */}
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border" />
                          </div>
                          <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-primary/5 px-2 text-muted-foreground">or</span>
                          </div>
                        </div>

                        {/* Paste URL */}
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-foreground">Paste Image URL</p>
                          <Input
                            value={announcementForm.graphicUrl}
                            onChange={(e) => setAnnouncementForm({ ...announcementForm, graphicUrl: e.target.value })}
                            placeholder="https://example.com/image.jpg"
                            className="bg-background/50 border-border focus:border-primary text-foreground placeholder:text-muted-foreground"
                          />
                        </div>

                        {/* Preview */}
                        {announcementForm.graphicUrl && (
                          <div className="rounded-xl overflow-hidden border-2 border-border shadow-lg mt-3">
                            <img
                              src={announcementForm.graphicUrl}
                              alt="Announcement preview"
                              className="w-full max-h-[300px] object-contain bg-black/50"
                              onError={(e) => {
                                e.currentTarget.src = "https://placehold.co/600x400/1a1525/efc64e?text=Invalid+Image";
                              }}
                            />
                            <div className="bg-muted p-2 flex items-center justify-between">
                              <span className="text-xs text-muted-foreground flex items-center gap-2">
                                <ImageIcon className="h-3 w-3" />
                                Graphic preview
                              </span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setAnnouncementForm({ ...announcementForm, graphicUrl: "" })}
                                className="h-6 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div>
                      <Label className="text-foreground mb-2 block">
                        {announcementForm.type === "graphic" ? "Caption / Description (optional)" : "Content *"}
                      </Label>
                      <Textarea
                        value={announcementForm.contentHtml}
                        onChange={(e) => setAnnouncementForm({ ...announcementForm, contentHtml: e.target.value })}
                        placeholder="Announcement content..."
                        className="bg-background/50 border-border focus:border-primary text-foreground placeholder:text-muted-foreground min-h-[120px]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-foreground mb-2 block">Published Date *</Label>
                        <Input
                          type="date"
                          value={announcementForm.publishedAt}
                          onChange={(e) => setAnnouncementForm({ ...announcementForm, publishedAt: e.target.value })}
                          className="bg-background/50 border-border focus:border-primary text-foreground"
                        />
                      </div>
                      <div>
                        <Label className="text-foreground mb-2 block">Expires Date (optional)</Label>
                        <Input
                          type="date"
                          value={announcementForm.expiresAt}
                          onChange={(e) => setAnnouncementForm({ ...announcementForm, expiresAt: e.target.value })}
                          className="bg-background/50 border-border focus:border-primary text-foreground"
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-4 rounded-lg bg-primary/10 border border-border">
                      <Switch
                        id="pinned"
                        checked={announcementForm.pinned}
                        onCheckedChange={(checked) => setAnnouncementForm({ ...announcementForm, pinned: checked })}
                        className="data-[state=checked]:bg-primary"
                      />
                      <Label htmlFor="pinned" className="text-foreground cursor-pointer flex items-center gap-2">
                        <Pin className="h-4 w-4" />
                        Pin to Top of Announcements
                      </Label>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={handleSaveAnnouncement}
                        className="flex-1 bg-primary text-primary-foreground border-0 shadow-lg hover:bg-primary/90"
                      >
                        {editingAnnouncement ? "Update" : "Create"} Announcement
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setAnnouncementDialogOpen(false)}
                        className="border-border hover:bg-accent"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {announcements.map((announcement) => (
                <Card
                  key={announcement.id}
                  className="bg-card/20 backdrop-blur-xl border-border hover:border-primary/50 transition-all shadow-lg hover:shadow-primary/10 flex flex-col overflow-hidden"
                >
                  {announcement.type === "graphic" && announcement.graphicUrl && (
                    <div className="w-full aspect-video overflow-hidden">
                      <img
                        src={announcement.graphicUrl}
                        alt={announcement.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader className={announcement.type === "non_graphic" ? "pb-2" : ""}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {announcement.pinned && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#efc64e]/20 text-[#b5621b]">
                              <Pin className="h-3 w-3 mr-1" />
                              Pinned
                            </span>
                          )}
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            announcement.type === "graphic" 
                              ? "bg-blue-500/20 text-blue-400" 
                              : "bg-muted text-muted-foreground"
                          }`}>
                            {announcement.type === "graphic" ? (
                              <><ImageIcon className="h-3 w-3 mr-1" /> Graphic</>
                            ) : (
                              <><FileText className="h-3 w-3 mr-1" /> Text</>
                            )}
                          </span>
                        </div>
                        <CardTitle className="text-lg text-foreground">
                          {announcement.title}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    {announcement.contentHtml && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">
                        {announcement.contentHtml.replace(/<[^>]*>/g, '')}
                      </p>
                    )}
                    <div className="space-y-2 mb-4">
                      <p className="text-xs text-muted-foreground flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        Published: {new Date(announcement.publishedAt).toLocaleDateString()}
                      </p>
                      {announcement.expiresAt && (
                        <p className="text-xs text-muted-foreground flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          Expires: {new Date(announcement.expiresAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-border hover:bg-primary/20 hover:text-primary"
                        onClick={() => openEditAnnouncementDialog(announcement)}
                      >
                        <Edit2 className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-border hover:bg-destructive/20 hover:text-destructive hover:border-destructive"
                        onClick={() => handleDeleteAnnouncement(announcement.id)}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Newsletter Subscribers Tab */}
          <TabsContent value="subscribers" className="mt-0 space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-foreground">Newsletter Subscribers</h2>
                <p className="text-muted-foreground mt-1">Manage your mailing list</p>
              </div>
              <Button
                onClick={handleExportSubscribers}
                variant="outline"
                className="border-border bg-card/20 backdrop-blur-md hover:bg-primary/20 hover:border-primary transition-all"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>

            <Card className="bg-card/20 backdrop-blur-xl border-border shadow-xl overflow-hidden">
              <CardHeader>
                <CardTitle className="text-foreground">Subscriber Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-primary/20 border border-border">
                    <p className="text-sm text-muted-foreground mb-1">Total Subscribers</p>
                    <p className="text-3xl font-bold text-foreground">{subscribers.length}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-gradient-to-br from-green-500/20 to-transparent border border-green-500/30">
                    <p className="text-sm text-green-300/80 mb-1">Active</p>
                    <p className="text-3xl font-bold text-green-300">{subscribers.filter(s => s.status === "active").length}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-gradient-to-br from-red-500/20 to-transparent border border-red-500/30">
                    <p className="text-sm text-red-300/80 mb-1">Unsubscribed</p>
                    <p className="text-3xl font-bold text-red-300">{subscribers.filter(s => s.status === "unsubscribed").length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/20 backdrop-blur-xl border-border shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="text-muted-foreground">Name</TableHead>
                      <TableHead className="text-muted-foreground">Email</TableHead>
                      <TableHead className="text-muted-foreground">Preferred Service</TableHead>
                      <TableHead className="text-muted-foreground">Joined Date</TableHead>
                      <TableHead className="text-muted-foreground">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscribers.map((subscriber) => (
                      <TableRow key={subscriber.id} className="border-border/50 hover:bg-accent/50">
                        <TableCell className="font-medium text-foreground">{subscriber.name}</TableCell>
                        <TableCell className="text-muted-foreground">{subscriber.email}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {subscriber.preferredServiceDay ? (
                            <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                              {subscriber.preferredServiceDay === 'sun' ? 'Sunday' : subscriber.preferredServiceDay === 'tue' ? 'Tuesday' : 'Friday'}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{new Date(subscriber.subscribedAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              subscriber.status === "active"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {subscriber.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          {/* Worship & Prayer Tab */}
          <TabsContent value="worship-prayer" className="mt-0 space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-foreground">Worship & Prayer</h2>
                <p className="text-muted-foreground mt-1">Manage worship sessions and prayer content</p>
              </div>
              <Dialog open={worshipPrayerDialogOpen} onOpenChange={setWorshipPrayerDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="bg-primary text-primary-foreground border-0 shadow-lg hover:bg-primary/90 transition-all"
                    onClick={openAddWorshipPrayerDialog}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-background border-border max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl text-foreground">
                      {editingWorshipPrayer ? "Edit Item" : "Add New Item"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingWorshipPrayer ? "Update worship or prayer details" : "Create a new worship or prayer entry"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-5">
                    <div>
                      <Label className="mb-2 block">Title *</Label>
                      <Input
                        value={worshipPrayerForm.title}
                        onChange={(e) => setWorshipPrayerForm({ ...worshipPrayerForm, title: e.target.value })}
                        placeholder="Sunday Morning Worship"
                      />
                    </div>

                    <div>
                      <Label className="mb-2 block">Category *</Label>
                      <Select value={worshipPrayerForm.category} onValueChange={(value: 'worship' | 'prayer') => setWorshipPrayerForm({ ...worshipPrayerForm, category: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="worship">Worship</SelectItem>
                          <SelectItem value="prayer">Prayer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="mb-2 flex items-center gap-2">
                        <Video className="h-4 w-4" />
                        YouTube URL
                      </Label>
                      <Input
                        value={worshipPrayerForm.videoUrl}
                        onChange={(e) => setWorshipPrayerForm({ ...worshipPrayerForm, videoUrl: e.target.value })}
                        placeholder="https://www.youtube.com/watch?v=..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="mb-2 block">Start Time (MM:SS)</Label>
                        <Input
                          value={worshipPrayerForm.startTime}
                          onChange={(e) => setWorshipPrayerForm({ ...worshipPrayerForm, startTime: e.target.value })}
                          placeholder="0:00"
                        />
                      </div>
                      <div>
                        <Label className="mb-2 block">End Time (MM:SS)</Label>
                        <Input
                          value={worshipPrayerForm.endTime}
                          onChange={(e) => setWorshipPrayerForm({ ...worshipPrayerForm, endTime: e.target.value })}
                          placeholder="45:30"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="mb-2 block">Lyrics / Description</Label>
                      <Textarea
                        value={worshipPrayerForm.lyrics}
                        onChange={(e) => setWorshipPrayerForm({ ...worshipPrayerForm, lyrics: e.target.value })}
                        placeholder="Enter lyrics or description..."
                        className="min-h-[100px]"
                      />
                    </div>

                    <div>
                      <Label className="mb-2 block">Chord Chart (Optional)</Label>
                      <Textarea
                        value={worshipPrayerForm.chordChart}
                        onChange={(e) => setWorshipPrayerForm({ ...worshipPrayerForm, chordChart: e.target.value })}
                        placeholder="Paste chord chart content..."
                        className="min-h-[100px] font-mono"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={handleSaveWorshipPrayer}
                        className="flex-1 bg-primary text-primary-foreground border-0 shadow-lg hover:bg-primary/90"
                      >
                        {editingWorshipPrayer ? "Update" : "Create"} Item
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setWorshipPrayerDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {worshipPrayerItems.map((item) => (
                <Card key={item.id} className="bg-card/20 backdrop-blur-xl border-border hover:border-primary/50 transition-all shadow-lg hover:shadow-primary/10 flex flex-col overflow-hidden">
                  {item.videoUrl && extractYouTubeVideoId(item.videoUrl) && (
                    <div className="w-full aspect-video overflow-hidden relative group">
                      <img
                        src={`https://img.youtube.com/vi/${extractYouTubeVideoId(item.videoUrl)}/mqdefault.jpg`}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                        <Video className="h-3 w-3" />
                        Video
                      </div>
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mb-2 ${
                          item.category === 'worship' 
                            ? "bg-purple-500/20 text-purple-400" 
                            : "bg-blue-500/20 text-blue-400"
                        }`}>
                          {item.category === 'worship' ? <Music className="h-3 w-3 mr-1" /> : <MessageCircle className="h-3 w-3 mr-1" />}
                          {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                        </span>
                        <CardTitle className="text-lg text-foreground line-clamp-1">
                          {item.title}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    {item.lyrics && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">
                        {item.lyrics}
                      </p>
                    )}
                    <div className="flex gap-2 mt-auto">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-border hover:bg-primary/20 hover:text-primary"
                        onClick={() => openEditWorshipPrayerDialog(item)}
                      >
                        <Edit2 className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-border hover:bg-destructive/20 hover:text-destructive hover:border-destructive"
                        onClick={() => handleDeleteWorshipPrayer(item.id)}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="mt-0 space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Site Settings</h2>
              <p className="text-muted-foreground">Configure your church website settings</p>
            </div>

            <Card className="bg-card/20 backdrop-blur-xl border-border shadow-xl">
              <CardHeader>
                <CardTitle className="text-foreground">Church Information</CardTitle>
                <CardDescription className="text-muted-foreground">Update your church details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-foreground mb-2 block">Church Name</Label>
                    <Input
                      defaultValue="Old Time Power Church"
                      className="bg-background/50 border-border focus:border-primary text-foreground"
                    />
                  </div>
                  <div>
                    <Label className="text-foreground mb-2 block">Email</Label>
                    <Input
                      defaultValue="info@otpchurch.org"
                      className="bg-background/50 border-border focus:border-primary text-foreground"
                    />
                  </div>
                  <div>
                    <Label className="text-foreground mb-2 block">Phone</Label>
                    <Input
                      defaultValue="+1 (234) 567-890"
                      className="bg-background/50 border-border focus:border-primary text-foreground"
                    />
                  </div>
                  <div>
                    <Label className="text-foreground mb-2 block">Location</Label>
                    <Input
                      defaultValue="123 Church Street, City, Country"
                      className="bg-background/50 border-border focus:border-primary text-foreground"
                    />
                  </div>
                </div>
                <Button className="bg-primary text-primary-foreground border-0 shadow-lg hover:bg-primary/90">
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
