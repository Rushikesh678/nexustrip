import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass, ArrowRight, ShieldCheck, Zap, Users, Receipt, CheckCircle2,
  Calculator, Sparkles, Scale, RefreshCw, Layers, Award, MapPin
} from 'lucide-react';

export const LandingPage = () => {
  // Interactive Calculator State
  const [numTravelers, setNumTravelers] = useState(4);
  const [totalExpenses, setTotalExpenses] = useState(2400);
  const [studentDiscount, setStudentDiscount] = useState(true);

  // Calculated stats
  const equalPerPerson = (totalExpenses / numTravelers).toFixed(2);
  const studentShare = studentDiscount ? (equalPerPerson * 0.8).toFixed(2) : equalPerPerson;
  const standardShare = studentDiscount
    ? ((totalExpenses - studentShare) / (numTravelers - 1)).toFixed(2)
    : equalPerPerson;

  return (
    <div style={{ backgroundColor: 'var(--color-paper-cream)', minHeight: '100vh', color: 'var(--color-charcoal)' }}>
      {/* HERO SECTION */}
      <section style={{
        backgroundColor: 'var(--color-forest-ink)',
        color: 'var(--color-paper-cream)',
        paddingTop: '80px',
        paddingBottom: '100px',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '2px solid var(--color-sage-border)'
      }}>
        <div style={{ maxWidth: 'var(--page-max-width)', margin: '0 auto', padding: '0 24px' }}>

          {/* Top Eyebrow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <span className="eyebrow-label">00 / VINTAGE POSTER EDITION</span>
            <div style={{ height: '1px', flex: 1, backgroundColor: 'var(--color-sage-border)' }} />
          </div>

          {/* Massive Display Title */}
          <h1 className="deacon-display" style={{
            fontSize: 'clamp(54px, 8vw, 110px)',
            color: 'var(--color-paper-cream)',
            marginBottom: '20px',
            maxWidth: '1000px'
          }}>
            SETTLE UP.<br />
            <span style={{ color: 'var(--color-meadow)' }}>OUTDOORS. TOGETHER.</span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 'clamp(16px, 2.2vw, 22px)',
            color: '#c9d1c8',
            maxWidth: '720px',
            lineHeight: 1.4,
            marginBottom: '36px',
            fontFamily: 'var(--font-graphik)'
          }}>
            A financial product wearing a patch jacket. Double-entry trip expense engine built for mountain trails, beach villas, and group roadtrips — no Venmo awkwardness.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', marginBottom: '64px' }}>
            <Link to="/register" className="btn-meadow">
              START FREE TRIP <ArrowRight size={18} />
            </Link>
            <a href="#calculator" className="btn-ghost-dark">
              TRY SPLIT CALCULATOR
            </a>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '12px', color: 'var(--color-moss-gray)', fontSize: '13px' }}>
              <ShieldCheck size={16} color="var(--color-meadow)" /> Double-Entry Ledger Verified
            </div>
          </div>

          {/* HERO IMAGE FRAMEWORK using forest.png */}
          <div style={{
            position: 'relative',
            borderRadius: '24px',
            border: '2px solid var(--color-sage-border)',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            backgroundColor: 'var(--color-deep-navy)'
          }}>
            <img
              src="/forest.png"
              alt="Vintage Forest Expedition Hero Artwork"
              style={{
                width: '100%',
                maxHeight: '520px',
                objectFit: 'cover',
                display: 'block'
              }}
            />

            {/* Overlapping Sticker Badges */}
            <div style={{ position: 'absolute', top: '24px', left: '24px' }}>
              <span className="sticker-badge">PRIORITY EXPEDITION</span>
            </div>

            <div style={{ position: 'absolute', top: '24px', right: '24px' }}>
              <span className="sticker-badge-navy">DOUBLE-ENTRY ENGINE</span>
            </div>

            <div style={{
              position: 'absolute',
              bottom: '24px',
              left: '24px',
              backgroundColor: 'rgba(18, 35, 21, 0.9)',
              backdropFilter: 'blur(8px)',
              padding: '16px 24px',
              borderRadius: '16px',
              border: '1px solid var(--color-sage-border)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              maxWidth: '480px'
            }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-meadow)',
                color: 'var(--color-forest-ink)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '900'
              }}>
                <Compass size={24} />
              </div>
              <div>
                <h4 style={{ color: 'var(--color-paper-cream)', fontSize: '16px', marginBottom: '2px' }}>THAILAND SKI & BEACH 2026</h4>
                <p style={{ color: 'var(--color-moss-gray)', fontSize: '13px' }}>4 Members • ₹4,500 Total Ledger Balance • 100% Settled</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FEATURE 01: CALCULATOR & DOUBLE-ENTRY RIGOR */}
      <section id="calculator" style={{ padding: '96px 0', borderBottom: '1px solid var(--color-sage-border)' }}>
        <div style={{ maxWidth: 'var(--page-max-width)', margin: '0 auto', padding: '0 24px' }}>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}>
            <div>
              <span className="eyebrow-label">01 / FINANCIALLY RIGOROUS</span>
              <h2 style={{ fontSize: 'clamp(36px, 5vw, 64px)', margin: '16px 0 24px 0', color: 'var(--color-forest-ink)' }}>
                THE POSTER LEDGER PRINCIPLE
              </h2>
              <p style={{ fontSize: '17px', lineHeight: 1.5, color: 'var(--color-charcoal)', marginBottom: '24px' }}>
                Standard expense apps use simple averages that fail when someone leaves a trip 2 days early, or when students get a 20% discount. <strong>TripLedger</strong> uses a double-entry debit/credit ledger structure that guarantees every cent is accounted for.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div style={{ padding: '8px', backgroundColor: 'rgba(85,221,74,0.15)', borderRadius: '8px', color: 'var(--color-forest-ink)' }}>
                    <Scale size={20} color="var(--color-forest-ink)" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '16px', marginBottom: '4px' }}>Automated Settlement Minimization</h4>
                    <p style={{ fontSize: '14px', color: '#555555' }}>Reduces 20 complex group transactions down to just 3 minimal payments.</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div style={{ padding: '8px', backgroundColor: 'rgba(115,211,235,0.2)', borderRadius: '8px' }}>
                    <Sparkles size={20} color="var(--color-forest-ink)" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '16px', marginBottom: '4px' }}>Smart Receipt OCR Parser</h4>
                    <p style={{ fontSize: '14px', color: '#555555' }}>Drop any receipt photo or invoice to automatically extract items, taxes, and split targets.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Calculator Card */}
            <div className="card-cream" style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-14px', right: '24px' }}>
                <span className="sticker-badge">INTERACTIVE DEMO</span>
              </div>

              <h3 style={{ fontSize: '24px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Calculator size={22} color="var(--color-meadow)" /> Live Split Preview
              </h3>

              {/* Slider 1: Expenses */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
                  <span>Total Group Expenses:</span>
                  <span style={{ color: 'var(--color-forest-ink)', fontWeight: 800 }}>₹{totalExpenses}</span>
                </div>
                <input
                  type="range"
                  min="400"
                  max="10000"
                  step="200"
                  value={totalExpenses}
                  onChange={(e) => setTotalExpenses(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--color-meadow)', cursor: 'pointer' }}
                />
              </div>

              {/* Slider 2: Travelers */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
                  <span>Group Travelers:</span>
                  <span style={{ color: 'var(--color-forest-ink)', fontWeight: 800 }}>{numTravelers} People</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="12"
                  step="1"
                  value={numTravelers}
                  onChange={(e) => setNumTravelers(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--color-meadow)', cursor: 'pointer' }}
                />
              </div>

              {/* Toggle: Student Tier */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#e8e2d7', padding: '12px 16px', borderRadius: '12px', marginBottom: '24px' }}>
                <span style={{ fontSize: '14px', fontWeight: 600 }}>Apply Student Tier (0.8x Multiplier)</span>
                <input
                  type="checkbox"
                  checked={studentDiscount}
                  onChange={(e) => setStudentDiscount(e.target.checked)}
                  style={{ width: '20px', height: '20px', accentColor: 'var(--color-meadow)', cursor: 'pointer' }}
                />
              </div>

              {/* Output Display */}
              <div style={{ backgroundColor: 'var(--color-forest-ink)', color: 'var(--color-paper-cream)', padding: '20px', borderRadius: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-sage-border)', paddingBottom: '12px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--color-moss-gray)' }}>Standard Traveler Share:</span>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-paper-cream)' }}>₹{standardShare}</span>
                </div>
                {studentDiscount && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-sage-border)', paddingBottom: '12px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '13px', color: 'var(--color-meadow)' }}>Student Tier (20% Off):</span>
                    <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-meadow)' }}>₹{studentShare}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--color-moss-gray)' }}>Settlement Direct Payments:</span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-river-blue)' }}>{numTravelers - 1} Transactions Total</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* FEATURE 02: THREE PILLARS GRID */}
      <section style={{ padding: '96px 0', backgroundColor: '#eae4d9', borderBottom: '1px solid var(--color-sage-border)' }}>
        <div style={{ maxWidth: 'var(--page-max-width)', margin: '0 auto', padding: '0 24px' }}>

          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 64px auto' }}>
            <span className="eyebrow-label">02 / BUILT FOR REAL TRIPS</span>
            <h2 style={{ fontSize: 'clamp(36px, 5vw, 58px)', marginTop: '12px', color: 'var(--color-forest-ink)' }}>
              ENGINEERED FOR THE UNPREDICTABLE
            </h2>
            <p style={{ fontSize: '16px', color: '#555555', marginTop: '12px' }}>
              Trips change. People join late, leave early, or buy shared groceries. Here is how TripLedger handles every edge case seamlessly.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>

            {/* Card 1 */}
            <div className="card-cream" style={{ display: 'flex', flexDirection: 'column', justifyBetween: 'space-between' }}>
              <div>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--color-forest-ink)',
                  color: 'var(--color-meadow)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}>
                  <Users size={24} />
                </div>
                <h3 style={{ fontSize: '24px', marginBottom: '12px' }}>Mid-Trip Departures</h3>
                <p style={{ fontSize: '15px', color: '#444444', lineHeight: 1.5, marginBottom: '20px' }}>
                  If a friend leaves early on day 3, freeze their expense allocations automatically so they aren't billed for day 4 beach dinners.
                </p>
              </div>
              <div style={{ borderTop: '1px dashed var(--color-sage-border)', paddingTop: '16px', color: 'var(--color-forest-ink)', fontSize: '13px', fontWeight: 700 }}>
                ✓ Prorated Date Ranges Supported
              </div>
            </div>

            {/* Card 2 */}
            <div className="card-cream" style={{ display: 'flex', flexDirection: 'column', justifyBetween: 'space-between' }}>
              <div>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--color-forest-ink)',
                  color: 'var(--color-river-blue)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}>
                  <Layers size={24} />
                </div>
                <h3 style={{ fontSize: '24px', marginBottom: '12px' }}>Tiered Cost Sharing</h3>
                <p style={{ fontSize: '15px', color: '#444444', lineHeight: 1.5, marginBottom: '20px' }}>
                  Support Sponsor (1.5x), Standard (1.0x), and Student (0.8x) multipliers so everyone pays their fair share according to budget.
                </p>
              </div>
              <div style={{ borderTop: '1px dashed var(--color-sage-border)', paddingTop: '16px', color: 'var(--color-forest-ink)', fontSize: '13px', fontWeight: 700 }}>
                ✓ Custom Multiplier Weighting
              </div>
            </div>

            {/* Card 3 */}
            <div className="card-cream" style={{ display: 'flex', flexDirection: 'column', justifyBetween: 'space-between' }}>
              <div>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--color-forest-ink)',
                  color: 'var(--color-sun-yellow)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}>
                  <Receipt size={24} />
                </div>
                <h3 style={{ fontSize: '24px', marginBottom: '12px' }}>Double-Entry Audit Trail</h3>
                <p style={{ fontSize: '15px', color: '#444444', lineHeight: 1.5, marginBottom: '20px' }}>
                  Every transaction generates balanced debit and credit entries. Inspect your mathematical ledger log down to the exact dollar.
                </p>
              </div>
              <div style={{ borderTop: '1px dashed var(--color-sage-border)', paddingTop: '16px', color: 'var(--color-forest-ink)', fontSize: '13px', fontWeight: 700 }}>
                ✓ Transparent Ledger Exports
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* TESTIMONIAL / POSTER SECTION */}
      <section style={{ padding: '96px 0', borderBottom: '1px solid var(--color-sage-border)' }}>
        <div style={{ maxWidth: 'var(--page-max-width)', margin: '0 auto', padding: '0 24px' }}>

          <div style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: '48px', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                borderRadius: '20px',
                overflow: 'hidden',
                border: '2px solid var(--color-sage-border)',
                boxShadow: 'var(--shadow-preview)'
              }}>
                <img
                  src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
                  alt="Mountain Traveler Expedition"
                  style={{ width: '100%', height: '420px', objectFit: 'cover', display: 'block' }}
                />
              </div>
              <div style={{ position: 'absolute', bottom: '-16px', left: '24px' }}>
                <span className="sticker-badge">VERIFIED TRAIL TESTED</span>
              </div>
            </div>

            <div>
              <span className="eyebrow-label">03 / FIELD REPORT</span>
              <h2 style={{ fontSize: 'clamp(32px, 4vw, 52px)', margin: '12px 0 20px 0', color: 'var(--color-forest-ink)' }}>
                "WE SAVED 5 HOURS OF MATH AFTER OUR 10-DAY ROADTRIP."
              </h2>
              <blockquote style={{ fontSize: '18px', color: 'var(--color-charcoal)', lineHeight: 1.5, marginBottom: '24px', fontStyle: 'italic' }}>
                "We had 8 people sharing Airbnb villas, car rentals, and mountain guide fees. Someone left on day 6. TripLedger calculated every single prorated debt in seconds. Nobody complained, and settlements were completed by midnight."
              </blockquote>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-forest-ink)',
                  color: 'var(--color-meadow)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800
                }}>
                  CW
                </div>
                <div>
                  <div style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-forest-ink)' }}>
                    CARTER & EXPEDITION CREW
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--color-moss-gray)' }}>Cascade Range Trail Trip • Summer 2026</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FINAL CALL TO ACTION BANNER */}
      <section style={{
        backgroundColor: 'var(--color-forest-ink)',
        color: 'var(--color-paper-cream)',
        padding: '96px 0',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
          <span className="eyebrow-label">JOIN THE EXPEDITION</span>
          <h2 className="deacon-display" style={{ fontSize: 'clamp(48px, 7vw, 84px)', margin: '20px 0', color: 'var(--color-paper-cream)' }}>
            READY TO PLAN YOUR <span style={{ color: 'var(--color-meadow)' }}>NEXT TRIP?</span>
          </h2>
          <p style={{ fontSize: '18px', color: '#c9d1c8', marginBottom: '36px' }}>
            Create your trip ledger in under 60 seconds. Invite your friends, track bookings, and enjoy stress-free settlements.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn-meadow">
              CREATE YOUR TRIP NOW <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn-ghost-dark">
              SIGN IN TO MY TRIPS
            </Link>
          </div>
        </div>
      </section>

      {/* FLOATING CALCULATE FUNDING CHIP */}
      <div className="floating-chip">
        <div style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-meadow)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-forest-ink)'
        }}>
          👍
        </div>
        <div>
          <span style={{ fontWeight: 700, display: 'block', fontSize: '12px' }}>TRIPLEDGER READY</span>
          <span style={{ fontSize: '11px', color: 'var(--color-moss-gray)' }}>0 Pending Settlement Conflicts</span>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
