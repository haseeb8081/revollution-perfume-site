'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cartContext';

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const { getUserOrders } = useCart();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      // Fetch user orders from cart context
      const fetchOrders = async () => {
        try {
          const userOrders = await getUserOrders(session.user.email || session.user.id || '');
          setOrders(userOrders);
        } catch (error) {
          console.error('Error fetching orders:', error);
          setOrders([]);
        } finally {
          setLoading(false);
        }
      };
      
      fetchOrders();
    } else if (status === 'unauthenticated') {
      // Redirect to login if not authenticated
      window.location.href = '/login';
    }
  }, [session, status, getUserOrders]);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  });

  if (status === 'loading' || loading) {
    return (
      <div className="page">
        <div className="container" style={{ padding: '3rem 0' }}>
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="page">
        <div className="container" style={{ padding: '3rem 0' }}>
          <p>Please log in to view your orders.</p>
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
                  <button 
                    className="btn btn-ghost" 
                    type="button"
                    onClick={toggleDropdown}
                    aria-haspopup="true"
                    aria-expanded={isDropdownOpen ? 'true' : 'false'}
                  >
                    {session?.user?.image ? (
                      <img 
                        src={session.user.image} 
                        alt={session.user.name || 'Profile'} 
                        className="w-8 h-8 rounded-full mr-2"
                      />
                    ) : (
                      <span className="mr-2">{session?.user?.name?.charAt(0) || 'U'}</span>
                    )}
                    {session?.user?.name || session?.user?.email}
                  </button>
                  {isDropdownOpen && (
                    <div className="dropdown-menu">
                      <div className="dropdown-content">
                        <Link href="/profile" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                          My Profile
                        </Link>
                        <Link href="/orders" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                          My Orders
                        </Link>
                        <button
                          onClick={async () => { 
                            await signOut({ redirect: false }); 
                            window.location.reload(); 
                            setIsDropdownOpen(false);
                          }}
                          className="dropdown-item logout-btn"
                          type="button"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
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

      {/* ORDERS CONTENT */}
      <main>
        <section style={{ padding: '3rem 0' }}>
          <div className="container">
            <div className="section-header">
              <div className="section-eyebrow">Account</div>
              <h1>Your Orders</h1>
            </div>

            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                <h3>You haven{`'`}t placed any orders yet</h3>
                <p style={{ margin: '1rem 0', color: 'var(--color-text-muted)' }}>
                  Once you place an order, it will appear here.
                </p>
                <Link href="/shop">
                  <button className="btn btn-primary">Browse Products</button>
                </Link>
              </div>
            ) : (
              <div style={{ maxWidth: '800px', margin: '2rem auto' }}>
                {orders.map((order) => (
                  <div 
                    key={order.id} 
                    style={{ 
                      backgroundColor: 'white', 
                      borderRadius: 'var(--radius-lg)', 
                      padding: '1.5rem',
                      marginBottom: '1rem',
                      boxShadow: 'var(--shadow-soft)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <div>
                        <h3 style={{ margin: 0 }}>Order #{order.id}</h3>
                        <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                          Placed on {new Date(order.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div style={{ 
                        padding: '0.3rem 0.8rem', 
                        borderRadius: 'var(--radius-pill)',
                        backgroundColor: order.status === 'Delivered' ? '#e8f5e9' : '#fff3e0',
                        color: order.status === 'Delivered' ? '#2e7d32' : '#ef6c00',
                        fontWeight: '600',
                        fontSize: '0.9rem'
                      }}>
                        {order.status}
                      </div>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                      <h4 style={{ marginBottom: '0.5rem' }}>Items:</h4>
                      <ul style={{ listStyle: 'none', padding: 0 }}>
                        {order.items.map((item: any, idx: number) => (
                          <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0' }}>
                            <span>{item.quantity} × {item.name}</span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div style={{ borderTop: '1px solid #eee', paddingTop: '0.5rem', textAlign: 'right' }}>
                      <strong>Total: ${order.total.toFixed(2)}</strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}