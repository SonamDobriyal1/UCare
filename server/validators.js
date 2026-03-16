import { z } from "zod";

export const postCreateSchema = z.object({
  title: z.string().min(3).max(140),
  body: z.string().min(10).max(4000),
  category: z.string().min(2).max(80),
  authorName: z.string().min(2).max(80),
  anonymous: z.boolean().optional().default(false),
});

export const replyCreateSchema = z.object({
  body: z.string().min(2).max(3000),
  authorName: z.string().min(2).max(80),
  anonymous: z.boolean().optional().default(false),
});

export const contactCreateSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(200),
  message: z.string().min(10).max(5000),
});

export const chatSchema = z.object({
  message: z.string().min(1).max(4000),
  sessionId: z.string().min(8).max(120).optional(),
});

export const userUpdateSchema = z.object({
  displayName: z.string().min(2).max(120).optional(),
  photoUrl: z.string().url().max(500).optional(),
  bio: z.string().max(500).optional(),
  location: z.string().max(120).optional(),
});

export const signupSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(200),
  password: z.string().min(8).max(200),
});

export const loginSchema = z.object({
  email: z.string().email().max(200),
  password: z.string().min(8).max(200),
});
