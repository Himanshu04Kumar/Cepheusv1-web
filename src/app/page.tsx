// @ts-nocheck
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={menuOpen ? 'menu-active' : ''}>

      {/* CLEAN NAVBAR WITH BOOK NOW & HAMBURGER PAIRED */}
      <nav className="navbar">
          <div className="nav-container">
              <div className="logo">
                  <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                      <span className="logo-text">CEPHEUS</span>
                  </Link>
              </div>
              <div className="nav-actions">
                  <ThemeToggle />
                  <Link href="/book" className="btn btn-primary btn-nav-accent">Book Now</Link>
                  <button className={`menu-trigger ${menuOpen ? 'is-active' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation menu">
                      <span className="hamburger-line"></span>
                      <span className="hamburger-line"></span>
                      <span className="hamburger-line"></span>
                  </button>
              </div>
          </div>
      </nav>

      {/* SIDE-VIEW NAVIGATION DRAWER PANELS */}
      <div className={`nav-overlay ${menuOpen ? 'menu-active' : ''}`} onClick={(e) => e.target.classList.contains('nav-overlay') && setMenuOpen(false)}>
          <div className="drawer-panel" role="dialog" aria-modal="true" aria-label="Site navigation">
              <div className="overlay-header">
                  <span className="drawer-title-text">MENU</span>
                  <button className="close-trigger" onClick={() => setMenuOpen(false)} aria-label="Close navigation menu">&times;</button>
              </div>
              <div className="overlay-content-grid">
                  <div className="overlay-nav-group">
                      <span className="group-label">Services</span>
                      <Link href="/book" className="overlay-link" onClick={() => setMenuOpen(false)}>Book a Repair</Link>
                      <Link href="/track" className="overlay-link" onClick={() => setMenuOpen(false)}>Track Your Repair</Link>
                  </div>
                  <div className="overlay-nav-group">
                      <span className="group-label">Partnerships</span>
                      <Link href="/institutional" className="overlay-link" onClick={() => setMenuOpen(false)}>Institutional Solutions</Link>
                  </div>
                  <div className="overlay-nav-group">
                      <span className="group-label">Resources</span>
                      <Link href="/faq" className="overlay-link" onClick={() => setMenuOpen(false)}>FAQs</Link>
                      <Link href="/warranty" className="overlay-link" onClick={() => setMenuOpen(false)}>Warranty Policy</Link>
                  </div>
                  <div className="overlay-nav-group">
                      <span className="group-label">About Us</span>
                      <Link href="/story" className="overlay-link" onClick={() => setMenuOpen(false)}>Our Story</Link>
                  </div>
                  <div className="overlay-nav-group">
                      <span className="group-label">Support</span>
                      <Link href="mailto:cepheusdtu@gmail.com" className="overlay-link">Get in Touch</Link>
                  </div>
                  <div className="overlay-nav-group">
                      <span className="group-label">Coming Soon</span>
                      <Link href="/nox-labs" className="overlay-link" onClick={() => setMenuOpen(false)}>NOX Labs</Link>
                      <Link href="/nox-compute" className="overlay-link" onClick={() => setMenuOpen(false)}>NOX Compute</Link>
                  </div>
                  <div className="overlay-nav-group status-footer-group">
                      <div className="status-pill-inline">
                          <span className="status-indicator-dot"></span>
                          Fully Live Across Delhi
                      </div>
                  </div>
              </div>
          </div>
      </div>

      {/* TWO-COLUMN HERO INTERFACE */}
      <header className="hero-split-container">
          <div className="hero-text-col">
              <h1 className="hero-title">Fix your device.<br /><span className="gradient-text">Without the anxiety.</span></h1>
              <p className="hero-micro-subtitle">Guaranteed 24-Hour Turnaround • Absolute Data Privacy • Fully Active Across Delhi</p>
              <div className="micro-pillars">
                  <span className="pillar-tag"><span className="check-icon">✓</span> Doorstep Inspection</span>
                  <span className="pillar-tag"><span class="check-icon">✓</span> Verified Parts</span>
                  <span className="pillar-tag"><span class="check-icon">✓</span> Live Tracking Log</span>
                  <span className="pillar-tag"><span class="check-icon">✓</span> Your Data Stays Yours</span>
                  <span className="pillar-tag"><span class="check-icon">✓</span> No Fix, No Fee</span>
                  <span className="pillar-tag"><span class="check-icon">✓</span> Upto 1Y Warranty</span>
              </div>
              <div className="hero-actions">
                  <Link href="/book" className="btn btn-primary btn-lg">Book a Repair</Link>
                  <Link href="/track" className="btn btn-outline btn-lg">Track Your Repair</Link>
              </div>
          </div>
          <div className="hero-preview-col">
              <div className="portal-mockup-wrapper">
                  <div className="portal-mockup">
                      <div className="mockup-header">
                          <span className="mockup-dot"></span>
                          <span className="mockup-dot"></span>
                          <span className="mockup-dot"></span>
                          <span className="mockup-title">cepheus-tracking-portal</span>
                      </div>
                      <div className="mockup-body">
                          <div className="mockup-status-row">
                              <span className="status-label">ACTIVE REPAIR:</span>
                              <span className="status-value active-glow">DIAGNOSTIC VIEW</span>
                          </div>
                          <div className="mockup-timeline">
                              <div className="timeline-item done">
                                  <div className="time-dot"></div>
                                  <div className="time-content">
                                      <span className="time-title">01 / Secure Intake Logged</span>
                                      <span className="time-meta">Verified at door • Complete</span>
                                  </div>
                              </div>
                              <div className="timeline-item active">
                                  <div className="time-dot"></div>
                                  <div className="time-content">
                                      <span className="time-title">02 / Live Component Diagnosis</span>
                                      <span className="time-meta">Teardown analysis in progress</span>
                                  </div>
                              </div>
                          </div>
                          <div className="mockup-data-card">
                              <div className="card-data-row">
                                  <span className="data-key">ESTIMATED TIME:</span>
                                  <span className="data-val">24 Hours</span>
                              </div>
                              <div className="card-data-row">
                                  <span className="data-key">PARTS STATUS:</span>
                                  <span className="data-val highlight">PENDING PRE-APPROVAL</span>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div className="ecosystem-capsule">
                      <span className="capsule-badge">Now Live</span>
                      <span className="capsule-text">Computers & Laptops</span>
                      <span className="capsule-separator">•</span>
                      <span className="capsule-text muted">Expanding to new categories soon</span>
                  </div>
              </div>
          </div>
      </header>

      {/* WORKFLOW STREAM */}
      <main className="workflow-section">
          <div className="section-header">
              <h2 className="section-title">How Do We Work?</h2>
              <p className="section-subtitle">Simple. Fast. Reliable.</p>
          </div>
          <div className="workflow-card">
              <div className="stream-container">
                  <div className="stream-step">
                      <div className="step-number">01</div>
                      <h3 className="step-title">Book a Repair</h3>
                      <p className="step-text">Choose a convenient pickup slot from your home or campus.</p>
                  </div>
                  <div className="stream-arrow"></div>
                  <div className="stream-step">
                      <div className="step-number">02</div>
                      <h3 className="step-title">Doorstep Inspection</h3>
                      <p className="step-text">We verify basic device conditions at your door and log it live into our tracker.</p>
                  </div>
                  <div className="stream-arrow"></div>
                  <div className="stream-step">
                      <div className="step-number">03</div>
                      <h3 className="step-title">Live Diagnosis</h3>
                      <p className="step-text">Review itemized costs and approve the fix at your <Link href="/track" className="step-link">Tracking Portal</Link>.</p>
                  </div>
                  <div className="stream-arrow"></div>
                  <div className="stream-step">
                      <div className="step-number">04</div>
                      <h3 className="step-title">Documented Fix</h3>
                      <p className="step-text">Watch your repair unfold with live photos and certified parts verification.</p>
                  </div>
                  <div className="stream-arrow"></div>
                  <div className="stream-step">
                      <div className="step-number">05</div>
                      <h3 className="step-title">Secure Return</h3>
                      <p className="step-text">Safe delivery with up to 1-year warranty and total data privacy.</p>
                  </div>
              </div>
          </div>
          <div className="institutional-brief-box">
              <div className="institutional-brief-copy">
                  <h4 className="institutional-brief-title">Managing devices for a school, college, or office?</h4>
                  <p className="institutional-brief-text">We provide dedicated frameworks for institutional clients—featuring itemized audit trails, pre-approved pricing lists, and consolidated monthly invoicing without fixed commitments.</p>
              </div>
              <div>
                  <Link href="/institutional" className="btn btn-outline">Explore Enterprise Solutions &rarr;</Link>
              </div>
          </div>
      </main>

      {/* FOOTER ARCHITECTURE */}
      <footer className="footer">
          <div className="footer-container">
              <div className="footer-brand-col">
                  <span className="logo-text">CEPHEUS</span>
                  <p className="footer-tagline">Trust, at Infrastructure Scale.</p>
                  <p className="footer-tagline-sub">Your device data is yours. We never sell or share it.</p>
              </div>
              <div className="footer-links-grid">
                  <div className="footer-col">
                      <h5 className="footer-col-title">Operations</h5>
                      <Link href="/book" className="footer-link">Book a Repair</Link>
                      <Link href="/track" className="footer-link">Track Your Repair</Link>
                      <Link href="/institutional" className="footer-link">Institutional Solutions</Link>
                  </div>
                  <div className="footer-col">
                      <h5 className="footer-col-title">Ecosystem</h5>
                      <Link href="/nox-labs" className="footer-link">NOX Labs</Link>
                      <Link href="/nox-compute" className="footer-link">NOX Compute</Link>
                  </div>
                  <div className="footer-col">
                      <h5 className="footer-col-title">Framework</h5>
                      <Link href="/privacy" className="footer-link">Privacy Policy</Link>
                      <Link href="/terms" className="footer-link">Terms of Service</Link>
                      <Link href="/audit" className="footer-link">Audit Guidelines</Link>
                  </div>
                  <div className="footer-col full-width-connect">
                      <h5 className="footer-col-title">Connect</h5>
                      <div className="social-links-row">
                          <Link href="https://www.instagram.com/cepheus_ecpt/" target="_blank" rel="noopener" className="social-icon-btn" aria-label="Instagram">
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                          </Link>
                          <Link href="https://www.linkedin.com/company/cepheus-co-in/about/?viewAsMember=true" target="_blank" rel="noopener" className="social-icon-btn" aria-label="LinkedIn">
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                          </Link>
                          <Link href="mailto:cepheusdtu@gmail.com" className="social-icon-btn" aria-label="Email">
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                          </Link>
                      </div>
                  </div>
              </div>
          </div>
          <div className="footer-bottom">
              <div className="footer-bottom-container">
                  <p className="copyright-text">&copy; 2026 Cepheus. All rights reserved.</p>
              </div>
          </div>
      </footer>
    </div>
  );
}
