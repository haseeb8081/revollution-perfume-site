"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    if (!formData.email || !formData.email.includes("@")) {
      toast.error("Please enter a valid email address");
      return false;
    }
    
    if (!formData.password || formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return false;
    }
    
    if (!isLogin && (!formData.name || formData.name.trim().length < 2)) {
      toast.error("Please enter your full name");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    if (isLogin) {
      // Login
      try {
        const result = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (result?.error) {
          toast.error("Invalid credentials. Please try again.");
        } else {
          toast.success("Login successful!");
          // Add a small delay before redirect to ensure toast is seen
          setTimeout(() => {
            router.push("/");
            router.refresh();
          }, 500);
        }
      } catch (error) {
        toast.error("An error occurred during login.");
      }
    } else {
      // Register
      try {
        const response = await fetch("/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.toLowerCase().trim(),
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (data.success) {
          toast.success("Account created successfully!");
          
          // Automatically login after successful registration
          const loginResult = await signIn("credentials", {
            email: formData.email.toLowerCase().trim(),
            password: formData.password,
            redirect: false,
          });

          if (loginResult?.error) {
            // If auto-login fails, prompt manual login
            toast.success("Please login with your new credentials");
            setIsLogin(true);
            // Clear password field for security
            setFormData(prev => ({
              ...prev,
              password: ""
            }));
          } else {
            toast.success("Logged in successfully!");
            setTimeout(() => {
              router.push("/");
              router.refresh();
            }, 500);
          }
        } else {
          // More specific error messages
          if (response.status === 503) {
            toast.error("Database connection issue. Please try again in a moment.");
          } else if (response.status === 409) {
            toast.error("An account with this email already exists.");
          } else {
            toast.error(data.message || "Failed to create account. Please try again.");
          }
        }
      } catch (error) {
        toast.error("An error occurred during registration.");
      }
    }
    
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/" });
  };

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
              <Link href="/login">
                <button className="btn btn-ghost" type="button">
                  Log in
                </button>
              </Link>
              <Link href="/cart">
                <button className="btn btn-primary" type="button">
                  Cart
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* LOGIN/REGISTER SECTION */}
      <main>
        <section className="login-section">
          <div className="container">
            <div className="login-container">
              <div className="login-card">
                <div className="login-header">
                  <h1 className="login-title">
                    {isLogin ? "Welcome Back" : "Create Account"}
                  </h1>
                  <p className="login-subtitle">
                    {isLogin
                      ? "Sign in to access your account"
                      : "Join Revollution to start your fragrance journey"}
                  </p>
                </div>

                <div className="login-tabs">
                  <button
                    className={`login-tab ${isLogin ? "active" : ""}`}
                    onClick={() => setIsLogin(true)}
                  >
                    Sign In
                  </button>
                  <button
                    className={`login-tab ${!isLogin ? "active" : ""}`}
                    onClick={() => setIsLogin(false)}
                  >
                    Register
                  </button>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                  {!isLogin && (
                    <div className="form-group">
                      <label htmlFor="name" className="form-label">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="form-input"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleChange}
                        required={!isLogin}
                      />
                    </div>
                  )}

                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-input"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      className="form-input"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {isLogin && (
                    <div className="form-footer">
                      <label className="checkbox-label">
                        <input type="checkbox" />
                        <span>Remember me</span>
                      </label>
                      <Link href="#" className="forgot-link">
                        Forgot password?
                      </Link>
                    </div>
                  )}

                  <button type="submit" className="btn-submit" disabled={loading}>
                    {loading ? "Processing..." : (isLogin ? "Sign In" : "Create Account")}
                  </button>
                </form>

                <div className="login-divider">
                  <span>OR</span>
                </div>

                <div className="social-login">
                  <button className="social-btn google-btn" onClick={handleGoogleLogin}>
                    <span>Continue with Google</span>
                  </button>
                  <button className="social-btn facebook-btn">
                    <span>Continue with Facebook</span>
                  </button>
                </div>

                <p className="login-switch">
                  {isLogin ? (
                    <>
                      Don{`'`}t have an account?{" "}
                      <button
                        onClick={() => setIsLogin(false)}
                        className="switch-btn"
                      >
                        Sign up
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <button
                        onClick={() => setIsLogin(true)}
                        className="switch-btn"
                      >
                        Sign in
                      </button>
                    </>
                  )}
                </p>
              </div>
            </div>
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
