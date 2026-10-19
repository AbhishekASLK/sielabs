"use client";
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

export default function Home() {
  const [userName, setUserName] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUserName(null);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    setUserName(localStorage.getItem('user'));
    setMounted(true);
    const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.1 });
    els.forEach(el => obs.observe(el));

    document.querySelectorAll('.pr-merged-tag[data-github-user]').forEach(tag => {
      const tagElement = tag as HTMLElement;
      const user = tagElement.dataset.githubUser;
      const textEl = tagElement.querySelector('.pr-count-text');
      if(textEl) {
        fetch(`https://api.github.com/search/issues?q=is:pr+is:merged+author:${user}+repo:tobymao/sqlglot&per_page=1`)
          .then(res => res.json())
          .then(data => {
            if (data.total_count !== undefined) {
              textEl.textContent = `${data.total_count} PRs Merged`;
            }
          })
          .catch(() => { });
      }
    });

    // Mobile nav toggle
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const handleNav = () => document.getElementById('navLinks')?.classList.toggle('show');
    hamburgerBtn?.addEventListener('click', handleNav);

    // Review toggles
    const handleReadMore = (e: Event) => {
      const target = e.target as HTMLElement;
      const expandedId = target.id.replace('reviewToggle', 'reviewExpanded');
      document.getElementById(expandedId)?.classList.toggle('show');
      target.textContent = target.textContent?.trim() === 'Read full review →' ? 'Show less ↑' : 'Read full review →';
    };
    const readMoreBtns = document.querySelectorAll('.review-read-more');
    readMoreBtns.forEach(btn => btn.addEventListener('click', handleReadMore));

    // See more toggle
    const seeMoreBtn = document.getElementById('seeMoreReviewsBtn');
    const handleSeeMore = (e: Event) => {
      document.getElementById('reviewCard4')?.classList.toggle('review-hidden');
      document.getElementById('reviewCard5')?.classList.toggle('review-hidden');
      const target = e.target as HTMLElement;
      target.textContent = target.textContent?.trim() === 'See more reviews ↓' ? 'Show less ↑' : 'See more reviews ↓';
    };
    seeMoreBtn?.addEventListener('click', handleSeeMore);

    return () => {
      hamburgerBtn?.removeEventListener('click', handleNav);
      readMoreBtns.forEach(btn => btn.removeEventListener('click', handleReadMore));
      seeMoreBtn?.removeEventListener('click', handleSeeMore);
    };
  }, []);

  return (
    <>
      

  <header>
    <div className="container">
      <nav aria-label="Main navigation">
        <a href="/" className="nav-brand">
          <img src="favicon.ico" alt="SieLabs Logo" className="nav-logo"
            style={{"width":"30px","height":"30px","objectFit":"contain","borderRadius":"4px","display":"block"}} />
          SieLabs
        </a>
        <div className={`nav-links ${isNavOpen ? 'show' : ''}`} id="navLinks">
          <a href="/programs/index.html" onClick={() => setIsNavOpen(false)}>Programs</a>
          <a href="/products/index.html" onClick={() => setIsNavOpen(false)}>Products</a>
          <a href="/careers/index.html" onClick={() => setIsNavOpen(false)}>Careers</a>
          <a href="https://chat.whatsapp.com/FhMDzQ9D6oVJ7E9WT21Xw6?s=cl&p=a&ilr=1" target="_blank" rel="noreferrer"
            className="nav-cta nav-cta-community mobile-cta" style={{"display":"flex","alignItems":"center","gap":"6px"}}
            onClick={() => setIsNavOpen(false)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M17.472 14.382c-.301-.15-1.777-.878-2.053-.978-.276-.1-.477-.15-.677.15-.2.3-.776.978-.952 1.178-.175.2-.351.225-.651.075-.3-.15-1.265-.466-2.41-1.487-.893-.796-1.496-1.78-1.671-2.08-.175-.3-.019-.462.13-.611.135-.134.301-.35.451-.525.15-.176.201-.301.301-.5.1-.2.05-.376-.025-.526-.075-.15-.677-1.632-.927-2.232-.244-.583-.493-.504-.677-.514-.175-.01-.376-.01-.576-.01-.2 0-.525.075-.8.375-.276.3-1.053 1.029-1.053 2.509 0 1.48 1.077 2.908 1.227 3.109.15.2 2.119 3.235 5.134 4.536.717.31 1.277.495 1.713.633.72.228 1.376.195 1.895.118.578-.086 1.777-.726 2.027-1.428.25-.7.25-1.3.175-1.428-.075-.128-.276-.228-.576-.378z" />
              <path
                d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.986-1.308A9.948 9.948 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.734 0-3.344-.462-4.737-1.268l-.34-.196-2.955.775.789-2.883-.217-.345A7.954 7.954 0 014 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8z" />
            </svg>
            Join Community
          </a>

          {/* Mobile Menu Auth Section */}
          <div className="mobile-menu-auth">
            {!mounted ? (
              <div style={{ height: "44px", borderRadius: "10px", background: "rgba(154, 123, 26, 0.08)" }} />
            ) : userName ? (
              <div className="mobile-user-box">
                <Link
                  href="/profile"
                  onClick={() => setIsNavOpen(false)}
                  className="mobile-user-link"
                >
                  <div className="mobile-user-avatar">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div className="mobile-user-name">{userName}</div>
                    <div className="mobile-user-sub">User Profile →</div>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    handleLogout();
                    setIsNavOpen(false);
                  }}
                  className="mobile-logout-btn"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  <span>Log out</span>
                </button>
              </div>
            ) : (
              <div className="mobile-auth-guest">
                <Link
                  href="/login"
                  onClick={() => setIsNavOpen(false)}
                  className="nav-auth-btn nav-auth-btn--ghost"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setIsNavOpen(false)}
                  className="nav-auth-btn nav-auth-btn--primary"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
        <div className="nav-actions">
          <a href="https://chat.whatsapp.com/FhMDzQ9D6oVJ7E9WT21Xw6?s=cl&p=a&ilr=1" target="_blank" rel="noreferrer"
            className="nav-cta nav-cta-community desktop-cta" style={{"display":"flex","alignItems":"center","gap":"6px","marginLeft":0}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M17.472 14.382c-.301-.15-1.777-.878-2.053-.978-.276-.1-.477-.15-.677.15-.2.3-.776.978-.952 1.178-.175.2-.351.225-.651.075-.3-.15-1.265-.466-2.41-1.487-.893-.796-1.496-1.78-1.671-2.08-.175-.3-.019-.462.13-.611.135-.134.301-.35.451-.525.15-.176.201-.301.301-.5.1-.2.05-.376-.025-.526-.075-.15-.677-1.632-.927-2.232-.244-.583-.493-.504-.677-.514-.175-.01-.376-.01-.576-.01-.2 0-.525.075-.8.375-.276.3-1.053 1.029-1.053 2.509 0 1.48 1.077 2.908 1.227 3.109.15.2 2.119 3.235 5.134 4.536.717.31 1.277.495 1.713.633.72.228 1.376.195 1.895.118.578-.086 1.777-.726 2.027-1.428.25-.7.25-1.3.175-1.428-.075-.128-.276-.228-.576-.378z" />
              <path
                d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.986-1.308A9.948 9.948 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.734 0-3.344-.462-4.737-1.268l-.34-.196-2.955.775.789-2.883-.217-.345A7.954 7.954 0 014 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8z" />
            </svg>
            Join Community
          </a>
          {userName ? (
            <div ref={dropdownRef} style={{ position: "relative" }}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                aria-label="User profile menu"
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(154, 123, 26, 0.12)",
                  border: isDropdownOpen ? "2px solid #9A7B1A" : "1.5px solid rgba(154, 123, 26, 0.35)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#9A7B1A",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                  transition: "all 0.2s ease",
                  outline: "none",
                  fontWeight: 700,
                  fontSize: "15px",
                }}
              >
                {userName.charAt(0).toUpperCase()}
              </button>

              {isDropdownOpen && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "calc(100% + 10px)",
                    width: "240px",
                    backgroundColor: "#FFFFFF",
                    borderRadius: "16px",
                    boxShadow: "0 14px 40px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.04)",
                    border: "1px solid rgba(0, 0, 0, 0.08)",
                    padding: "8px",
                    zIndex: 9999,
                  }}
                  role="menu"
                >
                  {/* User Profile Header Card (Clickable to Profile Page) */}
                  <Link
                    href="/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px 12px",
                      backgroundColor: "#FAFAF8",
                      borderRadius: "12px",
                      border: "1px solid rgba(0, 0, 0, 0.06)",
                      marginBottom: "6px",
                      textDecoration: "none",
                      cursor: "pointer",
                      transition: "background 0.15s, border-color 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(154, 123, 26, 0.08)";
                      e.currentTarget.style.borderColor = "rgba(154, 123, 26, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#FAFAF8";
                      e.currentTarget.style.borderColor = "rgba(0, 0, 0, 0.06)";
                    }}
                    title="Click to view Profile"
                  >
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        backgroundColor: "rgba(154, 123, 26, 0.15)",
                        color: "#9A7B1A",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: "14px",
                        flexShrink: 0,
                        border: "1px solid rgba(154, 123, 26, 0.3)",
                      }}
                    >
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "#1A1A1A",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {userName}
                      </p>
                      <p
                        style={{
                          margin: "2px 0 0",
                          fontSize: "11px",
                          color: "#9A7B1A",
                          fontWeight: 600,
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <span>User Profile</span>
                        <span>→</span>
                      </p>
                    </div>
                  </Link>

                  <div style={{ height: "1px", backgroundColor: "rgba(0, 0, 0, 0.06)", margin: "4px 0" }} />

                  {/* My Profile Item */}
                  <Link
                    href="/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px 12px",
                      borderRadius: "10px",
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "#1A1A1A",
                      textDecoration: "none",
                      transition: "background 0.15s, color 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(154, 123, 26, 0.08)";
                      e.currentTarget.style.color = "#9A7B1A";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#1A1A1A";
                    }}
                    role="menuitem"
                  >
                    <div
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "8px",
                        backgroundColor: "rgba(154, 123, 26, 0.1)",
                        color: "#9A7B1A",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                    <span>My Profile</span>
                  </Link>

                  <div style={{ height: "1px", backgroundColor: "rgba(0, 0, 0, 0.06)", margin: "4px 0" }} />

                  {/* My Courses Item */}
                  <a
                    href="programs/index.html"
                    onClick={() => setIsDropdownOpen(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px 12px",
                      borderRadius: "10px",
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "#1A1A1A",
                      textDecoration: "none",
                      transition: "background 0.15s, color 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(154, 123, 26, 0.08)";
                      e.currentTarget.style.color = "#9A7B1A";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#1A1A1A";
                    }}
                    role="menuitem"
                  >
                    <div
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "8px",
                        backgroundColor: "rgba(154, 123, 26, 0.1)",
                        color: "#9A7B1A",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                        <path d="M6 12v5c3 3 9 3 12 0v-5" />
                      </svg>
                    </div>
                    <span>My Courses</span>
                  </a>

                  <div style={{ height: "1px", backgroundColor: "rgba(0, 0, 0, 0.06)", margin: "4px 0" }} />

                  {/* Logout Item */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px 12px",
                      borderRadius: "10px",
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "#DC2626",
                      backgroundColor: "transparent",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                      fontFamily: "inherit",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(220, 38, 38, 0.08)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                    role="menuitem"
                  >
                    <div
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "8px",
                        backgroundColor: "rgba(220, 38, 38, 0.1)",
                        color: "#DC2626",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                    </div>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="nav-auth-group">
              <Link href="/login" className="nav-auth-btn nav-auth-btn--ghost">Log in</Link>
              <Link href="/signup" className="nav-auth-btn nav-auth-btn--primary">Sign up</Link>
            </div>
          )}
          <button
            type="button"
            className={`hamburger-btn ${isNavOpen ? 'is-active' : ''}`}
            onClick={() => setIsNavOpen(prev => !prev)}
            aria-label={isNavOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isNavOpen}
          >
            {isNavOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            )}
          </button>
        </div>
      </nav>
    </div>
  </header>

  <div className="container">
    <div className="hero" id="top" style={{"position":"relative"}}>
        
        <div style={{"position":"absolute","inset":"-40px 0 0 0","overflow":"hidden","zIndex":"0","pointerEvents":"none"}}>
          
          <svg
            style={{"position":"absolute","top":"15%","left":"5%","width":"180px","height":"180px","color":"var(--gold)","opacity":"0.15","transform":"rotate(-10deg)"}}
            viewBox="0 0 128 128" fill="currentColor">
            <path d="M63.666 4.037c-16.79 0-26.697 6.452-26.697 18.735v11.838h27.355v3.633H22.956C8.847 38.243 0 47.962 0 63.818c0 15.688 9.539 25.132 23.636 25.132h8.047v-12.01c0-12.283 10.37-22.13 22.653-22.13h27.42v-3.635H41.517v-15.14c0-7.382 6.002-13.385 13.384-13.385h36.143c7.382 0 13.384 6.003 13.384 13.385v5.337h15.424V22.772c0-12.283-10.222-18.735-26.696-18.735H63.666zM50.15 13.064c3.486 0 6.31 2.825 6.31 6.31 0 3.486-2.824 6.311-6.31 6.311a6.312 6.312 0 0 1-6.31-6.31c0-3.486 2.824-6.311 6.31-6.311zm44.204 28.532v12.01c0 12.283-10.37 22.13-22.653 22.13H44.281v3.635h40.239v15.14c0 7.382-6.002 13.384-13.384 13.384H34.993c-7.382 0-13.384-6.002-13.384-13.384v-5.337H6.185v15.613c0 12.283 10.222 18.735 26.696 18.735h29.49c16.79 0 26.697-6.452 26.697-18.735v-11.838H61.643v-3.633h41.368c14.11 0 22.956-9.72 22.956-25.576 0-15.688-9.539-25.132-23.636-25.132h-8.047zM77.85 114.936c-3.486 0-6.31-2.825-6.31-6.31 0-3.486 2.824-6.311 6.31-6.311a6.312 6.312 0 0 1 6.31 6.31c0 3.486-2.824 6.312-6.31 6.312z"/>
          </svg>
          
          <svg
            style={{"position":"absolute","top":"35%","right":"2%","width":"280px","height":"280px","color":"var(--text)","opacity":"0.10","transform":"rotate(10deg)"}}
            viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
          
          <svg
            style={{"position":"absolute","bottom":"5%","left":"45%","width":"120px","height":"120px","color":"var(--gold)","opacity":"0.12","transform":"rotate(-5deg)"}}
            viewBox="0 0 24 24" fill="currentColor">
            <path d="M21.886 5.536A11.959 11.959 0 0 1 24 12.015c0 6.627-5.373 12-12 12s-12-5.373-12-12 5.373-12 12-12c2.22 0 4.305.606 6.09 1.664L21.886 5.536zm-3.572.91L12.012 12.75l-2.218-2.218-1.768 1.768 3.986 3.986 8.07-8.07L16.314 6.446zM12 2c-5.514 0-10 4.486-10 10s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2z" />
          </svg>
          
          <svg
            style={{"position":"absolute","top":"-5%","left":"40%","width":"140px","height":"140px","color":"var(--text)","opacity":"0.08","transform":"rotate(15deg)"}}
            viewBox="0 0 128 128" fill="currentColor">
            <path
              d="M125.7 58L69.8 2.3c-3-3-8-3-11 0L42.5 18.6l17.6 17.6c3.4-1.3 7.5-.4 10 2.2 2.8 2.8 3.6 7 2.1 10.5l14.7 14.7c3.5-1.5 7.7-.6 10.5 2.1 3.6 3.6 3.6 9.4 0 13-3.6 3.6-9.4 3.6-13 0-2.8-2.8-3.7-7-2.1-10.5L67.6 53.6v23.2c1.5 3.5.6 7.7-2.1 10.5-3.6 3.6-9.4 3.6-13 0-3.6-3.6-3.6-9.4 0-13 2.8-2.8 7-3.7 10.5-2.1V49.1c-3.5-1.5-7.7-.6-10.5 2.1-2.4 2.4-3.4 6-2.4 9.1L32 42.1 2.3 71.8c-3 3-3 8 0 11l55.8 55.8c3 3 8 3 11 0l56.5-56.5c3.2-3 3.2-8 .1-11.1z" />
          </svg>
        </div>
        <div className="hero-left reveal" style={{"position":"relative","zIndex":"1"}}>
          <p className="eyebrow">Python with Machine Learning</p>
          <h1>Master Python and <em>Machine Learning</em>.</h1>
          <p className="hero-desc">
            A 4-month practical program to master Python programming, data science, and build production-ready Machine Learning models from scratch. Only 25 seats available.
          </p>
          <div className="hero-actions">
            <a href="programs/python-ml/index.html" className="btn-primary">View Curriculum →</a>
            <a href="#programs-lab" className="btn-secondary">Learn More</a>
          </div>
        </div>

        <div className="hero-image-right reveal"
          style={{"transitionDelay":"0.15s","display":"flex","alignItems":"center","justifyContent":"center","position":"relative","zIndex":"1"}}>
          <div style={{"position":"relative","width":"100%","maxWidth":"500px"}}>
            <div
              style={{"position":"absolute","inset":"-4px","background":"linear-gradient(135deg, var(--gold-light), transparent)","filter":"blur(20px)","opacity":"0.3","borderRadius":"20px"}}>
            </div>
            <img src="programs/python-ml/python_ml_thumbnail.png" alt="Python with Machine Learning Program"
              style={{"width":"100%","borderRadius":"16px","boxShadow":"0 24px 48px rgba(0,0,0,0.08)","border":"1px solid var(--border)","transform":"rotate(1.5deg)","transition":"transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease"}}
              
               />
          </div>
        </div>
      </div>
    </div>

  <hr className="section-divider" />

  <main>

    
    <section className="section-pad" id="company">
      <div className="container">
        <div className="section-head reveal">
          <div>
            <p className="eyebrow">Company Overview</p>
            <h2>We make technical complexity easier to adopt, teach, and scale.</h2>
          </div>
          <p className="section-desc">
            SieLabs operates at the intersection of product design, developer enablement, and applied education. Our
            work turns difficult concepts into usable systems, clear workflows, and products teams can trust.
          </p>
        </div>

        <div className="cap-grid reveal">
          <div className="cap-card">
            <span className="cap-kicker">Product Strategy</span>
            <h3>Sharp ideas into credible software.</h3>
            <p>From concept shaping to launch-ready interfaces — built to be clear in positioning and useful in
              practice.</p>
          </div>
          <div className="cap-card">
            <span className="cap-kicker">Applied Learning</span>
            <h3>Teaching systems close to real work.</h3>
            <p>Our learning products emphasize understanding, retention, and hands-on interaction over passive theory
              delivery.</p>
          </div>
          <div className="cap-card">
            <span className="cap-kicker">Studio Approach</span>
            <h3>Clarity, elegant systems, fast iteration.</h3>
            <p>Every project communicates value quickly while supporting the depth serious users need over time.</p>
          </div>
        </div>
      </div>
    </section>



    
    <section className="section-pad reviews-section" id="student-reviews">
      <div className="container">
        <div className="section-head reveal">
          <div>
            <p className="eyebrow">Student Reviews</p>
            <h2>Hear from those who've walked the path.</h2>
          </div>
          <p className="section-desc">
            Real stories from students who built the reverse engineering mindset and made meaningful open-source
            contributions through SieLabs programs.
          </p>
        </div>

        <div className="reviews-masonry reveal">

            
            <div className="review-card-compact">
                <svg className="review-quote-sm" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M9.135 5.015C5.242 6.584 3 9.58 3 13.203v5.782h5.782v-5.782H5.27c0-2.076 1.475-3.98 3.865-4.842L9.135 5.015zM18.865 5.015c-3.893 1.569-6.135 4.565-6.135 8.188v5.782h5.782v-5.782h-3.513c0-2.076 1.475-3.98 3.866-4.842L18.865 5.015z" />
                </svg>
                <p className="review-quote-text">
                  Being part of SieLabs' Open Source Lab was a turning point for me. Before joining, open source felt
                  intimidating — large codebases, strict review processes, and the fear of making mistakes. SieLabs
                  completely changed that by teaching me the <strong>reverse engineering mindset</strong>.
                </p>
                <div className="review-expanded" id="reviewExpanded1">
                  <p className="review-quote-text">
                    Contributing to <strong>SQLGlot</strong> pushed me out of my comfort zone in the best way possible.
                    I learned how to navigate a complex codebase, write meaningful tests, and iterate on feedback from
                    experienced maintainers. Each pull request was a lesson in writing cleaner, more thoughtful code.
                  </p>
                  <p className="review-quote-text">
                    What makes SieLabs special is the emphasis on understanding <strong>why</strong> things work, not
                    just how. The mentorship helped me develop a deeper approach to problem-solving that goes far beyond
                    any single project or language.
                  </p>
                  <p className="review-quote-text" style={{"marginBottom":"0"}}>
                    I'm grateful for the experience and the confidence it gave me. SieLabs is the perfect place for
                    anyone who wants to make <strong>real contributions to open source</strong> and grow as a developer.
                  </p>
                </div>
                <button className="review-read-more" id="reviewToggle1"
                  >Read
                  full review →</button>
                <div className="review-author-compact">
                  <img src="/assets/students/deepika_kakde.jpeg" alt="Deepika Kakade" className="review-avatar-sm"
                    loading="lazy" />
                  <div>
                    <span className="review-name-sm">Deepika Kakade</span>
                    <span className="review-role-sm">Open Source Lab Student</span>
                  </div>
                  <a href="https://github.com/tobymao/sqlglot/pulls?q=is%3Apr+is%3Aclosed+author%3Adeepika-kakde"
                    target="_blank" rel="noreferrer" className="pr-merged-tag" data-github-user="deepika-kakde">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                      <path
                        d="M5.45 5.154A4.25 4.25 0 0 0 9.25 7.5h1.378a2.251 2.251 0 1 1 0 1.5H9.25A5.734 5.734 0 0 1 5 7.123v3.505a2.25 2.25 0 1 1-1.5 0V5.372a2.25 2.25 0 1 1 1.95-.218zM4.25 13.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5zm8-9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5zm0 4a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5zM3.5 3.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0z" />
                    </svg>
                    <span className="pr-count-text">PRs Merged</span>
                  </a>
                </div>
            </div>

            
            <div className="review-card-compact">
                <svg className="review-quote-sm" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M9.135 5.015C5.242 6.584 3 9.58 3 13.203v5.782h5.782v-5.782H5.27c0-2.076 1.475-3.98 3.865-4.842L9.135 5.015zM18.865 5.015c-3.893 1.569-6.135 4.565-6.135 8.188v5.782h5.782v-5.782h-3.513c0-2.076 1.475-3.98 3.866-4.842L18.865 5.015z" />
                </svg>
                <p className="review-quote-text">
                  I've been connected with SieLabs through their Open Source Lab, and the experience has been incredibly
                  rewarding. What stood out to me wasn't just learning Git or contributing to open source — it was
                  developing
                  a <strong>systematic approach to understanding large codebases</strong> and solving real-world
                  problems.
                </p>
                <div className="review-expanded" id="reviewExpanded2">
                  <p className="review-quote-text">
                    Working on the SQLGlot project gave me hands-on experience with production-quality code, code
                    reviews,
                    debugging, writing tests, and collaborating with maintainers. During the program, I successfully got
                    <strong>10 pull requests merged</strong>, which was a huge milestone for me and significantly
                    boosted
                    my confidence as a developer.
                  </p>
                  <p className="review-quote-text">
                    One of the things I appreciated most was the mentorship. Every review comment became a learning
                    opportunity. Instead of simply fixing issues, I learned how to think about edge cases, write better
                    tests, understand maintainable code, and follow industry-standard development workflows.
                  </p>
                  <p className="review-quote-text">
                    Looking back, SieLabs was much more than a technical training program. It helped me develop
                    problem-solving skills, patience, and the confidence to contribute to real open-source projects. The
                    knowledge and experience I gained here will continue to help me throughout my software engineering
                    journey.
                  </p>
                  <p className="review-quote-text" style={{"marginBottom":"0"}}>
                    I'm grateful to the mentors and the entire SieLabs community for their guidance and support. I would
                    highly recommend SieLabs to anyone who wants to gain practical software development experience and
                    make
                    meaningful <strong>open-source contributions</strong>.
                  </p>
                </div>
                <button className="review-read-more" id="reviewToggle2"
                  >Read
                  full review →</button>
                <div className="review-author-compact">
                  <img src="/assets/students/piya.jpeg" alt="Piya Daswadkar" className="review-avatar-sm" loading="lazy" />
                  <div>
                    <span className="review-name-sm">Piya Daswadkar</span>
                    <span className="review-role-sm">Open Source Lab Student</span>
                  </div>
                  <a href="https://github.com/tobymao/sqlglot/pulls?q=is%3Apr+is%3Amerged+author%3APiyaDaswadkar"
                    target="_blank" rel="noreferrer" className="pr-merged-tag" data-github-user="PiyaDaswadkar">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                      <path
                        d="M5.45 5.154A4.25 4.25 0 0 0 9.25 7.5h1.378a2.251 2.251 0 1 1 0 1.5H9.25A5.734 5.734 0 0 1 5 7.123v3.505a2.25 2.25 0 1 1-1.5 0V5.372a2.25 2.25 0 1 1 1.95-.218zM4.25 13.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5zm8-9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5zm0 4a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5zM3.5 3.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0z" />
                    </svg>
                    <span className="pr-count-text">PRs Merged</span>
                  </a>
                </div>
            </div>

            
            <div className="review-card-compact">
                <svg className="review-quote-sm" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M9.135 5.015C5.242 6.584 3 9.58 3 13.203v5.782h5.782v-5.782H5.27c0-2.076 1.475-3.98 3.865-4.842L9.135 5.015zM18.865 5.015c-3.893 1.569-6.135 4.565-6.135 8.188v5.782h5.782v-5.782h-3.513c0-2.076 1.475-3.98 3.866-4.842L18.865 5.015z" />
                </svg>
                <p className="review-quote-text">
                  My experience with SieLabs has been extremely valuable. Through SieLabs, I gained practical exposure
                  to
                  <strong>open-source development</strong>, Git, GitHub workflows, and contributing to real-world
                  projects
                  like SQLGlot.
                </p>
                <div className="review-expanded" id="reviewExpanded3">
                  <p className="review-quote-text">
                    Working on actual issues, receiving code reviews, and collaborating with developers helped me
                    improve
                    both my technical and problem-solving skills. SieLabs encouraged me to understand concepts deeply
                    rather
                    than simply completing tasks.
                  </p>
                  <p className="review-quote-text">
                    The hands-on learning approach and real-world experience significantly increased my confidence as a
                    developer. I also developed better <strong>debugging, testing, and code-reading skills</strong>
                    while
                    working on production-level projects.
                  </p>
                  <p className="review-quote-text" style={{"marginBottom":"0"}}>
                    The knowledge and experience I gained at SieLabs will continue to help me throughout my software
                    development journey. I am truly grateful to SieLabs for providing such an excellent platform for
                    learning, growth, and <strong>continuous improvement</strong>.
                  </p>
                </div>
                <button className="review-read-more" id="reviewToggle3"
                  >Read
                  full review →</button>
                <div className="review-author-compact">
                  <img src="/assets/students/vaishnavi.jpeg" alt="Vaishnavi Polekar" className="review-avatar-sm"
                    loading="lazy" />
                  <div>
                    <span className="review-name-sm">Vaishnavi Polekar</span>
                    <span className="review-role-sm">Open Source Lab Student</span>
                  </div>
                  <a href="https://github.com/tobymao/sqlglot/pulls?q=is%3Apr+is%3Amerged+author%3Avaishnavi-polekar"
                    target="_blank" rel="noreferrer" className="pr-merged-tag" data-github-user="vaishnavi-polekar">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                      <path
                        d="M5.45 5.154A4.25 4.25 0 0 0 9.25 7.5h1.378a2.251 2.251 0 1 1 0 1.5H9.25A5.734 5.734 0 0 1 5 7.123v3.505a2.25 2.25 0 1 1-1.5 0V5.372a2.25 2.25 0 1 1 1.95-.218zM4.25 13.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5zm8-9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5zm0 4a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5zM3.5 3.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0z" />
                    </svg>
                    <span className="pr-count-text">PRs Merged</span>
                  </a>
                </div>
            </div>

            
            <div className="review-card-compact review-hidden" id="reviewCard4">
                <svg className="review-quote-sm" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M9.135 5.015C5.242 6.584 3 9.58 3 13.203v5.782h5.782v-5.782H5.27c0-2.076 1.475-3.98 3.865-4.842L9.135 5.015zM18.865 5.015c-3.893 1.569-6.135 4.565-6.135 8.188v5.782h5.782v-5.782h-3.513c0-2.076 1.475-3.98 3.866-4.842L18.865 5.015z" />
                </svg>
                <p className="review-quote-text">
                  I've been connected with SieLabs for the past 2 years now. What SieLabs really gave me wasn't just
                  technical knowledge, it was an approach and a <strong>reverse engineering mindset</strong>.
                </p>
                <div className="review-expanded" id="reviewExpanded4">
                  <p className="review-quote-text">
                    In their latest Open Source batch, I was able to contribute to <strong>sqlglot</strong>, a
                    real-world
                    open-source project. Within the first 15 days of the batch, I managed to get <strong>4 pull requests
                      merged</strong>, something I wouldn't have thought possible without the foundation SieLabs built
                    in
                    me. Diving into a large, unfamiliar codebase and actually making meaningful contributions that fast
                    really showed me how far the reverse engineering mindset can take you.
                  </p>
                  <p className="review-quote-text">
                    Looking back, I realize SieLabs was never about teaching "a language" or running "a course," it's
                    about building the right mindset. Once you have that mindset, the tools and languages become
                    secondary;
                    you can pick up anything, and more importantly, contribute to anything.
                  </p>
                  <p className="review-quote-text" style={{"marginBottom":"0"}}>
                    Grateful for the guidance and the community. Highly recommend SieLabs to anyone who wants to
                    actually
                    <strong>think like an engineer</strong>, not just learn syntax.
                  </p>
                </div>
                <button className="review-read-more" id="reviewToggle4"
                  >Read
                  full review →</button>
                <div className="review-author-compact">
                  <img src="/assets/students/vish.jpeg" alt="Vishvambhar Ranoshe" className="review-avatar-sm"
                    loading="lazy" />
                  <div>
                    <span className="review-name-sm">Vishvambhar Ranoshe</span>
                    <span className="review-role-sm">Open Source Lab Student</span>
                  </div>
                  <a href="https://github.com/tobymao/sqlglot/pulls?q=is%3Apr+is%3Amerged+author%3Avishvambhar-ranoshe"
                    target="_blank" rel="noreferrer" className="pr-merged-tag" data-github-user="vishvambhar-ranoshe">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                      <path
                        d="M5.45 5.154A4.25 4.25 0 0 0 9.25 7.5h1.378a2.251 2.251 0 1 1 0 1.5H9.25A5.734 5.734 0 0 1 5 7.123v3.505a2.25 2.25 0 1 1-1.5 0V5.372a2.25 2.25 0 1 1 1.95-.218zM4.25 13.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5zm8-9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5zm0 4a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5zM3.5 3.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0z" />
                    </svg>
                    <span className="pr-count-text">PRs Merged</span>
                  </a>
                </div>
            </div>

            
            <div className="review-card-compact review-hidden" id="reviewCard5">
                <svg className="review-quote-sm" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M9.135 5.015C5.242 6.584 3 9.58 3 13.203v5.782h5.782v-5.782H5.27c0-2.076 1.475-3.98 3.865-4.842L9.135 5.015zM18.865 5.015c-3.893 1.569-6.135 4.565-6.135 8.188v5.782h5.782v-5.782h-3.513c0-2.076 1.475-3.98 3.866-4.842L18.865 5.015z" />
                </svg>
                <p className="review-quote-text">
                  SieLabs helped me bridge the gap between theoretical knowledge and practical software engineering. 
                  The <strong>reverse engineering mindset</strong> taught here is invaluable.
                </p>
                <div className="review-expanded" id="reviewExpanded5">
                  <p className="review-quote-text">
                    Through the Open Source Lab, I learned how to navigate large, complex codebases and write production-quality code. The mentorship provided is exceptional, focusing on understanding the 'why' behind every technical decision.
                  </p>
                  <p className="review-quote-text" style={{"marginBottom":"0"}}>
                    I highly recommend SieLabs to anyone looking to make real open-source contributions and grow as a developer.
                  </p>
                </div>
                <button className="review-read-more" id="reviewToggle5"
                  >Read
                  full review →</button>
                <div className="review-author-compact">
                  <img src="/assets/students/anuja.jpeg" alt="Anuja" className="review-avatar-sm"
                    loading="lazy" />
                  <div>
                    <span className="review-name-sm">Anuja</span>
                    <span className="review-role-sm">Open Source Lab Student</span>
                  </div>
                  <a href="https://github.com/tobymao/sqlglot/pulls?q=is%3Apr+state%3Aclosed+author%3AAnuja006"
                    target="_blank" rel="noreferrer" className="pr-merged-tag" data-github-user="Anuja006">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                      <path
                        d="M5.45 5.154A4.25 4.25 0 0 0 9.25 7.5h1.378a2.251 2.251 0 1 1 0 1.5H9.25A5.734 5.734 0 0 1 5 7.123v3.505a2.25 2.25 0 1 1-1.5 0V5.372a2.25 2.25 0 1 1 1.95-.218zM4.25 13.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5zm8-9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5zm0 4a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5zM3.5 3.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0z" />
                    </svg>
                    <span className="pr-count-text">PRs Merged</span>
                  </a>
                </div>
            </div>

        </div>

        <div style={{"textAlign":"center","marginTop":"32px"}}>
          <button className="review-see-more-btn" id="seeMoreReviewsBtn" >
            See more reviews ↓
          </button>
        </div>

      </div>
    </section>



  </main>

  <footer>
    <div className="container">
      <div className="footer-grid">
        <div className="footer-brand-col">
          <a href="#top" className="footer-brand">
            <img src="favicon.ico" alt="SieLabs Logo" className="nav-logo"
              style={{"width":"24px","height":"24px","objectFit":"contain","borderRadius":"4px"}} />
            SieLabs
          </a>
          <p className="footer-tagline">Building modern software, open-source tools, and high-impact engineering programs.
          </p>
          <div className="footer-address">
            <p>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="var(--gold)" stroke="var(--gold)"
                strokeWidth="1.5">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"></path>
                <circle cx="12" cy="9" r="2.5" fill="white"></circle>
              </svg>
              EuroKids PreSchool Near Maratha Hotel in Narhe, Pune
            </p>
          </div>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Navigation</h4>
          <nav className="footer-links" aria-label="Footer navigation">
            <a href="programs/index.html">Programs</a>
            <a href="products/index.html">Products</a>
            <a href="careers/index.html">Careers</a>
          </nav>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Social</h4>
          <div className="footer-social">
            <a href="https://www.youtube.com/@sielabs" target="_blank" rel="noreferrer" aria-label="YouTube">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.501 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.377.55 9.377.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              YouTube
            </a>
            <a href="https://www.instagram.com/sielabs" target="_blank" rel="noreferrer" aria-label="Instagram">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
              Instagram
            </a>
            <a href="https://chat.whatsapp.com/FhMDzQ9D6oVJ7E9WT21Xw6?s=cl&p=a&ilr=1" target="_blank" rel="noreferrer"
              aria-label="WhatsApp Community">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M17.472 14.382c-.301-.15-1.777-.878-2.053-.978-.276-.1-.477-.15-.677.15-.2.3-.776.978-.952 1.178-.175.2-.351.225-.651.075-.3-.15-1.265-.466-2.41-1.487-.893-.796-1.496-1.78-1.671-2.08-.175-.3-.019-.462.13-.611.135-.134.301-.35.451-.525.15-.176.201-.301.301-.5.1-.2.05-.376-.025-.526-.075-.15-.677-1.632-.927-2.232-.244-.583-.493-.504-.677-.514-.175-.01-.376-.01-.576-.01-.2 0-.525.075-.8.375-.276.3-1.053 1.029-1.053 2.509 0 1.48 1.077 2.908 1.227 3.109.15.2 2.119 3.235 5.134 4.536.717.31 1.277.495 1.713.633.72.228 1.376.195 1.895.118.578-.086 1.777-.726 2.027-1.428.25-.7.25-1.3.175-1.428-.075-.128-.276-.228-.576-.378z" />
                <path
                  d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.986-1.308A9.948 9.948 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.734 0-3.344-.462-4.737-1.268l-.34-.196-2.955.775.789-2.883-.217-.345A7.954 7.954 0 014 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8z" />
              </svg>
              Community
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 SieLabs. All rights reserved.</p>
      </div>
    </div>
  </footer>

  

    </>
  );
}

