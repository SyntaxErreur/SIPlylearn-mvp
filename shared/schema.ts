import { z } from "zod";

// User schema
export const userSchema = z.object({
  id: z.number(),
  username: z.string().min(3, "Username must be at least 3 characters"),
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Course schema
export const courseSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  domain: z.string(),
  thumbnail: z.string(),
  progress: z.number().nullable().default(0),
});

// Investment schema
export const investmentSchema = z.object({
  id: z.number(),
  userId: z.number(),
  courseId: z.number(),
  amount: z.number(),
  duration: z.number(),
  type: z.enum(["sip", "full"]),
  startDate: z.string(),
});

// Export types
export type User = z.infer<typeof userSchema>;
export type Course = z.infer<typeof courseSchema>;
export type Investment = z.infer<typeof investmentSchema>;

// Insert schemas (omit auto-generated fields)
export const insertUserSchema = userSchema.omit({ id: true });
export type InsertUser = z.infer<typeof insertUserSchema>;

export const insertCourseSchema = courseSchema.omit({ id: true });
export type InsertCourse = z.infer<typeof insertCourseSchema>;

export const insertInvestmentSchema = investmentSchema.omit({ id: true });
export type InsertInvestment = z.infer<typeof insertInvestmentSchema>;

// SIP related types
export const sipDurationOptions = [3, 6, 9, 12] as const;
export type SipDuration = typeof sipDurationOptions[number];
