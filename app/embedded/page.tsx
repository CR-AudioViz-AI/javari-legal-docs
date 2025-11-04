'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { FileText, Upload, ArrowRight, Download, Loader2 } from 'lucide-react'
import { useEmbeddedAuth, useEmbeddedCredits } from '@/lib/message-bridge'

export default function EmbeddedDashboard() {
  const { userId, sessionToken, isReady } = useEmbeddedAuth()
  const { credits, deductCredits } = useEmbeddedCredits(userId)
  
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [loading, setLoading] = useState(false)
  const [conversionType, setConversionType] = useState<'legal-to-plain' | 'plain-to-legal'>('legal-to-plain')

  // Show loading state until auth is ready
  if (!isReady || !userId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Connecting to CR AudioViz AI...</p>
        </div>
      </div>
    )
  }

  const handleConvert = async () => {
    if (!inputText.trim()) return
    
    setLoading(true)
    try {
      // Calculate credits needed
      const creditsNeeded = 10 + Math.ceil(inputText.length / 1000) * 5

      // Deduct credits via parent
      const success = await deductCredits(creditsNeeded, `LegalEase: ${conversionType}`)
      
      if (!success) {
        alert('Insufficient credits. Please purchase more credits.')
        setLoading(false)
        return
      }

      // Call conversion API
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          text: inputText,
          conversionType,
          userId,
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        setOutputText(data.convertedText)
      } else {
        alert(data.error || 'Conversion failed')
      }
    } catch (error) {
      console.error('Conversion failed:', error)
      alert('Conversion failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const text = await file.text()
    setInputText(text)
  }

  return (
    <div className="h-full bg-gray-50 p-4">
      {/* Header with Credits */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">LegalEase AI</h1>
          <p className="text-sm text-gray-600">Transform legal documents instantly</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">Your Credits</div>
          <div className="text-2xl font-bold text-blue-600">{credits.toLocaleString()}</div>
        </div>
      </div>

      {/* Conversion Type Selector */}
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

      {/* Conversion Interface */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle>Input {conversionType === 'legal-to-plain' ? 'Legal Document' : 'Plain Text'}</CardTitle>
            <CardDescription>
              Paste your text below or upload a document
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="file"
                  onChange={handleFileUpload}
                  accept=".pdf,.docx,.txt"
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Button variant="outline" asChild>
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload File
                    </span>
                  </Button>
                </label>
              </div>

              <textarea
                className="w-full h-96 p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={
                  conversionType === 'legal-to-plain'
                    ? 'Paste legal document here...'
                    : 'Paste plain text here...'
                }
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />

              <Button 
                className="w-full" 
                onClick={handleConvert}
                disabled={loading || !inputText.trim()}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Converting...
                  </>
                ) : (
                  <>
                    Convert
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card>
          <CardHeader>
            <CardTitle>Output {conversionType === 'legal-to-plain' ? 'Plain English' : 'Legal Document'}</CardTitle>
            <CardDescription>
              Converted text will appear here
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button variant="outline" disabled={!outputText}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button variant="outline" disabled={!outputText}>
                  <Download className="h-4 w-4 mr-2" />
                  Download DOCX
                </Button>
              </div>

              <div className="w-full h-96 p-4 border rounded-lg bg-white overflow-auto">
                {outputText || (
                  <p className="text-gray-400 text-center mt-20">
                    Converted text will appear here...
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
