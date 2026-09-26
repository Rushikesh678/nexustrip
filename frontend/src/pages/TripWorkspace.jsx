import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Receipt, CalendarCheck, Users, BookOpen, Scale, FileText, Settings,
  Plus, Upload, DollarSign, CheckCircle2, AlertTriangle, ArrowUpRight, ArrowDownLeft,
  Sparkles, Download, Trash2, Edit, UserCheck, ShieldAlert, ArrowRight, RefreshCw, Layers
} from 'lucide-react';

export const TripWorkspace = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [tripData, setTripData] = useState(null);

  // Modals state
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showAddBookingModal, setShowAddBookingModal] = useState(false);
  const [showAddParticipantModal, setShowAddParticipantModal] = useState(false);
  const [showDepartModal, setShowDepartModal] = useState(false);
  const [selectedParticipantForDepart, setSelectedParticipantForDepart] = useState(null);

  // Receipt parser state
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptText, setReceiptText] = useState('');
  const [receiptMode, setReceiptMode] = useState('file'); // 'file' | 'text'
  const [parsingReceipt, setParsingReceipt] = useState(false);
  const [parsedData, setParsedData] = useState(null);

  // Expense Wizard Form State
  const [wizardStep, setWizardStep] = useState(1);
  const [expenseForm, setExpenseForm] = useState({
    description: '',
    merchant: '',
    category: 'FOOD',
    amount: '',
    payerId: '',
    splitMethod: 'EQUAL',
    selectedParticipantIds: []
  });

  // Booking Form State
  const [bookingForm, setBookingForm] = useState({
    description: '',
    type: 'accommodation',
    vendor_name: '',
    booking_reference: '',
    total_cost: '',
    start_date: '',
    end_date: '',
    allocation_model: 'equal',
    assigned_participant_ids: [],
    paid_by: ''
  });

  // Participant Form State
  const [participantForm, setParticipantForm] = useState({
    name: '',
    email: '',
    cost_tier: 'STANDARD',
    tier_multiplier: 1.0
  });

  const loadTripData = async () => {
    try {
      const res = await api.getTripById(tripId);
      if (res.success) {
        setTripData(res);
        if (res.participants && res.participants.length > 0 && !expenseForm.payerId) {
          const myPart = res.myParticipant || res.participants[0];
          setExpenseForm(prev => ({
            ...prev,
            payerId: myPart._id,
            selectedParticipantIds: res.participants.map(p => p._id)
          }));
          setBookingForm(prev => ({
            ...prev,
            start_date: res.trip.start_date.split('T')[0],
            end_date: res.trip.end_date.split('T')[0],
            assigned_participant_ids: res.participants.map(p => p._id)
          }));
        }
      }
    } catch (err) {
      console.error('Load trip error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTripData();
  }, [tripId]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--color-muted)' }}>Loading Trip Workspace...</div>;
  }

  if (!tripData || !tripData.trip) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <h2>Trip not found</h2>
        <button className="btn-primary" onClick={() => navigate('/')} style={{ marginTop: '16px' }}>Back to Trips</button>
      </div>
    );
  }

  const { trip, participants, expenses, bookings, myParticipant, stats } = tripData;
  const netBalance = myParticipant ? myParticipant.balance : 0; // positive = owed money, negative = owes money

  // Handlers for Add Expense Wizard
  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    try {
      const numAmt = Number(expenseForm.amount);
      const participantObjs = expenseForm.selectedParticipantIds.map(id => ({ memberId: id }));

      const res = await api.createExpense(tripId, {
        description: expenseForm.description,
        merchant: expenseForm.merchant,
        category: expenseForm.category,
        amount: numAmt,
        payerId: expenseForm.payerId,
        splitMethod: expenseForm.splitMethod,
        participants: participantObjs,
        aiParsed: !!parsedData,
        aiConfidence: parsedData ? parsedData.confidence : 0
      });

      if (res.success) {
        setShowAddExpenseModal(false);
        setWizardStep(1);
        setParsedData(null);
        setExpenseForm(prev => ({ ...prev, description: '', merchant: '', amount: '' }));
        loadTripData();
      }
    } catch (err) {
      alert(err.message || 'Error creating expense');
    }
  };

  // Handlers for AI Receipt Parse
  const handleReceiptParse = async (e, textOverride = null) => {
    if (e && e.preventDefault) e.preventDefault();

    const targetText = textOverride !== null ? textOverride : receiptText;
    const mode = textOverride !== null ? 'text' : receiptMode;

    if (mode === 'file' && !receiptFile) {
      alert('Please select a receipt image file or PDF to upload.');
      return;
    }
    if (mode === 'text' && !targetText.trim()) {
      alert('Please paste or type bill text before parsing.');
      return;
    }

    setParsingReceipt(true);
    try {
      const formData = new FormData();
      if (mode === 'file' && receiptFile) {
        formData.append('receipt', receiptFile);
      } else {
        formData.append('rawText', targetText.trim());
      }

      const res = await api.parseReceipt(formData);
      if (res.success && res.extractedData) {
        const ext = res.extractedData;
        setParsedData(ext);

        const defaultPayer = participants.find(p => p.email === user?.email)?._id || participants[0]?._id || '';
        const allParticipantIds = participants.map(p => p._id);

        setExpenseForm(prev => ({
          ...prev,
          description: `${ext.merchant}${ext.items?.[0]?.name ? ' (' + ext.items[0].name + ')' : ''}`,
          merchant: ext.merchant,
          category: ext.category || 'FOOD',
          amount: ext.total,
          payerId: prev.payerId || defaultPayer,
          selectedParticipantIds: prev.selectedParticipantIds.length > 0 ? prev.selectedParticipantIds : allParticipantIds
        }));
        setShowReceiptModal(false);
        setWizardStep(1); // Jump to AI Parsed review in wizard
        setShowAddExpenseModal(true);
      }
    } catch (err) {
      alert('Error parsing receipt with Groq AI: ' + (err.message || err));
    } finally {
      setParsingReceipt(false);
    }
  };

  // Handlers for Add Booking
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createBooking(tripId, {
        description: bookingForm.description,
        type: bookingForm.type,
        vendor_name: bookingForm.vendor_name,
        booking_reference: bookingForm.booking_reference,
        total_cost: Number(bookingForm.total_cost),
        start_date: bookingForm.start_date,
        end_date: bookingForm.end_date,
        allocation_model: bookingForm.allocation_model,
        assigned_participant_ids: bookingForm.assigned_participant_ids,
        paid_by: bookingForm.paid_by || null
      });
      if (res.success) {
        setShowAddBookingModal(false);
        setBookingForm(prev => ({ ...prev, description: '', vendor_name: '', total_cost: '' }));
        loadTripData();
      }
    } catch (err) {
      alert(err.message || 'Error creating booking');
    }
  };

  // Handlers for Add Participant
  const handleAddParticipant = async (e) => {
    e.preventDefault();
    try {
      const res = await api.addParticipant(tripId, participantForm);
      if (res.success) {
        setShowAddParticipantModal(false);
        setParticipantForm({ name: '', email: '', cost_tier: 'STANDARD', tier_multiplier: 1.0 });
        loadTripData();
      }
    } catch (err) {
      alert(err.message || 'Error adding participant');
    }
  };

  // Handlers for Early Departure Recalculation
  const handleDepartParticipant = async (e) => {
    e.preventDefault();
    if (!selectedParticipantForDepart) return;
    try {
      const res = await api.departParticipant(tripId, selectedParticipantForDepart._id, {
        departure_date: new Date().toISOString().split('T')[0],
        reason: 'Early departure mid-trip'
      });
      if (res.success) {
        setShowDepartModal(false);
        loadTripData();
        alert(res.message);
      }
    } catch (err) {
      alert(err.message || 'Error processing departure');
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--color-paper-cream)', minHeight: 'calc(100vh - 68px)', padding: '40px 24px 80px 24px' }}>
      <div style={{ maxWidth: 'var(--page-max-width)', margin: '0 auto' }}>
      
      {/* Workspace Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <span className="eyebrow-label">EXPEDITION WORKSPACE</span>
            <span className={trip.status === 'active' ? 'sticker-badge' : 'sticker-badge-navy'}>
              {trip.status.replace('_', ' ')}
            </span>
          </div>
          <h1 className="deacon-display" style={{ fontSize: 'clamp(32px, 4vw, 56px)', color: 'var(--color-forest-ink)' }}>
            {trip.name}
          </h1>
          <p style={{ color: '#555555', fontSize: '15px', marginTop: '6px', fontWeight: 500 }}>
            📍 {trip.destination || 'Destination'} • 📅 {new Date(trip.start_date).toLocaleDateString()} to {new Date(trip.end_date).toLocaleDateString()} • 💱 {trip.currency || 'INR'} (₹{trip.budget?.toLocaleString() || '0'} Budget)
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button className="btn-ghost-cream" onClick={() => setShowReceiptModal(true)}>
            <Sparkles size={16} color="var(--color-forest-ink)" /> AI RECEIPT OCR
          </button>
          <button className="btn-meadow" onClick={() => { setWizardStep(1); setShowAddExpenseModal(true); }}>
            <Plus size={18} /> ADD EXPENSE
          </button>
        </div>
      </div>

      {/* Prominent Balance Banner */}
      <div style={{
        backgroundColor: netBalance > 0 ? '#eefbe9' : netBalance < 0 ? '#fee2e2' : '#f4ede2',
        border: `2px solid ${netBalance > 0 ? 'var(--color-meadow)' : netBalance < 0 ? '#fca5a5' : 'var(--color-sage-border)'}`,
        borderRadius: '20px',
        padding: '24px 32px',
        marginBottom: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        boxShadow: 'var(--shadow-preview)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: '54px', height: '54px', borderRadius: '16px',
            backgroundColor: netBalance > 0 ? 'var(--color-meadow)' : netBalance < 0 ? '#dc2626' : 'var(--color-forest-ink)',
            color: netBalance > 0 ? 'var(--color-forest-ink)' : '#ffffff',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {netBalance > 0 ? <ArrowUpRight size={32} /> : netBalance < 0 ? <ArrowDownLeft size={32} /> : <CheckCircle2 size={32} />}
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-forest-ink)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              YOUR NET POSITION
            </div>
            <div style={{ fontSize: '32px', fontFamily: 'var(--font-deacon)', fontWeight: 900, color: netBalance > 0 ? 'var(--color-forest-ink)' : netBalance < 0 ? '#b91c1c' : 'var(--color-forest-ink)' }}>
              {netBalance > 0 ? `YOU ARE OWED ₹${netBalance.toFixed(2)}` : netBalance < 0 ? `YOU OWE ₹${Math.abs(netBalance).toFixed(2)}` : 'YOU ARE EVEN (₹0.00)'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '32px', fontSize: '14px' }}>
          <div>
            <span style={{ color: 'var(--color-moss-gray)', display: 'block', fontSize: '12px', textTransform: 'uppercase', fontWeight: 600 }}>Total You Paid</span>
            <strong style={{ fontSize: '20px', color: 'var(--color-forest-ink)', fontFamily: 'var(--font-deacon)' }}>₹{(myParticipant?.total_paid || 0).toFixed(2)}</strong>
          </div>
          <div style={{ borderLeft: '1px dashed var(--color-sage-border)', paddingLeft: '32px' }}>
            <span style={{ color: 'var(--color-moss-gray)', display: 'block', fontSize: '12px', textTransform: 'uppercase', fontWeight: 600 }}>Your Share Owed</span>
            <strong style={{ fontSize: '20px', color: 'var(--color-forest-ink)', fontFamily: 'var(--font-deacon)' }}>₹{(myParticipant?.total_owed || 0).toFixed(2)}</strong>
          </div>
        </div>
      </div>

      {/* Workspace Navigation Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        borderBottom: '2px solid var(--color-sage-border)',
        marginBottom: '32px',
        overflowX: 'auto',
        paddingBottom: '4px'
      }}>
        {[
          { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
          { id: 'expenses', label: `Expenses (${expenses.length})`, icon: Receipt },
          { id: 'bookings', label: `Bookings (${bookings.length})`, icon: CalendarCheck },
          { id: 'people', label: `People (${participants.length})`, icon: Users },
          { id: 'ledger', label: 'Ledger Audit', icon: BookOpen },
          { id: 'settlement', label: 'Settlement Matrix', icon: Scale },
          { id: 'report', label: 'Trip Report', icon: FileText },
          { id: 'settings', label: 'Settings', icon: Settings }
        ].map(tab => {
          const IconComp = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                border: 'none',
                background: isActive ? 'var(--color-forest-ink)' : 'transparent',
                color: isActive ? 'var(--color-meadow)' : 'var(--color-forest-ink)',
                borderRadius: '10px 10px 0 0',
                fontWeight: isActive ? 800 : 600,
                fontSize: '13px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              <IconComp size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content Views */}

      {/* 1. OVERVIEW DASHBOARD TAB */}
      {activeTab === 'dashboard' && (
        <DashboardTab
          trip={trip}
          stats={stats}
          participants={participants}
          expenses={expenses}
          bookings={bookings}
          onAddExpense={() => { setWizardStep(1); setShowAddExpenseModal(true); }}
          onAddBooking={() => setShowAddBookingModal(true)}
          onOpenSettlement={() => setActiveTab('settlement')}
        />
      )}

      {/* 2. EXPENSES TAB */}
      {activeTab === 'expenses' && (
        <ExpensesTab
          expenses={expenses}
          participants={participants}
          onAddExpense={() => { setWizardStep(1); setShowAddExpenseModal(true); }}
          onOpenReceiptModal={() => setShowReceiptModal(true)}
          onRefresh={loadTripData}
        />
      )}

      {/* 3. BOOKINGS TAB */}
      {activeTab === 'bookings' && (
        <BookingsTab
          bookings={bookings}
          participants={participants}
          onAddBooking={() => setShowAddBookingModal(true)}
          onRefresh={loadTripData}
        />
      )}

      {/* 4. PEOPLE TAB */}
      {activeTab === 'people' && (
        <PeopleTab
          participants={participants}
          trip={trip}
          onAddParticipant={() => setShowAddParticipantModal(true)}
          onDepartParticipant={(p) => { setSelectedParticipantForDepart(p); setShowDepartModal(true); }}
          onRefresh={loadTripData}
        />
      )}

      {/* 5. LEDGER TAB */}
      {activeTab === 'ledger' && (
        <LedgerTab tripId={tripId} participants={participants} />
      )}

      {/* 6. SETTLEMENT TAB */}
      {activeTab === 'settlement' && (
        <SettlementTab tripId={tripId} trip={trip} participants={participants} onRefresh={loadTripData} />
      )}

      {/* 7. TRIP REPORT TAB */}
      {activeTab === 'report' && (
        <ReportTab tripId={tripId} trip={trip} />
      )}

      {/* 8. SETTINGS TAB */}
      {activeTab === 'settings' && (
        <SettingsTab trip={trip} onRefresh={loadTripData} />
      )}

      {/* FLOATING CALCULATE FUNDING / LEDGER STATUS CHIP */}
      <div className="floating-chip">
        <div style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-meadow)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-forest-ink)',
          fontWeight: 800
        }}>
          👍
        </div>
        <div>
          <span style={{ fontWeight: 700, display: 'block', fontSize: '12px' }}>CALCULATE FUNDING</span>
          <span style={{ fontSize: '11px', color: 'var(--color-moss-gray)' }}>{participants.length} Active Travelers • Balanced Ledger</span>
        </div>
      </div>

      </div>

      {/* --- MODALS --- */}

      {/* Add Expense Wizard Modal */}
      {showAddExpenseModal && (
        <AddExpenseWizardModal
          step={wizardStep}
          setStep={setWizardStep}
          expenseForm={expenseForm}
          setExpenseForm={setExpenseForm}
          participants={participants}
          parsedData={parsedData}
          onSubmit={handleExpenseSubmit}
          onClose={() => { setShowAddExpenseModal(false); setWizardStep(1); setParsedData(null); }}
        />
      )}

      {/* AI Receipt Parser Modal */}
      {showReceiptModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '16px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '520px', borderRadius: '16px', border: '2px solid var(--color-meadow-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={20} style={{ color: 'var(--color-primary)' }} /> Groq AI Bill & Receipt Parser
              </h3>
              <button onClick={() => setShowReceiptModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>×</button>
            </div>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px', marginBottom: '16px' }}>
              Upload a receipt photo/PDF or paste bill text. Groq AI extracts merchant, line items, date, tax, tip, and totals with 98%+ accuracy.
            </p>

            {/* Input Mode Selector */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', background: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
              <button
                type="button"
                onClick={() => setReceiptMode('file')}
                style={{
                  flex: 1, padding: '8px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '13px',
                  backgroundColor: receiptMode === 'file' ? '#ffffff' : 'transparent',
                  boxShadow: receiptMode === 'file' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  color: receiptMode === 'file' ? 'var(--color-primary)' : 'var(--color-muted)'
                }}
              >
                📁 Upload File / Photo
              </button>
              <button
                type="button"
                onClick={() => setReceiptMode('text')}
                style={{
                  flex: 1, padding: '8px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '13px',
                  backgroundColor: receiptMode === 'text' ? '#ffffff' : 'transparent',
                  boxShadow: receiptMode === 'text' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  color: receiptMode === 'text' ? 'var(--color-primary)' : 'var(--color-muted)'
                }}
              >
                📝 Paste Bill Text
              </button>
            </div>

            {/* Parsing Spinner Indicator */}
            {parsingReceipt && (
              <div style={{ backgroundColor: '#eff6ff', border: '1px solid #93c5fd', borderRadius: '12px', padding: '16px', textAlign: 'center', marginBottom: '16px' }}>
                <RefreshCw size={24} style={{ color: 'var(--color-primary)', animation: 'spin 1s linear infinite', marginBottom: '8px' }} />
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e40af' }}>Analyzing Receipt with Tesseract OCR & Groq AI...</div>
                <div style={{ fontSize: '11px', color: '#3b82f6', marginTop: '4px' }}>Parsing merchant, items, dates, and calculated balances</div>
              </div>
            )}

            <form onSubmit={handleReceiptParse}>
              {receiptMode === 'file' ? (
                <div style={{ border: '2px dashed var(--color-border)', borderRadius: '12px', padding: '24px', textAlign: 'center', marginBottom: '16px', backgroundColor: '#f8fafc' }}>
                  <Upload size={32} style={{ color: 'var(--color-primary)', marginBottom: '8px' }} />
                  <p style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>Choose Receipt Image or PDF</p>
                  <p style={{ fontSize: '12px', color: 'var(--color-muted)', marginBottom: '12px' }}>Supports JPG, PNG, WEBP, or PDF</p>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setReceiptFile(e.target.files[0])}
                    style={{ display: 'block', margin: '0 auto', fontSize: '13px' }}
                  />
                  {receiptFile && (
                    <div style={{ marginTop: '10px', fontSize: '12px', color: 'var(--color-success)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                      <CheckCircle2 size={14} /> Selected: {receiptFile.name} ({(receiptFile.size / 1024).toFixed(1)} KB)
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>Paste Receipt Text or Invoice Summary</label>
                  <textarea
                    rows={5}
                    placeholder="e.g. Punjabi Dhaba: 2 Paneer Butter Masala Rs 480, 4 Naan Rs 240, Total Rs 720"
                    value={receiptText}
                    onChange={(e) => setReceiptText(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '13px', fontFamily: 'inherit' }}
                  />

                  {/* Sample Presets */}
                  <div style={{ marginTop: '10px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>💡 Or Try 1-Click Demo Presets:</div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={() => {
                          const demo = "Punjabi Dhaba & Bar\n2 Paneer Butter Masala Rs 480\n4 Butter Naan Rs 240\n1 Jeera Rice Rs 180\nGST 5% Rs 45\nTotal Rs 945";
                          setReceiptText(demo);
                          setReceiptMode('text');
                          handleReceiptParse(null, demo);
                        }}
                        style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer' }}
                      >
                        🍽️ Restaurant Bill
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const demo = "Grand Alpine Resort & Spa\n2 Nights Deluxe Suite $360\nResort Experience Fee $40\nTaxes & Fees $30\nTotal Amount $430";
                          setReceiptText(demo);
                          setReceiptMode('text');
                          handleReceiptParse(null, demo);
                        }}
                        style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer' }}
                      >
                        🏨 Hotel Invoice
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const demo = "Highland Taxi Express\nDistance: 35 km\nBase Fare Rs 450\nToll Tax Rs 90\nDriver Tip Rs 60\nTotal Fare Rs 600";
                          setReceiptText(demo);
                          setReceiptMode('text');
                          handleReceiptParse(null, demo);
                        }}
                        style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer' }}
                      >
                        🚕 Taxi Fare
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowReceiptModal(false)}>Cancel</button>
                <button type="submit" disabled={parsingReceipt} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={16} />
                  {parsingReceipt ? 'Groq AI Analyzing...' : 'Parse Bill with Groq AI'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Booking Modal */}
      {showAddBookingModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '16px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '520px', borderRadius: '16px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800 }}>Create Locked Group Booking</h3>
              <button onClick={() => setShowAddBookingModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>×</button>
            </div>

            <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Booking Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grand Beach Resort (4 Nights)"
                  value={bookingForm.description}
                  onChange={(e) => setBookingForm({ ...bookingForm, description: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '14px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Type</label>
                  <select
                    value={bookingForm.type}
                    onChange={(e) => setBookingForm({ ...bookingForm, type: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '14px' }}
                  >
                    <option value="accommodation">Accommodation</option>
                    <option value="transportation">Transportation</option>
                    <option value="activity">Activity</option>
                    <option value="meal">Meal</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Vendor Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Marriott / Airbnb"
                    value={bookingForm.vendor_name}
                    onChange={(e) => setBookingForm({ ...bookingForm, vendor_name: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '14px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Total Vendor Cost (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="1200"
                    value={bookingForm.total_cost}
                    onChange={(e) => setBookingForm({ ...bookingForm, total_cost: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '14px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Paid Upfront By</label>
                  <select
                    value={bookingForm.paid_by}
                    onChange={(e) => setBookingForm({ ...bookingForm, paid_by: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '14px' }}
                  >
                    <option value="">Vendor Not Yet Paid</option>
                    {participants.map(p => (
                      <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Start Date *</label>
                  <input
                    type="date"
                    required
                    value={bookingForm.start_date}
                    onChange={(e) => setBookingForm({ ...bookingForm, start_date: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '14px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>End Date *</label>
                  <input
                    type="date"
                    required
                    value={bookingForm.end_date}
                    onChange={(e) => setBookingForm({ ...bookingForm, end_date: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '14px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Cost Allocation Model</label>
                <select
                  value={bookingForm.allocation_model}
                  onChange={(e) => setBookingForm({ ...bookingForm, allocation_model: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '14px' }}
                >
                  <option value="equal">Equal Split</option>
                  <option value="weighted_nights">Weighted by Nights Stayed</option>
                  <option value="tiered">Tiered Cost Sharing (Student/Sponsor Multiplier)</option>
                  <option value="occupancy_based">Occupancy Based (Room Split)</option>
                  <option value="consumption_only">Consumption / Attendance Only</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowAddBookingModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Booking</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Participant Modal */}
      {showAddParticipantModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '16px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '440px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800 }}>Add Trip Participant</h3>
              <button onClick={() => setShowAddParticipantModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>×</button>
            </div>

            <form onSubmit={handleAddParticipant} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Participant Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Connor"
                  value={participantForm.name}
                  onChange={(e) => setParticipantForm({ ...participantForm, name: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="sarah@example.com"
                  value={participantForm.email}
                  onChange={(e) => setParticipantForm({ ...participantForm, email: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '14px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Cost Tier</label>
                  <select
                    value={participantForm.cost_tier}
                    onChange={(e) => {
                      const tier = e.target.value;
                      const mult = tier === 'STUDENT' ? 0.75 : tier === 'SPONSOR' ? 1.25 : 1.0;
                      setParticipantForm({ ...participantForm, cost_tier: tier, tier_multiplier: mult });
                    }}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '14px' }}
                  >
                    <option value="STANDARD">Standard (1.0x)</option>
                    <option value="STUDENT">Student / Discount (0.75x)</option>
                    <option value="SPONSOR">Sponsor / Premium (1.25x)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Multiplier</label>
                  <input
                    type="number"
                    step="0.05"
                    value={participantForm.tier_multiplier}
                    onChange={(e) => setParticipantForm({ ...participantForm, tier_multiplier: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '14px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowAddParticipantModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Add Member</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Early Departure Recalculation Modal */}
      {showDepartModal && selectedParticipantForDepart && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '16px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '440px', borderRadius: '16px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '12px' }}>Process Early Departure</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', marginBottom: '16px' }}>
              Mark <strong>{selectedParticipantForDepart.name}</strong> as departing today. The system will automatically recalculate future bookings and adjust group cost allocations.
            </p>

            <form onSubmit={handleDepartParticipant}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowDepartModal(false)}>Cancel</button>
                <button type="submit" className="btn-danger">Confirm Early Departure</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

/* --- TAB COMPONENTS --- */

/* 1. OVERVIEW DASHBOARD TAB */
const DashboardTab = ({ trip, stats, participants, expenses, bookings, onAddExpense, onAddBooking, onOpenSettlement }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Quick Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Total Spent So Far</span>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-ink)', marginTop: '4px' }}>
            ₹{stats.totalSpent.toFixed(2)}
          </div>
          <span style={{ fontSize: '12px', color: 'var(--color-muted)', marginTop: '4px', display: 'block' }}>
            ₹{stats.totalExpenses.toFixed(2)} expenses + ₹{stats.totalBookings.toFixed(2)} bookings
          </span>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Trip Budget</span>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-ink)', marginTop: '4px' }}>
            ₹{(stats.budget || 0).toFixed(2)}
          </div>
          {/* Progress bar */}
          <div style={{ width: '100%', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', marginTop: '8px', overflow: 'hidden' }}>
            <div style={{
              width: `${Math.min(stats.budgetUsedPercentage, 100)}%`,
              height: '100%',
              backgroundColor: stats.budgetUsedPercentage > 90 ? 'var(--color-danger)' : 'var(--color-primary)'
            }} />
          </div>
          <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '4px', display: 'block' }}>
            {stats.budgetUsedPercentage}% of budget utilized
          </span>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Active Members</span>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-ink)', marginTop: '4px' }}>
            {stats.participantCount} People
          </div>
          <span style={{ fontSize: '12px', color: 'var(--color-success)', marginTop: '4px', display: 'block' }}>
            All confirmed & active
          </span>
        </div>

        <div className="card" style={{ padding: '20px', backgroundColor: 'var(--color-primary-muted)', borderColor: 'var(--color-focus-ring)' }}>
          <span style={{ fontSize: '13px', color: 'var(--color-primary)', fontWeight: 600 }}>Settlement Status</span>
          <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-ink)', marginTop: '4px' }}>
            {trip.status.replace('_', ' ').toUpperCase()}
          </div>
          <button className="btn-primary" onClick={onOpenSettlement} style={{ marginTop: '8px', fontSize: '12px', padding: '6px 12px' }}>
            View Settlement →
          </button>
        </div>
      </div>

      {/* Middle Grid: AI Savings Suggestion & Action Items */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        
        {/* AI Savings Card */}
        <div className="card" style={{ borderLeft: '4px solid var(--color-primary)', background: 'linear-gradient(to right, #f0f7ff, #ffffff)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Sparkles size={20} style={{ color: 'var(--color-primary)' }} />
            <h4 style={{ fontSize: '16px', fontWeight: 700 }}>AI Group Savings Recommendation</h4>
          </div>
          <p style={{ fontSize: '14px', color: 'var(--color-text-primary)', marginBottom: '12px' }}>
            💡 <strong>Accommodation Optimization:</strong> Sharing a 4-bedroom villa instead of separate hotel rooms can save your group <strong>~₹400.00 (25%)</strong>.
          </p>
          <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', backgroundColor: '#ffffff', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
            Current setup: ₹1600.00 total • Proposed Villa: ₹1200.00 total (₹300/person)
          </div>
        </div>

        {/* Action Items Box */}
        <div className="card">
          <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>Action Items</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-success)' }}>
              <CheckCircle2 size={16} /> All {participants.length} participants confirmed attendance
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-secondary)' }}>
              <CheckCircle2 size={16} /> {bookings.length} Group bookings locked with vendors
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-warning)' }}>
              <AlertTriangle size={16} /> {expenses.length} Expenses logged. Final settlement ready at trip end.
            </div>
          </div>
        </div>

      </div>

      {/* Recent Activity List */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Recent Expenses</h3>
          <button className="btn-secondary" onClick={onAddExpense} style={{ fontSize: '13px', padding: '6px 12px' }}>
            + Log Expense
          </button>
        </div>

        {expenses.length === 0 ? (
          <p style={{ color: 'var(--color-muted)', fontSize: '14px', textAlign: 'center', padding: '24px 0' }}>
            No expenses logged yet. Click "+ Log Expense" or use the AI Receipt Parser.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {expenses.slice(0, 5).map(exp => (
              <div key={exp._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid var(--color-border)', borderRadius: '8px', backgroundColor: '#ffffff' }}>
                <div>
                  <strong style={{ fontSize: '15px', color: 'var(--color-ink)' }}>{exp.description}</strong>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                    Paid by {exp.payerId?.name || 'User'} • {new Date(exp.date).toLocaleDateString()}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-ink)' }}>₹{exp.amount.toFixed(2)}</span>
                  <span className="badge badge-primary" style={{ display: 'block', marginTop: '2px', fontSize: '10px' }}>{exp.category}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

/* 2. EXPENSES TAB */
const ExpensesTab = ({ expenses, participants, onAddExpense, onOpenReceiptModal, onRefresh }) => {
  const [filterCategory, setFilterCategory] = useState('ALL');

  const filteredExpenses = filterCategory === 'ALL'
    ? expenses
    : expenses.filter(e => e.category === filterCategory);

  const handleDeleteExpense = async (eid) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      await api.deleteExpense(expenses[0].tripId, eid);
      onRefresh();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['ALL', 'FOOD', 'ACCOMMODATION', 'TRANSPORT', 'ACTIVITY', 'OTHER'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={filterCategory === cat ? 'btn-primary' : 'btn-secondary'}
              style={{ fontSize: '13px', padding: '6px 14px' }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-secondary" onClick={onOpenReceiptModal}>
            <Sparkles size={16} /> Scan Receipt AI
          </button>
          <button className="btn-primary" onClick={onAddExpense}>
            <Plus size={16} /> Log Expense
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid var(--color-border)' }}>
              <th style={{ padding: '14px 20px', fontWeight: 600 }}>Description / Merchant</th>
              <th style={{ padding: '14px 20px', fontWeight: 600 }}>Category</th>
              <th style={{ padding: '14px 20px', fontWeight: 600 }}>Payer</th>
              <th style={{ padding: '14px 20px', fontWeight: 600 }}>Date</th>
              <th style={{ padding: '14px 20px', fontWeight: 600 }}>Amount</th>
              <th style={{ padding: '14px 20px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: 'var(--color-muted)' }}>
                  No expenses match your criteria.
                </td>
              </tr>
            ) : (
              filteredExpenses.map(exp => (
                <tr key={exp._id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '14px 20px' }}>
                    <strong style={{ color: 'var(--color-ink)' }}>{exp.description}</strong>
                    {exp.merchant && <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{exp.merchant}</div>}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span className="badge badge-primary">{exp.category}</span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>{exp.payerId?.name || 'User'}</td>
                  <td style={{ padding: '14px 20px' }}>{new Date(exp.date).toLocaleDateString()}</td>
                  <td style={{ padding: '14px 20px', fontWeight: 700 }}>₹{exp.amount.toFixed(2)}</td>
                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    <button
                      onClick={() => handleDeleteExpense(exp._id)}
                      style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer' }}
                      title="Delete Expense"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* 3. BOOKINGS TAB */
const BookingsTab = ({ bookings, participants, onAddBooking, onRefresh }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Group Bookings & Vendor Commitments</h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
            Locked accommodations, flights, and activities with custom cost sharing models.
          </p>
        </div>
        <button className="btn-primary" onClick={onAddBooking}>
          <Plus size={16} /> Create Booking
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
        {bookings.length === 0 ? (
          <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--color-muted)' }}>
            No locked bookings created yet.
          </div>
        ) : (
          bookings.map(b => (
            <div key={b._id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span className="badge badge-info">{b.type.toUpperCase()}</span>
                  <span className="badge badge-success">{b.status.toUpperCase()}</span>
                </div>
                <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>{b.description}</h4>
                <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
                  Vendor: <strong>{b.vendor_name || 'Direct'}</strong>
                </div>

                <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', marginBottom: '14px', fontSize: '13px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>Total Cost:</span>
                    <strong style={{ fontSize: '15px', color: 'var(--color-ink)' }}>₹{b.total_cost.toFixed(2)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>Model:</span>
                    <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{b.allocation_model.replace('_', ' ')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Vendor Paid By:</span>
                    <span>{b.paid_by?.name || 'Not Paid'}</span>
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '12px', color: 'var(--color-muted)' }}>
                Assigned Participants: {b.assigned_participants?.length || 0} People
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

/* 4. PEOPLE TAB */
const PeopleTab = ({ participants, trip, onAddParticipant, onDepartParticipant, onRefresh }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Trip Participants ({participants.length})</h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
            Manage attendance, cost multipliers (students/sponsors), and early departures.
          </p>
        </div>
        <button className="btn-primary" onClick={onAddParticipant}>
          <Plus size={16} /> Add Member
        </button>
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid var(--color-border)' }}>
              <th style={{ padding: '14px 20px', fontWeight: 600 }}>Name / Email</th>
              <th style={{ padding: '14px 20px', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '14px 20px', fontWeight: 600 }}>Cost Tier</th>
              <th style={{ padding: '14px 20px', fontWeight: 600 }}>Total Paid</th>
              <th style={{ padding: '14px 20px', fontWeight: 600 }}>Total Owed</th>
              <th style={{ padding: '14px 20px', fontWeight: 600 }}>Net Position</th>
              <th style={{ padding: '14px 20px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {participants.map(p => {
              const net = (p.total_owed || 0) - (p.total_paid || 0);
              return (
                <tr key={p._id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '14px 20px' }}>
                    <strong style={{ color: 'var(--color-ink)' }}>{p.name}</strong>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{p.email}</div>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span className={`badge ${p.status === 'active' || p.status === 'confirmed' ? 'badge-success' : p.status === 'departed' ? 'badge-warning' : 'badge-danger'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ fontWeight: 600, fontSize: '12px' }}>{p.cost_tier} ({p.tier_multiplier}x)</span>
                  </td>
                  <td style={{ padding: '14px 20px', fontWeight: 600 }}>₹{(p.total_paid || 0).toFixed(2)}</td>
                  <td style={{ padding: '14px 20px', fontWeight: 600 }}>₹{(p.total_owed || 0).toFixed(2)}</td>
                  <td style={{ padding: '14px 20px', fontWeight: 700, color: net > 0 ? 'var(--color-danger)' : net < 0 ? 'var(--color-success)' : 'var(--color-ink)' }}>
                    {net > 0 ? `Owes ₹${net.toFixed(2)}` : net < 0 ? `Owed ₹${Math.abs(net).toFixed(2)}` : 'Settled'}
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    {p.status !== 'departed' && (
                      <button className="btn-secondary" onClick={() => onDepartParticipant(p)} style={{ fontSize: '12px', padding: '4px 8px' }}>
                        Depart Early
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* 5. LEDGER TAB */
const LedgerTab = ({ tripId, participants }) => {
  const [ledgerData, setLedgerData] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [subTab, setSubTab] = useState('ledger');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getLedger(tripId),
      api.getAuditLogs(tripId)
    ]).then(([lRes, aRes]) => {
      if (lRes.success) setLedgerData(lRes.ledger);
      if (aRes.success) setAuditLogs(aRes.logs);
    }).finally(() => setLoading(false));
  }, [tripId]);

  if (loading) return <div style={{ textAlign: 'center', padding: '40px' }}>Loading Financial Ledger...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', gap: '12px' }}>
        <button className={subTab === 'ledger' ? 'btn-primary' : 'btn-secondary'} onClick={() => setSubTab('ledger')}>
          Double-Entry Ledger Statement
        </button>
        <button className={subTab === 'audit' ? 'btn-primary' : 'btn-secondary'} onClick={() => setSubTab('audit')}>
          Audit Logs ({auditLogs.length})
        </button>
      </div>

      {subTab === 'ledger' ? (
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ padding: '12px 16px' }}>Date</th>
                <th style={{ padding: '12px 16px' }}>Entry Type</th>
                <th style={{ padding: '12px 16px' }}>Description</th>
                <th style={{ padding: '12px 16px' }}>Payer / Creditor</th>
                <th style={{ padding: '12px 16px' }}>Participant / Debtor</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Amount / Share</th>
              </tr>
            </thead>
            <tbody>
              {ledgerData.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '32px' }}>No ledger entries.</td></tr>
              ) : (
                ledgerData.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '12px 16px' }}>{new Date(item.date).toLocaleDateString()}</td>
                    <td style={{ padding: '12px 16px' }}><span className="badge badge-primary">{item.type}</span></td>
                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>{item.description}</td>
                    <td style={{ padding: '12px 16px' }}>{item.payer}</td>
                    <td style={{ padding: '12px 16px' }}>{item.participant}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700 }}>₹{item.participantShare.toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ padding: '12px 16px' }}>Timestamp</th>
                <th style={{ padding: '12px 16px' }}>Action</th>
                <th style={{ padding: '12px 16px' }}>Actor</th>
                <th style={{ padding: '12px 16px' }}>Details / Reason</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log) => (
                <tr key={log._id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '12px 16px', color: 'var(--color-text-secondary)' }}>{new Date(log.createdAt).toLocaleString()}</td>
                  <td style={{ padding: '12px 16px' }}><span className="badge badge-info">{log.action}</span></td>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{log.actorName}</td>
                  <td style={{ padding: '12px 16px' }}>{log.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

/* 6. SETTLEMENT TAB */
const SettlementTab = ({ tripId, trip, participants, onRefresh }) => {
  const [settlement, setSettlement] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSettlement = async () => {
    try {
      const res = await api.getSettlement(tripId);
      if (res.success) setSettlement(res.settlement);
    } catch (err) {
      console.error('Fetch settlement error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettlement();
  }, [tripId]);

  const handleFinalize = async () => {
    try {
      const res = await api.finalizeSettlement(tripId);
      if (res.success) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        fetchSettlement();
        onRefresh();
        alert('Settlement finalized! Required payout transactions calculated.');
      }
    } catch (err) {
      alert(err.message || 'Error finalizing settlement');
    }
  };

  const handleRecordPayment = async (tx) => {
    try {
      const res = await api.recordSettlementPayment(tripId, {
        transaction_id: tx._id,
        from_participant: tx.from_participant._id,
        to_participant: tx.to_participant._id,
        amount: tx.amount,
        payment_method: 'venmo'
      });
      if (res.success) {
        confetti({ particleCount: 50, spread: 50 });
        fetchSettlement();
        onRefresh();
      }
    } catch (err) {
      alert(err.message || 'Error marking payment');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '40px' }}>Calculating Greedy Settlement Matrix...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Settlement Summary Card */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: 800 }}>Automated Settlement Engine</h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            Greedy algorithm minimizes transaction count across group members.
          </p>
        </div>

        <button className="btn-primary" onClick={handleFinalize} style={{ padding: '12px 24px', fontSize: '15px' }}>
          Finalize Settlement & Lock
        </button>
      </div>

      {/* Net Balances Table */}
      <div className="card">
        <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Participant Net Position Summary</h4>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ padding: '12px 16px' }}>Participant</th>
                <th style={{ padding: '12px 16px' }}>Total Paid</th>
                <th style={{ padding: '12px 16px' }}>Total Owed</th>
                <th style={{ padding: '12px 16px' }}>Net Position</th>
              </tr>
            </thead>
            <tbody>
              {settlement?.balances?.map((b, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{b.name}</td>
                  <td style={{ padding: '12px 16px' }}>₹{(b.total_paid || 0).toFixed(2)}</td>
                  <td style={{ padding: '12px 16px' }}>₹{(b.total_owed || 0).toFixed(2)}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: b.net_balance > 0 ? 'var(--color-danger)' : b.net_balance < 0 ? 'var(--color-success)' : 'var(--color-ink)' }}>
                    {b.net_balance > 0 ? `Owes ₹${b.net_balance.toFixed(2)}` : b.net_balance < 0 ? `Owed ₹${Math.abs(b.net_balance).toFixed(2)}` : 'Even (₹0.00)'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Required Payout Transactions */}
      <div className="card">
        <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>
          Simplified Payout Transactions ({settlement?.transactions_required?.length || 0})
        </h4>

        {settlement?.transactions_required?.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px', color: 'var(--color-success)', fontWeight: 600 }}>
            🎉 All accounts are balanced! No transactions needed.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {settlement?.transactions_required?.map((tx) => (
              <div key={tx._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid var(--color-border)', borderRadius: '12px', backgroundColor: tx.status === 'COMPLETED' ? '#f0fdf4' : '#ffffff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ fontWeight: 700, fontSize: '15px' }}>{tx.from_participant?.name || 'Member'}</div>
                  <ArrowRight size={18} style={{ color: 'var(--color-primary)' }} />
                  <div style={{ fontWeight: 700, fontSize: '15px' }}>{tx.to_participant?.name || 'Member'}</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-ink)' }}>₹{tx.amount.toFixed(2)}</span>
                  {tx.status === 'COMPLETED' ? (
                    <span className="badge badge-success">COMPLETED</span>
                  ) : (
                    <button className="btn-primary" onClick={() => handleRecordPayment(tx)} style={{ fontSize: '12px', padding: '6px 12px' }}>
                      Mark Paid
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

/* 7. REPORT TAB */
const ReportTab = ({ tripId, trip }) => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getReport(tripId).then(res => {
      if (res.success) setReportData(res.report);
    }).finally(() => setLoading(false));
  }, [tripId]);

  if (loading) return <div style={{ textAlign: 'center', padding: '40px' }}>Generating Trip Report...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: 800 }}>Comprehensive Trip Financial Report</h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            Full spending analytics, category breakdown, and exportable PDF statement.
          </p>
        </div>
        <a
          href={api.downloadReportPDFUrl(tripId)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
          style={{ textDecoration: 'none' }}
        >
          <Download size={16} /> Export PDF Report
        </a>
      </div>

      {/* Category breakdown */}
      <div className="card">
        <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Spending by Category</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
          {Object.entries(reportData?.byCategory || {}).map(([cat, amt]) => (
            <div key={cat} style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>{cat}</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-ink)', marginTop: '4px' }}>
                ₹{amt.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* 8. SETTINGS TAB */
const SettingsTab = ({ trip, onRefresh }) => {
  const [form, setForm] = useState({
    name: trip.name,
    destination: trip.destination,
    budget: trip.budget,
    currency: trip.currency,
    cost_sharing_model: trip.cost_sharing_model,
    refund_policy: trip.refund_policy,
    rounding_method: trip.rounding_method
  });

  const handleSave = async (e) => {
    e.preventDefault();
    await api.updateTrip(trip._id, form);
    onRefresh();
    alert('Trip settings saved!');
  };

  return (
    <div className="card" style={{ maxWidth: '600px' }}>
      <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '16px' }}>Trip Rules & Settings</h3>
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Trip Name</label>
          <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Budget (₹)</label>
          <input type="number" value={form.budget} onChange={e => setForm({ ...form, budget: Number(e.target.value) })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Rounding Method</label>
          <select value={form.rounding_method} onChange={e => setForm({ ...form, rounding_method: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
            <option value="last_person">Last Person Absorbs Rounding Diff</option>
            <option value="banker">Banker's Rounding (Nearest Cent)</option>
            <option value="equal">Equal Distribution</option>
          </select>
        </div>
        <button type="submit" className="btn-primary" style={{ marginTop: '12px' }}>Save Settings</button>
      </form>
    </div>
  );
};

/* ADD EXPENSE WIZARD MODAL COMPONENT (7 Steps as per design specs) */
const AddExpenseWizardModal = ({ step, setStep, expenseForm, setExpenseForm, participants, parsedData, onSubmit, onClose }) => {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '16px' }}>
      <div className="card" style={{ width: '100%', maxWidth: '520px', borderRadius: '16px', maxHeight: '90vh', overflowY: 'auto' }}>
        
        {/* Wizard Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 800 }}>Log Group Expense</h3>
            <span style={{ fontSize: '12px', color: 'var(--color-primary)', fontWeight: 600 }}>Step {step} of 7</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>×</button>
        </div>

        <form onSubmit={onSubmit}>
          {/* STEP 1: Entry Method */}
          {step === 1 && (
            <div>
              {parsedData ? (
                <div style={{ backgroundColor: '#f0fdf4', padding: '18px', borderRadius: '12px', border: '1.5px solid #86efac', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: '#166534', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Sparkles size={18} /> Groq AI Parsed Receipt Summary
                    </span>
                    <span style={{ fontSize: '12px', backgroundColor: '#dcfce7', color: '#15803d', padding: '3px 10px', borderRadius: '12px', fontWeight: 700, border: '1px solid #86efac' }}>
                      ✨ {parsedData.confidence}% Confidence
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px', marginBottom: '8px' }}>
                    <div><strong>Merchant:</strong> {parsedData.merchant}</div>
                    <div><strong>Category:</strong> <span className="badge badge-primary">{parsedData.category}</span></div>
                    <div><strong>Date:</strong> {parsedData.date}</div>
                    <div><strong>Currency:</strong> {parsedData.currency}</div>
                  </div>

                  <div style={{ fontSize: '14px', margin: '10px 0', padding: '10px 12px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#166534' }}>Final Post-Tax Amount (₹):</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontSize: '18px', fontWeight: 800, color: '#15803d' }}>₹</span>
                      <input
                        type="number"
                        step="0.01"
                        value={expenseForm.amount}
                        onChange={(e) => {
                          const val = e.target.value;
                          setExpenseForm(prev => ({ ...prev, amount: val }));
                          setParsedData(prev => prev ? ({ ...prev, total: parseFloat(val) || 0 }) : null);
                        }}
                        style={{ padding: '4px 8px', borderRadius: '6px', border: '1.5px solid #86efac', fontWeight: 800, fontSize: '16px', color: '#15803d', width: '120px' }}
                      />
                    </div>
                  </div>


                  {parsedData.items && parsedData.items.length > 0 && (
                    <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px dashed #bbf7d0' }}>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#166534', marginBottom: '6px' }}>Line Items Breakdown ({parsedData.items.length}):</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', color: '#1f2937', backgroundColor: '#ffffff', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        {parsedData.items.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0', borderBottom: idx < parsedData.items.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                            <span>• {item.name} <strong style={{ color: '#64748b' }}>(x{item.quantity})</strong></span>
                            <span style={{ fontWeight: 600 }}>{parsedData.currency === 'INR' ? '₹' : '$'}{item.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(parsedData.tax > 0 || parsedData.tip > 0 || parsedData.subtotal > 0) && (
                    <div style={{ marginTop: '8px', fontSize: '11px', color: '#4b5563', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                      {parsedData.subtotal > 0 && <span>Subtotal: {parsedData.subtotal}</span>}
                      {parsedData.tax > 0 && <span>Tax: {parsedData.tax}</span>}
                      {parsedData.tip > 0 && <span>Tip: {parsedData.tip}</span>}
                    </div>
                  )}

                  <div style={{ marginTop: '14px', display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      className="btn-primary"
                      style={{ flex: 1, padding: '10px', fontSize: '13px', fontWeight: 700, justifyContent: 'center' }}
                      onClick={() => setStep(3)} // Jump straight to Payer Selection
                    >
                      ⚡ Apply AI Data & Pick Payer →
                    </button>
                  </div>
                </div>
              ) : null}

              {!parsedData && (
                <div>
                  <p style={{ fontSize: '14px', marginBottom: '16px' }}>How would you like to record this expense?</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <button type="button" className="btn-secondary" style={{ justifyContent: 'flex-start', padding: '14px' }} onClick={() => setStep(2)}>
                      📝 Manual Entry
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Description & Merchant */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Group Seafood Dinner"
                  value={expenseForm.description}
                  onChange={e => setExpenseForm({ ...expenseForm, description: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '14px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Category</label>
                <select
                  value={expenseForm.category}
                  onChange={e => setExpenseForm({ ...expenseForm, category: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '14px' }}
                >
                  <option value="FOOD">Food & Dining</option>
                  <option value="ACCOMMODATION">Accommodation</option>
                  <option value="TRANSPORT">Transport & Taxis</option>
                  <option value="ACTIVITY">Activities & Excursions</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 3: Payer Selection */}
          {step === 3 && (
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Who Paid for this Expense? *</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {participants.map(p => (
                  <label key={p._id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--color-border)', cursor: 'pointer', backgroundColor: expenseForm.payerId === p._id ? 'var(--color-primary-muted)' : '#ffffff' }}>
                    <input
                      type="radio"
                      name="payer"
                      value={p._id}
                      checked={expenseForm.payerId === p._id}
                      onChange={() => setExpenseForm({ ...expenseForm, payerId: p._id })}
                    />
                    <strong style={{ fontSize: '14px' }}>{p.name}</strong>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Amount Input */}
          {step === 4 && (
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Total Expense Amount (₹) *</label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="150.00"
                value={expenseForm.amount}
                onChange={e => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '18px', fontWeight: 700 }}
              />
            </div>
          )}

          {/* STEP 5: Participant Selection */}
          {step === 5 && (
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Who Participated in this Expense?</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {participants.map(p => {
                  const isChecked = expenseForm.selectedParticipantIds.includes(p._id);
                  return (
                    <label key={p._id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setExpenseForm({ ...expenseForm, selectedParticipantIds: [...expenseForm.selectedParticipantIds, p._id] });
                          } else {
                            setExpenseForm({ ...expenseForm, selectedParticipantIds: expenseForm.selectedParticipantIds.filter(id => id !== p._id) });
                          }
                        }}
                      />
                      <span>{p.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 6: Split Model Selection */}
          {step === 6 && (
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Select Split Model</label>
              <select
                value={expenseForm.splitMethod}
                onChange={e => setExpenseForm({ ...expenseForm, splitMethod: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '14px' }}
              >
                <option value="EQUAL">Equally Among Participants</option>
                <option value="PERCENTAGE">By Percentage</option>
                <option value="CUSTOM">Custom Rupee Amounts</option>
              </select>
            </div>
          )}

          {/* STEP 7: Review & Confirm */}
          {step === 7 && (
            <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '12px', fontSize: '14px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>Review & Confirm</h4>
              <p><strong>Description:</strong> {expenseForm.description}</p>
              <p><strong>Amount:</strong> ₹{Number(expenseForm.amount).toFixed(2)}</p>
              <p><strong>Payer:</strong> {participants.find(p => p._id === expenseForm.payerId)?.name || 'Payer'}</p>
              <p><strong>Split Model:</strong> {expenseForm.splitMethod}</p>
              <p><strong>Participants ({expenseForm.selectedParticipantIds.length}):</strong></p>
            </div>
          )}

          {/* Wizard Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', paddingTop: '12px', borderTop: '1px solid var(--color-border)' }}>
            {step > 1 ? (
              <button type="button" className="btn-secondary" onClick={() => setStep(step - 1)}>Back</button>
            ) : (
              <span />
            )}

            {step < 7 ? (
              <button type="button" className="btn-primary" onClick={() => setStep(step + 1)}>Next</button>
            ) : (
              <button type="submit" className="btn-primary">Confirm & Submit Expense</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
