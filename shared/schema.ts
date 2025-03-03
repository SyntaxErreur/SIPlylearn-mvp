import { pgTable, text, serial, integer, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
});

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  domain: text("domain").notNull(),
  thumbnail: text("thumbnail").notNull(),
  progress: integer("progress").default(0),
});

export const investments = pgTable("investments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  courseId: integer("course_id").notNull(),
  amount: decimal("amount").notNull(),
  duration: integer("duration").notNull(), // in months
  type: text("type").notNull(), // 'sip' or 'full'
  startDate: text("start_date").notNull(),
  domain: text("domain"), // Only required for 3/6 month plans
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  email: true,
});

export const insertCourseSchema = createInsertSchema(courses);
export const insertInvestmentSchema = createInsertSchema(investments);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Course = typeof courses.$inferSelect;
export type Investment = typeof investments.$inferSelect;

export const sipDurationOptions = [3, 6, 9, 12] as const;
export type SipDuration = typeof sipDurationOptions[number];

export interface SipReward {
  saved: number;
  reward: number;
  features: string[];
}

export const sipRewards: Record<SipDuration, SipReward> = {
  3: {
    saved: 91,
    reward: 0,
    features: ['Ads in lectures', 'Access to selected domain lectures']
  },
  6: {
    saved: 182,
    reward: 1.82,
    features: ['Ads in lectures', 'Access to selected domain lectures', 'University certified courses']
  },
  9: {
    saved: 273,
    reward: 5.46,
    features: ['No ads in lectures', 'Access to all lectures', 'University certified courses']
  },
  12: {
    saved: 365,
    reward: 14.6,
    features: ['No ads in lectures', 'Access to all lectures', 'University certified courses']
  }
};