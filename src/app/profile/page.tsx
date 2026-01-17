'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      // Use the session data directly
      setUserData(session.user);
      setLoading(false);
    } else if (status === 'unauthenticated') {
      // Redirect to login if not authenticated
      window.location.href = '/login';
    }
  }, [session, status]);

  if (status === 'loading' || loading) {
    return (
      <div className="page">
        <div className="container" style={{ padding: '3rem 0' }}>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="page">
        <div className="container" style={{ padding: '3rem 0' }}>
          <p>Please log in to view your profile.</p>
          <Link href="/login">
            <button className="btn btn-primary">Log In</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      {/* NAVBAR */}
      <header className="navbar">
        <div className="container">
          <div className="navbar-inner">
            <Link href="/" className="brand">
              <div className="brand-mark">R</div>
              <div>
                <div className="brand-text-main">Revollution</div>
                <div className="brand-text-sub">Signature Perfume House</div>
              </div>
            </Link>
            <nav className="nav-links">
              <Link href="/">Home</Link>
              <Link href="/shop">Shop</Link>
              <Link href="/#collections">Collections</Link>
              <Link href="/#reviews">Reviews</Link>
              <Link href="/#contact">Contact</Link>
            </nav>
            <div className="nav-cta">
              <div className="profile-dropdown">
                <div className="profile-trigger">
                  <button className="btn btn-ghost" type="button">
                    {userData.image ? (
                      <img 
                        src={userData.image} 
                        alt={userData.name || 'Profile'} 
                        className="w-8 h-8 rounded-full mr-2"
                      />
                    ) : (
                      <span className="mr-2">{userData.name?.charAt(0) || 'U'}</span>
                    )}
                    {userData.name || userData.email}
                  </button>
                  <div className="dropdown-menu">
                    <div className="dropdown-content">
                      <Link href="/profile" className="dropdown-item">
                        My Profile
                      </Link>
                      <Link href="/orders" className="dropdown-item">
                        My Orders
                      </Link>
                      <button 
                        onClick={async () => {
                          await signOut({ redirect: false });
                          window.location.reload();
                        }}
                        className="dropdown-item logout-btn"
                        type="button"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <Link href="/cart">
                <button className="btn btn-primary" type="button">
                  Cart
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* PROFILE CONTENT */}
      <main>
        <section style={{ padding: '3rem 0' }}>
          <div className="container">
            <div className="section-header">
              <div className="section-eyebrow">Account</div>
              <h1>Your Profile</h1>
            </div>

            <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
              <div style={{ 
                backgroundColor: 'white', 
                borderRadius: 'var(--radius-lg)', 
                padding: '2rem',
                boxShadow: 'var(--shadow-soft)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
                  {userData.image ? (
                    <img 
                      src={userData.image} 
                      alt={userData.name || 'Profile'} 
                      style={{ 
                        width: '80px', 
                        height: '80px', 
                        borderRadius: '50%', 
                        marginRight: '1rem' 
                      }}
                    />
                  ) : (
                    <div style={{ 
                      width: '80px', 
                      height: '80px', 
                      borderRadius: '50%', 
                      backgroundColor: '#0b1f3b', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      color: 'white',
                      fontSize: '1.5rem',
                      marginRight: '1rem'
                    }}>
                      {userData.name?.charAt(0) || 'U'}
                    </div>
                  )}
                  <div>
                    <h2 style={{ margin: 0, fontSize: '1.5rem' }}>{userData.name || 'User'}</h2>
                    <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>{userData.email}</p>
                  </div>
                </div>

                <div style={{ marginTop: '1.5rem' }}>
                  <h3 style={{ marginBottom: '1rem' }}>Account Information</h3>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Name</label>
                    <p style={{ padding: '0.5rem 0' }}>{userData.name || 'Not provided'}</p>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Email</label>
                    <p style={{ padding: '0.5rem 0' }}>{userData.email || 'Not provided'}</p>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Joined</label>
                    <p style={{ padding: '0.5rem 0' }}>
                      {userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'Unknown'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}