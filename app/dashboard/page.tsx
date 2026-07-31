'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Upload, ArrowRight, Download } from 'lucide-react'

async function authHeader(): Promise<Record<string, string>> {
  const { createClient } = await import('@/lib/supabase')
  const supabase = createClient()
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export default function DashboardPage() {
  const [inputText, setInputText] = useState('')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [outputText, setOutputText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [conversionType, setConversionType] = useState<'legal-to-plain' | 'plain-to-legal'>('legal-to-plain')
  const [balance, setBalance] = useState<number | null>(null)
  const [lastCost, setLastCost] = useState<number | null>(null)
  const [acknowledged, setAcknowledged] = useState(false)

  const loadBalance = useCallback(async () => {
    try {
      const headers = await authHeader()
      const res = await fetch('/api/credits/balance', { headers })
      const body = await res.json()
      if (body.ok) setBalance(body.balance)
    } catch { /* leave balance null - the header shows a loading state */ }
  }, [])

  useEffect(() => { void loadBalance() }, [loadBalance])

  const handleConvert = async () => {
    if (!inputText.trim() && !uploadedFile) return
    setLoading(true); setError(null); setOutputText('')

    try {
      const headers = await authHeader()
      const body = new FormData()
      if (uploadedFile) body.append('file', uploadedFile)
      else body.append('text', inputText)
      body.append('direction', conversionType)
      body.append('acknowledged_disclaimer', String(acknowledged))

      const res = await fetch('/api/convert', { method: 'POST', headers, body })
      const data = await res.json()

      if (!res.ok || !data.success) {
        setError(data.error ?? 'Conversion failed — please try again.')
        return
      }
      setOutputText(data.convertedText)
      setLastCost(data.cost)
      setBalance(data.newBalance)
    } catch {
      setError('Could not reach the conversion service. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setUploadedFile(file)
    setInputText('') // the file itself is sent to the API, not its raw text
  }

  const downloadOutput = (format: 'txt' | 'docx') => {
    // Real DOCX generation is a larger addition (needs a docx-writing library
    // server-side) - honest plain-text download now, DOCX export queued
    // rather than a Download button that silently does nothing.
    if (format === 'docx') {
      setError('DOCX export is not built yet — use the text download for now.')
      return
    }
    const blob = new Blob([outputText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'converted-document.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold">LegalEase AI</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Credits: <strong>{balance === null ? '…' : balance}</strong>
            </span>
            <Button variant="outline">My Account</Button>
            <Button variant="ghost">Sign Out</Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Structural, not a footnote - shown above the tool every time, and
            the checkbox below is what actually gates the Convert button. */}
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
          <strong>Not legal advice.</strong> CR AudioViz AI is not a law firm. Every conversion is
          AI-generated from your own text and is a starting point only — have a licensed attorney
          review anything before you sign it, rely on it, or act on it.
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Document Converter</h1>
          <p className="text-gray-600">
            Transform legal documents to plain English or create legal documents from plain text
          </p>
        </div>

        <div className="flex gap-4 mb-6">
          <Button
            variant={conversionType === 'legal-to-plain' ? 'default' : 'outline'}
            onClick={() => setConversionType('legal-to-plain')}
          >
            Legal → Plain English
          </Button>
          <Button
            variant={conversionType === 'plain-to-legal' ? 'default' : 'outline'}
            onClick={() => setConversionType('plain-to-legal')}
          >
            Plain English → Legal
          </Button>
        </div>

        {error && (
          <div role="alert" className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Input {conversionType === 'legal-to-plain' ? 'Legal Document' : 'Plain Text'}</CardTitle>
              <CardDescription>Paste your text below or upload a document (PDF, DOCX, or TXT)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    type="file" onChange={handleFileUpload} accept=".pdf,.docx,.txt"
                    className="hidden" id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Button variant="outline" asChild>
                      <span><Upload className="h-4 w-4 mr-2" />Upload File</span>
                    </Button>
                  </label>
                  {uploadedFile && (
                    <span className="text-sm text-gray-600">
                      {uploadedFile.name}
                      <button type="button" className="ml-2 text-red-500 hover:underline"
                        onClick={() => setUploadedFile(null)}>Remove</button>
                    </span>
                  )}
                </div>

                <textarea
                  className="w-full h-96 p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
                  placeholder={
                    uploadedFile ? 'A file is selected above — its contents will be converted.'
                    : conversionType === 'legal-to-plain' ? 'Paste legal document here...' : 'Paste plain text here...'
                  }
                  value={inputText}
                  disabled={!!uploadedFile}
                  onChange={(e) => setInputText(e.target.value)}
                />

                <label className="flex items-start gap-2 text-sm text-gray-600 cursor-pointer">
                  <input type="checkbox" className="mt-0.5" checked={acknowledged}
                    onChange={(e) => setAcknowledged(e.target.checked)} />
                  I understand this is not legal advice and I will have a licensed attorney
                  review this document before relying on it.
                </label>

                <Button className="w-full" onClick={handleConvert}
                  disabled={loading || !acknowledged || (!inputText.trim() && !uploadedFile)}>
                  {loading ? 'Converting…' : 'Convert'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Output {conversionType === 'legal-to-plain' ? 'Plain English' : 'Legal Document'}</CardTitle>
              <CardDescription>
                {lastCost !== null ? `This conversion cost ${lastCost} credits` : 'Converted text will appear here'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button variant="outline" disabled={!outputText} onClick={() => downloadOutput('txt')}>
                    <Download className="h-4 w-4 mr-2" />Download Text
                  </Button>
                  <Button variant="outline" disabled={!outputText} onClick={() => downloadOutput('docx')}>
                    <Download className="h-4 w-4 mr-2" />Download DOCX
                  </Button>
                </div>

                <div className="w-full h-96 p-4 border rounded-lg bg-gray-50 overflow-auto whitespace-pre-wrap">
                  {outputText || (
                    <p className="text-gray-400 text-center mt-20">Converted text will appear here...</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Documents</CardTitle>
            <CardDescription>Your recently converted documents</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 text-center py-8">
              No documents yet. Start by converting your first document above.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
