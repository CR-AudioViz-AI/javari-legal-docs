'use client';

import { useState } from 'react';
import { FileText, Upload, Download, ArrowRight, Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const [file, setFile] = useState<File | null>(null);
  const [conversionType, setConversionType] = useState<'legal_to_plain' | 'plain_to_legal'>('legal_to_plain');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleConvert = async () => {
    if (!file) return;

    setLoading(true);
    try {
      // This is a placeholder - in production, this would call your API
      await new Promise(resolve => setTimeout(resolve, 2000));
      setResult({
        convertedText: 'This is your converted document...',
        keyTerms: [],
        criticalPoints: [],
      });
    } catch (error) {
      console.error('Conversion error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <FileText className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold">LegalEase AI</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <span className="text-gray-600">Credits:</span>
                <span className="ml-2 font-semibold">50</span>
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Upgrade
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Converter</h1>
          <p className="text-gray-600">Transform legal documents into plain English and vice versa</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Upload Document</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Conversion Type
              </label>
              <select
                value={conversionType}
                onChange={(e) => setConversionType(e.target.value as any)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="legal_to_plain">Legal → Plain English</option>
                <option value="plain_to_legal">Plain English → Legal</option>
              </select>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Drop your file here or</p>
              <label className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700">
                <input
                  type="file"
                  accept=".pdf,.docx,.doc,.txt"
                  onChange={handleFileChange}
                  className="hidden"
                />
                Choose File
              </label>
              {file && (
                <p className="mt-4 text-sm text-gray-600">
                  Selected: {file.name}
                </p>
              )}
            </div>

            <button
              onClick={handleConvert}
              disabled={!file || loading}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" />
                  Converting...
                </>
              ) : (
                <>
                  Convert Document
                  <ArrowRight className="ml-2" />
                </>
              )}
            </button>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Converted Document</h2>
            
            {result ? (
              <div>
                <div className="bg-gray-50 rounded-lg p-4 mb-4 max-h-96 overflow-y-auto">
                  <p className="text-gray-800 whitespace-pre-wrap">{result.convertedText}</p>
                </div>
                <button className="w-full border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 flex items-center justify-center">
                  <Download className="mr-2" />
                  Download PDF
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center h-96 text-gray-400">
                <div className="text-center">
                  <FileText className="w-16 h-16 mx-auto mb-4" />
                  <p>Your converted document will appear here</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Documents */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Documents</h2>
          <div className="text-center text-gray-400 py-8">
            No documents yet. Upload your first document to get started!
          </div>
        </div>
      </div>
    </div>
  );
}
