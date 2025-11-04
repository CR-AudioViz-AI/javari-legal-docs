'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { FileText, Upload, ArrowRight, Download } from 'lucide-react'

export default function DashboardPage() {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [loading, setLoading] = useState(false)
  const [conversionType, setConversionType] = useState<'legal-to-plain' | 'plain-to-legal'>('legal-to-plain')

  const handleConvert = async () => {
    if (!inputText.trim()) return
    
    setLoading(true)
    try {
      // TODO: Implement API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      setOutputText('Conversion result will appear here...')
    } catch (error) {
      console.error('Conversion failed:', error)
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold">LegalEase AI</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Credits: <strong>850</strong></span>
            <Button variant="outline">My Account</Button>
            <Button variant="ghost">Sign Out</Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Document Converter</h1>
          <p className="text-gray-600">
            Transform legal documents to plain English or create legal documents from plain text
          </p>
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
                  {loading ? 'Converting...' : 'Convert'}
                  <ArrowRight className="ml-2 h-4 w-4" />
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

                <div className="w-full h-96 p-4 border rounded-lg bg-gray-50 overflow-auto">
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

        {/* Recent Documents */}
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
