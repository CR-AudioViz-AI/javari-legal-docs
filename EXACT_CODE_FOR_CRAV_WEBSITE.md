# EXACT CODE FOR CRAV-WEBSITE

Copy and paste these exact code snippets into your crav-website repo.

---

## FILE 1: /app/apps/page.tsx

**ADD THIS to the `embeddedApps` array** (around line 6-50):

```typescript
{
  id: 'legalease',
  icon: '⚖️',
  iconComponent: FileText,
  name: 'LegalEase AI',
  description: 'Transform legal documents into plain English and vice versa with AI-powered translation.',
  features: [
    'Bidirectional legal translation',
    'Extract key terms & obligations',
    '15+ professional legal templates',
    'Export to PDF/DOCX'
  ],
  status: 'live',
  href: '/apps/legalease',
  color: 'amber',
},
```

**ADD THIS to imports** (at the top of file):

```typescript
import { FileText } from 'lucide-react'
```

---

## FILE 2: /app/apps/legalease/page.tsx

**CREATE NEW FILE** with this exact content:

```typescript
'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { deductCredits } from '@/lib/credits'

export default function LegalEaseApp() {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isReady, setIsReady] = useState(false)
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    let mounted = true

    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/signin?redirect=/apps/legalease')
        return
      }

      const handleMessage = async (event: MessageEvent) => {
        // Verify origin in production
        const legalEaseUrl = process.env.NEXT_PUBLIC_LEGALEASE_URL || 'https://crav-legalease.vercel.app'
        
        if (process.env.NODE_ENV === 'production' && event.origin !== legalEaseUrl) {
          console.warn('Rejected message from:', event.origin)
          return
        }

        if (!mounted) return

        const { type, payload } = event.data

        switch (type) {
          case 'READY':
            // Send auth token to embedded app
            iframeRef.current?.contentWindow?.postMessage({
              type: 'AUTH_TOKEN',
              payload: {
                userId: session.user.id,
                sessionToken: session.access_token,
              }
            }, legalEaseUrl)
            setIsReady(true)
            break

          case 'REQUEST_AUTH':
            // Re-send auth if requested
            iframeRef.current?.contentWindow?.postMessage({
              type: 'AUTH_TOKEN',
              payload: {
                userId: session.user.id,
                sessionToken: session.access_token,
              }
            }, legalEaseUrl)
            break

          case 'CREDIT_CHECK':
            // Get current credit balance
            const { data: profile } = await supabase
              .from('profiles')
              .select('credits_balance')
              .eq('id', payload.userId)
              .single()

            iframeRef.current?.contentWindow?.postMessage({
              type: 'CREDIT_UPDATE',
              payload: {
                balance: profile?.credits_balance || 0
              }
            }, legalEaseUrl)
            break

          case 'CREDIT_DEDUCT':
            // Deduct credits
            try {
              await deductCredits(
                payload.userId, 
                payload.amount, 
                payload.description
              )

              // Get new balance
              const { data: updatedProfile } = await supabase
                .from('profiles')
                .select('credits_balance')
                .eq('id', payload.userId)
                .single()

              iframeRef.current?.contentWindow?.postMessage({
                type: 'CREDIT_UPDATE',
                payload: {
                  success: true,
                  newBalance: updatedProfile?.credits_balance || 0
                }
              }, legalEaseUrl)
            } catch (error) {
              console.error('Credit deduction failed:', error)
              iframeRef.current?.contentWindow?.postMessage({
                type: 'CREDIT_UPDATE',
                payload: {
                  success: false,
                  error: 'Insufficient credits'
                }
              }, legalEaseUrl)
            }
            break

          case 'NAVIGATE':
            // Navigate parent window
            router.push(payload.path)
            break
        }
      }

      window.addEventListener('message', handleMessage)

      return () => {
        mounted = false
        window.removeEventListener('message', handleMessage)
      }
    }

    checkAuth()
  }, [router, supabase])

  const legalEaseUrl = process.env.NEXT_PUBLIC_LEGALEASE_URL || 'https://crav-legalease.vercel.app'

  return (
    <div className="h-screen w-full bg-gray-50">
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg font-medium">Loading LegalEase AI...</p>
            <p className="text-gray-500 text-sm mt-2">Connecting to secure environment</p>
          </div>
        </div>
      )}
      
      <iframe
        ref={iframeRef}
        src={`${legalEaseUrl}/embedded`}
        className="w-full h-full border-0"
        allow="clipboard-read; clipboard-write"
        title="LegalEase AI"
      />
    </div>
  )
}
```

