"use client";
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { getUserAvatarUrl, DiceBearStyle } from '@/lib/avatar';
import InquiryModal from '@/components/InquiryModal';

function playPopSound() {
  try {
    // 1. Try DOM preloaded audio or create Audio instance
    const audioEl = (document.getElementById('siePopAudioTag') as HTMLAudioElement) || new Audio('/assets/pop.wav');
    audioEl.volume = 0.85;
    audioEl.currentTime = 0;
    const playPromise = audioEl.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // Successfully played!
        })
        .catch(() => {
          // If browser blocked immediate autoplay, play as soon as user touches/clicks/scrolls
          const playOnGesture = () => {
            try {
              const retryAudio = (document.getElementById('siePopAudioTag') as HTMLAudioElement) || new Audio('/assets/pop.wav');
              retryAudio.volume = 0.85;
              retryAudio.currentTime = 0;
              retryAudio.play().catch(() => playWebAudioPop());
            } catch {
              playWebAudioPop();
            }
            window.removeEventListener('click', playOnGesture);
            window.removeEventListener('keydown', playOnGesture);
            window.removeEventListener('scroll', playOnGesture);
            window.removeEventListener('touchstart', playOnGesture);
          };

          window.addEventListener('click', playOnGesture, { once: true });
          window.addEventListener('keydown', playOnGesture, { once: true });
          window.addEventListener('scroll', playOnGesture, { passive: true, once: true });
          window.addEventListener('touchstart', playOnGesture, { passive: true, once: true });

          // Also attempt Web Audio synthesizer
          playWebAudioPop();
        });
    }
  } catch {
    playWebAudioPop();
  }
}

function playWebAudioPop() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const triggerTones = () => {
      const now = ctx.currentTime;
      // Tone 1: Warm chirp (E5 659Hz -> A5 880Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659, now);
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.08);
      gain1.gain.setValueAtTime(0.3, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.22);

      // Tone 2: Harmonic ring (1320Hz)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880, now + 0.06);
      osc2.frequency.exponentialRampToValueAtTime(1320, now + 0.16);
      gain2.gain.setValueAtTime(0.001, now);
      gain2.gain.setValueAtTime(0.2, now + 0.06);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.06);
      osc2.stop(now + 0.35);
    };

    if (ctx.state === 'suspended') {
      ctx.resume().then(triggerTones).catch(() => {});
    } else {
      triggerTones();
    }
  } catch {
    // Audio blocked
  }
}

