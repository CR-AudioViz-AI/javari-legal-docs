-- Minimal working schema for LegalEase
CREATE TABLE IF NOT EXISTS legalease_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  original_content TEXT NOT NULL,
  converted_content TEXT,
  document_type TEXT DEFAULT 'other',
  status TEXT DEFAULT 'completed',
  cost_credits INTEGER DEFAULT 0,
  word_count INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES legalease_documents(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  original_language TEXT NOT NULL,
  target_language TEXT NOT NULL,
  original_text TEXT NOT NULL,
  translated_text TEXT,
  cost_credits INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_docs_user ON legalease_documents(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_trans_user ON translations(user_id, created_at DESC);

ALTER TABLE legalease_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS docs_select ON legalease_documents;
CREATE POLICY docs_select ON legalease_documents FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS trans_select ON translations;
CREATE POLICY trans_select ON translations FOR ALL USING (auth.uid() = user_id);
