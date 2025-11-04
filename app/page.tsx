'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { FileText, Zap, Shield, DollarSign, ArrowRight, CheckCircle, Users, Clock } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FileText className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-bold">LegalEase AI</span>
        </div>
        <div className="flex gap-4">
          <Link href="/dashboard">
            <Button variant="ghost">Dashboard</Button>
          </Link>
          <Link href="/embedded">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Transform Legal Documents<br />Into Plain English
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          AI-powered legal document translation that makes complex contracts and agreements easy to understand for everyone.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/embedded">
            <Button size="lg" className="text-lg px-8">
              Try It Free <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button size="lg" variant="outline" className="text-lg px-8">
              View Dashboard
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose LegalEase AI?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <Zap className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Instant Translation</CardTitle>
              <CardDescription>
                Convert legal jargon to plain English in seconds using advanced AI
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-10 w-10 text-green-600 mb-2" />
              <CardTitle>Secure & Private</CardTitle>
              <CardDescription>
                Your documents are encrypted and never stored permanently
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <DollarSign className="h-10 w-10 text-purple-600 mb-2" />
              <CardTitle>Affordable Pricing</CardTitle>
              <CardDescription>
                Pay only for what you use with our credit-based system
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Clock className="h-10 w-10 text-orange-600 mb-2" />
              <CardTitle>Save Time</CardTitle>
              <CardDescription>
                No more hours spent deciphering legal documents
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16 bg-gray-50 rounded-lg my-8">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              1
            </div>
            <h3 className="text-xl font-semibold mb-2">Upload Document</h3>
            <p className="text-gray-600">
              Paste or upload your legal document text
            </p>
          </div>
          <div className="text-center">
            <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              2
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Processing</h3>
            <p className="text-gray-600">
              Our AI analyzes and translates the content
            </p>
          </div>
          <div className="text-center">
            <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              3
            </div>
            <h3 className="text-xl font-semibold mb-2">Get Results</h3>
            <p className="text-gray-600">
              Receive plain English translation instantly
            </p>
          </div>
        </div>
      </section>

      {/* Features List */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Everything You Need</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              'Convert legal to plain English',
              'Convert plain English to legal',
              'Extract key terms and obligations',
              'Generate executive summaries',
              'Identify important deadlines',
              'Highlight payment terms',
              'Spot penalties and consequences',
              'Save conversion history'
            ].map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-lg">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-12 text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Simplify Legal Documents?</h2>
          <p className="text-xl mb-8 opacity-90">
            Start converting legal documents to plain English today
          </p>
          <Link href="/embedded">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t mt-16">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-600" />
            <span className="font-semibold">LegalEase AI</span>
          </div>
          <p className="text-gray-600 text-sm">
            Part of CR AudioViz AI ecosystem • Making legal documents accessible to everyone
          </p>
          <div className="flex gap-4">
            <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
              Dashboard
            </Link>
            <Link href="/embedded" className="text-sm text-gray-600 hover:text-gray-900">
              Try Demo
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
