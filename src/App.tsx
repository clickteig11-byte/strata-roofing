import React, { useState, useId } from 'react';
import { 
  ArrowUpRight, 
  CheckCircle2, 
  Sliders, 
  ShieldCheck, 
  Layers, 
  PhoneCall, 
  Sparkles, 
  Compass, 
  Hammer, 
  Mountain, 
  Ruler, 
  Award,
  FileCheck
} from 'lucide-react';

interface SlateGradeSpec {
  name: string;
  quarry: string;
  weightLbsPerSq: number;
  durabilityYears: string;
  astmGrade: string;
  recommendedNail: string;
}

const SLATE_GRADES: Record<string, SlateGradeSpec> = {
  standard_s1: {
    name: 'Standard Commercial 3/16"',
    quarry: 'Fair Haven, Vermont (Unfading Green)',
    weightLbsPerSq: 750,
    durabilityYears: '125+ Years',
    astmGrade: 'ASTM C406 Grade S1',
    recommendedNail: '1.50" 11-Gauge Smooth Solid Copper Wire Nail'
  },
  heavy_quarter: {
    name: 'Architectural Heavy 3/8"',
    quarry: 'Poultney, Vermont (Mottled Purple & Green)',
    weightLbsPerSq: 1250,
    durabilityYears: '150+ Years',
    astmGrade: 'ASTM C406 Grade S1',
    recommendedNail: '2.00" 11-Gauge Smooth Solid Copper Wire Nail'
  },
  monumental_half: {
    name: 'Monumental Graduated 1/2"',
    quarry: 'Buckingham County, Virginia (Crystalline Black)',
    weightLbsPerSq: 1800,
    durabilityYears: '175+ Years',
    astmGrade: 'ASTM C406 Grade S1 Highest Density',
    recommendedNail: '2.50" 10-Gauge Solid Copper Wire Nail'
  },
  welsh_penrhyn: {
    name: 'Welsh Penrhyn Heather Blue',
    quarry: 'Bethesda, Gwynedd, North Wales (UK)',
    weightLbsPerSq: 820,
    durabilityYears: '150+ Years',
    astmGrade: 'BS EN 12326-1 A1-T1-S1 Verified',
    recommendedNail: '1.75" 11-Gauge Solid Copper Wire Nail'
  }
};

interface MetalSpec {
  metal: string;
  gauge: string;
  finish: string;
  expansionCoeff: string;
  seamType: string;
  serviceLife: string;
}

const METALS_INFO: MetalSpec[] = [
  {
    metal: 'VMZINC Quartz-Zinc',
    gauge: '0.70mm / 0.80mm',
    finish: 'Pre-weathered velvet light gray patina',
    expansionCoeff: '0.022 mm/m/°C (Accommodated via sliding clips)',
    seamType: 'Continuous Double-Lock Standing Seam (1" Seam Height)',
    serviceLife: '100+ Years in coastal and mountain atmospheres'
  },
  {
    metal: 'VMZINC Anthra-Zinc',
    gauge: '0.70mm / 0.80mm',
    finish: 'Deep charcoal anthracite mineral tone',
    expansionCoeff: '0.022 mm/m/°C',
    seamType: 'Continuous Double-Lock with concealed fasteners',
    serviceLife: '100+ Years with zero paint maintenance'
  },
  {
    metal: 'Revere Architectural Copper',
    gauge: '16 oz & 20 oz Cold-Rolled',
    finish: 'Natural mill bronze weathering to brown then green patina',
    expansionCoeff: '0.017 mm/m/°C',
    seamType: 'Fully soldered flat-lock & double-lock standing seam',
    serviceLife: '150+ Years (Standard for historic cathedrals)'
  },
  {
    metal: 'TCS II Terne-Coated Stainless',
    gauge: '304 Stainless with Tin/Zinc alloy',
    finish: 'Matte architectural pewter patina',
    expansionCoeff: '0.016 mm/m/°C',
    seamType: 'Fully soldered watertight pans on low slope valleys',
    serviceLife: 'Centuries (Immune to acid rain & marine salt spray)'
  }
];

