"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cartContext";
import { useSession, signOut } from "next-auth/react";
import toast from "react-hot-toast";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const { data: session, status } = useSession();
  const [showCheckout, setShowCheckout] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const { placeOrder, getUserOrders } = useCart();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // If user is logged in, use their session info combined with form data
      if (status === 'authenticated' && session?.user?.email) {
        // Enhance form data with session user info if not provided
        const customerInfo = {
          name: formData.name || session.user.name || 'Customer',
          email: session.user.email,
          phone: formData.phone || '',
          address: formData.address || 'N/A',
          city: formData.city || 'N/A',
          postalCode: formData.postalCode || 'N/A',
        };
        
        // Place order using the API directly
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customerInfo,
            items: cart,
            totalAmount: getTotalPrice(),
          }),
        });

        const data = await response.json();

        if (data.success) {
          toast.success("Order confirmed! Check your email for details.");
          setOrderNumber(data.data.orderNumber);
          setOrderSubmitted(true);

          // Clear cart after successful order
          setTimeout(() => {
            clearCart();
            setShowCheckout(false);
            setOrderSubmitted(false);
            setFormData({
              name: "",
              email: "",
              phone: "",
              address: "",
              city: "",
              postalCode: "",
            });
          }, 5000);
        } else {
          toast.error(data.message || "Failed to place order. Please try again.");
        }
      } else {
        // For non-authenticated users, use form data
        const response = await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerInfo: formData,
            items: cart,
            totalAmount: getTotalPrice(),
          }),
        });

        const data = await response.json();

        if (data.success) {
          toast.success("Order confirmed! Check your email for details.");
          setOrderNumber(data.data.orderNumber);
          setOrderSubmitted(true);

          // Clear cart after successful order
          setTimeout(() => {
            clearCart();
            setShowCheckout(false);
            setOrderSubmitted(false);
            setFormData({
              name: "",
              email: "",
              phone: "",
              address: "",
              city: "",
              postalCode: "",
            });
          }, 5000);
        } else {
          toast.error(data.message || "Failed to place order. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };


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
              {status === 'authenticated' ? (
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
              ) : (
                <Link href="/login">
                  <button className="btn btn-ghost" type="button">
                    Log in
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* CART SECTION */}
      <main>
        <section className="cart-section">
          <div className="container">
            <div className="cart-header">
              <h1 className="cart-title">Shopping Cart</h1>
              <p className="cart-subtitle">
                {cart.length === 0
                  ? "Your cart is empty"
                  : `${cart.length} item${cart.length > 1 ? "s" : ""} in your cart`}
              </p>
            </div>

            {cart.length === 0 ? (
              <div className="empty-cart">
                <p>No items in your cart yet.</p>
                <Link href="/shop">
                  <button className="btn btn-primary">Continue Shopping</button>
                </Link>
              </div>
            ) : (
              <div className="cart-layout">
                {/* CART ITEMS */}
                <div className="cart-items-section">
                  <div className="cart-items">
                    {cart.map((item) => (
                      <div key={item._id} className="cart-item">
                        <div className="cart-item-image">
                          <img src={item.image} alt={item.name} />
                        </div>
                        <div className="cart-item-details">
                          <h3 className="cart-item-name">{item.name}</h3>
                          <p className="cart-item-category">{item.category}</p>
                          <p className="cart-item-price">${item.price}</p>
                        </div>
                        <div className="cart-item-actions">
                          <div className="quantity-controls">
                            <button
                              className="qty-btn"
                              onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            >
                              −
                            </button>
                            <span className="qty-display">{item.quantity}</span>
                            <button
                              className="qty-btn"
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                          <p className="cart-item-subtotal">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          <button
                            className="btn-remove"
                            onClick={() => removeFromCart(item._id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CART SUMMARY & CHECKOUT FORM */}
                <div className="cart-summary-section">
                  <div className="cart-summary">
                    <h2 className="summary-title">Order Summary</h2>
                    <div className="summary-row">
                      <span>Subtotal:</span>
                      <span>${getTotalPrice().toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                      <span>Shipping:</span>
                      <span>Free</span>
                    </div>
                    <div className="summary-total">
                      <span>Total:</span>
                      <span>${getTotalPrice().toFixed(2)}</span>
                    </div>

                    {!showCheckout ? (
                      <button
                        className="btn-checkout"
                        onClick={() => setShowCheckout(true)}
                      >
                        Proceed to Checkout
                      </button>
                    ) : null}
                  </div>

                  {/* CHECKOUT FORM */}
                  {showCheckout && (
                    <div className="checkout-form-container">
                      <h2 className="checkout-title">Checkout Details</h2>
                      {orderSubmitted ? (
                        <div className="order-success">
                          <h3>✓ Order Confirmed!</h3>
                          <p className="order-number">Order #: {orderNumber}</p>
                          <p>Thank you for your order! We{`'`}ve sent a confirmation email to <strong>{formData.email}</strong> with all the details.</p>
                          <p style={{ marginTop: '15px', fontSize: '0.9rem', color: '#5f6b85' }}>Redirecting you back to shop...</p>
                        </div>
                      ) : (
                        <form className="checkout-form" onSubmit={handleSubmit}>
                          <div className="form-group">
                            <label htmlFor="name" className="form-label">
                              Full Name *
                            </label>
                            <input
                              type="text"
                              id="name"
                              name="name"
                              className="form-input"
                              placeholder="John Doe"
                              value={formData.name}
                              onChange={handleChange}
                              required
                            />
                          </div>

                          <div className="form-group">
                            <label htmlFor="email" className="form-label">
                              Email Address *
                            </label>
                            <input
                              type="email"
                              id="email"
                              name="email"
                              className="form-input"
                              placeholder="john@example.com"
                              value={formData.email}
                              onChange={handleChange}
                              required
                            />
                          </div>

                          <div className="form-group">
                            <label htmlFor="phone" className="form-label">
                              Phone Number *
                            </label>
                            <input
                              type="tel"
                              id="phone"
                              name="phone"
                              className="form-input"
                              placeholder="+1 (555) 123-4567"
                              value={formData.phone}
                              onChange={handleChange}
                              required
                            />
                          </div>

                          <div className="form-group">
                            <label htmlFor="address" className="form-label">
                              Street Address *
                            </label>
                            <textarea
                              id="address"
                              name="address"
                              className="form-input form-textarea"
                              placeholder="123 Main Street, Apt 4B"
                              value={formData.address}
                              onChange={handleChange}
                              rows={3}
                              required
                            />
                          </div>

                          <div className="form-row">
                            <div className="form-group">
                              <label htmlFor="city" className="form-label">
                                City *
                              </label>
                              <input
                                type="text"
                                id="city"
                                name="city"
                                className="form-input"
                                placeholder="New York"
                                value={formData.city}
                                onChange={handleChange}
                                required
                              />
                            </div>

                            <div className="form-group">
                              <label htmlFor="postalCode" className="form-label">
                                Postal Code *
                              </label>
                              <input
                                type="text"
                                id="postalCode"
                                name="postalCode"
                                className="form-input"
                                placeholder="10001"
                                value={formData.postalCode}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </div>

                          <button type="submit" className="btn-confirm-order" disabled={submitting}>
                            {submitting ? "Processing..." : `Confirm Order - $${getTotalPrice().toFixed(2)}`}
                          </button>
                        </form>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer-inner">
            <p>© {new Date().getFullYear()} Revollution. All rights reserved.</p>
            <div className="footer-links">
              <Link href="/#story">About</Link>
              <Link href="/shop">Shop</Link>
              <Link href="/#contact">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