---

## FILE 3: .env.local

**ADD THIS LINE** to your environment variables:

```bash
NEXT_PUBLIC_LEGALEASE_URL=https://crav-legalease.vercel.app
```

**ALSO ADD TO VERCEL** (Settings → Environment Variables):
- Name: `NEXT_PUBLIC_LEGALEASE_URL`
- Value: `https://crav-legalease.vercel.app`
- Environments: Production, Preview, Development

---

## FILE 4: Supabase Migration

**RUN THIS in Supabase SQL Editor** (https://supabase.com/dashboard/project/kteobfyferrukqeolofj/sql):

```sql
-- Add legalease_documents table for document history
CREATE TABLE IF NOT EXISTS public.legalease_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  original_content TEXT NOT NULL,
  converted_content TEXT,
  document_type TEXT DEFAULT 'other' CHECK (document_type IN ('contract', 'agreement', 'terms', 'policy', 'other')),
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.legalease_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view own documents
CREATE POLICY "Users can view own legalease documents" ON public.legalease_documents
  FOR SELECT USING (auth.uid() = user_id);

-- RLS Policy: Users can create own documents
CREATE POLICY "Users can create own legalease documents" ON public.legalease_documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can update own documents
CREATE POLICY "Users can update own legalease documents" ON public.legalease_documents
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policy: Users can delete own documents
CREATE POLICY "Users can delete own legalease documents" ON public.legalease_documents
  FOR DELETE USING (auth.uid() = user_id);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_legalease_documents_user_id ON public.legalease_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_legalease_documents_created_at ON public.legalease_documents(created_at DESC);

-- Add updated_at trigger
CREATE TRIGGER update_legalease_documents_updated_at 
  BEFORE UPDATE ON public.legalease_documents
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
```

---

## VERIFICATION CHECKLIST

After making these changes:

### ✅ Code Changes:
- [ ] Added LegalEase entry to `/app/apps/page.tsx`
- [ ] Added `FileText` import to `/app/apps/page.tsx`
- [ ] Created `/app/apps/legalease/page.tsx`
- [ ] Added `NEXT_PUBLIC_LEGALEASE_URL` to `.env.local`

### ✅ Deployment:
- [ ] Committed changes to git
- [ ] Pushed to GitHub
- [ ] Vercel auto-deployed
- [ ] Added env var to Vercel dashboard

### ✅ Database:
- [ ] Ran migration in Supabase SQL Editor
- [ ] Verified `legalease_documents` table exists
- [ ] Verified RLS policies are active

### ✅ Testing:
- [ ] Visit https://craudiovizai.com/apps
- [ ] See LegalEase AI card
- [ ] Click card
- [ ] App loads in iframe
- [ ] Credits display correctly
- [ ] Convert a document
- [ ] Credits deduct properly
- [ ] Document saves to database

---

## GIT COMMANDS

```bash
# In crav-website directory
git add app/apps/page.tsx
git add app/apps/legalease/page.tsx
git add .env.local

git commit -m "Add LegalEase AI integration

- Added LegalEase to apps page
- Created embedded iframe wrapper
- Integrated with unified credit system
- PostMessage communication for auth & credits"

git push origin main
```

---

## TROUBLESHOOTING

**If iframe doesn't load:**
```bash
# Check URL is correct
echo $NEXT_PUBLIC_LEGALEASE_URL

# Verify crav-legalease is deployed
curl -I https://crav-legalease.vercel.app/embedded
```

**If credits don't work:**
```sql
-- Check if credit transactions table has data
SELECT * FROM credit_transactions 
WHERE user_id = 'your-user-id' 
ORDER BY created_at DESC 
LIMIT 5;
```

**If postMessage fails:**
- Check browser console for CORS errors
- Verify origin in production matches exactly
- Check both apps are on HTTPS

---

## THAT'S IT!

3 files + 1 SQL migration = LegalEase integrated! 🎉
