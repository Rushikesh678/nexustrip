import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, User, Mail, KeyRound, ArrowRight } from 'lucide-react';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    venmo_handle: '',
    upi_id: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await register(formData);
      if (res.success) {
        navigate('/trips');
      } else {
        setError(res.message || 'Registration failed.');
      }
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 68px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--color-paper-cream)',
      padding: '40px 24px',
      position: 'relative'
    }}>
      <div className="card-cream" style={{ width: '100%', maxWidth: '500px', position: 'relative' }}>
        
        {/* Sticker Badge */}
        <div style={{ position: 'absolute', top: '-14px', right: '24px' }}>
          <span className="sticker-badge">NEW EXPLORER PASS</span>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '14px',
            backgroundColor: 'var(--color-forest-ink)',
            color: 'var(--color-meadow)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            boxShadow: '0 4px 14px rgba(18, 35, 21, 0.2)'
          }}>
            <Compass size={30} />
          </div>
          <span className="eyebrow-label" style={{ display: 'block', marginBottom: '6px' }}>01 / REGISTRATION</span>
          <h2 style={{ fontSize: '36px', color: 'var(--color-forest-ink)', letterSpacing: '-0.02em' }}>
            CREATE EXPEDITION ACCOUNT
          </h2>
          <p style={{ color: '#555555', fontSize: '14px', marginTop: '6px' }}>
            Join TripLedger for effortless group expense settlements
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            color: '#b91c1c',
            padding: '12px 16px',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: 600,
            marginBottom: '20px',
            border: '1px solid #fca5a5'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-forest-ink)', marginBottom: '6px' }}>
              FULL NAME
            </label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-sage-border)' }} />
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Alex Morgan"
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  borderRadius: '10px',
                  border: '1px solid var(--color-sage-border)',
                  backgroundColor: '#ffffff',
                  fontSize: '14px',
                  outline: 'none',
                  color: 'var(--color-forest-ink)'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-forest-ink)', marginBottom: '6px' }}>
              EMAIL ADDRESS
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-sage-border)' }} />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="alex@tripledger.com"
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  borderRadius: '10px',
                  border: '1px solid var(--color-sage-border)',
                  backgroundColor: '#ffffff',
                  fontSize: '14px',
                  outline: 'none',
                  color: 'var(--color-forest-ink)'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-forest-ink)', marginBottom: '6px' }}>
              PASSWORD
            </label>
            <div style={{ position: 'relative' }}>
              <KeyRound size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-sage-border)' }} />
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  borderRadius: '10px',
                  border: '1px solid var(--color-sage-border)',
                  backgroundColor: '#ffffff',
                  fontSize: '14px',
                  outline: 'none',
                  color: 'var(--color-forest-ink)'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-forest-ink)', marginBottom: '6px' }}>
                VENMO HANDLE (OPTIONAL)
              </label>
              <input
                type="text"
                name="venmo_handle"
                value={formData.venmo_handle}
                onChange={handleChange}
                placeholder="@alex_morgan"
                style={{
                  width: '100%',
                  padding: '10px 12px',
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
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-forest-ink)', marginBottom: '6px' }}>
                UPI ID (OPTIONAL)
              </label>
              <input
                type="text"
                name="upi_id"
                value={formData.upi_id}
                onChange={handleChange}
                placeholder="alex@upi"
                style={{
                  width: '100%',
                  padding: '10px 12px',
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

          <button type="submit" disabled={loading} className="btn-meadow" style={{ justifyContent: 'center', padding: '14px', fontSize: '14px', marginTop: '8px' }}>
            {loading ? 'CREATING ACCOUNT...' : 'GET STARTED FREE'} <ArrowRight size={18} />
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '14px', color: '#555555', marginTop: '24px' }}>
          Already registered? <Link to="/login" style={{ color: 'var(--color-forest-ink)', fontWeight: 800, textDecoration: 'underline' }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
};
