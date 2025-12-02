import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Service days enum
export const serviceDays = ["sun", "tue", "fri"] as const;
export type ServiceDay = (typeof serviceDays)[number];

export const serviceDayNames: Record<ServiceDay, string> = {
  sun: "Saviour's Exaltation Service (Sunday)",
  tue: "Scripture Expository Service (Tuesday)",
  fri: "Spirit Empowerment Service (Friday)",
};

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("editor"), // admin, editor, viewer
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  role: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Sermons table
export const sermons = pgTable("sermons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  preacher: text("preacher").notNull(),
  serviceDay: text("service_day").notNull(), // sun, tue, fri
  date: timestamp("date").notNull(),
  videoUrl: text("video_url").notNull(),
  startSec: integer("start_sec").notNull().default(0),
  endSec: integer("end_sec"),
  excerpt: text("excerpt"),
  outline: text("outline"), // Plain text extracted from uploaded documents
  outlineRichText: text("outline_rich_text"),
  outlineDocUrl: text("outline_doc_url"),
  scriptures: text("scriptures").array(),
  tags: text("tags").array(),
  featured: boolean("featured").default(false),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSermonSchema = createInsertSchema(sermons).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertSermon = z.infer<typeof insertSermonSchema>;
export type Sermon = typeof sermons.$inferSelect;

// Announcements table
export const announcements = pgTable("announcements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  type: text("type").notNull().default("non_graphic"), // graphic, non_graphic
  contentHtml: text("content_html"),
  graphicUrl: text("graphic_url"),
  publishedAt: timestamp("published_at").notNull().defaultNow(),
  expiresAt: timestamp("expires_at"),
  pinned: boolean("pinned").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertAnnouncementSchema = createInsertSchema(announcements).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;
export type Announcement = typeof announcements.$inferSelect;

// Newsletter Subscribers table
export const subscribers = pgTable("subscribers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  source: text("source").default("website"), // website, telegram, manual
  tags: text("tags").array(),
  preferredServiceDay: text("preferred_service_day"),
  status: text("status").notNull().default("active"), // active, unsubscribed
  subscribedAt: timestamp("subscribed_at").defaultNow(),
  unsubscribedAt: timestamp("unsubscribed_at"),
});

export const insertSubscriberSchema = createInsertSchema(subscribers).omit({
  id: true,
  subscribedAt: true,
  unsubscribedAt: true,
});

export type InsertSubscriber = z.infer<typeof insertSubscriberSchema>;
export type Subscriber = typeof subscribers.$inferSelect;

// Worship/Prayer content table
export const worshipPrayer = pgTable("worship_prayer", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  category: text("category").notNull(), // worship, prayer
  videoUrl: text("video_url"),
  startSec: integer("start_sec").default(0),
  endSec: integer("end_sec"),
  lyrics: text("lyrics"),
  chordChart: text("chord_chart"),
  attachments: text("attachments").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
