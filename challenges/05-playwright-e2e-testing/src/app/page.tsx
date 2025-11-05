import Link from 'next/link';
import { products } from '@/lib/products';

export default function Home() {
  const featuredProducts = products.slice(0, 4);

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#2c3e50',
        color: 'white',
        padding: '1rem 2rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
          <h1 data-testid="site-logo" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            <Link href="/">TechShop</Link>
          </h1>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <Link href="/products" data-testid="nav-products" style={{ color: 'white' }}>Products</Link>
            <Link href="/cart" data-testid="nav-cart" style={{ color: 'white' }}>Cart</Link>
            <Link href="/account" data-testid="nav-account" style={{ color: 'white' }}>Account</Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '4rem 2rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 data-testid="hero-title" style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>
            Welcome to TechShop
          </h2>
          <p data-testid="hero-subtitle" style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>
            Your one-stop shop for the latest electronics and accessories
          </p>
          <Link
            href="/products"
            data-testid="hero-cta"
            style={{
              display: 'inline-block',
              backgroundColor: 'white',
              color: '#667eea',
              padding: '0.75rem 2rem',
              borderRadius: '4px',
              fontWeight: 'bold',
              fontSize: '1.1rem'
            }}
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section style={{ maxWidth: '1200px', margin: '3rem auto', padding: '0 2rem' }}>
        <h2 data-testid="featured-title" style={{ fontSize: '2rem', marginBottom: '2rem', color: '#2c3e50' }}>
          Featured Products
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '2rem'
        }}>
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              data-testid={`product-card-${product.id}`}
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '1.5rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s'
              }}
            >
              <div style={{
                width: '100%',
                height: '200px',
                backgroundColor: '#e0e0e0',
                borderRadius: '4px',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#999'
              }}>
                [Product Image]
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#2c3e50' }}>
                {product.name}
              </h3>
              <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>
                {product.description.substring(0, 60)}...
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea' }}>
                  ${product.price}
                </span>
                <Link
                  href={`/products/${product.id}`}
                  data-testid={`view-product-${product.id}`}
                  style={{
                    backgroundColor: '#667eea',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    fontSize: '0.9rem'
                  }}
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ backgroundColor: 'white', padding: '3rem 2rem', marginTop: '3rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            <div data-testid="feature-shipping" style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#2c3e50' }}>Free Shipping</h3>
              <p style={{ color: '#666' }}>On orders over $50</p>
            </div>
            <div data-testid="feature-returns" style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#2c3e50' }}>Easy Returns</h3>
              <p style={{ color: '#666' }}>30-day return policy</p>
            </div>
            <div data-testid="feature-support" style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#2c3e50' }}>24/7 Support</h3>
              <p style={{ color: '#666' }}>Always here to help</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#2c3e50',
        color: 'white',
        padding: '2rem',
        marginTop: '3rem',
        textAlign: 'center'
      }}>
        <p data-testid="footer-copyright">© 2025 TechShop. All rights reserved.</p>
      </footer>
    </div>
  );
}
