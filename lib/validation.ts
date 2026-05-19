import { z } from 'zod'

export const subscribeSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100).trim(),
  email: z.string().email('Please enter a valid email address').toLowerCase().trim(),
  ebookId: z.string().uuid('Invalid ebook ID'),
})

export const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address').toLowerCase().trim(),
})

export const ebookSchema = z.object({
  title: z.string().min(3, 'Title too short').max(120).trim(),
  description: z.string().min(10, 'Description too short').max(120).trim(),
  type: z.enum(['free', 'paid']),
  drive_link: z.string().url('Must be a valid URL').nullable().optional(),
  price: z.number().positive('Price must be positive').nullable().optional(),
  cover_url: z.string().nullable().optional(),
})

export const adminLoginSchema = z.object({
  password: z.string().min(1, 'Password required'),
})

export const configSchema = z.object({
  whatsapp_number: z.string().max(20).nullable().optional(),
  creator_email: z.string().email().nullable().optional(),
})

export function sanitizeString(str: string): string {
  return str
    .replace(/[<>]/g, '')     // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove JS injection
    .trim()
}
