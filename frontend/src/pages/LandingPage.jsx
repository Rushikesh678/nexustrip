import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Compass, ArrowRight, ShieldCheck, Zap, Users, Receipt, CheckCircle2,
  Calculator, Sparkles, Scale, BookOpen, Camera, CalendarCheck,
  Check, ArrowUpRight, ChevronRight, HelpCircle, Layers, MapPin, Download,
  CreditCard, Smartphone, Info, DollarSign, Clock, ShieldAlert, Cpu
} from 'lucide-react';

export const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Quick Join Code Input
  const [inviteCode, setInviteCode] = useState('');

  // Interactive Guide Step & Sub-Tab
  const [activeGuideStep, setActiveGuideStep] = useState(0);
  const [guideDetailTab, setGuideDetailTab] = useState('overview'); // 'overview' | 'example' | 'pro-tips'

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(null);

  // Interactive Live Split Calculator
  const [numTravelers, setNumTravelers] = useState(5);
  const [totalExpenses, setTotalExpenses] = useState(4800);
  const [hasSponsor, setHasSponsor] = useState(true);
  const [hasStudent, setHasStudent] = useState(true);

  // Calculation for live mini demo
  const sponsorMultiplier = hasSponsor ? 1.5 : 1.0;
  const studentMultiplier = hasStudent ? 0.8 : 1.0;
  const standardCount = Math.max(1, numTravelers - (hasSponsor ? 1 : 0) - (hasStudent ? 1 : 0));
  const totalWeights = (hasSponsor ? sponsorMultiplier : 0) + (hasStudent ? studentMultiplier : 0) + (standardCount * 1.0);
  const baseShare = totalExpenses / (totalWeights || 1);
  const minimizedTxns = Math.max(1, numTravelers - 1);
  const rawTxns = (numTravelers * (numTravelers - 1)) / 2;

  const handleQuickJoin = (e) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;
    if (user) {
      navigate('/trips');
    } else {
      navigate(`/register?code=${encodeURIComponent(inviteCode.trim().toUpperCase())}`);
    }
  };

  const guideSteps = [
    {
      step: '01',
      title: 'Trip Setup, Smart Roles & Multi-Tier Multipliers',
      shortTitle: 'Setup & Multipliers',
      tagline: 'Instant 4-letter invite codes, host permissions, and weighted cost tiers',
      icon: Users,
      color: 'var(--color-meadow)',
      badge: 'PHASE 1: ONBOARDING & ARCHITECTURE',
      overview: 'Getting a group aligned before booking is where most trips fall apart. TripLedger lets the organizer establish the destination, travel dates, overall budget ceiling, and base currency in seconds. Each trip receives a unique 4-character invite code (e.g., EXP-7H4P) so friends can join from mobile or desktop instantly.',
      deepDive: [
        {
          title: 'Custom Roles & Host Governance',
          desc: 'Designate Trip Hosts with administrative powers (managing bookings, approving expenses, finalizing settlement) while general Travelers can log receipts, view the schedule, and settle personal debts.'
        },
        {
          title: 'Fair Multiplier Cost Tiers',
          desc: 'Not everyone in a friend group has identical financial means. Assign custom multipliers such as Student/Budget (0.8x), Standard (1.0x), or Sponsor/Working Professional (1.5x). When shared expenses are logged, the math automatically adjusts each person’s share proportionally without awkward renegotiations.'
        },
        {
          title: 'Automated Mid-Trip Arrival & Early Departure Freeze',
          desc: 'Friends arriving 2 days late or leaving early won\'t be unfairly billed. TripLedger timestamps arrival and departure windows so that expenses incurred after a traveler departs are automatically locked out from their ledger.'
        }
      ],
      example: {
        scenario: 'Alex organizes a 5-day mountain retreat with 5 friends. Student friend Vikram has a tighter budget, while working friend Priya offers to sponsor a larger portion.',
        action: 'Alex assigns Vikram a 0.8x multiplier tier, Standard 1.0x to 3 others, and Priya a 1.5x tier.',
        outcome: 'On a ₹5,000 shared cabin expense: Vikram pays only ₹755, Standard members pay ₹943 each, and Priya covers ₹1,415. Everyone travels happily with zero financial resentment.'
      },
      proTip: 'Set your overall trip budget cap during setup. The live dashboard tracks real-time burn rate and alerts you the moment group bookings approach 85% of your target.'
    },
    {
      step: '02',
      title: 'Master Itinerary, AI Discovery & Bookings Hub',
      shortTitle: 'Timeline & Bookings Vault',
      tagline: 'Time-slotted multi-day schedules, reservation vault, and 1-click booking sync',
      icon: CalendarCheck,
      color: 'var(--color-river-blue)',
      badge: 'PHASE 2: COLLABORATIVE PLANNING',
      overview: 'Keep everyone on the same page with a structured, collaborative itinerary. Organize each travel day into distinct time windows (Morning, Afternoon, Evening, Night) with custom activity categories. Centralize all flight tickets, hotel vouchers, Airbnbs, and activity passes into a shared vault.',
      deepDive: [
        {
          title: 'Time-Slotted Collaborative Timeline',
          desc: 'Group daily activities into Morning, Afternoon, Evening, and Night blocks. Tag items with categories (Dining, Adventure, Lodging, Transport, Sightseeing) with cost estimates vs actuals.'
        },
        {
          title: 'Centralized Bookings & Voucher Hub',
          desc: 'Store airline confirmation codes (PNR), hotel check-in times, Airbnb door pin codes, car rental vouchers, and ticket PDFs in one shared hub so any traveler can present details at check-in.'
        },
        {
          title: 'AI Destination Insights & 1-Click Sync',
          desc: 'Explore curated sightseeing spots, top cafes, hidden gems, and adventure activities tailored to your destination city. Add any recommended spot directly into your itinerary schedule with 1-click.'
        }
      ],
      example: {
        scenario: 'On Day 3 in Bali, the group wants to visit a cliffside beach club and have dinner at a local seafood grill.',
        action: 'The organizer adds the beach club to the "Afternoon" block with booking ref #BC-891, and seafood grill to the "Evening" block.',
        outcome: 'All 5 travelers can open their phones, check arrival times, view driver contact details, and see estimated costs directly on the master schedule.'
      },
      proTip: 'Link bookings directly to itinerary blocks. Confirmed bookings automatically generate scheduled timeline cards with vendor details pre-filled.'
    },
    {
      step: '03',
      title: 'Smart Expense Logging, Camera OCR & Side Quests',
      shortTitle: 'OCR Bills & Side Quests',
      tagline: 'Itemized receipt scanner, multi-payer splits, and private sub-group accounting',
      icon: Receipt,
      color: 'var(--color-sun-yellow)',
      badge: 'PHASE 3: EXPENSE EXECUTION',
      overview: 'Say goodbye to tedious manual data entry and messy group chats. Snap a picture of restaurant bills, grocery receipts, or tour invoices. The OCR engine parses itemized line items, subtotals, taxes, and service fees for 1-click drag-and-drop traveler assignment.',
      deepDive: [
        {
          title: 'Automated Camera OCR Receipt Parser',
          desc: 'Upload a bill photo or paste invoice text. The OCR system reads individual line items, dishes, drinks, tax percentages, and tips, letting you assign specific dishes to specific diners.'
        },
        {
          title: 'Side Quests (Sub-Group Isolation)',
          desc: 'When 3 friends go scuba diving or cocktail tasting while 2 others relax at the hotel, create an isolated "Side Quest". Costs are strictly distributed among the 3 participants, charging uninvolved members exactly ₹0.'
        },
        {
          title: '4 Flexible Split Models & Multi-Payers',
          desc: 'Split by Equal share, Exact amounts, Weighted percentages, or Tier Multipliers. When multiple people co-fund a massive villa deposit, record multi-payer distributions seamlessly.'
        }
      ],
      example: {
        scenario: 'A cafe bill totals ₹3,600 with 6 coffees, 3 desserts, 2 cocktails, and 5% GST. Only 2 people ordered cocktails.',
        action: 'The OCR scanner extracts all items. Cocktails are assigned strictly to the 2 drinkers, coffee/desserts to everyone, and GST is split proportionally.',
        outcome: 'The 2 cocktail drinkers pay ₹1,150 each, while the other 3 non-drinkers pay only ₹433 each. Complete fairness with zero manual arithmetic.'
      },
      proTip: 'Use Side Quests anytime a small group takes an Uber or orders extra snacks. It ensures non-participating friends never pay a penny for activities they didn\'t join.'
    },
    {
      step: '04',
      title: 'Greedy Debt Minimizer, Double-Entry Ledger & Settle Up',
      shortTitle: 'Minimal Settle & Ledger',
      tagline: 'Graph simplification algorithm, 1-click UPI payments, and immutable audit logs',
      icon: Scale,
      color: 'var(--color-meadow)',
      badge: 'PHASE 4: MATHEMATICAL SETTLEMENT',
      overview: 'At the end of a trip, circular debts create awkward payment webs where everyone owes everyone else. TripLedger\'s graph simplification engine calculates net balances and computes the minimum number of direct transactions required to balance the entire group to ₹0.00.',
      deepDive: [
        {
          title: 'Greedy Graph Debt Reduction Algorithm',
          desc: 'In an 8-person trip, raw debts create up to 28 confusing pairwise transfers. TripLedger collapses this graph into at most 7 direct payments, eliminating circular middleman transfers completely.'
        },
        {
          title: '1-Click UPI, Venmo & PayPal Settle Up',
          desc: 'Settlement cards display direct UPI QR codes, UPI IDs, Venmo handles, and PayPal links. Once paid, 1-click confirmation updates the ledger with a cryptographic timestamp.'
        },
        {
          title: 'Strict Double-Entry Rigor & PDF Debriefs',
          desc: 'Every transaction creates balancing Debit and Credit entries with full audit logs. Export comprehensive PDF debriefs with category spending charts, budget variance, and per-person statements.'
        }
      ],
      example: {
        scenario: 'After 5 days of travel across 42 expenses, the raw pairwise debt web involves 14 separate transfers between 6 friends.',
        action: 'TripLedger calculates net credits and net debits, matching highest debtors with highest creditors.',
        outcome: 'The 14 confusing debts collapse into just 3 direct UPI transfers. All balances reach ₹0.00 with verified payment receipts.'
      },
      proTip: 'Download the itemized PDF financial report at the end of the trip to share in your group chat or keep for personal tax and accounting records.'
    }
  ];

  const faqs = [
    {
      q: 'How does TripLedger differ from regular expense splitting apps like Splitwise?',
      a: 'Standard apps are limited to basic expense lists and lack trip coordination. TripLedger is a complete group travel operating system: it combines Day-by-Day Itineraries, a Centralized Bookings Vault, Camera OCR Receipt Scanners, Isolated Side Quests, Tiered Cost Multipliers (Student vs Sponsor), AI Destination Insights, and strict Double-Entry Ledger accounting that guarantees zero math discrepancies.'
    },
    {
      q: 'How do Tiered Cost Multipliers work mathematically?',
      a: 'Each participant has a cost multiplier (e.g. Student = 0.8x, Standard = 1.0x, Sponsor = 1.5x). When an expense is split using tiered sharing, each person\'s share is calculated as: (Their Multiplier ÷ Sum of All Multipliers) × Total Expense. This ensures proportional contributions that respect everyone\'s budget.'
    },
    {
      q: 'What happens if a friend arrives late or leaves the trip early?',
      a: 'During participant setup, each traveler has an arrival and departure date. If a member departs on Day 3 of a 5-day trip, any expenses or bookings logged on Days 4 and 5 automatically exclude them from the split, ensuring departed friends are never charged for activities they did not attend.'
    },
    {
      q: 'How does the Smart Receipt OCR scanner work?',
      a: 'You can upload an image or take a photo of any restaurant or shop receipt directly on your phone. The OCR parser detects item descriptions, line amounts, subtotals, taxes (like GST or VAT), and tip amounts. You can then assign specific items to specific travelers with 1-click checkboxes.'
    },
    {
      q: 'What is a "Side Quest" in TripLedger?',
      a: 'A Side Quest is an isolated sub-group expense. For example, if 3 out of 6 friends go scuba diving, you tag that expense as a Side Quest. Only those 3 participating members share the bill, while the other 3 friends have ₹0 attributed to them.'
    },
    {
      q: 'How does the Greedy Debt Minimization algorithm work?',
      a: 'Instead of making everyone pay back every single person they borrowed from (which causes up to N*(N-1)/2 transactions), TripLedger calculates each person\'s Net Balance (Total Paid minus Total Consumed). It then matches the biggest debtor with the biggest creditor in a greedy graph solver, reducing transactions to at most N-1 simple direct transfers.'
    }
  ];

  const features = [
    {
      icon: CalendarCheck,
      title: 'Day-by-Day Itinerary',
      description: 'Time-slotted schedule grouped by Morning, Afternoon, Evening, and Night with live budget & booking integration.',
      tag: 'Timeline'
    },
    {
      icon: Camera,
      title: 'Smart Receipt OCR',
      description: 'Snap photos of paper bills. Auto-extract dishes, drinks, taxes, and service fees with individual line item assignment.',
      tag: 'AI Scanner'
    },
    {
      icon: Zap,
      title: 'Side Quests Sub-Splitting',
      description: 'Private adventures (clubbing, scuba, rentals) billed strictly to participating members with ₹0 charged to others.',
      tag: 'Fair Splits'
    },
    {
      icon: Scale,
      title: 'Minimal Debt Settlement',
      description: 'Greedy algorithm collapses messy multi-person debt webs into the absolute minimum direct payments.',
      tag: '1-Click Settle'
    },
    {
      icon: BookOpen,
      title: 'Double-Entry Rigor',
      description: 'Full debit and credit immutable accounting ledger with timestamped audit logs. Zero discrepancies guaranteed.',
      tag: 'Audit Trail'
    },
    {
      icon: Download,
      title: 'Executive PDF Reports',
      description: 'Export itemized individual member statements, category breakdown charts, and printable financial statements.',
      tag: 'Debriefs'
    }
  ];

  return (
    <div style={{ backgroundColor: 'var(--color-paper-cream)', minHeight: '100vh', color: 'var(--color-charcoal)' }}>

      {/* 1. HERO SECTION */}
      <section style={{
        backgroundColor: 'var(--color-forest-ink)',
        color: 'var(--color-paper-cream)',
        paddingTop: 'clamp(36px, 6vw, 70px)',
        paddingBottom: 'clamp(40px, 7vw, 80px)',
        borderBottom: '2px solid var(--color-sage-border)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: 'var(--page-max-width)', margin: '0 auto', padding: '0 clamp(16px, 4vw, 24px)' }}>
          
          {/* Top Pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(85, 221, 74, 0.12)',
            border: '1px solid rgba(85, 221, 74, 0.35)',
            padding: '6px 14px',
            borderRadius: '9999px',
            marginBottom: '20px'
          }}>
            <Sparkles size={14} color="var(--color-meadow)" />
            <span style={{ fontSize: '12px', color: 'var(--color-meadow)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              The Group Trip Operating System
            </span>
          </div>

          {/* Headline */}
          <h1 className="deacon-display" style={{
            fontSize: 'clamp(32px, 6.5vw, 84px)',
            color: 'var(--color-paper-cream)',
            marginBottom: '18px',
            maxWidth: '960px',
            lineHeight: 0.95,
            wordBreak: 'break-word'
          }}>
            PLAN TOGETHER.<br />
            SPLIT PRECISELY.<br />
            <span style={{ color: 'var(--color-meadow)' }}>SETTLE WITH ZERO DRAMA.</span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 'clamp(15px, 1.8vw, 19px)',
            color: '#c9d1c8',
            maxWidth: '680px',
            lineHeight: 1.55,
            marginBottom: '32px'
          }}>
            Collaborative day-by-day itineraries, instant OCR receipt scanning, fair multi-tier splits, and minimal debt settlement powered by double-entry accounting.
          </p>

          {/* Action CTAs */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            alignItems: 'center',
            marginBottom: '36px'
          }}>
            {user ? (
              <Link to="/trips" className="btn-meadow" style={{ textDecoration: 'none' }}>
                GO TO MY TRIPS <ArrowRight size={18} />
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-meadow" style={{ textDecoration: 'none' }}>
                  START FREE TRIP <ArrowRight size={18} />
                </Link>
                <Link to="/login" className="btn-ghost-dark" style={{ textDecoration: 'none' }}>
                  SIGN IN
                </Link>
              </>
            )}
            <a href="#how-it-works" className="btn-ghost-dark" style={{ textDecoration: 'none' }}>
              DEEP DIVE USER GUIDE ↓
            </a>
          </div>

          {/* Quick Join Code Form */}
          <div style={{
            maxWidth: '480px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '16px',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-paper-cream)', opacity: 0.9 }}>
              🎟️ Have a Trip Invite Code?
            </span>
            <form onSubmit={handleQuickJoin} style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="e.g. EXP-9K2M"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                maxLength={10}
                style={{
                  flex: '1 1 180px',
                  backgroundColor: 'rgba(0,0,0,0.4)',
                  border: '1px solid var(--color-sage-border)',
                  color: 'var(--color-paper-cream)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  fontSize: '14px',
                  fontWeight: 600,
                  letterSpacing: '0.05em'
                }}
              />
              <button
                type="submit"
                className="btn-primary"
                style={{
                  padding: '10px 18px',
                  fontSize: '13px',
                  whiteSpace: 'nowrap',
                  backgroundColor: 'var(--color-meadow)',
                  color: 'var(--color-forest-ink)',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                JOIN TRIP
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* 2. HOW TRIPLEDGER WORKS (VERBOSE INTERACTIVE USER GUIDE) */}
      <section id="how-it-works" style={{
        paddingTop: 'clamp(40px, 7vw, 80px)',
        paddingBottom: 'clamp(40px, 7vw, 80px)',
        maxWidth: 'var(--page-max-width)',
        margin: '0 auto',
        paddingLeft: 'clamp(16px, 4vw, 24px)',
        paddingRight: 'clamp(16px, 4vw, 24px)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'var(--color-forest-ink)',
            color: 'var(--color-meadow)',
            padding: '5px 14px',
            borderRadius: '9999px',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            marginBottom: '14px'
          }}>
            <HelpCircle size={14} /> COMPLETE MASTERCLASS & WORKFLOW TUTORIAL
          </div>
          <h2 style={{
            fontSize: 'clamp(28px, 4.5vw, 52px)',
            color: 'var(--color-forest-ink)',
            marginBottom: '12px',
            lineHeight: 1.05
          }}>
            THE COMPLETE USER GUIDE
          </h2>
          <p style={{ fontSize: 'clamp(14px, 1.6vw, 17px)', color: 'var(--color-charcoal)', maxWidth: '640px', margin: '0 auto', opacity: 0.85, lineHeight: 1.5 }}>
            A comprehensive, step-by-step deep dive into how TripLedger coordinates, splits, and settles your group travel with zero stress.
          </p>
        </div>

        {/* Step Selector Pills (Mobile Scrollable) */}
        <div style={{
          display: 'flex',
          gap: '10px',
          overflowX: 'auto',
          paddingBottom: '12px',
          marginBottom: '24px',
          WebkitOverflowScrolling: 'touch'
        }}>
          {guideSteps.map((s, idx) => {
            const Icon = s.icon;
            const isSelected = activeGuideStep === idx;
            return (
              <button
                key={s.step}
                onClick={() => {
                  setActiveGuideStep(idx);
                  setGuideDetailTab('overview');
                }}
                style={{
                  flex: '1 0 auto',
                  minWidth: '200px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px 18px',
                  borderRadius: '14px',
                  border: `2px solid ${isSelected ? 'var(--color-forest-ink)' : 'var(--color-border)'}`,
                  backgroundColor: isSelected ? 'var(--color-forest-ink)' : 'white',
                  color: isSelected ? 'var(--color-paper-cream)' : 'var(--color-charcoal)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 4px 14px rgba(18,35,21,0.15)' : 'none'
                }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: isSelected ? 'var(--color-meadow)' : 'rgba(0,0,0,0.06)',
                  color: isSelected ? 'var(--color-forest-ink)' : 'var(--color-charcoal)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '14px',
                  flexShrink: 0
                }}>
                  {s.step}
                </div>
                <div>
                  <div style={{ fontSize: '11px', opacity: isSelected ? 0.85 : 0.6, fontWeight: 700, letterSpacing: '0.05em' }}>
                    STEP {s.step}
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, whiteSpace: 'nowrap' }}>
                    {s.shortTitle}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Step Master Card */}
        {(() => {
          const current = guideSteps[activeGuideStep];
          const CurrentIcon = current.icon;
          return (
            <div style={{
              backgroundColor: 'white',
              border: '2px solid var(--color-forest-ink)',
              borderRadius: '24px',
              padding: 'clamp(20px, 4vw, 44px)',
              boxShadow: '0 12px 40px rgba(18, 35, 21, 0.08)'
            }}>
              {/* Header Info */}
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '20px', marginBottom: '24px' }}>
                <div>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: 'rgba(85, 221, 74, 0.15)',
                    color: 'var(--color-forest-ink)',
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    fontSize: '11px',
                    fontWeight: 800,
                    letterSpacing: '0.05em',
                    marginBottom: '10px'
                  }}>
                    {current.badge}
                  </div>
                  <h3 style={{ fontSize: 'clamp(22px, 3.2vw, 34px)', color: 'var(--color-forest-ink)', marginBottom: '6px' }}>
                    {current.title}
                  </h3>
                  <div style={{ fontSize: '14px', color: 'var(--color-driftwood)', fontWeight: 600 }}>
                    {current.tagline}
                  </div>
                </div>

                {/* Sub-Tabs Selector */}
                <div style={{
                  display: 'inline-flex',
                  backgroundColor: 'var(--color-paper-cream)',
                  padding: '4px',
                  borderRadius: '10px',
                  border: '1px solid var(--color-border)',
                  gap: '4px'
                }}>
                  {[
                    { id: 'overview', label: '📖 Architecture' },
                    { id: 'example', label: '💡 Real Example' },
                    { id: 'pro-tips', label: '⭐ Organizer Tips' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setGuideDetailTab(tab.id)}
                      style={{
                        border: 'none',
                        backgroundColor: guideDetailTab === tab.id ? 'var(--color-forest-ink)' : 'transparent',
                        color: guideDetailTab === tab.id ? 'var(--color-paper-cream)' : 'var(--color-charcoal)',
                        padding: '6px 14px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sub-Tab 1: Architecture & Capabilities */}
              {guideDetailTab === 'overview' && (
                <div>
                  <p style={{ fontSize: '15px', lineHeight: 1.65, color: 'var(--color-charcoal)', marginBottom: '28px' }}>
                    {current.overview}
                  </p>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '20px',
                    marginBottom: '32px'
                  }}>
                    {current.deepDive.map((item, iIdx) => (
                      <div
                        key={iIdx}
                        style={{
                          backgroundColor: 'var(--color-paper-cream)',
                          border: '1px solid var(--color-border)',
                          borderRadius: '14px',
                          padding: '18px 20px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <CheckCircle2 size={16} color="var(--color-meadow)" style={{ flexShrink: 0 }} />
                          <h4 style={{ fontSize: '15px', color: 'var(--color-forest-ink)' }}>
                            {item.title}
                          </h4>
                        </div>
                        <p style={{ fontSize: '13px', lineHeight: 1.5, color: 'var(--color-charcoal)', opacity: 0.9 }}>
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-Tab 2: Real-World Scenario */}
              {guideDetailTab === 'example' && (
                <div style={{
                  backgroundColor: 'var(--color-paper-cream)',
                  border: '1.5px solid var(--color-forest-ink)',
                  borderRadius: '16px',
                  padding: '24px',
                  marginBottom: '28px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <Sparkles size={18} color="var(--color-forest-ink)" />
                    <h4 style={{ fontSize: '18px', color: 'var(--color-forest-ink)' }}>
                      Real-World Scenario in Action
                    </h4>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ padding: '12px 16px', backgroundColor: 'white', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-driftwood)', textTransform: 'uppercase' }}>1. The Challenge</span>
                      <p style={{ fontSize: '14px', color: 'var(--color-charcoal)', marginTop: '4px', lineHeight: 1.5 }}>
                        {current.example.scenario}
                      </p>
                    </div>

                    <div style={{ padding: '12px 16px', backgroundColor: 'white', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-driftwood)', textTransform: 'uppercase' }}>2. The TripLedger Action</span>
                      <p style={{ fontSize: '14px', color: 'var(--color-charcoal)', marginTop: '4px', lineHeight: 1.5 }}>
                        {current.example.action}
                      </p>
                    </div>

                    <div style={{ padding: '12px 16px', backgroundColor: 'rgba(85, 221, 74, 0.15)', borderRadius: '10px', border: '1px solid var(--color-meadow)' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-forest-ink)', textTransform: 'uppercase' }}>3. The Result</span>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-forest-ink)', marginTop: '4px', lineHeight: 1.5 }}>
                        {current.example.outcome}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-Tab 3: Organizer Pro-Tips */}
              {guideDetailTab === 'pro-tips' && (
                <div style={{
                  backgroundColor: 'var(--color-forest-ink)',
                  color: 'var(--color-paper-cream)',
                  borderRadius: '16px',
                  padding: '24px',
                  marginBottom: '28px',
                  border: '1px solid var(--color-sage-border)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                    <ShieldCheck size={20} color="var(--color-meadow)" />
                    <h4 style={{ fontSize: '18px', color: 'var(--color-paper-cream)' }}>
                      Organizer Expert Tip
                    </h4>
                  </div>
                  <p style={{ fontSize: '15px', lineHeight: 1.6, color: '#e5e7eb' }}>
                    {current.proTip}
                  </p>
                </div>
              )}

              {/* Bottom Nav Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderTop: '1px solid var(--color-border)', paddingTop: '20px' }}>
                <div style={{ fontSize: '12px', color: 'var(--color-driftwood)', fontWeight: 600 }}>
                  Showing Stage {activeGuideStep + 1} of {guideSteps.length}
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  {activeGuideStep > 0 && (
                    <button
                      onClick={() => {
                        setActiveGuideStep(prev => prev - 1);
                        setGuideDetailTab('overview');
                      }}
                      style={{
                        padding: '10px 16px',
                        borderRadius: '8px',
                        border: '1px solid var(--color-border)',
                        backgroundColor: 'white',
                        color: 'var(--color-charcoal)',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      ← Previous Stage
                    </button>
                  )}

                  {activeGuideStep < guideSteps.length - 1 ? (
                    <button
                      onClick={() => {
                        setActiveGuideStep(prev => prev + 1);
                        setGuideDetailTab('overview');
                      }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        backgroundColor: 'var(--color-forest-ink)',
                        color: 'var(--color-paper-cream)',
                        border: 'none',
                        padding: '10px 18px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Next Stage: {guideSteps[activeGuideStep + 1].shortTitle} <ChevronRight size={16} />
                    </button>
                  ) : (
                    <Link
                      to="/register"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        backgroundColor: 'var(--color-meadow)',
                        color: 'var(--color-forest-ink)',
                        textDecoration: 'none',
                        padding: '10px 18px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: 700
                      }}
                    >
                      CREATE YOUR TRIP NOW <ArrowRight size={16} />
                    </Link>
                  )}
                </div>
              </div>

            </div>
          );
        })()}
      </section>

      {/* 3. CORE FEATURES GRID (CLEAN & MINIMAL) */}
      <section style={{
        backgroundColor: '#e9e3da',
        paddingTop: 'clamp(40px, 6vw, 70px)',
        paddingBottom: 'clamp(40px, 6vw, 70px)',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)'
      }}>
        <div style={{ maxWidth: 'var(--page-max-width)', margin: '0 auto', padding: '0 clamp(16px, 4vw, 24px)' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 42px)', color: 'var(--color-forest-ink)', marginBottom: '8px' }}>
              DESIGNED FOR REAL GROUP TRIPS
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--color-charcoal)', opacity: 0.8 }}>
              No messy spreadsheets. No lost receipts. Complete clarity from start to finish.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '20px'
          }}>
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  style={{
                    backgroundColor: 'white',
                    border: '1.5px solid var(--color-forest-ink)',
                    borderRadius: '16px',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '16px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        backgroundColor: 'var(--color-forest-ink)',
                        color: 'var(--color-meadow)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Icon size={20} />
                      </div>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor: 'var(--color-paper-cream)',
                        color: 'var(--color-forest-ink)',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        border: '1px solid var(--color-border)'
                      }}>
                        {f.tag}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '18px', color: 'var(--color-forest-ink)', marginBottom: '8px' }}>
                      {f.title}
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--color-charcoal)', lineHeight: 1.5, opacity: 0.85 }}>
                      {f.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE MINI SPLIT CALCULATOR */}
      <section style={{
        paddingTop: 'clamp(40px, 6vw, 70px)',
        paddingBottom: 'clamp(40px, 6vw, 70px)',
        maxWidth: 'var(--page-max-width)',
        margin: '0 auto',
        paddingLeft: 'clamp(16px, 4vw, 24px)',
        paddingRight: 'clamp(16px, 4vw, 24px)'
      }}>
        <div style={{
          backgroundColor: 'var(--color-forest-ink)',
          color: 'var(--color-paper-cream)',
          borderRadius: '20px',
          padding: 'clamp(24px, 4vw, 44px)',
          border: '2px solid var(--color-sage-border)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span style={{ fontSize: '11px', color: 'var(--color-meadow)', fontWeight: 700, letterSpacing: '0.08em' }}>
              ✦ INSTANT DEBT MINIMIZER DEMO
            </span>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 38px)', color: 'var(--color-paper-cream)', marginTop: '6px', marginBottom: '8px' }}>
              SEE HOW THE MATH SIMPLIFIES
            </h2>
            <p style={{ fontSize: '14px', color: '#c9d1c8', maxWidth: '500px', margin: '0 auto' }}>
              Adjust travelers and spend below to see our graph solver eliminate awkward money transfers.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '28px', alignItems: 'center' }}>
            
            {/* Sliders */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', fontWeight: 600 }}>
                  <span>Number of Travelers</span>
                  <span style={{ color: 'var(--color-meadow)', fontWeight: 800 }}>{numTravelers} Friends</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="12"
                  value={numTravelers}
                  onChange={(e) => setNumTravelers(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--color-meadow)', cursor: 'pointer' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', fontWeight: 600 }}>
                  <span>Total Group Expenses</span>
                  <span style={{ color: 'var(--color-meadow)', fontWeight: 800 }}>₹{totalExpenses.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="20000"
                  step="500"
                  value={totalExpenses}
                  onChange={(e) => setTotalExpenses(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--color-meadow)', cursor: 'pointer' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={hasStudent}
                    onChange={(e) => setHasStudent(e.target.checked)}
                    style={{ accentColor: 'var(--color-meadow)' }}
                  />
                  1 Student (0.8x discount)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={hasSponsor}
                    onChange={(e) => setHasSponsor(e.target.checked)}
                    style={{ accentColor: 'var(--color-meadow)' }}
                  />
                  1 Sponsor (1.5x share)
                </label>
              </div>
            </div>

            {/* Results Display */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '16px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>
                <span style={{ fontSize: '13px', color: '#c9d1c8' }}>Standard Share / person</span>
                <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-meadow)' }}>
                  ₹{Math.round(baseShare).toLocaleString()}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: '#c9d1c8' }}>Unoptimized Pairwise Debts</span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#f87171' }}>
                  {rawTxns} transfers
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: '#c9d1c8' }}>TripLedger Graph Settle</span>
                <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-meadow)' }}>
                  Only {minimizedTxns} transfers!
                </span>
              </div>

              <div style={{
                backgroundColor: 'rgba(85, 221, 74, 0.12)',
                border: '1px solid rgba(85, 221, 74, 0.3)',
                padding: '10px',
                borderRadius: '8px',
                fontSize: '11px',
                color: 'var(--color-meadow)',
                textAlign: 'center',
                fontWeight: 600
              }}>
                ✨ Eliminated {rawTxns - minimizedTxns} redundant transactions
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. DEEP DIVE FAQS SECTION */}
      <section style={{
        paddingTop: 'clamp(40px, 6vw, 70px)',
        paddingBottom: 'clamp(40px, 6vw, 70px)',
        maxWidth: 'var(--page-max-width)',
        margin: '0 auto',
        paddingLeft: 'clamp(16px, 4vw, 24px)',
        paddingRight: 'clamp(16px, 4vw, 24px)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 42px)', color: 'var(--color-forest-ink)', marginBottom: '8px' }}>
            FREQUENTLY ASKED QUESTIONS
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--color-charcoal)', opacity: 0.8 }}>
            Everything you need to know about TripLedger's financial architecture and trip workflows.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '800px', margin: '0 auto' }}>
          {faqs.map((faq, fIdx) => {
            const isOpen = openFaq === fIdx;
            return (
              <div
                key={fIdx}
                style={{
                  backgroundColor: 'white',
                  border: '1.5px solid var(--color-forest-ink)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease'
                }}
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : fIdx)}
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '15px',
                    fontWeight: 700,
                    color: 'var(--color-forest-ink)',
                    gap: '12px'
                  }}
                >
                  <span>{faq.q}</span>
                  <span style={{ fontSize: '18px', fontWeight: 800, transform: isOpen ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s ease' }}>
                    +
                  </span>
                </button>
                {isOpen && (
                  <div style={{ padding: '0 20px 18px 20px', fontSize: '14px', lineHeight: 1.6, color: 'var(--color-charcoal)', borderTop: '1px solid var(--color-border)', paddingTop: '12px' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. CALL TO ACTION FOOTER */}
      <footer style={{
        backgroundColor: 'var(--color-forest-ink)',
        color: 'var(--color-paper-cream)',
        paddingTop: '40px',
        paddingBottom: '30px',
        borderTop: '2px solid var(--color-sage-border)',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: 'var(--page-max-width)', margin: '0 auto', padding: '0 clamp(16px, 4vw, 24px)' }}>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', color: 'var(--color-paper-cream)', marginBottom: '12px' }}>
            READY FOR YOUR NEXT ADVENTURE?
          </h2>
          <p style={{ fontSize: '14px', color: '#c9d1c8', marginBottom: '24px', maxWidth: '480px', margin: '0 auto 24px auto' }}>
            Create a trip in 30 seconds. Invite your friends and let TripLedger do the heavy lifting.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '32px' }}>
            {user ? (
              <Link to="/trips" className="btn-meadow" style={{ textDecoration: 'none' }}>
                OPEN TRIPS DASHBOARD <ArrowRight size={18} />
              </Link>
            ) : (
              <Link to="/register" className="btn-meadow" style={{ textDecoration: 'none' }}>
                START FREE NOW <ArrowRight size={18} />
              </Link>
            )}
          </div>

          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '12px',
            color: 'var(--color-driftwood)'
          }}>
            <div>© {new Date().getFullYear()} TripLedger. Double-Entry Group Travel Engine.</div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <a href="#how-it-works" style={{ color: 'var(--color-driftwood)', textDecoration: 'none' }}>Tutorial</a>
              <Link to="/login" style={{ color: 'var(--color-driftwood)', textDecoration: 'none' }}>Sign In</Link>
              <Link to="/register" style={{ color: 'var(--color-driftwood)', textDecoration: 'none' }}>Create Account</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};
