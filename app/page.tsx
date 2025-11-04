'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { FileText, Zap, Shield, DollarSign } from 'lucide-react'

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
          <Link href="/auth/signin">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link href="/auth/signup">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Legal Documents Made Simple
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Transform complex legal jargon into plain English (and back!) with our AI-powered platform.
          Understand contracts, agreements, and legal documents in seconds.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/auth/signup">
            <Button size="lg" className="text-lg px-8">
              Start Free Trial
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="text-lg px-8">
            Watch Demo
          </Button>
        </div>
        <p className="mt-4 text-sm text-gray-500">
          Free tier includes 100 credits • No credit card required
        </p>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose LegalEase AI?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <Zap className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Lightning Fast</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Convert legal documents to plain English in seconds using advanced AI technology.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>100% Secure</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Your documents are encrypted and never stored. We prioritize your privacy and security.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <FileText className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>15+ Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Access professional legal document templates for contracts, NDAs, policies, and more.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <DollarSign className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Affordable Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Start free with 100 credits. Upgrade only when you need more. No hidden fees.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Simple, Transparent Pricing</h2>
        <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Free</CardTitle>
              <p className="text-3xl font-bold mt-2">$0</p>
              <CardDescription>Per month</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>✓ 100 credits/month</li>
                <li>✓ Basic conversion</li>
                <li>✓ 5 templates</li>
                <li>✓ Email support</li>
              </ul>
              <Button className="w-full mt-4" variant="outline">
                Start Free
              </Button>
            </CardContent>
          </Card>

          <Card className="border-blue-600 border-2">
            <CardHeader>
              <CardTitle>Starter</CardTitle>
              <p className="text-3xl font-bold mt-2">$29</p>
              <CardDescription>Per month</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>✓ 1,000 credits/month</li>
                <li>✓ Unlimited conversions</li>
                <li>✓ 15 templates</li>
                <li>✓ Priority support</li>
                <li>✓ Export to PDF/DOCX</li>
              </ul>
              <Button className="w-full mt-4">
                Get Started
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Professional</CardTitle>
              <p className="text-3xl font-bold mt-2">$99</p>
              <CardDescription>Per month</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>✓ 5,000 credits/month</li>
                <li>✓ All templates</li>
                <li>✓ 24/7 support</li>
                <li>✓ Custom branding</li>
                <li>✓ API access</li>
                <li>✓ Bulk processing</li>
              </ul>
              <Button className="w-full mt-4" variant="outline">
                Choose Plan
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Enterprise</CardTitle>
              <p className="text-3xl font-bold mt-2">$299</p>
              <CardDescription>Per month</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>✓ 20,000 credits/month</li>
                <li>✓ Custom templates</li>
                <li>✓ Account manager</li>
                <li>✓ White-label</li>
                <li>✓ Advanced analytics</li>
                <li>✓ SLA guarantee</li>
              </ul>
              <Button className="w-full mt-4" variant="outline">
                Contact Sales
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="bg-blue-600 text-white rounded-2xl p-12">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Simplify Legal Documents?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users who trust LegalEase AI for their document translation needs.
          </p>
          <Link href="/auth/signup">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2025 LegalEase AI. All rights reserved.</p>
          <p className="mt-2 text-sm">
            Part of CR AudioViz AI ecosystem • Built with ❤️ for clarity
          </p>
        </div>
      </footer>
    </div>
  )
}
