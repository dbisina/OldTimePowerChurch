import {
  type User, type InsertUser,
  type Sermon, type InsertSermon,
  type Announcement, type InsertAnnouncement,
  type Subscriber, type InsertSubscriber,
  type WorshipPrayer, type InsertWorshipPrayer,
  users, sermons, announcements, subscribers, worshipPrayer
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, lte, gt, or, isNull } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUser(id: string, data: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: string): Promise<boolean>;

  // Sermon operations
  getSermon(id: string): Promise<Sermon | undefined>;
  getSermonBySlug(slug: string): Promise<Sermon | undefined>;
  getAllSermons(): Promise<Sermon[]>;
  getFeaturedSermons(): Promise<Sermon[]>;
  getSermonsByServiceDay(serviceDay: string): Promise<Sermon[]>;
  createSermon(sermon: InsertSermon): Promise<Sermon>;
  updateSermon(id: string, data: Partial<InsertSermon>): Promise<Sermon | undefined>;
  deleteSermon(id: string): Promise<boolean>;

  // Announcement operations
  getAnnouncement(id: string): Promise<Announcement | undefined>;
  getAnnouncementBySlug(slug: string): Promise<Announcement | undefined>;
  getAllAnnouncements(): Promise<Announcement[]>;
  getActiveAnnouncements(): Promise<Announcement[]>;
  getPinnedAnnouncements(): Promise<Announcement[]>;
  createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;
  updateAnnouncement(id: string, data: Partial<InsertAnnouncement>): Promise<Announcement | undefined>;
  deleteAnnouncement(id: string): Promise<boolean>;

  // Subscriber operations
  getSubscriber(id: string): Promise<Subscriber | undefined>;
  getSubscriberByEmail(email: string): Promise<Subscriber | undefined>;
  getAllSubscribers(): Promise<Subscriber[]>;
  getActiveSubscribers(): Promise<Subscriber[]>;
  createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber>;
  updateSubscriber(id: string, data: Partial<InsertSubscriber>): Promise<Subscriber | undefined>;
  deleteSubscriber(id: string): Promise<boolean>;

  // Worship/Prayer operations
  getWorshipPrayer(id: string): Promise<WorshipPrayer | undefined>;
  getAllWorshipPrayer(): Promise<WorshipPrayer[]>;
  getWorshipPrayerByCategory(category: string): Promise<WorshipPrayer[]>;
  createWorshipPrayer(item: InsertWorshipPrayer): Promise<WorshipPrayer>;
  updateWorshipPrayer(id: string, data: Partial<InsertWorshipPrayer>): Promise<WorshipPrayer | undefined>;
  deleteWorshipPrayer(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return db.select().from(users);
  }

  async updateUser(id: string, data: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return user;
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id)).returning();
    return result.length > 0;
  }

  // Sermon operations
  async getSermon(id: string): Promise<Sermon | undefined> {
    const [sermon] = await db.select().from(sermons).where(eq(sermons.id, id));
    return sermon;
  }

  async getSermonBySlug(slug: string): Promise<Sermon | undefined> {
    const [sermon] = await db.select().from(sermons).where(eq(sermons.slug, slug));
    return sermon;
  }

  async getAllSermons(): Promise<Sermon[]> {
    return db.select().from(sermons).orderBy(desc(sermons.date));
  }

  async getFeaturedSermons(): Promise<Sermon[]> {
    return db.select().from(sermons).where(eq(sermons.featured, true)).orderBy(desc(sermons.date));
  }

  async getSermonsByServiceDay(serviceDay: string): Promise<Sermon[]> {
    return db.select().from(sermons).where(eq(sermons.serviceDay, serviceDay)).orderBy(desc(sermons.date));
  }

  async createSermon(insertSermon: InsertSermon): Promise<Sermon> {
    const [sermon] = await db.insert(sermons).values(insertSermon).returning();
    return sermon;
  }

  async updateSermon(id: string, data: Partial<InsertSermon>): Promise<Sermon | undefined> {
    const [sermon] = await db.update(sermons)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(sermons.id, id))
      .returning();
    return sermon;
  }

  async deleteSermon(id: string): Promise<boolean> {
    const result = await db.delete(sermons).where(eq(sermons.id, id)).returning();
    return result.length > 0;
  }

  // Announcement operations
  async getAnnouncement(id: string): Promise<Announcement | undefined> {
    const [announcement] = await db.select().from(announcements).where(eq(announcements.id, id));
    return announcement;
  }

  async getAnnouncementBySlug(slug: string): Promise<Announcement | undefined> {
    const [announcement] = await db.select().from(announcements).where(eq(announcements.slug, slug));
    return announcement;
  }

  async getAllAnnouncements(): Promise<Announcement[]> {
    return db.select().from(announcements).orderBy(desc(announcements.publishedAt));
  }

  async getActiveAnnouncements(): Promise<Announcement[]> {
    const now = new Date();
    return db.select().from(announcements)
      .where(
        and(
          lte(announcements.publishedAt, now),
          or(
            isNull(announcements.expiresAt),
            gt(announcements.expiresAt, now)
          )
        )
      )
      .orderBy(desc(announcements.pinned), desc(announcements.publishedAt));
  }

  async getPinnedAnnouncements(): Promise<Announcement[]> {
    return db.select().from(announcements)
      .where(eq(announcements.pinned, true))
      .orderBy(desc(announcements.publishedAt));
  }

  async createAnnouncement(insertAnnouncement: InsertAnnouncement): Promise<Announcement> {
    const [announcement] = await db.insert(announcements).values(insertAnnouncement).returning();
    return announcement;
  }

  async updateAnnouncement(id: string, data: Partial<InsertAnnouncement>): Promise<Announcement | undefined> {
    const [announcement] = await db.update(announcements)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(announcements.id, id))
      .returning();
    return announcement;
  }

  async deleteAnnouncement(id: string): Promise<boolean> {
    const result = await db.delete(announcements).where(eq(announcements.id, id)).returning();
    return result.length > 0;
  }

  // Subscriber operations
  async getSubscriber(id: string): Promise<Subscriber | undefined> {
    const [subscriber] = await db.select().from(subscribers).where(eq(subscribers.id, id));
    return subscriber;
  }

  async getSubscriberByEmail(email: string): Promise<Subscriber | undefined> {
    const [subscriber] = await db.select().from(subscribers).where(eq(subscribers.email, email));
    return subscriber;
  }

  async getAllSubscribers(): Promise<Subscriber[]> {
    return db.select().from(subscribers).orderBy(desc(subscribers.subscribedAt));
  }

  async getActiveSubscribers(): Promise<Subscriber[]> {
    return db.select().from(subscribers)
      .where(eq(subscribers.status, "active"))
      .orderBy(desc(subscribers.subscribedAt));
  }

  async createSubscriber(insertSubscriber: InsertSubscriber): Promise<Subscriber> {
    const [subscriber] = await db.insert(subscribers).values(insertSubscriber).returning();
    return subscriber;
  }

  async updateSubscriber(id: string, data: Partial<InsertSubscriber>): Promise<Subscriber | undefined> {
    const updateData: Partial<Subscriber> = { ...data };

    // If unsubscribing, set the unsubscribedAt timestamp
    if (data.status === "unsubscribed") {
      const existing = await this.getSubscriber(id);
      if (existing && existing.status !== "unsubscribed") {
        updateData.unsubscribedAt = new Date();
      }
    }

    const [subscriber] = await db.update(subscribers)
      .set(updateData)
      .where(eq(subscribers.id, id))
      .returning();
    return subscriber;
  }

  async deleteSubscriber(id: string): Promise<boolean> {
    const result = await db.delete(subscribers).where(eq(subscribers.id, id)).returning();
    return result.length > 0;
  }

  // Worship/Prayer operations
  async getWorshipPrayer(id: string): Promise<WorshipPrayer | undefined> {
    const [item] = await db.select().from(worshipPrayer).where(eq(worshipPrayer.id, id));
    return item;
  }

  async getAllWorshipPrayer(): Promise<WorshipPrayer[]> {
    return db.select().from(worshipPrayer).orderBy(desc(worshipPrayer.createdAt));
  }

  async getWorshipPrayerByCategory(category: string): Promise<WorshipPrayer[]> {
    return db.select().from(worshipPrayer).where(eq(worshipPrayer.category, category)).orderBy(desc(worshipPrayer.createdAt));
  }

  async createWorshipPrayer(item: InsertWorshipPrayer): Promise<WorshipPrayer> {
    const [newItem] = await db.insert(worshipPrayer).values(item).returning();
    return newItem;
  }

  async updateWorshipPrayer(id: string, data: Partial<InsertWorshipPrayer>): Promise<WorshipPrayer | undefined> {
    const [updatedItem] = await db.update(worshipPrayer)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(worshipPrayer.id, id))
      .returning();
    return updatedItem;
  }

  async deleteWorshipPrayer(id: string): Promise<boolean> {
    const result = await db.delete(worshipPrayer).where(eq(worshipPrayer.id, id)).returning();
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
