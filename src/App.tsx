import React, { useState } from 'react';

export default function App() {
  const [metricValue, setMetricValue] = useState(160);
  const [selectedSpec, setSelectedSpec] = useState('METALLURGY');

  return (
    <div>
      {/* ARCHITECTURAL EDGE HEADER */}
      <header className="site-edge-header">
        <div className="edge-brand-lockup">
          <a href="#top" className="edge-brand">Strata Zinc & Slate</a>
          <span className="edge-coords">ZURICH · DENVER // EST. 1978</span>
        </div>

        <nav className="edge-nav-links" aria-label="Primary Navigation">
          <a href="#workbench" onClick={() => setSelectedSpec('METALLURGY')}>METALLURGY</a>
          <a href="#workbench" onClick={() => setSelectedSpec('SLATE')}>SLATE</a>
          <a href="#workbench" onClick={() => setSelectedSpec('WIND UPLIFT')}>WIND UPLIFT</a>
          <a href="#workbench" onClick={() => setSelectedSpec('PORTFOLIO')}>PORTFOLIO</a>
        </nav>

        <a href="#dispatch" className="edge-action-btn">
          COMMISSION ROOF ENVELOPE
        </a>
      </header>

      {/* HERO SECTION */}
      <header id="top" className="hero-fullbleed">
        <div className="hero-body">
          <div className="hero-copy-stack">
            <span className="hero-small-label">TITANIUM-ZINC ALLOY · WELSH CWT-Y-BUGAIL SLATE</span>
            <h1 className="hero-title">
              METALLURGIC ENVELOPES
              <span className="hero-subline">BUILT FOR CENTURIES.</span>
            </h1>
            <p className="hero-lead">Continuous double-lock standing seam zinc, hand-dressed Bangor Blue slate, and concealed drainage gutters engineered for catastrophic alpine wind loads.</p>
            <a href="#workbench" className="editorial-cta-btn">
              Open Technical Diagnostics
            </a>
          </div>

          <div className="hero-quiet-caption" aria-label="Core Guarantees">
            <span>150-YEAR ZERO-DECAY</span>
            <span>·</span>
            <span>CLASS 4 HAIL RESISTANCE</span>
            <span>·</span>
            <span>0.7mm PRE-WEATHERED ZINC</span>
          </div>
        </div>
      </header>

      {/* INTERACTIVE WORKBENCH */}
      <section id="workbench" className="lab-section">
        <div className="lab-grid">
          <div>
            <span className="hero-small-label">ROOF PITCH &amp; WIND CALCULATOR // STRATA ZINC &amp; SLATE</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '-0.02em', color: 'var(--ink-primary)' }}>
              WIND UPLIFT &amp; ROOF PITCH INCLINE
            </h2>
            <p style={{ color: 'var(--ink-muted)', lineHeight: 1.6, marginBottom: '2rem' }}>
              Calculate standing-seam zinc pan width, concealed fastener spacing, and coastal wind-uplift resistance.
            </p>

            <div style={{ marginBottom: '1.5rem', background: 'var(--bg-color)', padding: '1.5rem', border: '1px solid var(--border-soft)' }}>
              <label style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.76rem', marginBottom: '0.75rem', fontWeight: 600 }}>
                <span style={{ textTransform: 'uppercase' }}>ROOF PITCH &amp; WIND LOAD</span>
                <span style={{ color: 'var(--accent-color)', fontWeight: 700 }}>{metricValue} MPH RESISTANCE</span>
              </label>
              <input
                type="range"
                min="80"
                max="200"
                step="0.1"
                value={metricValue}
                onChange={(e) => setMetricValue(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-color)', cursor: 'pointer' }}
              />
            </div>

            <table className="spec-table">
              <tbody>
                <tr>
                  <td className="spec-label">ACTIVE PROTOCOL</td>
                  <td className="spec-value">{selectedSpec}</td>
                </tr>
                <tr>
                  <td className="spec-label">SAFETY MARGIN</td>
                  <td className="spec-value" style={{ color: 'var(--accent-color)' }}>+{(Number(metricValue) * 1.34).toFixed(1)}x OVER-ENGINEERED</td>
                </tr>
                <tr>
                  <td className="spec-label">STRUCTURAL COMPLIANCE</td>
                  <td className="spec-value">ISO 9001 / DIN 1988 VERIFIED</td>
                </tr>
                <tr>
                  <td className="spec-label">WARRANTY UNDERWRITING</td>
                  <td className="spec-value">FULLY BONDED &amp; INSURED</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ border: '1px solid var(--border-soft)', padding: '2.5rem', background: 'var(--bg-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-soft)', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent-color)', fontWeight: 700 }}>LIVE SENSOR ARRAY</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 600 }}>STATE: NOMINAL</span>
            </div>

            <div style={{ height: '220px', display: 'flex', alignItems: 'flex-end', gap: '10px', background: 'var(--surface-color)', padding: '1rem', border: '1px solid var(--border-soft)' }}>
              {[25, 40, 65, 30, 80, 95, 75, 88, 60, 90].map((base, idx) => {
                const height = Math.min(100, Math.round((base * Number(metricValue)) / 160));
                return (
                  <div
                    key={idx}
                    style={{
                      flex: 1,
                      height: `${height}%`,
                      background: idx % 2 === 0 ? 'var(--accent-color)' : 'rgba(0,0,0,0.12)',
                      transition: 'height 0.2s ease'
                    }}
                  />
                );
              })}
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--ink-muted)', fontWeight: 600 }}>
              <span>HARMONIC ATTENUATION</span>
              <span style={{ color: 'var(--accent-color)' }}>PASSING TOLERANCE</span>
            </div>
          </div>
        </div>
      </section>

      {/* DISPATCH MATRIX */}
      <footer id="dispatch" style={{ borderTop: '1px solid var(--border-soft)', padding: '4rem 3.5rem', textAlign: 'center', background: 'var(--surface-color)' }}>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.04em', color: 'var(--ink-primary)' }}>
          Strata Zinc & Slate
        </p>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--accent-color)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1.5rem', fontWeight: 600 }}>
          ZURICH · DENVER // EST. 1978 · LICENSED ARCHITECTURAL CONTRACTOR
        </p>
        <div style={{ display: 'inline-flex', gap: '1.5rem' }}>
          <a href="#top" className="editorial-cta-btn" style={{ padding: '0.75rem 1.6rem', fontSize: '0.72rem' }}>
            RETURN TO SUMMIT
          </a>
        </div>
      </footer>
    </div>
  );
}
