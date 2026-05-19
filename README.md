# Good Life Medics — Next.js Project

## 🚀 Quick Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env.local
```
Then fill in all values in `.env.local`

### 3. Generate your admin password hash
Run this in your terminal (replace `yourpassword` with a strong password):
```bash
node -e "const b=require('bcryptjs');b.hash('yourpassword',12).then(console.log)"
```
Copy the output and paste it as `ADMIN_PASSWORD_HASH` in `.env.local`

### 4. Generate JWT secret
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
Copy output to `JWT_SECRET` in `.env.local`

### 5. Set up Supabase database
- Go to your Supabase project → SQL Editor
- Copy and paste the contents of `supabase-schema.sql`
- Click Run

### 6. Run locally
```bash
npm run dev
```
Open http://localhost:3000

---

## 📦 Deploy to Vercel

### 1. Push to GitHub
```bash
git add .
git commit -m "Initial Next.js project"
git push
```

### 2. Add environment variables in Vercel
Go to Vercel Dashboard → Project → Settings → Environment Variables
Add ALL variables from `.env.example` with real values

### 3. Deploy
Vercel auto-deploys on every push to main ✅

---

## 🔐 Security Notes
- `.env.local` is in `.gitignore` — NEVER commit it
- `SUPABASE_SERVICE_ROLE_KEY` is only used server-side in API routes
- Admin password is bcrypt-hashed — never stored plain
- JWT tokens are httpOnly cookies — safe from XSS
- All inputs are validated with Zod
- Rate limiting on all public API endpoints

---

## 📁 Project Structure
```
app/
  page.tsx              ← Landing page (server component)
  admin/page.tsx        ← Admin dashboard (client component)
  api/
    subscribe/          ← Save subscriber + send ebook email
    newsletter/         ← Newsletter signup
    ebooks/             ← CRUD ebooks (admin protected)
    admin/
      login/            ← Admin auth (bcrypt + JWT)
      config/           ← Site config
      upload/           ← Image uploads to Supabase Storage
components/
  WelcomePopup.tsx      ← Popup with 2-step flow
  EbooksSection.tsx     ← Free + paid ebook grids
  SubscribeModal.tsx    ← Subscribe form + API call
  WatchLearnSection.tsx ← YouTube RSS feed
  ... (all other sections)
lib/
  supabase.ts           ← DB clients (public + admin)
  resend.ts             ← Email sending
  auth.ts               ← bcrypt + JWT
  validation.ts         ← Zod schemas
  rateLimit.ts          ← Request throttling
types/index.ts          ← TypeScript interfaces
supabase-schema.sql     ← Database setup script
```
