// app/page.tsx — Javari LegalEase
// CR AudioViz AI · EIN 39-3646201 · July 30, 2026
'use client'

const FEATURES = [
  { e: '↔️', t: 'Two-Way Conversion', d: 'Legal documents into plain English, or plain English into a formal legal draft.' },
  { e: '📄', t: 'Standard Templates', d: 'NDAs, contractor agreements, leases, and more, drafted from your real details.' },
  { e: '🔒', t: 'Your Documents, Your Account', d: 'Everything you create is tied to your CR AudioViz AI account — no separate login.' },
  { e: '⚖️', t: 'Not a Substitute for a Lawyer', d: 'Every document we generate is a starting draft, meant to be reviewed by a licensed attorney.' },
]

export default function Page() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#e2e8f0', fontFamily: 'system-ui,sans-serif' }}>
      <div style={{ height: 60 }} />
      <section style={{ textAlign: 'center', padding: '64px 24px 24px', maxWidth: 700, margin: '0 auto' }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>⚖️</div>
        <h1 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, margin: '0 0 16px', color: '#6366f1' }}>Javari LegalEase</h1>
        <p style={{ fontSize: 18, color: '#9ca3af', maxWidth: 520, margin: '0 auto 24px', lineHeight: 1.65 }}>
          Convert legal documents to plain English, plain English to a legal draft, or generate a
          standard contract from your own details.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="https://craudiovizai.com/signup?returnTo=https%3A%2F%2Fjavarilegal.com%2Fdashboard"
            style={{ background: '#6366f1', color: '#fff', borderRadius: 10, padding: '13px 28px', fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
            Get Started →
          </a>
          <a href="https://craudiovizai.com" style={{ background: 'rgba(255,255,255,0.06)', color: '#e2e8f0', borderRadius: 10, padding: '13px 28px', fontSize: 15, fontWeight: 600, textDecoration: 'none' }}>
            View Platform
          </a>
        </div>
      </section>

      {/* Structural, not a footnote: this is placed directly under the hero,
          before anyone reaches a feature list or a signup button. */}
      <section style={{ maxWidth: 640, margin: '0 auto 40px', padding: '0 24px' }}>
        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
          borderRadius: 12, padding: '18px 20px', fontSize: 14, lineHeight: 1.6, color: '#fca5a5' }}>
          <strong style={{ color: '#f87171' }}>We are not a law firm, and this is not legal advice.</strong>{' '}
          Javari LegalEase uses AI to convert and draft documents from standard templates and the
          information you provide. Laws vary by state, jurisdiction, and situation in ways a
          template cannot account for. Before you sign, rely on, or act on any document created
          here, have it reviewed by a licensed attorney.
        </div>
      </section>

      <section style={{ maxWidth: 800, margin: '0 auto', padding: '0 20px 60px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16 }}>
        {FEATURES.map(f => (
          <div key={f.t} style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '20px 16px' }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{f.e}</div>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#e2e8f0', marginBottom: 4 }}>{f.t}</div>
            <div style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.5 }}>{f.d}</div>
          </div>
        ))}
      </section>

      <footer style={{ background: '#050609', borderTop: '1px solid rgba(255,255,255,0.04)', padding: '20px', textAlign: 'center' }}>
        <p style={{ color: '#374151', fontSize: 11, margin: 0 }}>
          © 2026 CR AudioViz AI, LLC — EIN: 39-3646201 · Not a law firm · Not legal advice ·{' '}
          <a href="https://craudiovizai.com/signup?returnTo=https%3A%2F%2Fjavarilegal.com%2Fdashboard" style={{ color: '#6366f1', textDecoration: 'none' }}>Get Started</a>
        </p>
      </footer>
    </div>
  )
}