export default function Home() {
  const [userName, setUserName] = useState<string | null>(null);
  const [avatarStyle, setAvatarStyle] = useState<DiceBearStyle>('fun-emoji');
  const [avatarSeed, setAvatarSeed] = useState<string>('');
  const [mounted, setMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [showNudge, setShowNudge] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

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
      // Ctrl+K or Cmd+K to focus search input like Claude Academy
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchInputRef.current?.focus();
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
    let triggered = false;

    const showAndPlay = () => {
      if (triggered) return;
      triggered = true;
      setShowNudge(true);
      playPopSound();
      cleanup();
    };

    const handleFirstGesture = () => {
      showAndPlay();
    };

    const cleanup = () => {
      window.removeEventListener('scroll', handleFirstGesture);
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
      window.removeEventListener('mousemove', handleFirstGesture);
    };

    // Listen for initial user gesture (unlocks audio policy immediately)
    window.addEventListener('scroll', handleFirstGesture, { passive: true, once: true });
    window.addEventListener('click', handleFirstGesture, { once: true });
    window.addEventListener('touchstart', handleFirstGesture, { passive: true, once: true });
    window.addEventListener('mousemove', handleFirstGesture, { once: true });

    // Fallback timer: pops up and plays sound after 1200ms
    const timer = setTimeout(() => {
      showAndPlay();
    }, 1200);

    return () => {
      clearTimeout(timer);
      cleanup();
    };
  }, []);

  useEffect(() => {
    const syncUserAndAvatar = () => {
      setUserName(localStorage.getItem('user'));
      setAvatarStyle((localStorage.getItem('user_avatar_style') as DiceBearStyle) || 'fun-emoji');
      setAvatarSeed(localStorage.getItem('user_avatar_seed') || '');
    };

    syncUserAndAvatar();
    setMounted(true);

    window.addEventListener('storage', syncUserAndAvatar);
    window.addEventListener('sie_avatar_updated', syncUserAndAvatar);
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
    const handleSeeMore = () => {
      document.getElementById('reviewCard4')?.classList.toggle('review-hidden');
      document.getElementById('reviewCard5')?.classList.toggle('review-hidden');
      if (seeMoreBtn) {
        seeMoreBtn.textContent = seeMoreBtn.textContent?.trim() === 'See more reviews ↓' ? 'Show less ↑' : 'See more reviews ↓';
      }
    };
    seeMoreBtn?.addEventListener('click', handleSeeMore);

    return () => {
      window.removeEventListener('storage', syncUserAndAvatar);
      window.removeEventListener('sie_avatar_updated', syncUserAndAvatar);
      readMoreBtns.forEach(btn => btn.removeEventListener('click', handleReadMore));
      seeMoreBtn?.removeEventListener('click', handleSeeMore);
    };
  }, []);

  const avatarUrl = getUserAvatarUrl(userName || 'SieLabs', avatarStyle, avatarSeed);
  const initial = (userName?.trim().charAt(0) || 'U').toUpperCase();

  return (
    <>
      {/* ── CLAUDE ACADEMY STYLE HEADER ── */}
      <header style={{ borderBottom: '1px solid rgba(20, 20, 19, 0.08)', backgroundColor: 'var(--bg)' }}>
        <div className="header-container">
          <nav aria-label="Main navigation" style={{ padding: '16px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
            {/* Existing SieLabs Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
              <Link href="/" className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                <img
                  src="/favicon.ico"
                  alt="SieLabs Logo"
                  className="nav-logo"
                  style={{ width: "30px", height: "30px", objectFit: "contain", borderRadius: "4px", display: "block" }}
                />
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 500, letterSpacing: '-0.01em', color: 'var(--text)' }}>
                  SieLabs
                </span>
              </Link>

              {/* Navigation Links */}
              <div className={`nav-links ${isNavOpen ? 'show' : ''}`} id="navLinks">
                <a href="/programs/index.html" onClick={() => setIsNavOpen(false)} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  Explore
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}>
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </a>
                <a href="#tracks" onClick={() => setIsNavOpen(false)}>Programs</a>
                <a href="/products/index.html" onClick={() => setIsNavOpen(false)}>Products</a>
                <a href="/careers/index.html" onClick={() => setIsNavOpen(false)}>Careers</a>
                <a
                  href="https://chat.whatsapp.com/FhMDzQ9D6oVJ7E9WT21Xw6?s=cl&p=a&ilr=1"
                  target="_blank"
                  rel="noreferrer"
                  className="nav-cta nav-cta-community mobile-cta"
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                  onClick={() => setIsNavOpen(false)}
                >
                  Join Community
                </a>
              </div>
            </div>

            {/* Header Right: Search bar (Ctrl K) + Auth */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {/* Claude Academy Search Input */}
              <div className="claude-search-box" style={{ width: '300px', minWidth: '260px' }} id="claudeDesktopSearch">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6, flexShrink: 0 }}>
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: 'var(--text)',
                    fontSize: '13.5px',
                    flex: 1,
                    minWidth: 0,
                  }}
                />
                <span className="claude-kbd-shortcut" style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>Ctrl&nbsp;K</span>
              </div>

              {/* Whatsapp Community CTA */}
              <a
                href="https://chat.whatsapp.com/FhMDzQ9D6oVJ7E9WT21Xw6?s=cl&p=a&ilr=1"
                target="_blank"
                rel="noreferrer"
                className="btn-secondary desktop-cta"
                style={{ padding: '7px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--gold)' }}>
                  <path d="M17.472 14.382c-.301-.15-1.777-.878-2.053-.978-.276-.1-.477-.15-.677.15-.2.3-.776.978-.952 1.178-.175.2-.351.225-.651.075-.3-.15-1.265-.466-2.41-1.487-.893-.796-1.496-1.78-1.671-2.08-.175-.3-.019-.462.13-.611.135-.134.301-.35.451-.525.15-.176.201-.301.301-.5.1-.2.05-.376-.025-.526-.075-.15-.677-1.632-.927-2.232-.244-.583-.493-.504-.677-.514-.175-.01-.376-.01-.576-.01-.2 0-.525.075-.8.375-.276.3-1.053 1.029-1.053 2.509 0 1.48 1.077 2.908 1.227 3.109.15.2 2.119 3.235 5.134 4.536.717.31 1.277.495 1.713.633.72.228 1.376.195 1.895.118.578-.086 1.777-.726 2.027-1.428.25-.7.25-1.3.175-1.428-.075-.128-.276-.228-.576-.378z" />
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.986-1.308A9.948 9.948 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.734 0-3.344-.462-4.737-1.268l-.34-.196-2.955.775.789-2.883-.217-.345A7.954 7.954 0 014 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8z" />
                </svg>
                Community
              </a>

              {/* User Dropdown / Sign in button */}
              {userName ? (
                <div ref={dropdownRef} style={{ position: "relative" }}>
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                    aria-label="User profile menu"
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="true"
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      backgroundColor: "rgba(218, 119, 86, 0.15)",
                      border: isDropdownOpen ? "2px solid var(--gold)" : "1px solid rgba(218, 119, 86, 0.4)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: "var(--gold)",
                      outline: "none",
                      overflow: "hidden",
                      padding: 0,
                    }}
                  >
                    <img
                      src={avatarUrl}
                      alt={userName || "Profile"}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = "none";
                        const fallback = (e.currentTarget.parentElement?.querySelector(".home-nav-fallback") as HTMLElement);
                        if (fallback) fallback.style.display = "flex";
                      }}
                    />
                    <span className="home-nav-fallback" style={{ display: "none" }}>{initial}</span>
                  </button>

                  {isDropdownOpen && (
                    <div
                      style={{
                        position: "absolute",
                        right: 0,
                        top: "calc(100% + 10px)",
                        width: "230px",
                        backgroundColor: "#FFFFFF",
                        borderRadius: "16px",
                        boxShadow: "0 14px 36px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.03)",
                        border: "1px solid #E5E3DC",
                        padding: "8px",
                        zIndex: 9999,
                      }}
                      role="menu"
                    >
                      <Link
                        href="/profile"
                        onClick={() => setIsDropdownOpen(false)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          padding: "10px 12px",
                          backgroundColor: "#F6F4EE",
                          borderRadius: "12px",
                          border: "1px solid #E8E5DD",
                          marginBottom: "6px",
                          textDecoration: "none",
                        }}
                      >
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            backgroundColor: "rgba(218, 119, 86, 0.2)",
                            color: "var(--gold)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 700,
                            fontSize: "13px",
                            overflow: "hidden",
                          }}
                        >
                          <img
                            src={avatarUrl}
                            alt={userName || "Profile"}
                            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                          />
                        </div>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "#141413", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {userName}
                          </p>
                        </div>
                      </Link>

                      <Link
                        href="/profile"
                        onClick={() => setIsDropdownOpen(false)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          padding: "8px 12px",
                          borderRadius: "8px",
                          fontSize: "13px",
                          color: "#A19F97",
                          textDecoration: "none",
                        }}
                      >
                        My Profile
                      </Link>
                      <a
                        href="/programs/index.html"
                        onClick={() => setIsDropdownOpen(false)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          padding: "8px 12px",
                          borderRadius: "8px",
                          fontSize: "13px",
                          color: "#A19F97",
                          textDecoration: "none",
                        }}
                      >
                        My Courses
                      </a>
                      <button
                        type="button"
                        onClick={handleLogout}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          padding: "8px 12px",
                          borderRadius: "8px",
                          fontSize: "13px",
                          color: "#F87171",
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          textAlign: "left",
                        }}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  style={{
                    color: 'var(--text)',
                    fontSize: '14px',
                    fontWeight: 450,
                    textDecoration: 'none',
                    padding: '8px 16px',
                    borderRadius: '9999px',
                    transition: 'color 0.15s',
                  }}
                >
                  Sign in
                </Link>
              )}

              {/* Mobile Hamburger */}
              <button
                type="button"
                className={`hamburger-btn ${isNavOpen ? 'is-active' : ''}`}
                onClick={() => setIsNavOpen(prev => !prev)}
                aria-label="Toggle navigation"
                style={{ color: 'var(--text)' }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12h18M3 6h18M3 18h18" />
                </svg>
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* ── SECTION 1: CLAUDE ACADEMY HERO (Welcome to SieLabs Academy) ── */}
      <section style={{ padding: '84px 0 64px', position: 'relative' }}>
        <div className="container">
          <div style={{ maxWidth: '780px' }} className="reveal">
            <h1 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(42px, 5.2vw, 64px)',
              lineHeight: 1.12,
              letterSpacing: '-0.025em',
              color: 'var(--text)',
              fontWeight: 400,
              marginBottom: '20px'
            }}>
              Welcome to SieLabs Academy
            </h1>
            <p style={{
              color: 'var(--text-muted)',
              fontSize: '17px',
              lineHeight: 1.7,
              maxWidth: '680px',
              marginBottom: '36px',
              fontWeight: 400,
            }}>
              Learn to build practical software, systems architectures, and open source with intention.
              Hands-on cohorts, deep code walkthroughs, and production use cases from experienced maintainers.
            </p>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setIsInquiryModalOpen(true)}
                className="btn-primary"
                style={{ cursor: 'pointer' }}
              >
                Get started
              </button>
              <a href="/programs/index.html" className="btn-secondary">
                Browse all resources
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: "DIVE INTO A TRACK" (Mirroring Claude Academy's 3-Card Grid) ── */}
      <section id="tracks" style={{ padding: '40px 0 88px' }}>
        <div className="container">
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '32px',
            color: 'var(--text)',
            fontWeight: 400,
            marginBottom: '24px',
            letterSpacing: '-0.02em',
          }}>
            Dive into a track
          </h2>

          <div className="claude-tracks-grid reveal">
            {/* Card 1: Python & ML */}
            <a href="programs/python-ml/index.html" className="claude-track-card">
              <div className="claude-window-preview">
                {/* Window Chrome */}
                <div className="claude-window-dots">
                  <div className="claude-window-dot red" />
                  <div className="claude-window-dot yellow" />
                  <div className="claude-window-dot green" />
                </div>
                {/* Topographic Lines Overlay */}
                <svg className="claude-topography-lines" viewBox="0 0 300 150" fill="none" stroke="var(--gold)" strokeWidth="1.2">
                  <path d="M-20,40 Q60,10 140,50 T320,30" />
                  <path d="M-10,70 Q70,40 150,80 T330,60" />
                  <path d="M-10,100 Q80,70 160,110 T340,90" />
                  <path d="M0,130 Q90,100 170,140 T350,120" />
                </svg>
                {/* Mockup Terminal Output */}
                <div style={{ marginTop: '8px' }}>
                  <div className="claude-terminal-line" style={{ color: '#E7DAD3' }}>
                    <span style={{ color: 'var(--gold)' }}>$</span> python -m sie.ml.train --device cuda
                  </div>
                  <div className="claude-terminal-line" style={{ opacity: 0.7, marginTop: '4px' }}>
                    [1/100] Loss: 0.041 | Latency: 4.2ms | ONNX exported
                  </div>
                  <div className="claude-terminal-line" style={{ color: '#34D399', marginTop: '4px' }}>
                    ✓ Production inference microservice ready
                  </div>
                </div>
              </div>
              <div className="claude-track-body">
                <h3 className="claude-track-title">Python with Machine Learning</h3>
                <p className="claude-track-desc">
                  Your thinking partner for production AI: master Python internals, vector math with NumPy, and build live prediction microservices from scratch.
                </p>
              </div>
            </a>

            {/* Card 2: Open Source Mindset */}
            <a href="programs/open-source/index.html" className="claude-track-card">
              <div className="claude-window-preview">
                <div className="claude-window-dots">
                  <div className="claude-window-dot red" />
                  <div className="claude-window-dot yellow" />
                  <div className="claude-window-dot green" />
                </div>
                <svg className="claude-topography-lines" viewBox="0 0 300 150" fill="none" stroke="#60A5FA" strokeWidth="1.2">
                  <path d="M-20,30 Q80,20 160,60 T320,40" />
                  <path d="M-10,60 Q90,50 170,90 T330,70" />
                  <path d="M0,90 Q100,80 180,120 T340,100" />
                </svg>
                <div style={{ marginTop: '8px' }}>
                  <div className="claude-terminal-line" style={{ color: '#E7DAD3' }}>
                    <span style={{ color: '#60A5FA' }}>git</span> checkout -b feat/dialect-optimizer
                  </div>
                  <div className="claude-terminal-line" style={{ opacity: 0.7, marginTop: '4px' }}>
                    pytest tests/dialects/test_postgres.py: 48 passed
                  </div>
                  <div className="claude-terminal-line" style={{ color: '#A78BFA', marginTop: '4px' }}>
                    Merged: PR #1428 into tobymao/sqlglot
                  </div>
                </div>
              </div>
              <div className="claude-track-body">
                <h3 className="claude-track-title">Open Source Mindset</h3>
                <p className="claude-track-desc">
                  Reverse engineer real-world codebases. Brief maintainers on complex bugs, write ironclad test suites, and merge pull requests into global projects.
                </p>
              </div>
            </a>

            {/* Card 3: Applied Systems & Data */}
            <a href="programs/index.html" className="claude-track-card">
              <div className="claude-window-preview">
                <div className="claude-window-dots">
                  <div className="claude-window-dot red" />
                  <div className="claude-window-dot yellow" />
                  <div className="claude-window-dot green" />
                </div>
                <svg className="claude-topography-lines" viewBox="0 0 300 150" fill="none" stroke="#34D399" strokeWidth="1.2">
                  <path d="M-20,50 Q70,30 150,70 T320,50" />
                  <path d="M-10,80 Q80,60 160,100 T330,80" />
                  <path d="M0,110 Q90,90 170,130 T340,110" />
                </svg>
                <div style={{ marginTop: '8px' }}>
                  <div className="claude-terminal-line" style={{ color: '#E7DAD3' }}>
                    <span style={{ color: '#34D399' }}>sie-pipeline</span> stream --topic telemetry.v1
                  </div>
                  <div className="claude-terminal-line" style={{ opacity: 0.7, marginTop: '4px' }}>
                    Throughput: 1.2M msg/sec | DuckDB analytical query: 3ms
                  </div>
                  <div className="claude-terminal-line" style={{ color: '#FBBF24', marginTop: '4px' }}>
                    Parquet lakehouse partition verified
                  </div>
                </div>
              </div>
              <div className="claude-track-body">
                <h3 className="claude-track-title">Applied Systems & Data</h3>
                <p className="claude-track-desc">
                  Build software with depth. Plan, write, debug, and scale distributed ETL architectures, storage formats, and concurrent backends wherever you code.
                </p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: COURSE SHOWCASE (Screenshot 2: Claude 101 Espresso Banner) ── */}
      <section style={{ padding: '24px 0 80px' }}>
        <div className="container">
          {/* Espresso / Terracotta Brown Course Banner */}
          <div className="claude-course-banner reveal">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '32px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '280px' }}>
                <a href="/programs/index.html" className="claude-breadcrumb-link">
                  ← Academy / Active Cohort
                </a>
                <h2>Python ML 101</h2>
                <p className="course-desc">
                  Learn to use Python and Machine Learning for everyday engineering work, from fundamental internals and matrix operations to training models, serializing artifacts, and serving inference APIs.
                </p>

                {/* Metadata Pills Row */}
                <div className="claude-chips-row">
                  <div className="claude-meta-chip">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    </svg>
                    6 modules
                  </div>
                  <div className="claude-meta-chip">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    4 months
                  </div>
                  <div className="claude-meta-chip">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                    25 seats only
                  </div>
                  <div className="claude-meta-chip">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                      <path d="M6 12v5c3 3 9 3 12 0v-5" />
                    </svg>
                    Completion certificate
                  </div>
                </div>

                {/* Primary & Secondary Buttons */}
                <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <a href="programs/python-ml/index.html" className="btn-primary" style={{ padding: '11px 24px' }}>
                    Start course →
                  </a>
                  <a href="/login" className="btn-secondary" style={{ padding: '11px 24px', background: '#FFFFFF', borderColor: '#E5D6C7', color: '#3E231B' }}>
                    Sign in to save progress
                  </a>
                </div>
              </div>

              {/* Medallion illustration badge (as seen in Claude 101 screenshot) */}
              <div className="claude-medallion-badge" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="68" height="68" viewBox="0 0 48 48" fill="none" stroke="#A05236" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 14C14 8.47715 18.4772 4 24 4C29.5228 4 34 8.47715 34 14C34 18.148 31.4722 21.705 27.8596 23.2045C25.4294 24.2131 23.957 26.6853 23.957 29.317V30" />
                  <circle cx="24" cy="38" r="2.5" fill="#A05236" />
                  <path d="M8 20L4 24L8 28" />
                  <path d="M40 20L44 24L40 28" />
                </svg>
              </div>
            </div>
          </div>

          {/* Claude Academy Notification Callout Box */}
          <div className="claude-callout-box reveal">
            <div className="claude-callout-content">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--gold)', flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <span>Upcoming cohort starts soon. Intentionally capped at 25 engineers for rigorous 1-on-1 code reviews.</span>
            </div>
            <a href="programs/python-ml/index.html" className="claude-callout-btn">
              See what’s inside
            </a>
          </div>

          {/* 2-Column Curriculum Detail: "What you'll learn" vs Course Index */}
          <div className="claude-curriculum-grid reveal">
            {/* Left: What You'll Learn Card */}
            <div style={{
              background: '#FFFFFF',
              border: '1px solid #E5E3DC',
              borderRadius: '18px',
              padding: '32px',
            }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', color: '#141413', marginBottom: '8px', fontWeight: 400 }}>
                What you'll learn
              </h3>
              <p style={{ color: '#6E6D68', fontSize: '13.5px', marginBottom: '20px' }}>
                By the end of this program, you will be able to:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  "Explain Python internals: memory model, references, dunder methods, and decorators.",
                  "Master NumPy N-dimensional array manipulation, SIMD vectorization, and broadcasting.",
                  "Wrangle and clean large datasets with production-grade Pandas transformations.",
                  "Derive, train, and evaluate classical Supervised and Unsupervised machine learning models.",
                  "Understand PyTorch tensor computing, autograd computational graphs, and loss optimization.",
                  "Package and deploy production inference microservices with FastAPI, ONNX, and Docker."
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '4px' }}>
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                    <span style={{ fontSize: '14px', color: '#141413', lineHeight: 1.6 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Course Syllabus Sidebar */}
            <div style={{
              background: '#FFFFFF',
              border: '1px solid #E5E3DC',
              borderRadius: '18px',
              padding: '32px',
            }}>
              <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)', display: 'block', marginBottom: '16px' }}>
                Course Syllabus
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { id: '01', title: 'Advanced Python Internals' },
                  { id: '02', title: 'Mathematics for ML & NumPy' },
                  { id: '03', title: 'Feature Engineering & EDA' },
                  { id: '04', title: 'Supervised Learning in Depth' },
                  { id: '05', title: 'PyTorch & Deep Learning' },
                  { id: '06', title: 'Model Serving & Capstone' },
                ].map((mod) => (
                  <a
                    key={mod.id}
                    href="programs/python-ml/index.html"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      background: '#FAF9F5',
                      borderRadius: '10px',
                      border: '1px solid #EAE6DF',
                      color: '#141413',
                      fontSize: '13.5px',
                      textDecoration: 'none',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(217, 119, 87, 0.4)';
                      e.currentTarget.style.backgroundColor = '#F5F2EB';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#EAE6DF';
                      e.currentTarget.style.backgroundColor = '#FAF9F5';
                    }}
                  >
                    <span>
                      <span style={{ color: '#8E8D88', marginRight: '8px', fontSize: '12px' }}>{mod.id}</span>
                      {mod.title}
                    </span>
                    <span style={{ color: '#8E8D88', fontSize: '12px' }}>→</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: COMPANY OVERVIEW ── */}
      <section className="section-pad" id="company" style={{ borderTop: '1px solid rgba(20, 20, 19, 0.08)' }}>
        <div className="container">
          <div className="section-head reveal">
            <div>
              <p className="eyebrow" style={{ color: 'var(--gold)' }}>Applied Engineering</p>
              <h2>We turn complex software engineering into intuitive, repeatable craftsmanship.</h2>
            </div>
            <p className="section-desc">
              SieLabs operates at the intersection of open source enablement, systems architecture, and applied education.
              We reject shallow bootcamps in favor of deep code comprehension, reverse engineering, and production quality.
            </p>
          </div>

          <div className="cap-grid reveal">
            <div className="cap-card">
              <span className="cap-kicker">Systems Thinking</span>
              <h3>Sharp ideas into production software.</h3>
              <p>From understanding memory layout to containerized microservice architectures — built for resilience and clarity.</p>
            </div>
            <div className="cap-card">
              <span className="cap-kicker">Applied Learning</span>
              <h3>Learning close to actual maintainers.</h3>
              <p>Our programs emphasize direct interaction with complex real-world repositories like SQLGlot, NumPy, and PyTorch.</p>
            </div>
            <div className="cap-card">
              <span className="cap-kicker">High-Agency Craft</span>
              <h3>Clarity, elegant design, fast iteration.</h3>
              <p>We train engineers who can independently clone unfamiliar codebases, isolate bugs, and ship confident pull requests.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: STUDENT REVIEWS & OUTCOMES ── */}
      <section className="section-pad reviews-section" id="student-reviews" style={{ borderTop: '1px solid rgba(20, 20, 19, 0.08)' }}>
        <div className="container">
          <div className="section-head reveal">
            <div>
              <p className="eyebrow" style={{ color: 'var(--gold)' }}>Student Reviews</p>
              <h2>Hear from those who've walked the path.</h2>
            </div>
            <p className="section-desc">
              Real stories from students who built the reverse engineering mindset and made meaningful open-source
              contributions through SieLabs programs.
            </p>
          </div>

          <div className="reviews-masonry reveal">
            {/* Deepika Kakade */}
            <div className="review-card-compact">
              <svg className="review-quote-sm" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--gold)' }}>
                <path d="M9.135 5.015C5.242 6.584 3 9.58 3 13.203v5.782h5.782v-5.782H5.27c0-2.076 1.475-3.98 3.865-4.842L9.135 5.015zM18.865 5.015c-3.893 1.569-6.135 4.565-6.135 8.188v5.782h5.782v-5.782h-3.513c0-2.076 1.475-3.98 3.866-4.842L18.865 5.015z" />
              </svg>
              <p className="review-quote-text">
                Being part of SieLabs was a turning point for me. Before joining, open source felt intimidating — large codebases, strict review processes, and fear of mistakes. SieLabs completely changed that by teaching me the <strong>reverse engineering mindset</strong>.
              </p>
              <div className="review-expanded" id="reviewExpanded1">
                <p className="review-quote-text">
                  Contributing to <strong>SQLGlot</strong> pushed me out of my comfort zone. I learned how to navigate a complex codebase, write meaningful tests, and iterate on maintainer feedback.
                </p>
              </div>
              <button className="review-read-more" id="reviewToggle1">Read full review →</button>
              <div className="review-author-compact">
                <img src="/assets/students/deepika_kakde.jpeg" alt="Deepika Kakade" className="review-avatar-sm" loading="lazy" />
                <div>
                  <span className="review-name-sm">Deepika Kakade</span>
                  <span className="review-role-sm">Open Source Lab Student</span>
                </div>
                <a href="https://github.com/tobymao/sqlglot/pulls?q=is%3Apr+is%3Aclosed+author%3Adeepika-kakde" target="_blank" rel="noreferrer" className="pr-merged-tag" data-github-user="deepika-kakde">
                  <span className="pr-count-text">PRs Merged</span>
                </a>
              </div>
            </div>

            {/* Piya Daswadkar */}
            <div className="review-card-compact">
              <svg className="review-quote-sm" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--gold)' }}>
                <path d="M9.135 5.015C5.242 6.584 3 9.58 3 13.203v5.782h5.782v-5.782H5.27c0-2.076 1.475-3.98 3.865-4.842L9.135 5.015zM18.865 5.015c-3.893 1.569-6.135 4.565-6.135 8.188v5.782h5.782v-5.782h-3.513c0-2.076 1.475-3.98 3.866-4.842L18.865 5.015z" />
              </svg>
              <p className="review-quote-text">
                Working on SQLGlot gave me hands-on experience with production code, code reviews, debugging, and maintainer collaboration. During the program, I got <strong>10 pull requests merged</strong>!
              </p>
              <div className="review-expanded" id="reviewExpanded2">
                <p className="review-quote-text">
                  SieLabs was much more than technical training. It helped me develop problem-solving patience and the confidence to contribute to real software projects.
                </p>
              </div>
              <button className="review-read-more" id="reviewToggle2">Read full review →</button>
              <div className="review-author-compact">
                <img src="/assets/students/piya.jpeg" alt="Piya Daswadkar" className="review-avatar-sm" loading="lazy" />
                <div>
                  <span className="review-name-sm">Piya Daswadkar</span>
                  <span className="review-role-sm">Open Source Lab Student</span>
                </div>
                <a href="https://github.com/tobymao/sqlglot/pulls?q=is%3Apr+is%3Amerged+author%3APiyaDaswadkar" target="_blank" rel="noreferrer" className="pr-merged-tag" data-github-user="PiyaDaswadkar">
                  <span className="pr-count-text">PRs Merged</span>
                </a>
              </div>
            </div>

            {/* Vaishnavi Polekar */}
            <div className="review-card-compact">
              <svg className="review-quote-sm" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--gold)' }}>
                <path d="M9.135 5.015C5.242 6.584 3 9.58 3 13.203v5.782h5.782v-5.782H5.27c0-2.076 1.475-3.98 3.865-4.842L9.135 5.015zM18.865 5.015c-3.893 1.569-6.135 4.565-6.135 8.188v5.782h5.782v-5.782h-3.513c0-2.076 1.475-3.98 3.866-4.842L18.865 5.015z" />
              </svg>
              <p className="review-quote-text">
                SieLabs encouraged me to understand concepts deeply rather than simply completing tasks. The hands-on learning approach significantly increased my confidence as an engineer.
              </p>
              <div className="review-expanded" id="reviewExpanded3">
                <p className="review-quote-text">
                  I developed better debugging, testing, and code-reading skills while working directly on production-level projects.
                </p>
              </div>
              <button className="review-read-more" id="reviewToggle3">Read full review →</button>
              <div className="review-author-compact">
                <img src="/assets/students/vaishnavi.jpeg" alt="Vaishnavi Polekar" className="review-avatar-sm" loading="lazy" />
                <div>
                  <span className="review-name-sm">Vaishnavi Polekar</span>
                  <span className="review-role-sm">Open Source Lab Student</span>
                </div>
                <a href="https://github.com/tobymao/sqlglot/pulls?q=is%3Apr+is%3Amerged+author%3Avaishnavi-polekar" target="_blank" rel="noreferrer" className="pr-merged-tag" data-github-user="vaishnavi-polekar">
                  <span className="pr-count-text">PRs Merged</span>
                </a>
              </div>
            </div>

            {/* Vishvambhar Ranoshe */}
            <div className="review-card-compact review-hidden" id="reviewCard4">
              <svg className="review-quote-sm" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--gold)' }}>
                <path d="M9.135 5.015C5.242 6.584 3 9.58 3 13.203v5.782h5.782v-5.782H5.27c0-2.076 1.475-3.98 3.865-4.842L9.135 5.015zM18.865 5.015c-3.893 1.569-6.135 4.565-6.135 8.188v5.782h5.782v-5.782h-3.513c0-2.076 1.475-3.98 3.866-4.842L18.865 5.015z" />
              </svg>
              <p className="review-quote-text">
                I've been connected with SieLabs for the past 2 years now. What SieLabs really gave me wasn't just technical knowledge, it was an approach and a <strong>reverse engineering mindset</strong>.
              </p>
              <div className="review-expanded" id="reviewExpanded4">
                <p className="review-quote-text">
                  In their latest Open Source batch, I was able to contribute to <strong>SQLGlot</strong>, a real-world open-source project. Within the first 15 days of the batch, I managed to get <strong>4 pull requests merged</strong>, something I wouldn't have thought possible without the foundation SieLabs built in me. Diving into a large, unfamiliar codebase and actually making meaningful contributions that fast really showed me how far the reverse engineering mindset can take you.
                </p>
                <p className="review-quote-text">
                  Looking back, I realize SieLabs was never about teaching "a language" or running "a course," it's about building the right mindset. Once you have that mindset, the tools and languages become secondary; you can pick up anything, and more importantly, contribute to anything.
                </p>
                <p className="review-quote-text" style={{ marginBottom: 0 }}>
                  Grateful for the guidance and the community. Highly recommend SieLabs to anyone who wants to actually <strong>think like an engineer</strong>, not just learn syntax.
                </p>
              </div>
              <button className="review-read-more" id="reviewToggle4">Read full review →</button>
              <div className="review-author-compact">
                <img src="/assets/students/vish.jpeg" alt="Vishvambhar Ranoshe" className="review-avatar-sm" loading="lazy" />
                <div>
                  <span className="review-name-sm">Vishvambhar Ranoshe</span>
                  <span className="review-role-sm">Open Source Lab Student</span>
                </div>
                <a href="https://github.com/tobymao/sqlglot/pulls?q=is%3Apr+is%3Amerged+author%3Avishvambhar-ranoshe" target="_blank" rel="noreferrer" className="pr-merged-tag" data-github-user="vishvambhar-ranoshe">
                  <span className="pr-count-text">PRs Merged</span>
                </a>
              </div>
            </div>

            {/* Anuja */}
            <div className="review-card-compact review-hidden" id="reviewCard5">
              <svg className="review-quote-sm" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--gold)' }}>
                <path d="M9.135 5.015C5.242 6.584 3 9.58 3 13.203v5.782h5.782v-5.782H5.27c0-2.076 1.475-3.98 3.865-4.842L9.135 5.015zM18.865 5.015c-3.893 1.569-6.135 4.565-6.135 8.188v5.782h5.782v-5.782h-3.513c0-2.076 1.475-3.98 3.866-4.842L18.865 5.015z" />
              </svg>
              <p className="review-quote-text">
                SieLabs helped me bridge the gap between theoretical knowledge and practical software engineering. The <strong>reverse engineering mindset</strong> taught here is invaluable.
              </p>
              <div className="review-expanded" id="reviewExpanded5">
                <p className="review-quote-text">
                  Through the Open Source Lab, I learned how to navigate large, complex codebases and write production-quality code. The mentorship provided is exceptional, focusing on understanding the 'why' behind every technical decision.
                </p>
                <p className="review-quote-text" style={{ marginBottom: 0 }}>
                  I highly recommend SieLabs to anyone looking to make real open-source contributions and grow as a developer.
                </p>
              </div>
              <button className="review-read-more" id="reviewToggle5">Read full review →</button>
              <div className="review-author-compact">
                <img src="/assets/students/anuja.jpeg" alt="Anuja" className="review-avatar-sm" loading="lazy" />
                <div>
                  <span className="review-name-sm">Anuja</span>
                  <span className="review-role-sm">Open Source Lab Student</span>
                </div>
                <a href="https://github.com/tobymao/sqlglot/pulls?q=is%3Apr+state%3Aclosed+author%3AAnuja006" target="_blank" rel="noreferrer" className="pr-merged-tag" data-github-user="Anuja006">
                  <span className="pr-count-text">PRs Merged</span>
                </a>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <button className="review-see-more-btn" id="seeMoreReviewsBtn">
              See more reviews ↓
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid rgba(20, 20, 19, 0.08)', backgroundColor: '#F3F1EC', padding: '64px 0 40px' }}>
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand-col">
              <Link href="/" className="footer-brand" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: '#141413', fontFamily: 'var(--font-serif)', fontSize: '18px' }}>
                <img
                  src="/favicon.ico"
                  alt="SieLabs Logo"
                  className="nav-logo"
                  style={{ width: "24px", height: "24px", objectFit: "contain", borderRadius: "4px", display: "block" }}
                />
                SieLabs
              </Link>
              <p className="footer-tagline" style={{ color: '#6E6D68', marginTop: '12px' }}>
                Applied software engineering, open source tools, and high-impact learning initiatives.
              </p>
              <div className="footer-address" style={{ marginTop: '16px', color: '#9C9A92', fontSize: '13px' }}>
                <p>EuroKids PreSchool Near Maratha Hotel in Narhe, Pune</p>
              </div>
            </div>

            <div className="footer-col">
              <h4 className="footer-heading" style={{ color: '#141413', fontSize: '14px', marginBottom: '14px' }}>Navigation</h4>
              <nav className="footer-links" aria-label="Footer navigation">
                <a href="/programs/index.html" style={{ color: '#A19F97' }}>Programs</a>
                <a href="/products/index.html" style={{ color: '#A19F97' }}>Products</a>
                <a href="/careers/index.html" style={{ color: '#A19F97' }}>Careers</a>
              </nav>
            </div>

            <div className="footer-col">
              <h4 className="footer-heading" style={{ color: '#141413', fontSize: '14px', marginBottom: '14px' }}>Community & Social</h4>
              <div className="footer-social">
                <a href="https://chat.whatsapp.com/FhMDzQ9D6oVJ7E9WT21Xw6?s=cl&p=a&ilr=1" target="_blank" rel="noreferrer" style={{ color: '#A19F97' }}>
                  WhatsApp Community
                </a>
                <a href="https://www.youtube.com/@sielabs" target="_blank" rel="noreferrer" style={{ color: '#A19F97' }}>
                  YouTube
                </a>
                <a href="https://www.instagram.com/sielabs" target="_blank" rel="noreferrer" style={{ color: '#A19F97' }}>
                  Instagram
                </a>
              </div>
            </div>
          </div>

          <div className="footer-bottom" style={{ borderTop: '1px solid rgba(20, 20, 19, 0.08)', marginTop: '48px', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', color: '#9C9A92', fontSize: '13px' }}>
            <p>© 2026 SieLabs. All rights reserved.</p>
            <p>Designed with intention.</p>
          </div>
        </div>
      </footer>

      {/* ── AGENT INDICATION TEASER (Points to button with sound so users notice it) ── */}
      {!isInquiryModalOpen && showNudge && (
        <div
          onClick={() => {
            setIsInquiryModalOpen(true);
            setShowNudge(false);
          }}
          className="claude-support-nudge"
          style={{
            position: 'fixed',
            bottom: '86px',
            right: '24px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E5E3DC',
            borderRadius: '14px',
            padding: '9px 12px 9px 11px',
            boxShadow: '0 10px 28px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.04)',
            zIndex: 998,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            animation: 'nudgePopIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            transformOrigin: 'bottom right',
            maxWidth: '240px',
          }}
        >
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <img
              src="/favicon.ico"
              alt="SieLabs Advisor"
              style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                objectFit: 'contain',
                display: 'block',
              }}
            />
            <span
              style={{
                position: 'absolute',
                bottom: '-1px',
                right: '-1px',
                width: '6.5px',
                height: '6.5px',
                backgroundColor: '#16A34A',
                border: '1px solid #FFFFFF',
                borderRadius: '50%',
              }}
            />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: '#141413', lineHeight: 1.3 }}>
              How can I help you? 👋
            </p>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowNudge(false);
            }}
            aria-label="Dismiss hint"
            style={{
              border: 'none',
              background: 'transparent',
              color: '#9C9A92',
              cursor: 'pointer',
              padding: '2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Pointer tail pointing down towards the circular button */}
          <div
            style={{
              position: 'absolute',
              bottom: '-5px',
              right: '20px',
              width: '10px',
              height: '10px',
              backgroundColor: '#FFFFFF',
              borderRight: '1px solid #E5E3DC',
              borderBottom: '1px solid #E5E3DC',
              transform: 'rotate(45deg)',
            }}
          />
        </div>
      )}

      {/* ── FLOATING SUPPORT BUBBLE (Bottom right, opens inquiry widget) ── */}
      <button
        type="button"
        onClick={() => {
          setIsInquiryModalOpen((prev) => !prev);
          setShowNudge(false);
        }}
        className="claude-support-bubble"
        aria-label="Connect with SieLabs / Ask a question"
        title="Connect with SieLabs / Ask a question"
        style={{ border: 'none', cursor: 'pointer', outline: 'none' }}
      >
        {isInquiryModalOpen ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      {/* ── PRELOADED CHIME AUDIO ELEMENT ── */}
      <audio id="siePopAudioTag" src="/assets/pop.wav" preload="auto" style={{ display: 'none' }} />

      {/* ── INQUIRY MODAL (Sends lead info via email & stores in DB) ── */}
      <InquiryModal
        isOpen={isInquiryModalOpen}
        onClose={() => setIsInquiryModalOpen(false)}
      />
    </>
  );
}
