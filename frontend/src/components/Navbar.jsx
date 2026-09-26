import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, LogOut, User as UserIcon, PlusCircle, Luggage } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav style={{
      backgroundColor: 'var(--color-forest-ink)',
      color: 'var(--color-paper-cream)',
      height: '68px',
      padding: '0 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid var(--color-sage-border)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      {/* Brand Logo */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
        <div style={{
          backgroundColor: 'var(--color-meadow)',
          color: 'var(--color-forest-ink)',
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 900
        }}>
          <Compass size={22} />
        </div>
        <span style={{
          fontFamily: 'var(--font-deacon)',
          fontWeight: 900,
          fontSize: '24px',
          letterSpacing: '-0.02em',
          color: 'var(--color-paper-cream)',
          textTransform: 'uppercase'
        }}>
          TRIP<span style={{ color: 'var(--color-meadow)' }}>LEDGER</span>
        </span>
      </Link>

      {/* Nav Center Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
        <Link to="/" style={{
          color: 'var(--color-paper-cream)',
          textDecoration: 'none',
          fontSize: '13px',
          fontWeight: 600,
          letterSpacing: '0.14em',
          textTransform: 'uppercase'
        }}>
          EXPLORE
        </Link>
        <Link to="/trips" style={{
          color: 'var(--color-paper-cream)',
          textDecoration: 'none',
          fontSize: '13px',
          fontWeight: 600,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <Luggage size={15} color="var(--color-meadow)" /> MY TRIPS
        </Link>
      </div>

      {/* Right User / Auth Cluster */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {user ? (
          <>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: 'rgba(243, 237, 228, 0.08)',
              padding: '6px 14px',
              borderRadius: '9999px',
              border: '1px solid var(--color-sage-border)'
            }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-meadow)',
                color: 'var(--color-forest-ink)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '13px'
              }}>
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-paper-cream)' }}>{user.name}</span>
              <span style={{
                fontSize: '10px',
                fontWeight: 800,
                textTransform: 'uppercase',
                backgroundColor: user.role === 'member' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(85, 221, 74, 0.2)',
                color: user.role === 'member' ? '#7dd3fc' : 'var(--color-meadow)',
                border: `1px solid ${user.role === 'member' ? 'rgba(56, 189, 248, 0.4)' : 'rgba(85, 221, 74, 0.4)'}`,
                padding: '2px 6px',
                borderRadius: '9999px',
                letterSpacing: '0.05em'
              }}>
                {user.role === 'member' ? '🎒 Traveler' : '👑 Host'}
              </span>
            </div>

            <button
              onClick={() => { logout(); navigate('/'); }}
              style={{
                background: 'transparent',
                border: '1px solid var(--color-sage-border)',
                color: 'var(--color-moss-gray)',
                padding: '8px 14px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.05em'
              }}
            >
              <LogOut size={14} /> LOGOUT
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-ghost-dark" style={{ padding: '8px 18px', fontSize: '12px' }}>
              LOG IN
            </Link>
            <Link to="/register" className="btn-meadow" style={{ padding: '8px 20px', fontSize: '12px' }}>
              GET STARTED
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};
