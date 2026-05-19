export interface Ebook {
  id: string
  title: string
  description: string
  cover_url: string | null
  drive_link: string | null
  price: number | null
  type: 'free' | 'paid'
  created_at: string
  updated_at: string
}

export interface Subscriber {
  id: string
  name: string
  email: string
  ebook_title: string | null
  source: 'popup' | 'ebook_card'
  created_at: string
}

export interface NewsletterSignup {
  id: string
  email: string
  created_at: string
}

export interface SiteConfig {
  id: string
  whatsapp_number: string | null
  creator_email: string | null
  creator_photo_url: string | null
  supabase_url: string | null
  resend_key_set: boolean
  updated_at: string
}

export interface ApiResponse<T = null> {
  success: boolean
  data?: T
  error?: string
}

export interface AdminStats {
  subscribers: number
  free_ebooks: number
  paid_ebooks: number
  newsletter: number
}
