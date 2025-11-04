# CRAV-WEBSITE INTEGRATION GUIDE
# How to add LegalEase AI to your Apps page

## STEP 1: Add to Apps Page

**File**: `/app/apps/page.tsx`

Add this to the `embeddedApps` array:

```typescript
{
  id: 'legalease',
  icon: '⚖️',
  iconComponent: FileText, // Add to imports: import { FileText } from 'lucide-react'
  name: 'LegalEase AI',
  description: 'Transform legal documents into plain English and vice versa with AI-powered translation.',
  features: [
    'Bidirectional legal translation',
    'Extract key terms & obligations',
    '15+ professional templates',
    'Export to PDF/DOCX'
  ],
  status: 'live',
  href: '/apps/legalease',
  color: 'amber',
  creditsPerUse: '10-50', // Variable based on document size
},
```

---

## STEP 2: Create LegalEase App Page

**File**: `/app/apps/legalease/page.tsx`

```typescript
'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { deductCredits, addCredits } from '@/lib/credits'

export default function LegalEaseApp() {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isReady, setIsReady] = useState(false)
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/signin?redirect=/apps/legalease')
        return
      }

      // Set up message handler
      const handleMessage = async (event: MessageEvent) => {
        // Verify origin
        if (event.origin !== process.env.NEXT_PUBLIC_LEGALEASE_URL) {
          return
        }

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
            }, process.env.NEXT_PUBLIC_LEGALEASE_URL!)
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
            }, process.env.NEXT_PUBLIC_LEGALEASE_URL!)
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
            }, process.env.NEXT_PUBLIC_LEGALEASE_URL!)
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
              }, process.env.NEXT_PUBLIC_LEGALEASE_URL!)
            } catch (error) {
              iframeRef.current?.contentWindow?.postMessage({
                type: 'CREDIT_UPDATE',
                payload: {
                  success: false,
                  error: 'Insufficient credits'
                }
              }, process.env.NEXT_PUBLIC_LEGALEASE_URL!)
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
        window.removeEventListener('message', handleMessage)
      }
    }

    checkAuth()
  }, [])

  return (
    <div className="h-screen w-full">
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading LegalEase AI...</p>
          </div>
        </div>
      )}
      
      <iframe
        ref={iframeRef}
        src={`${process.env.NEXT_PUBLIC_LEGALEASE_URL}/embedded`}
        className="w-full h-full border-0"
        allow="clipboard-read; clipboard-write"
      />
    </div>
  )
}
```

---

## STEP 3: Add Environment Variable

**File**: `.env.local` (in crav-website)

Add this line:

```bash
NEXT_PUBLIC_LEGALEASE_URL=https://crav-legalease.vercel.app
```

---

## STEP 4: Update Database Tables

LegalEase uses the SAME Supabase database. Run this migration:

```sql
-- Add legalease_documents table
CREATE TABLE IF NOT EXISTS public.legalease_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  original_content TEXT NOT NULL,
  converted_content TEXT,
  document_type TEXT DEFAULT 'other',
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.legalease_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own documents" ON public.legalease_documents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own documents" ON public.legalease_documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create index
CREATE INDEX idx_legalease_documents_user_id ON public.legalease_documents(user_id);
```

---

## STEP 5: Deploy Both Apps

### Deploy crav-legalease:
```bash
# Already done! Just push to GitHub
cd /path/to/crav-legalease
git push origin main
# Vercel auto-deploys
```

### Update crav-website:
```bash
# Add the changes from steps 1-3
git add .
git commit -m "Add LegalEase AI integration"
git push origin main
```

---

## STEP 6: Test Integration

1. **Visit**: https://craudiovizai.com/apps
2. **Click**: LegalEase AI card
3. **Verify**: 
   - App loads in iframe
   - Your credits display correctly
   - Document conversion works
   - Credits deduct properly

---

## HOW IT WORKS

```
User visits craudiovizai.com/apps/legalease
    ↓
Parent page loads iframe from crav-legalease.vercel.app/embedded
    ↓
Embedded app sends "READY" message
    ↓
Parent sends AUTH_TOKEN with userId and sessionToken
    ↓
Embedded app displays user's credit balance
    ↓
User converts document
    ↓
Embedded app sends CREDIT_DEDUCT message
    ↓
Parent deducts credits from shared database
    ↓
Parent sends CREDIT_UPDATE with new balance
    ↓
Embedded app updates display
```

---

## WHITE-LABEL MODE

For white-label customers, change these environment variables:

```bash
NEXT_PUBLIC_APP_MODE=standalone
NEXT_PUBLIC_USE_SHARED_DB=false
# Use their own Supabase
NEXT_PUBLIC_SUPABASE_URL=customer_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=customer_supabase_key
# Use their own Stripe
STRIPE_SECRET_KEY=customer_stripe_key
```

The app automatically switches to standalone mode!

---

## CREDIT COSTS

Based on crav-website pricing:
- Base conversion: 10 credits
- Per 1,000 characters: +5 credits
- Extract key terms: +5 credits
- Generate summary: +5 credits

Example:
- 3,000 character document = 10 + (3 × 5) = 25 credits
- With terms & summary = 25 + 5 + 5 = 35 credits

---

## NEXT STEPS

1. Push LegalEase changes to GitHub
2. Add integration code to crav-website
3. Deploy both
4. Test end-to-end
5. 🚀 LAUNCH!
