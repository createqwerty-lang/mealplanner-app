import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).optional(),
});

export const loginSchema = z
  .object({
    email: z.string().min(1).optional(),
    username: z.string().min(1).optional(),
    password: z.string().min(1),
  })
  .refine((data) => data.email || data.username, {
    message: 'Email or username is required',
  });

export const resetRequestSchema = z.object({
  email: z.string().email(),
});

export const resetSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8),
});
