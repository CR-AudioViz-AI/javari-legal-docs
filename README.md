# LegalEase AI 

**Transform Legal Documents into Plain English (and vice versa)**

A professional SaaS platform for legal document translation powered by AI. Built with Next.js 14, OpenAI GPT-4, Supabase, and Stripe.

---

## 🚀 Features

### Core Functionality
- **Bidirectional Translation**: Legal → Plain English & Plain English → Legal
- **File Processing**: Upload PDF, DOCX, or TXT files
- **Key Term Extraction**: Automatically identify obligations, deadlines, parties, payments, and penalties
- **Executive Summary**: AI-generated summaries of complex documents
- **15+ Professional Templates**: Pre-built legal document templates

### User Features
- **Credit System**: Usage-based pricing with 4 tier plans
- **Document History**: Save and access past conversions
- **Custom Branding**: Upload logo and customize colors (Pro+)
- **Export Options**: Download as PDF or DOCX
- **Side-by-Side View**: Compare original and converted text

### Tech Stack
- **Framework**: Next.js 14 (App Router, TypeScript)
- **Database**: Supabase PostgreSQL
- **AI**: OpenAI GPT-4 Turbo
- **Payments**: Stripe (subscriptions + webhooks)
- **Styling**: Tailwind CSS + shadcn/ui
- **Deployment**: Vercel

---

## 📋 Prerequisites

- Node.js 18+ installed
- Supabase account
- OpenAI API key
- Stripe account
- GitHub account
- Vercel account

---

## 🛠️ Installation

### 1. Clone Repository

```bash
git clone https://github.com/roy-henderson/crav-legalease.git
cd crav-legalease
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_APP_URL`

### 4. Database Setup

1. Go to Supabase Dashboard → SQL Editor
2. Run `database/migration.sql`
3. Run `database/additional-templates.sql`

### 5. Stripe Setup

1. Create products in Stripe Dashboard:
   - Starter Plan ($29/month)
   - Professional Plan ($99/month)
   - Enterprise Plan ($299/month)
2. Copy Price IDs to `lib/stripe.ts`
3. Set up webhook endpoint (after deployment)

### 6. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

---

## 🚢 Deployment

### Deploy to Vercel

1. **Push to GitHub**:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables
   - Deploy!

3. **Configure Stripe Webhook**:
   - Get your Vercel URL
   - Add webhook in Stripe: `https://your-app.vercel.app/api/webhooks/stripe`
   - Select events: `checkout.session.completed`, `customer.subscription.*`, `invoice.*`
   - Copy webhook secret to Vercel env vars
   - Redeploy

---

## 💳 Pricing Plans

| Plan | Price | Credits | Features |
|------|-------|---------|----------|
| **Free** | $0 | 100/month | Basic conversion, 5 templates, Email support |
| **Starter** | $29 | 1,000/month | Unlimited conversions, 15 templates, Priority support |
| **Professional** | $99 | 5,000/month | Custom branding, API access, Bulk processing |
| **Enterprise** | $299 | 20,000/month | White-label, Dedicated support, SLA |

---

## 📁 Project Structure

```
legalease-ai/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── convert/      # Document conversion
│   │   ├── documents/    # Document management
│   │   ├── templates/    # Template access
│   │   └── webhooks/     # Stripe webhooks
│   ├── dashboard/        # User dashboard
│   ├── admin/            # Admin panel
│   └── page.tsx          # Landing page
├── components/
│   └── ui/               # Reusable UI components
├── lib/
│   ├── supabase.ts       # Supabase client & types
│   ├── openai.ts         # AI conversion logic
│   ├── stripe.ts         # Payment processing
│   ├── file-processor.ts # File upload handling
│   └── utils.ts          # Helper functions
├── database/
│   ├── migration.sql     # Database schema
│   └── additional-templates.sql  # Template data
└── public/               # Static assets
```

---

## 🔐 Security

- **Row Level Security (RLS)**: Enabled on all Supabase tables
- **API Key Protection**: All keys stored in environment variables
- **Stripe Webhook Verification**: Signature validation on all webhook events
- **User Authentication**: Supabase Auth with secure sessions

---

## 🧪 Testing

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build test
npm run build
```

---

## 📊 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/signin` - Sign in user

### Conversion
- `POST /api/convert` - Convert document (legal↔plain)

### Documents
- `GET /api/documents?userId={id}` - List user documents
- `POST /api/documents` - Create document

### Templates
- `GET /api/templates` - List active templates

### Webhooks
- `POST /api/webhooks/stripe` - Handle Stripe events

---

## 🤝 Contributing

This is a private project. Contact Roy Henderson for access.

---

## 📝 License

Proprietary - © 2025 CR AudioViz AI LLC. All rights reserved.

---

## 👨‍💻 Developer

**Roy Henderson**  
CEO & Co-Founder, CR AudioViz AI LLC  
Fort Myers, Florida  

---

## 🆘 Support

For issues or questions:
- Email: [support@craudiovizai.com](mailto:support@craudiovizai.com)
- Dashboard: [Admin Panel](https://legalease-ai.vercel.app/admin)

---

**Built with ❤️ as part of the CR AudioViz AI ecosystem**

<!-- Build trigger: Database schema fixes applied -->


<!-- Deployment triggered: 2025-11-04 14:57:35 -->


<!-- Environment variables updated: 2025-11-04 16:42:40 -->
