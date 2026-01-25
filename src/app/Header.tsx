'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Header({ 
  getTotalItems 
}: { 
  getTotalItems: () => number 
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();
  
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
  }, [isDropdownOpen]);

  return (
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
            <Link href="#collections">Collections</Link>
            <Link href="#reviews">Reviews</Link>
            <Link href="#contact">Contact</Link>
          </nav>
          <div className="nav-cta">
            {status === 'authenticated' ? (
              <div className="profile-dropdown">
                <div className="profile-trigger" ref={dropdownRef}>
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
                        <Link href="/profile" className="dropdown-item" onClick={(e) => { e.preventDefault(); setIsDropdownOpen(false); setTimeout(() => { window.location.href = '/profile'; }, 10); }}>
                          My Profile
                        </Link>
                        <Link href="/orders" className="dropdown-item" onClick={(e) => { e.preventDefault(); setIsDropdownOpen(false); setTimeout(() => { window.location.href = '/orders'; }, 10); }}>
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
            ) : (
              <Link href="/login">
                <button className="btn btn-ghost" type="button">
                  Log in
                </button>
              </Link>
            )}
            <Link href="/cart">
              <button className="btn btn-primary" type="button">
                Cart {getTotalItems() > 0 && `(${getTotalItems()})`}
              </button>
            </Link>
          </div>
          <button
            className="mobile-menu-toggle"
            aria-label="Toggle navigation"
            type="button"
            onClick={() => setMobileNavOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}