"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cartContext";
import { useSession, signOut } from "next-auth/react";
import toast from "react-hot-toast";

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  images: Array<{ url: string; alt: string }>;
}

const dummyProducts: Product[] = [
  // Unisex Products
  {
    _id: "1",
    name: "Neon Mirage",
    slug: "neon-mirage",
    description: "A layered green-blue accord that reads different on everyone — truly unisex, undeniably modern.",
    price: 92,
    category: "unisex",
    images: [{ url: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=600&fit=crop", alt: "Neon Mirage" }]
  },
  {
    _id: "2",
    name: "Emerald Dawn",
    slug: "emerald-dawn",
    description: "A bright, green opening with citrus and white florals. Perfect for everyday confidence.",
    price: 89,
    category: "unisex",
    images: [{ url: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=600&h=600&fit=crop", alt: "Emerald Dawn" }]
  },
  {
    _id: "3",
    name: "Azure Ember",
    slug: "azure-ember",
    description: "Smokey woods, blue iris, and a hint of spice. Built for nights that go beyond the plan.",
    price: 95,
    category: "unisex",
    images: [{ url: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&h=600&fit=crop", alt: "Azure Ember" }]
  },
  // Women Products
  {
    _id: "4",
    name: "Velvet Cascade",
    slug: "velvet-cascade",
    description: "A luxurious floral-green blend with velvety rose and soft moss. Elegant and refined.",
    price: 98,
    category: "women",
    images: [{ url: "https://images.unsplash.com/photo-1528662768781-e34ec5440e89?w=600&h=600&fit=crop", alt: "Velvet Cascade" }]
  },
  {
    _id: "5",
    name: "Rose Harmony",
    slug: "rose-harmony",
    description: "Delicate rose petals meet fresh green notes. A feminine masterpiece for the modern woman.",
    price: 94,
    category: "women",
    images: [{ url: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&h=600&fit=crop", alt: "Rose Harmony" }]
  },
  {
    _id: "6",
    name: "Jasmine Dream",
    slug: "jasmine-dream",
    description: "Exotic jasmine with hints of vanilla. A dreamy, romantic scent for special occasions.",
    price: 96,
    category: "women",
    images: [{ url: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600&h=600&fit=crop", alt: "Jasmine Dream" }]
  },
  // Men Products
  {
    _id: "7",
    name: "Midnight Fern",
    slug: "midnight-fern",
    description: "A bold, masculine scent with aromatic fern and dark woods. Perfect for confident men.",
    price: 88,
    category: "men",
    images: [{ url: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&h=600&fit=crop", alt: "Midnight Fern" }]
  },
  {
    _id: "8",
    name: "Ocean Drift",
    slug: "ocean-drift",
    description: "Fresh aquatic notes with cedarwood. A crisp, clean scent for the adventurous man.",
    price: 90,
    category: "men",
    images: [{ url: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=600&h=600&fit=crop", alt: "Ocean Drift" }]
  },
  {
    _id: "9",
    name: "Leather & Smoke",
    slug: "leather-smoke",
    description: "Rich leather with smoky undertones. Bold, powerful, and unforgettable.",
    price: 99,
    category: "men",
    images: [{ url: "https://images.unsplash.com/photo-1588405748879-acb68d5ae02e?w=600&h=600&fit=crop", alt: "Leather & Smoke" }]
  },
];

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>(dummyProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(dummyProducts);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const { addToCart, getTotalItems } = useCart();
  const { data: session, status } = useSession();

  useEffect(() => {
    // Filter products based on category
    if (filter === "") {
      setFilteredProducts(dummyProducts);
    } else {
      setFilteredProducts(dummyProducts.filter(p => p.category === filter));
    }
  }, [filter]);

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
              <Link href="/#story">Our Story</Link>
              <Link href="/#reviews">Reviews</Link>
              <Link href="/#contact">Contact</Link>
            </nav>
            <div className="nav-cta">
              {status === 'authenticated' ? (
                <div className="profile-dropdown">
                  <div className="profile-trigger">
                    <button className="btn btn-ghost" type="button">
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
                    <div className="dropdown-menu">
                      <div className="dropdown-content">
                        <Link href="/profile" className="dropdown-item">
                          My Profile
                        </Link>
                        <Link href="/orders" className="dropdown-item">
                          My Orders
                        </Link>
                        <button 
                          onClick={async () => { await signOut({ redirect: false }); window.location.reload(); }}
                          className="dropdown-item logout-btn"
                          type="button"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
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
          </div>
        </div>
      </header>

      {/* SHOP SECTION */}
      <main>
        <section style={{ paddingTop: "3rem", paddingBottom: "3rem" }}>
          <div className="container">
            <div className="section-header">
              <div className="section-eyebrow">Shop All</div>
              <h1 className="section-title">Discover Your Signature Scent</h1>
              <p className="section-description">
                Browse our full collection of green & blue inspired perfumes.
              </p>
            </div>

            {/* Filters */}
            <div style={{ marginBottom: "2rem", display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
              <button
                className={`btn ${filter === "" ? "btn-primary" : "btn-ghost"}`}
                onClick={() => setFilter("")}
              >
                All
              </button>
              <button
                className={`btn ${filter === "women" ? "btn-primary" : "btn-ghost"}`}
                onClick={() => setFilter("women")}
              >
                Women
              </button>
              <button
                className={`btn ${filter === "men" ? "btn-primary" : "btn-ghost"}`}
                onClick={() => setFilter("men")}
              >
                Men
              </button>
              <button
                className={`btn ${filter === "unisex" ? "btn-primary" : "btn-ghost"}`}
                onClick={() => setFilter("unisex")}
              >
                Unisex
              </button>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div style={{ textAlign: "center", padding: "3rem" }}>
                <p>Loading products...</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="card-grid">
                {filteredProducts.map((product) => (
                  <article key={product._id} className="card">
                    <div className="card-image-wrapper">
                      <img
                        src={product.images[0]?.url || "/placeholder.jpg"}
                        alt={product.images[0]?.alt || product.name}
                        className="card-image"
                      />
                    </div>
                    <div className="card-content">
                      <div className="card-label">{product.category}</div>
                      <h3 className="card-title">{product.name}</h3>
                      <p className="card-body">
                        {product.description.substring(0, 100)}...
                      </p>
                      <div className="card-meta">
                        <span className="pill">${product.price}</span>
                        <button
                          className="btn-add-to-cart"
                          onClick={() => {
                            addToCart({
                              _id: product._id,
                              name: product.name,
                              price: product.price,
                              image: product.images[0]?.url || "",
                              category: product.category,
                            });
                            toast.success(`${product.name} added to cart!`);
                          }}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "3rem" }}>
                <p>No products found. Check back soon!</p>
                <Link href="/">
                  <button className="btn btn-primary" style={{ marginTop: "1rem" }}>
                    Return Home
                  </button>
                </Link>
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
