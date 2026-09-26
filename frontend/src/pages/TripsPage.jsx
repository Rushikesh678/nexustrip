import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Plus, Calendar, MapPin, IndianRupee, Users, ChevronRight, Sparkles, Compass, ShieldCheck } from 'lucide-react';

export const TripsPage = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    destination: '',
    description: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    currency: 'INR',
    budget: 3500,
    cost_sharing_model: 'equal',
    refund_policy: 'full'
  });
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchTrips = async () => {
    try {
      const res = await api.getTrips();
      if (res.success) {
        setTrips(res.trips);
      }
    } catch (err) {
      console.error('Fetch trips error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleCreateTrip = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.createTrip(formData);
      if (res.success) {
        setShowModal(false);
        fetchTrips();
        navigate(`/trip/${res.trip._id}`);
      }
    } catch (err) {
      alert(err.message || 'Failed to create trip');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickSeedDemo = async () => {
    setSubmitting(true);
    try {
      const res = await api.createTrip({
        name: 'Thailand Ski & Beach Adventure 2026',
        destination: 'Phuket & Chiang Mai, Thailand',
        description: '7-day group trip exploring islands, street food, and mountain trails.',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        currency: 'INR',
        budget: 4500,
        cost_sharing_model: 'equal',
        refund_policy: 'full'
      });

      if (res.success && res.trip) {
        const tripId = res.trip._id;
        // Add sample participants
        await api.addParticipant(tripId, { name: 'Alice Walker', email: 'alice.walker@example.com', cost_tier: 'STANDARD', tier_multiplier: 1.0 });
        await api.addParticipant(tripId, { name: 'Bob Miller', email: 'bob.miller@example.com', cost_tier: 'STUDENT', tier_multiplier: 0.8 });
        await api.addParticipant(tripId, { name: 'Charlie Zhang', email: 'charlie.zhang@example.com', cost_tier: 'SPONSOR', tier_multiplier: 1.2 });

        // Add sample bookings & expenses
        await api.createBooking(tripId, {
          description: 'Grand Beach Resort Villa (4 Nights)',
          type: 'accommodation',
          vendor_name: 'Grand Beach Resort',
          total_cost: 1600,
          start_date: new Date().toISOString().split('T')[0],
          end_date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          quantity: 2
        });

        await api.createBooking(tripId, {
          description: 'Private Island Catamaran Tour',
          type: 'activity',
          vendor_name: 'Phuket Marine Excursions',
          total_cost: 600,
          start_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          end_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        });

        // Get participants
        const partsRes = await api.getParticipants(tripId);
        if (partsRes.participants && partsRes.participants.length > 0) {
          const p1 = partsRes.participants[0]._id;
          const p2 = partsRes.participants[1]?._id || p1;

          await api.createExpense(tripId, {
            description: 'Group Welcome Dinner & Drinks',
            merchant: 'Tiki Beachfront Bistro',
            category: 'FOOD',
            amount: 320,
            payerId: p1
          });

          await api.createExpense(tripId, {
            description: 'Airport Shuttle & Taxi Fare',
            merchant: 'Phuket Express Shuttle',
            category: 'TRANSPORT',
            amount: 140,
            payerId: p2
          });
        }

        fetchTrips();
        navigate(`/trip/${tripId}`);
      }
    } catch (err) {
      console.error('Seed demo error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--color-paper-cream)', minHeight: 'calc(100vh - 68px)', padding: '48px 24px' }}>
      <div style={{ maxWidth: 'var(--page-max-width)', margin: '0 auto' }}>
        
        {/* Page Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', marginBottom: '40px' }}>
          <div>
            <span className="eyebrow-label">01 / EXPEDITIONS & TRIP LEDGERS</span>
            <h1 className="deacon-display" style={{ fontSize: 'clamp(36px, 5vw, 64px)', color: 'var(--color-forest-ink)', marginTop: '8px' }}>
              MY GROUP TRIPS
            </h1>
            <p style={{ color: '#555555', fontSize: '16px', marginTop: '4px' }}>
              Double-entry debits, mid-trip prorated balances, and zero-conflict settlements
            </p>
          </div>
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <button className="btn-ghost-cream" onClick={handleQuickSeedDemo} disabled={submitting}>
              <Sparkles size={16} color="var(--color-forest-ink)" /> LOAD DEMO TRIP
            </button>
            <button className="btn-meadow" onClick={() => setShowModal(true)}>
              <Plus size={18} /> CREATE NEW TRIP
            </button>
          </div>
        </div>

        {/* Loading state */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--color-moss-gray)', fontWeight: 700 }}>
            Loading your trip ledgers...
          </div>
        ) : trips.length === 0 ? (
          /* Empty State */
          <div className="card-cream" style={{ textAlign: 'center', padding: '80px 24px', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-14px', right: '32px' }}>
              <span className="sticker-badge">GET STARTED</span>
            </div>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              backgroundColor: 'var(--color-forest-ink)',
              color: 'var(--color-meadow)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <Compass size={36} />
            </div>
            <h3 style={{ fontSize: '28px', color: 'var(--color-forest-ink)', marginBottom: '12px' }}>NO ACTIVE EXPEDITIONS YET</h3>
            <p style={{ color: '#555555', maxWidth: '500px', margin: '0 auto 28px auto', fontSize: '15px', lineHeight: 1.5 }}>
              Create your first group trip or load our pre-populated demo trip to experience transparent double-entry expense sharing and automated settlement.
            </p>
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn-meadow" onClick={() => setShowModal(true)}>
                <Plus size={18} /> CREATE FIRST TRIP
              </button>
              <button className="btn-ghost-cream" onClick={handleQuickSeedDemo}>
                <Sparkles size={16} /> LOAD DEMO TRIP
              </button>
            </div>
          </div>
        ) : (
          /* Trip Cards Grid */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '28px' }}>
            {trips.map(trip => (
              <div
                key={trip._id}
                className="card-cream"
                onClick={() => navigate(`/trip/${trip._id}`)}
                style={{
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  backgroundColor: '#f8f4ed'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'var(--color-forest-ink)';
                  e.currentTarget.style.boxShadow = '0 16px 48px rgba(18, 35, 21, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--color-sage-border)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-preview)';
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <span className={trip.status === 'active' ? 'sticker-badge' : 'sticker-badge-navy'}>
                      {trip.status.replace('_', ' ')}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-forest-ink)', backgroundColor: 'rgba(85,221,74,0.2)', padding: '4px 10px', borderRadius: '6px' }}>
                      {trip.currency || 'INR'} ₹{trip.budget?.toLocaleString() || '0'}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '26px', marginBottom: '10px', color: 'var(--color-forest-ink)', lineHeight: 0.9 }}>
                    {trip.name}
                  </h3>

                  {trip.destination && (
                    <p style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#555555', fontSize: '14px', marginBottom: '14px', fontWeight: 500 }}>
                      <MapPin size={16} color="var(--color-forest-ink)" /> {trip.destination}
                    </p>
                  )}

                  <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--color-moss-gray)', marginBottom: '20px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={14} color="var(--color-forest-ink)" />
                      {new Date(trip.start_date).toLocaleDateString()} – {new Date(trip.end_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div style={{ borderTop: '1px dashed var(--color-sage-border)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: '#555555' }}>
                    Organizer: <strong style={{ color: 'var(--color-forest-ink)' }}>{trip.organizer_id?.name || 'You'}</strong>
                  </span>
                  <span style={{ color: 'var(--color-forest-ink)', display: 'flex', alignItems: 'center', fontWeight: 800, fontSize: '13px', letterSpacing: '0.05em' }}>
                    OPEN WORKSPACE <ChevronRight size={16} color="var(--color-meadow)" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Trip Modal */}
        {showModal && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(18, 35, 21, 0.75)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: '24px'
          }}>
            <div className="card-cream" style={{ width: '100%', maxWidth: '540px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-14px', right: '24px' }}>
                <span className="sticker-badge">NEW LEDGER</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <span className="eyebrow-label">CREATE EXPEDITION</span>
                  <h3 style={{ fontSize: '28px', color: 'var(--color-forest-ink)', marginTop: '4px' }}>NEW GROUP TRIP</h3>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: 'var(--color-forest-ink)', fontWeight: 800 }}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleCreateTrip} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-forest-ink)', marginBottom: '6px' }}>
                    TRIP NAME *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Thailand Beach & Ski 2026"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '10px',
                      border: '1px solid var(--color-sage-border)',
                      backgroundColor: '#ffffff',
                      fontSize: '14px',
                      outline: 'none',
                      color: 'var(--color-forest-ink)'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-forest-ink)', marginBottom: '6px' }}>
                    DESTINATION
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Phuket, Thailand"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '10px',
                      border: '1px solid var(--color-sage-border)',
                      backgroundColor: '#ffffff',
                      fontSize: '14px',
                      outline: 'none',
                      color: 'var(--color-forest-ink)'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-forest-ink)', marginBottom: '6px' }}>
                      START DATE *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '10px',
                        border: '1px solid var(--color-sage-border)',
                        backgroundColor: '#ffffff',
                        fontSize: '13px',
                        outline: 'none',
                        color: 'var(--color-forest-ink)'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-forest-ink)', marginBottom: '6px' }}>
                      END DATE *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '10px',
                        border: '1px solid var(--color-sage-border)',
                        backgroundColor: '#ffffff',
                        fontSize: '13px',
                        outline: 'none',
                        color: 'var(--color-forest-ink)'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-forest-ink)', marginBottom: '6px' }}>
                      CURRENCY
                    </label>
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '10px',
                        border: '1px solid var(--color-sage-border)',
                        backgroundColor: '#ffffff',
                        fontSize: '13px',
                        outline: 'none',
                        color: 'var(--color-forest-ink)'
                      }}
                    >
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="THB">THB (฿)</option>
                      <option value="AUD">AUD ($)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-forest-ink)', marginBottom: '6px' }}>
                      ESTIMATED BUDGET
                    </label>
                    <input
                      type="number"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '10px',
                        border: '1px solid var(--color-sage-border)',
                        backgroundColor: '#ffffff',
                        fontSize: '13px',
                        outline: 'none',
                        color: 'var(--color-forest-ink)'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                  <button type="button" className="btn-ghost-cream" onClick={() => setShowModal(false)}>
                    CANCEL
                  </button>
                  <button type="submit" disabled={submitting} className="btn-meadow">
                    {submitting ? 'CREATING...' : 'OPEN WORKSPACE'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
