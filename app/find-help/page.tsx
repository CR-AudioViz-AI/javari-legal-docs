'use client'
// app/find-help/page.tsx — Javari LegalEase
// The real, public-facing "look for attorneys in your area" page: describe
// your situation and get told what kind of attorney typically handles it,
// then a real link to your state's official, free bar referral service.
// Never recommends a specific attorney, never takes a fee tied to whether
// someone gets hired - see app/api/legal-resources/route.ts for why.
// CR AudioViz AI · EIN 39-3646201 · July 31, 2026
import { useState } from 'react'
import { Search, MapPin, Phone, ExternalLink, AlertTriangle } from 'lucide-react'

const US_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware',
  'District of Columbia','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
  'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota',
  'Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey',
  'New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon',
  'Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah',
  'Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming',
]

type Match = { practice_area: string; description: string; urgency_note: string | null; matched_on: string[] }
type BarService = { state: string; bar_name: string; referral_url: string | null; phone: string | null; notes: string | null }

export default function FindHelpPage() {
  const [situation, setSituation] = useState('')
  const [matches, setMatches] = useState<Match[] | null>(null)
  const [matchNote, setMatchNote] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [state, setState] = useState('')
  const [barService, setBarService] = useState<BarService | null>(null)
  const [barLoading, setBarLoading] = useState(false)

  const findAttorneyType = async () => {
    if (!situation.trim()) return
    setLoading(true); setMatches(null); setMatchNote(null)
    try {
      const res = await fetch('/api/legal-resources', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ situation }),
      })
      const data = await res.json()
      if (data.ok) { setMatches(data.matches ?? []); setMatchNote(data.note ?? null) }
    } finally { setLoading(false) }
  }

  const lookupStateBar = async (selected: string) => {
    setState(selected); setBarService(null)
    if (!selected) return
    setBarLoading(true)
    try {
      const res = await fetch(`/api/legal-resources?mode=state-bar&state=${encodeURIComponent(selected)}`)
      const data = await res.json()
      if (data.ok) setBarService(data.referral_services?.[0] ?? null)
    } finally { setBarLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#e2e8f0', fontFamily: 'system-ui,sans-serif', padding: '40px 20px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8, color: '#6366f1' }}>Find the Right Kind of Attorney</h1>
        <p style={{ color: '#9ca3af', marginBottom: 24, lineHeight: 1.6 }}>
          Describe what's going on, and we'll tell you what type of attorney typically handles
          it, plus a free link to your state's official lawyer referral service.
        </p>

        <div style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 20, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 16, padding: 12,
            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, fontSize: 13, color: '#fca5a5' }}>
            <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
            <span>
              We are not a law firm and this is not legal advice. This tool only suggests a general
              type of attorney based on keywords - it does not recommend or endorse any specific
              lawyer, and we receive no fee tied to whether you hire anyone.
            </span>
          </div>

          <textarea
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            placeholder="e.g. My landlord is trying to evict me without proper notice..."
            style={{ width: '100%', minHeight: 90, background: '#0a0a0f', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 10, padding: 12, color: '#e2e8f0', fontSize: 14, resize: 'vertical' }}
          />
          <button onClick={findAttorneyType} disabled={loading || !situation.trim()}
            style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8, background: '#6366f1', color: '#fff',
              border: 'none', borderRadius: 10, padding: '10px 20px', fontSize: 14, fontWeight: 700,
              cursor: 'pointer', opacity: loading || !situation.trim() ? 0.5 : 1 }}>
            <Search size={16} /> {loading ? 'Looking…' : 'What kind of attorney do I need?'}
          </button>
        </div>

        {matches && matches.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            {matches.map((m) => (
              <div key={m.practice_area} style={{ background: '#111118', border: '1px solid rgba(99,102,241,0.3)',
                borderRadius: 12, padding: 16, marginBottom: 10 }}>
                <div style={{ fontWeight: 700, color: '#818cf8', marginBottom: 4 }}>{m.practice_area}</div>
                <div style={{ fontSize: 13, color: '#9ca3af', lineHeight: 1.5 }}>{m.description}</div>
                {m.urgency_note && (
                  <div style={{ marginTop: 8, fontSize: 12, color: '#fbbf24' }}>⏱ {m.urgency_note}</div>
                )}
              </div>
            ))}
          </div>
        )}
        {matchNote && (
          <div style={{ marginBottom: 24, fontSize: 13, color: '#9ca3af', padding: 12,
            background: '#111118', borderRadius: 10 }}>{matchNote}</div>
        )}

        <div style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <MapPin size={18} color="#6366f1" />
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Find Your State's Free Referral Service</h2>
          </div>
          <select value={state} onChange={(e) => lookupStateBar(e.target.value)}
            style={{ width: '100%', background: '#0a0a0f', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 10, padding: 10, color: '#e2e8f0', fontSize: 14 }}>
            <option value="">Select your state…</option>
            {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          {barLoading && <p style={{ marginTop: 12, color: '#9ca3af', fontSize: 13 }}>Looking up…</p>}
          {barService && (
            <div style={{ marginTop: 16, padding: 14, background: 'rgba(99,102,241,0.08)', borderRadius: 10 }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>{barService.bar_name}</div>
              {barService.phone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, marginBottom: 4 }}>
                  <Phone size={14} /> {barService.phone}
                </div>
              )}
              {barService.referral_url && (
                <a href={barService.referral_url} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: '#818cf8', textDecoration: 'none' }}>
                  <ExternalLink size={14} /> Visit official referral service
                </a>
              )}
              {barService.notes && <p style={{ marginTop: 8, fontSize: 12, color: '#9ca3af' }}>{barService.notes}</p>}
              <p style={{ marginTop: 10, fontSize: 11, color: '#6b7280' }}>
                This is your state's official, non-profit lawyer referral service - free to link to,
                and we have no financial relationship with it.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