export default function App() {
  // Workbench state
  const [roofSquares, setRoofSquares] = useState<number>(38); // 1 Square = 100 sq ft
  const [pitchRise, setPitchRise] = useState<number>(9); // 9/12 Pitch
  const [slateGradeKey, setSlateGradeKey] = useState<string>('standard_s1');
  const [groundSnowLoad, setGroundSnowLoad] = useState<number>(45); // PSF
  const [zincRunLength, setZincRunLength] = useState<number>(32); // Feet

  // Metal detail toggle state
  const [activeMetalIdx, setActiveMetalIdx] = useState<number>(0);

  // Intake Form state
  const [clientName, setClientName] = useState('');
  const [projectLocation, setProjectLocation] = useState('');
  const [buildingType, setBuildingType] = useState('historic-residence');
  const [projectScope, setProjectScope] = useState('full-slate-zinc');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [takeoffRef, setTakeoffRef] = useState('');

  // Accessible IDs
  const sqId = useId();
  const pitchId = useId();
  const snowId = useId();
  const zincId = useId();

  // Mathematical & Engineering Calculations
  const totalSqFt = roofSquares * 100;
  const currentGrade = SLATE_GRADES[slateGradeKey];

  // Pitch angle in radians: theta = arctan(rise / 12)
  const pitchAngleRad = Math.atan(pitchRise / 12);
  const pitchAngleDeg = Math.round((pitchAngleRad * 180) / Math.PI);
  const cosPitch = Math.cos(pitchAngleRad);

  // Total dead weight of pure slate on the rafters
  const totalDeadWeightLbs = roofSquares * currentGrade.weightLbsPerSq;
  const totalDeadWeightTons = (totalDeadWeightLbs / 2000).toFixed(2);
  const deadLoadPsf = (currentGrade.weightLbsPerSq / 100).toFixed(1);

  // Design roof snow load per ASCE 7-16: Ps = 0.7 * Cs * Pg (flat roof factor 0.7 * slope factor Cs * ground load Pg)
  // Sloped roof factor Cs: drops as pitch steepens past 7/12 (30 deg) due to snow shedding on smooth slate
  const slopeFactorCs = pitchAngleDeg <= 30 ? 1.0 : Math.max(0.2, 1.0 - (pitchAngleDeg - 30) / 40);
  const designSnowLoadPsf = (0.7 * slopeFactorCs * groundSnowLoad).toFixed(1);
  const combinedRafterPsf = (parseFloat(deadLoadPsf) + parseFloat(designSnowLoadPsf)).toFixed(1);

  // Total slate count: an 18"x10" slate with 3" headlap has 7.5" exposure = 75 sq. in. = 192 slates per square
  const slatesPerSquare = 192;
  const totalSlatePieces = roofSquares * slatesPerSquare;

  // Zinc Pan Thermal Expansion:
  // Delta L = alpha * L * Delta T
  // Alpha for zinc = 0.0000122 in/in/deg F. Design Delta T = 150 deg F (-10F to 140F sun)
  const zincExpansionInches = (0.0000122 * (zincRunLength * 12) * 150).toFixed(2);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const refCode = `SR-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setTakeoffRef(refCode);
    setFormSubmitted(true);
    try {
      const payload = {
        refCode,
        clientName,
        projectLocation,
        buildingType,
        projectScope,
        roofSquares,
        pitchRise,
        slateGrade: currentGrade.grade,
        combinedRafterPsf,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(`strata_takeoff_${refCode}`, JSON.stringify(payload));
    } catch {
      // Local storage fallback
    }
  };

  return (
    <div className="roof-app-wrapper">
      {/* TOP CRAFT STANDARDS BAR */}
      <aside className="roof-top-bar" aria-label="Craft Standards Readout">
        <div className="roof-top-container">
          <div className="roof-top-item">
            <span className="live-pulse" aria-hidden="true"></span>
            <span className="mono-sub">ACTIVE CREWS:</span>
            <span className="mono-bold">HISTORIC SLATE &amp; STANDING SEAM ZINC METALS</span>
          </div>
          <div className="roof-top-item hide-mobile">
            <span className="mono-sub">ACCREDITATION:</span>
            <span>SRCA CERTIFIED MASTER SLATERS · SPENGLER MEISTER CRAFT</span>
          </div>
          <div className="roof-top-item hide-mobile">
            <span className="mono-sub">QUARRY SOURCE:</span>
            <span>VERMONT S1 UNMETEORIZED UNfading SLATE</span>
          </div>
          <div className="roof-top-item">
            <span className="mono-sub">FIELD SHOPS:</span>
            <span className="coords-badge">BOSTON HISTORIC &amp; BERKSHIRE METALS</span>
          </div>
        </div>
      </aside>

      {/* MASTER ARCHITECTURAL HEADER */}
      <header className="roof-master-header">
        <div className="roof-header-inner">
          <a href="#hero" className="roof-brand-lockup">
            <span className="roof-brand-name">STRATA ZINC &amp; SLATE</span>
            <span className="roof-brand-sub">ARCHITECTURAL METALSMITHS · MASTER SLATE ARTISANS</span>
          </a>

          <nav className="roof-header-nav" aria-label="Main Navigation">
            <a href="#workbench">01. LOAD &amp; PITCH LAB</a>
            <a href="#metallurgy">02. ARCHITECTURAL METALS</a>
            <a href="#quarries">03. SLATE PROVENANCE</a>
            <a href="#anatomy">04. FLASHING ANATOMY</a>
            <a href="#commission">05. INTAKE</a>
          </nav>

          <a href="#commission" className="roof-btn-primary">
            COMMISSION ROOF ENVELOPE
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </div>
      </header>

      {/* HERO SECTION */}
      <section id="hero" className="roof-hero-section">
        <div className="roof-hero-grid">
          <div className="roof-hero-content">
            <div className="pill-tag">
              <Mountain size={13} aria-hidden="true" />
              <span>CENTURY ENVELOPES // VERMONT S1 &amp; VMZINC</span>
            </div>

            <h1 className="roof-hero-h1">
              ARCHITECTURAL ROOFS
              <span className="roof-hero-accent">BUILT FOR THREE HUNDRED YEARS.</span>
            </h1>

            <p className="roof-hero-summary">
              Hand-dressed Vermont Unfading Green slate fastened with solid copper nails, 
              paired with double-lock standing seam zinc and custom-soldered 20-ounce copper gutters. 
              Zero synthetic asphalt. Zero exposed rubber gaskets. Pure stone and architectural metal.
            </p>

            <div className="roof-hero-actions">
              <a href="#workbench" className="roof-btn-primary-lg">
                <Sliders size={16} aria-hidden="true" />
                OPEN LOAD &amp; PITCH WORKBENCH
              </a>
              <a href="#metallurgy" className="roof-btn-secondary-lg">
                EXPLORE VMZINC &amp; COPPER
              </a>
            </div>

            <div className="roof-trust-row" aria-label="Core Guarantees">
              <div className="trust-cell">
                <span className="trust-number">150+ YRS</span>
                <span className="trust-label">S1 SLATE SERVICE LIFE</span>
              </div>
              <div className="trust-divider" aria-hidden="true"></div>
              <div className="trust-cell">
                <span className="trust-number">140 MPH</span>
                <span className="trust-label">WIND UPLIFT TESTED</span>
              </div>
              <div className="trust-divider" aria-hidden="true"></div>
              <div className="trust-cell">
                <span className="trust-number">CLASS 4</span>
                <span className="trust-label">HAIL IMPACT CERTIFIED</span>
              </div>
              <div className="trust-divider" aria-hidden="true"></div>
              <div className="trust-cell">
                <span className="trust-number">100%</span>
                <span className="trust-label">SOLID COPPER FASTENERS</span>
              </div>
            </div>
          </div>

          <div className="roof-hero-visual">
            <div className="image-frame">
              <img 
                src="/roofing-hero.jpg" 
                alt="Historic architectural slate and standing seam zinc roof with custom soldered copper dormers" 
                className="roof-feature-img"
              />
              <div className="image-caption-overlay">
                <div className="caption-pill">FIELD SPECIMEN // BEACON HILL RESIDENCE</div>
                <div className="caption-details">
                  <span>Vermont Unfading Green Slate</span> · <span>Double-Lock VMZINC Dormers</span> · <span>20 oz Soldered Copper Valleys</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 01: INTERACTIVE LOAD, PITCH & SLATE LAB */}
      <section id="workbench" className="roof-section bg-slate">
        <div className="roof-section-inner">
          <div className="section-head">
            <div className="pill-tag">
              <Ruler size={13} aria-hidden="true" />
              <span>STRUCTURAL ENGINEERING // ASCE 7-16 &amp; ASTM C406</span>
            </div>
            <h2 className="section-title">ROOF PITCH, SNOW LOAD &amp; SLATE DEADWEIGHT LAB</h2>
            <p className="section-lead">
              Calculate rafter loads, wind uplift resistance, and thermal expansion joints for architectural slate and standing seam zinc systems based on pitch ratio and regional snow conditions.
            </p>
          </div>

          <div className="workbench-card-grid">
            {/* Input Controls */}
            <div className="workbench-inputs-card">
              <div className="card-header-bar">
                <span className="card-kicker">01 // ENVELOPE PARAMETERS</span>
                <span className="card-status-dot">ACTIVE ENGINE</span>
              </div>

              {/* Roof Area in Squares */}
              <div className="input-group">
                <div className="input-label-row">
                  <label htmlFor={sqId} className="input-label">ROOF FOOTPRINT (SQUARES)</label>
                  <span className="input-val-badge">{roofSquares} SQUARES ({totalSqFt.toLocaleString()} SQ. FT.)</span>
                </div>
                <input 
                  id={sqId}
                  type="range" 
                  min="8" 
                  max="100" 
                  step="1" 
                  value={roofSquares} 
                  onChange={(e) => setRoofSquares(parseInt(e.target.value, 10))}
                  className="roof-slider"
                />
                <div className="slider-limits">
                  <span>8 Squares (Cottage)</span>
                  <span>45 Squares (Townhome)</span>
                  <span>100 Squares (Grand Estate)</span>
                </div>
              </div>

              {/* Roof Pitch Ratio */}
              <div className="input-group">
                <div className="input-label-row">
                  <label htmlFor={pitchId} className="input-label">ROOF PITCH INCLINE</label>
                  <span className="input-val-badge">{pitchRise}/12 PITCH ({pitchAngleDeg}° INCLINE)</span>
                </div>
                <input 
                  id={pitchId}
                  type="range" 
                  min="4" 
                  max="18" 
                  step="1" 
                  value={pitchRise} 
                  onChange={(e) => setPitchRise(parseInt(e.target.value, 10))}
                  className="roof-slider"
                />
                <div className="slider-limits">
                  <span>4/12 (Minimum Slate Slope)</span>
                  <span>9/12 (Classic Victorian)</span>
                  <span>18/12 (Steep French Mansard)</span>
                </div>
              </div>

              {/* Slate Grade Selection */}
              <div className="input-group">
                <label className="input-label">SLATE THICKNESS &amp; GRADE</label>
                <div className="grade-grid" role="radiogroup" aria-label="Slate Grades">
                  {Object.entries(SLATE_GRADES).map(([key, spec]) => (
                    <button
                      key={key}
                      type="button"
                      role="radio"
                      aria-checked={slateGradeKey === key}
                      onClick={() => setSlateGradeKey(key)}
                      className={`grade-option-btn ${slateGradeKey === key ? 'active' : ''}`}
                    >
                      <span className="grade-name">{spec.name}</span>
                      <span className="grade-meta">{spec.weightLbsPerSq} lbs/sq · {spec.durabilityYears}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Ground Snow Load */}
              <div className="input-group">
                <div className="input-label-row">
                  <label htmlFor={snowId} className="input-label">ASCE 7 GROUND SNOW LOAD</label>
                  <span className="input-val-badge">{groundSnowLoad} PSF (Ground Benchmark)</span>
                </div>
                <input 
                  id={snowId}
                  type="range" 
                  min="20" 
                  max="90" 
                  step="5" 
                  value={groundSnowLoad} 
                  onChange={(e) => setGroundSnowLoad(parseInt(e.target.value, 10))}
                  className="roof-slider"
                />
                <div className="slider-limits">
                  <span>20 PSF (Coastal Mid-Atlantic)</span>
                  <span>45 PSF (Greater Boston)</span>
                  <span>90 PSF (Alpine / Green Mts)</span>
                </div>
              </div>

              {/* Zinc Pan Continuous Run */}
              <div className="input-group">
                <div className="input-label-row">
                  <label htmlFor={zincId} className="input-label">STANDING SEAM ZINC PAN LENGTH</label>
                  <span className="input-val-badge">{zincRunLength} FT CONTINUOUS RUN</span>
                </div>
                <input 
                  id={zincId}
                  type="range" 
                  min="12" 
                  max="55" 
                  step="1" 
                  value={zincRunLength} 
                  onChange={(e) => setZincRunLength(parseInt(e.target.value, 10))}
                  className="roof-slider"
                />
                <div className="slider-limits">
                  <span>12 Ft (Dormer Pan)</span>
                  <span>30 Ft (Standard Rake)</span>
                  <span>55 Ft (Long Continuous Rafter)</span>
                </div>
              </div>
            </div>

            {/* Calculated Structural Readout */}
            <div className="workbench-results-card">
              <div className="card-header-bar">
                <span className="card-kicker">02 // RAFTER &amp; DEAD LOAD VERIFICATION</span>
                <span className="card-sub-kicker">ASCE 7-16 STRUCTURAL METRICS</span>
              </div>

              <div className="results-hero-stat">
                <span className="stat-eyebrow">TOTAL STONE DEAD WEIGHT ON RAFTERS</span>
                <div className="stat-big-lockup">
                  <span className="stat-big-val">{totalDeadWeightTons}</span>
                  <span className="stat-big-unit">TONS OF VERMONT SLATE ({totalDeadWeightLbs.toLocaleString()} LBS)</span>
                </div>
                <p className="stat-narrative">
                  For {roofSquares} squares of {currentGrade.name}, the envelope requires <strong>{totalSlatePieces.toLocaleString()} hand-punched slates</strong> with 3-inch headlap. Combined rafter structural requirement: <strong>{combinedRafterPsf} PSF</strong> (Dead Load + Sloped Snow Load).
                </p>
              </div>

              <div className="prescription-matrix">
                <div className="matrix-row">
                  <div className="matrix-cell">
                    <span className="cell-label">DESIGN SNOW LOAD ON ROOF</span>
                    <span className="cell-value">{designSnowLoadPsf} PSF</span>
                    <span className="cell-note">Reduced by {pitchAngleDeg}° slope factor (Cs = {slopeFactorCs.toFixed(2)})</span>
                  </div>
                  <div className="matrix-cell">
                    <span className="cell-label">ZINC PAN THERMAL TRAVEL</span>
                    <span className="cell-value">±{zincExpansionInches}" EXPANSION</span>
                    <span className="cell-note">Accommodated via sliding stainless clips at ridge/eaves</span>
                  </div>
                </div>

                <div className="matrix-row">
                  <div className="matrix-cell">
                    <span className="cell-label">SPECIFIED COPPER ROOFING NAIL</span>
                    <span className="cell-value cell-text-sm">{currentGrade.recommendedNail}</span>
                    <span className="cell-note">Smooth-shank pure copper (never electro-galvanized)</span>
                  </div>
                  <div className="matrix-cell">
                    <span className="cell-label">UNDERLAYMENT SPECIFICATION</span>
                    <span className="cell-value cell-text-sm">Grace Ice &amp; Water HT + DELTA-VENT SA</span>
                    <span className="cell-note">High-temperature 260°F rated vapor-permeable membrane</span>
                  </div>
                </div>
              </div>

              <div className="workbench-cta-box">
                <div className="cta-icon-box">
                  <Award size={18} aria-hidden="true" />
                </div>
                <div className="cta-text-box">
                  <span className="cta-title">Need Historic District Submittals?</span>
                  <span className="cta-sub">We prepare stamped drawings, slate quarry certifications, and metal mockups for Historic Commissions across Massachusetts and Rhode Island.</span>
                </div>
                <a href="#commission" className="roof-btn-secondary">
                  REQUEST TAKEOFF
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 02: ARCHITECTURAL METALS SHOWCASE */}
      <section id="metallurgy" className="roof-section bg-white">
        <div className="roof-section-inner">
          <div className="section-head">
            <div className="pill-tag">
              <Hammer size={13} aria-hidden="true" />
              <span>METALLURGY // COLD-ROLLED TRADITION</span>
            </div>
            <h2 className="section-title">VMZINC, ARCHITECTURAL COPPER &amp; TERNE</h2>
            <p className="section-lead">
              Our metalsmiths form continuous double-lock standing seams using German RAS folding machines and hand-dressed seam irons. No caulked joints. No exposed silicone. Every valley is locked and fully soldered.
            </p>
          </div>

          <div className="metals-tabs-bar" role="tablist" aria-label="Architectural Metals">
            {METALS_INFO.map((metal, idx) => (
              <button
                key={idx}
                type="button"
                role="tab"
                aria-selected={activeMetalIdx === idx}
                onClick={() => setActiveMetalIdx(idx)}
                className={`metal-tab-btn ${activeMetalIdx === idx ? 'active' : ''}`}
              >
                {metal.metal}
              </button>
            ))}
          </div>

          <div className="metal-detail-card">
            <div className="metal-detail-grid">
              <div className="metal-info-left">
                <span className="metal-kicker">MATERIAL SPECIFICATION</span>
                <h3 className="metal-name">{METALS_INFO[activeMetalIdx].metal}</h3>
                <p className="metal-finish-desc">{METALS_INFO[activeMetalIdx].finish}</p>
                <div className="metal-specs-list">
                  <div className="metal-spec-line">
                    <span className="spec-name">GAUGE / THICKNESS:</span>
                    <span className="spec-val">{METALS_INFO[activeMetalIdx].gauge}</span>
                  </div>
                  <div className="metal-spec-line">
                    <span className="spec-name">THERMAL BEHAVIOR:</span>
                    <span className="spec-val">{METALS_INFO[activeMetalIdx].expansionCoeff}</span>
                  </div>
                  <div className="metal-spec-line">
                    <span className="spec-name">SEAM ARCHITECTURE:</span>
                    <span className="spec-val">{METALS_INFO[activeMetalIdx].seamType}</span>
                  </div>
                  <div className="metal-spec-line">
                    <span className="spec-name">EXPECTED LIFE:</span>
                    <span className="spec-val text-green">{METALS_INFO[activeMetalIdx].serviceLife}</span>
                  </div>
                </div>
              </div>

              <div className="metal-craft-right">
                <span className="craft-badge">SPENGLER MEISTER TRADITION</span>
                <h4 className="craft-title">Hand-Formed Double-Lock Seams</h4>
                <p className="craft-body">
                  Unlike snap-together commercial panels that warp under thermal movement, our double-lock seams fold the metal 360 degrees around concealed stainless sliding clips. 
                  The pans float freely during New England seasonal swings from -10°F winter freezes to 140°F rooftop solar heat.
                </p>
                <div className="craft-features">
                  <div className="craft-pill">Concealed Sliding Clips</div>
                  <div className="craft-pill">50/50 Tin-Lead Solder</div>
                  <div className="craft-pill">Zero Exposed Fasteners</div>
                  <div className="craft-pill">Zero Caulking Maintenance</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 03: SLATE PROVENANCE & QUARRY SHOWCASE */}
      <section id="quarries" className="roof-section bg-slate">
        <div className="roof-section-inner">
          <div className="section-head">
            <div className="pill-tag">
              <Compass size={13} aria-hidden="true" />
              <span>GEOLOGICAL PROVENANCE // ASTM C406 S1</span>
            </div>
            <h2 className="section-title">THE NORTH AMERICAN &amp; WELSH QUARRIES</h2>
            <p className="section-lead">
              We reject cheap imported Spanish and Chinese slate that contains reactive iron pyrites which bleed brown rust stains after two winters. We source solely from certified North American S1 vein deposits and North Wales.
            </p>
          </div>

          <div className="quarry-grid">
            <div className="quarry-card">
              <span className="quarry-origin">FAIR HAVEN, VERMONT</span>
              <h3 className="quarry-title">Vermont Unfading Green</h3>
              <p className="quarry-desc">
                The gold standard of historic New England slate. Quarried from the Taconic Mountain belt, this ultra-dense Cambrian phyllite retains its rich sage-green tone without fading or flaking for over a century.
              </p>
              <div className="quarry-metrics">
                <span>ASTM C406: Grade S1</span>
                <span>Water Absorption: &lt; 0.14%</span>
                <span>Modulus of Rupture: 9,200 PSI</span>
              </div>
            </div>

            <div className="quarry-card">
              <span className="quarry-origin">POULTNEY, VERMONT</span>
              <h3 className="quarry-title">Vermont Mottled Purple &amp; Red</h3>
              <p className="quarry-desc">
                Naturally variegated with deep wine purple and subtle olive accents. Highly favored by preservation architects for historic Victorian, Queen Anne, and Romanesque Revival estates throughout Boston and Newport.
              </p>
              <div className="quarry-metrics">
                <span>ASTM C406: Grade S1</span>
                <span>Water Absorption: &lt; 0.16%</span>
                <span>Modulus of Rupture: 8,800 PSI</span>
              </div>
            </div>

            <div className="quarry-card">
              <span className="quarry-origin">BUCKINGHAM COUNTY, VIRGINIA</span>
              <h3 className="quarry-title">Buckingham Crystalline Black</h3>
              <p className="quarry-desc">
                Regarded worldwide as the finest black slate on earth. Formed under intense Appalachian metamorphism with visible sparkling mica crystals. Service life exceeds 175 years in corrosive marine environments.
              </p>
              <div className="quarry-metrics">
                <span>ASTM C406: Highest S1 Class</span>
                <span>Water Absorption: &lt; 0.08%</span>
                <span>Modulus of Rupture: 10,400 PSI</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 04: FLASHING ANATOMY */}
      <section id="anatomy" className="roof-section bg-white">
        <div className="roof-section-inner">
          <div className="section-head">
            <div className="pill-tag">
              <ShieldCheck size={13} aria-hidden="true" />
              <span>FLASHING INTEGRITY // ZERO WATER CHANNELS</span>
            </div>
            <h2 className="section-title">VALLEYS, CHIMNEYS &amp; GUTTER ANATOMY</h2>
            <p className="section-lead">
              A slate roof never fails in the middle of a field—it fails where the slates meet masonry walls, valleys, and gutters. Here is how our copper details prevent water infiltration forever.
            </p>
          </div>

          <div className="anatomy-grid">
            <div className="anatomy-box">
              <div className="anatomy-icon-wrap">
                <FileCheck size={24} aria-hidden="true" />
              </div>
              <h3 className="anatomy-title">Step Flashing with Lead Counter-Flashing</h3>
              <p className="anatomy-desc">
                Individual 16 oz copper step flashings are woven with every single course of slate. The mortar joints in brick chimneys are ground out 1.5 inches deep to receive fold-in lead wedge plugs and non-hardening polyurethane sealant.
              </p>
            </div>

            <div className="anatomy-box">
              <div className="anatomy-icon-wrap">
                <Layers size={24} aria-hidden="true" />
              </div>
              <h3 className="anatomy-title">Open W-Valley with Splash Rib</h3>
              <p className="anatomy-desc">
                Continuous 20 oz cold-rolled copper valley liners featuring a central 1-inch raised splash rib. Prevents rushing storm water on steep pitches from damming and forcing its way under the opposite slate course.
              </p>
            </div>

            <div className="anatomy-box">
              <div className="anatomy-icon-wrap">
                <Hammer size={24} aria-hidden="true" />
              </div>
              <h3 className="anatomy-title">Heavy Solid Copper Half-Round Gutters</h3>
              <p className="anatomy-desc">
                Continuous 6-inch half-round gutters formed from 20 oz copper, suspended with hand-forged solid brass roof brackets spaced every 24 inches to withstand crushing winter ice sheets and sliding snow loads.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 05: COMMISSION & ARCHITECTURAL TAKEOFF */}
      <section id="commission" className="roof-section bg-slate">
        <div className="roof-section-inner max-w-narrow">
          <div className="section-head text-center">
            <div className="pill-tag mx-auto">
              <PhoneCall size={13} aria-hidden="true" />
              <span>ROOF TAKEOFF // COMMISSION INQUIRY</span>
            </div>
            <h2 className="section-title">COMMISSION A ROOF ENVELOPE AUDIT</h2>
            <p className="section-lead">
              We collaborate with historic preservation architects, general contractors, and private estate owners. All inquiries receive direct consultation with our Master Slater.
            </p>
          </div>

          {formSubmitted ? (
            <div className="submission-success-box">
              <div className="success-icon-wrap">
                <CheckCircle2 size={36} aria-hidden="true" />
              </div>
              <h3 className="success-title">COMMISSION TAKEOFF RECEIVED</h3>
              <p className="success-desc">
                Thank you, <strong>{clientName || 'Project Lead'}</strong>. Your inquiry for <strong>{projectLocation || 'your property'}</strong> has been assigned to our master slating director. We will review your architectural scope and contact you within 24 hours.
              </p>
              <div className="success-details-list">
                <span>TAKEOFF REF: #{takeoffRef}</span>
                <span>·</span>
                <span>STRUCTURE: {buildingType.toUpperCase().replace('-', ' ')}</span>
                <span>·</span>
                <span>SCOPE: {projectScope.toUpperCase().replace('-', ' ')}</span>
                <span>·</span>
                <span>METALS: 100% SOLDERED COPPER &amp; VMZINC</span>
              </div>
              <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a 
                  href={`mailto:takeoffs@strataroofing.com?subject=Slate%20Takeoff%20%23${takeoffRef}&body=Client%3A%20${encodeURIComponent(clientName)}%0ALocation%3A%20${encodeURIComponent(projectLocation)}%0AStructure%3A%20${buildingType}%0AScope%3A%20${projectScope}%0ARoof%20Squares%3A%20${roofSquares}%20SQ%0APitch%3A%20${pitchRise}%2F12%0ASlate%20Grade%3A%20${currentGrade.grade}%0ACombined%20Rafter%20Load%3A%20${combinedRafterPsf}%20PSF`}
                  className="roof-btn-primary"
                >
                  EMAIL TAKEOFF TO MASTER SLATER
                </a>
                <button 
                  type="button" 
                  onClick={() => setFormSubmitted(false)}
                  className="roof-btn-secondary"
                >
                  SUBMIT ANOTHER DRAWING SET
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="roof-intake-form">
              <div className="form-grid-2">
                <div className="form-field">
                  <label htmlFor="client-name-input">Architect, Builder, or Owner</label>
                  <input 
                    id="client-name-input"
                    type="text" 
                    required 
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. William Prescott / Cambridge Architects"
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="proj-loc-input">Project Town &amp; Historic District</label>
                  <input 
                    id="proj-loc-input"
                    type="text" 
                    required 
                    value={projectLocation}
                    onChange={(e) => setProjectLocation(e.target.value)}
                    placeholder="e.g. Beacon Hill, Boston or Newport Historic District"
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-field">
                  <label htmlFor="bldg-type-select">Building Type</label>
                  <select 
                    id="bldg-type-select"
                    value={buildingType}
                    onChange={(e) => setBuildingType(e.target.value)}
                  >
                    <option value="historic-residence">Historic Townhome / Brownstone (Beacon Hill / Back Bay)</option>
                    <option value="custom-estate">New Architectural Stone Estate</option>
                    <option value="institutional-church">Cathedral, Chapel, or Academic Building</option>
                    <option value="alpine-mountain">High-Altitude Alpine Chalet / Lodge</option>
                  </select>
                </div>
                <div className="form-field">
                  <label htmlFor="project-scope-select">Envelope Scope</label>
                  <select 
                    id="project-scope-select"
                    value={projectScope}
                    onChange={(e) => setProjectScope(e.target.value)}
                  >
                    <option value="full-slate-zinc">Complete Vermont Slate + VMZINC Standing Seam</option>
                    <option value="slate-restoration">Historic Slate Conservation &amp; Copper Flashing Replacement</option>
                    <option value="double-lock-zinc">Full VMZINC Double-Lock Standing Seam Roof</option>
                    <option value="copper-gutters">Custom Soldered Copper Valleys, Gutters &amp; Dormers</option>
                  </select>
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="roof-notes-input">Drawings, Pitch Details, &amp; Historic Constraints</label>
                <textarea 
                  id="roof-notes-input"
                  rows={3}
                  placeholder="Describe your rafter pitch, roof square estimate, Historic Commission requirements, or current leak points..."
                ></textarea>
              </div>

              <div className="form-submit-row">
                <button type="submit" className="roof-btn-primary-lg">
                  SUBMIT DRAWING TAKEOFF
                  <ArrowUpRight size={16} aria-hidden="true" />
                </button>
                <span className="submit-subtext">
                  Direct review by SRCA Certified Master Slaters. No sales agents.
                </span>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* MASTER TRADE FOOTER */}
      <footer className="roof-master-footer">
        <div className="roof-footer-inner">
          <div className="footer-col-brand">
            <span className="footer-brand-title">STRATA ZINC &amp; SLATE</span>
            <p className="footer-brand-desc">
              Architectural sheet metal fabrication and master slate restoration. Specialized in VMZINC standing seam, Vermont S1 unfading slate, and continuous hand-soldered copper envelopes for historic and monumental structures across New England.
            </p>
            <div className="footer-badges">
              <span>SRCA CERTIFIED MASTER SLATER</span>
              <span>·</span>
              <span>SPENGLER MEISTER TRADITION</span>
              <span>·</span>
              <span>NRCA MEMBER #38192</span>
              <span>·</span>
              <span>MASS. HIC LIC. #198274</span>
            </div>
          </div>

          <div className="footer-col-links">
            <span className="footer-heading">BOSTON HISTORIC SHOP</span>
            <p>
              88 Commercial Wharf<br />
              Boston, MA 02110<br />
              Shop Line: +1 (617) 542-ROOF
            </p>
          </div>

          <div className="footer-col-links">
            <span className="footer-heading">BERKSHIRE METAL SHOP</span>
            <p>
              122 Elm Street<br />
              Pittsfield, MA 01201<br />
              Shop Line: +1 (413) 443-ZINC
            </p>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <span>© {new Date().getFullYear()} STRATA METALS &amp; SLATE LLC. ALL RIGHTS RESERVED.</span>
          <span>MASTER SLATERS &amp; ARCHITECTURAL TINSMITHS</span>
        </div>
      </footer>
    </div>
  );
}