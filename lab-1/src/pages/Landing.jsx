import { useNavigate } from 'react-router-dom'
import './Landing.css'

function Landing() {
  const navigate = useNavigate()

  return (
    <div className="landing">
      {/* Navbar */}
      <nav className="landing-nav">
        <span className="landing-logo">TenantTrails</span>
        <div className="landing-nav-actions">
          <button className="btn-ghost" onClick={() => navigate('/login')}>Sign In</button>
          <button className="btn-primary" onClick={() => navigate('/login')}>Get Started</button>
        </div>
      </nav>

      {/* Hero */}
      <section className="landing-hero">
        <span className="hero-badge">Launching in Halifax, Nova Scotia</span>
        <h1 className="hero-headline">
          Know what you're signing<br />before you sign it.
        </h1>
        <p className="hero-sub">
          Read honest reviews from past tenants. See AI-generated summaries.<br />
          Make informed decisions about where you live.
        </p>
        <div className="hero-cta">
          <button className="btn-primary btn-lg" onClick={() => navigate('/login')}>Create Free Account</button>
          <button className="btn-outline btn-lg" onClick={() => navigate('/login')}>Sign In</button>
        </div>

        {/* Feature row */}
        <div className="hero-features">
          <div className="feature-item">
            <span className="feature-icon">⭐</span>
            <strong>Verified Reviews</strong>
            <p>Real ratings with photos and videos from past tenants.</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🤖</span>
            <strong>AI Summaries</strong>
            <p>Key issues and sentiment extracted from every review.</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">💬</span>
            <strong>Ask Questions</strong>
            <p>Comment on reviews and get answers from past tenants.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Landing
