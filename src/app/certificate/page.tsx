'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { getUserAvatarUrl, DiceBearStyle } from '@/lib/avatar';

function CertificateContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read query params or fallback to SieLabs defaults
  const initialCourse = searchParams.get('course') || 'Python with Machine Learning';
  const initialName = searchParams.get('name') || 'Abhishek Bhosale';
  const initialDate = searchParams.get('date') || 'November 14, 2026';
  const certId = searchParams.get('id') || 'SIE-ML-84920';

  const [courseName, setCourseName] = useState(initialCourse);
  const [recipientName, setRecipientName] = useState(initialName);
  const [issueDate, setIssueDate] = useState(initialDate);

  // User auth state for SieLabs nav
  const [userName, setUserName] = useState<string | null>(null);
  const [avatarStyle, setAvatarStyle] = useState<DiceBearStyle>('fun-emoji');
  const [avatarSeed, setAvatarSeed] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Modal for editing name
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [tempName, setTempName] = useState(initialName);
  const [tempCourse, setTempCourse] = useState(initialCourse);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Sync logged in user
  useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored && stored.trim()) {
        setUserName(stored.trim());
        if (!searchParams.get('name')) {
          setRecipientName(stored.trim());
          setTempName(stored.trim());
        }
      }
      const savedStyle = localStorage.getItem('sie_avatar_style') as DiceBearStyle;
      const savedSeed = localStorage.getItem('sie_avatar_seed');
      if (savedStyle) setAvatarStyle(savedStyle);
      if (savedSeed) setAvatarSeed(savedSeed);
    } catch { }

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsDropdownOpen(false);
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
  }, [searchParams]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUserName(null);
    setIsDropdownOpen(false);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard! Anyone can view and verify this badge.');
    }
  };

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
      setRecipientName(tempName.trim());
      setCourseName(tempCourse.trim());
      setIsEditModalOpen(false);

      const params = new URLSearchParams(window.location.search);
      params.set('name', tempName.trim());
      params.set('course', tempCourse.trim());
      router.replace(`?${params.toString()}`);
      showToast('Certificate updated successfully!');
    }
  };

  // Add to LinkedIn certification
  const handleAddToLinkedIn = () => {
    const certUrl = typeof window !== 'undefined' ? window.location.href : 'https://sielabs.org/certificate';
    const linkedInUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(
      courseName + ' - Course Completion Badge'
    )}&organizationName=SieLabs&issueYear=2026&issueMonth=11&certUrl=${encodeURIComponent(
      certUrl
    )}&certId=${encodeURIComponent(certId)}`;
    window.open(linkedInUrl, '_blank', 'noopener,noreferrer');
  };

  // High-resolution Canvas download as PNG
  const handleDownloadImage = () => {
    try {
      const canvas = document.createElement('canvas');
      const width = 1560; // 2x resolution
      const height = 980;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 1. Terracotta Card Background
      ctx.fillStyle = '#D97757';
      ctx.beginPath();
      ctx.roundRect(0, 0, width, height, 48);
      ctx.fill();

      // 2. Rosette Badge Sticker in Center (Perfect Horizontal & Level Alignment)
      const cx = width / 2;
      const cy = height / 2 - 8;

      ctx.save();
      ctx.translate(cx, cy);

      // Draw Ribbon Tails behind the seal
      ctx.fillStyle = '#BF5935';
      // Left tail
      ctx.beginPath();
      ctx.moveTo(-60, 200);
      ctx.lineTo(-115, 335);
      ctx.lineTo(-75, 305);
      ctx.lineTo(-30, 328);
      ctx.lineTo(-30, 200);
      ctx.closePath();
      ctx.fill();

      // Right tail
      ctx.beginPath();
      ctx.moveTo(30, 200);
      ctx.lineTo(30, 328);
      ctx.lineTo(75, 305);
      ctx.lineTo(115, 335);
      ctx.lineTo(60, 200);
      ctx.closePath();
      ctx.fill();

      // Draw 32-point Rosette Seal
      const pts: { x: number; y: number }[] = [];
      const n = 32;
      for (let i = 0; i < n; i++) {
        const a = (i * Math.PI) / 16 - Math.PI / 2;
        const r = i % 2 === 0 ? 305 : 288;
        pts.push({ x: r * Math.cos(a), y: r * Math.sin(a) });
      }

      ctx.fillStyle = '#FAF6F0';
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(pts[i].x, pts[i].y);
      }
      ctx.closePath();
      ctx.fill();

      // Inner solid terracotta ring
      ctx.strokeStyle = '#D97757';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, 0, 272, 0, Math.PI * 2);
      ctx.stroke();

      // Inner dashed gold ring
      ctx.strokeStyle = '#E5A93C';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.arc(0, 0, 258, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Arched curved text: ★ COURSE COMPLETED • SIELABS ★
      const text = '★ COURSE COMPLETED • SIELABS ★';
      const arcRadius = 228;
      const totalAngle = Math.PI * 0.72;
      const anglePerChar = totalAngle / (text.length - 1);
      const startAngle = -Math.PI / 2 - totalAngle / 2;

      ctx.fillStyle = '#D97757';
      ctx.font = 'bold 18px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (let i = 0; i < text.length; i++) {
        const charAngle = startAngle + i * anglePerChar;
        ctx.save();
        ctx.rotate(charAngle + Math.PI / 2);
        ctx.fillText(text[i], 0, -arcRadius);
        ctx.restore();
      }

      // Course Title
      ctx.fillStyle = '#141413';
      ctx.font = '600 48px "DM Serif Display", Georgia, serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(courseName, 0, 20);

      // "PRESENTED TO"
      ctx.fillStyle = '#78716C';
      ctx.font = 'bold 16px system-ui, -apple-system, sans-serif';
      ctx.fillText('PRESENTED TO', 0, 78);

      // Recipient Name
      ctx.fillStyle = '#141413';
      ctx.font = 'bold 44px "DM Serif Display", Georgia, serif';
      ctx.fillText(recipientName, 0, 134);

      ctx.restore(); // restore rotation/translate

      // 8. Bottom Left Brand (SieLabs)
      ctx.save();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '500 32px "DM Serif Display", Georgia, serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'bottom';
      ctx.fillText('SieLabs', 110, height - 55);
      ctx.restore();

      // 9. Bottom Right Issue Date
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = '600 22px system-ui, -apple-system, monospace';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      ctx.letterSpacing = '2px';
      ctx.fillText(`ISSUED ${issueDate.toUpperCase()}`, width - 75, height - 58);

      const finishDownload = () => {
        const link = document.createElement('a');
        link.download = `sielabs-certificate-${recipientName.toLowerCase().replace(/\s+/g, '-')}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        showToast('Certificate PNG downloaded successfully!');
      };

      // 10. Draw SieLabs Logo from favicon.ico onto Canvas
      const logoImg = new Image();
      logoImg.crossOrigin = 'anonymous';
      logoImg.onload = () => {
        // Draw centered emblem in rosette sticker
        ctx.save();
        ctx.translate(cx, cy);
        const logoSize = 76;
        ctx.shadowColor = 'rgba(217, 119, 87, 0.35)';
        ctx.shadowBlur = 18;
        ctx.shadowOffsetY = 4;
        ctx.drawImage(logoImg, -logoSize / 2, -100 - logoSize / 2, logoSize, logoSize);
        ctx.restore();

        // Draw bottom-left brand logo
        const bottomLogoSize = 44;
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
        ctx.shadowBlur = 8;
        ctx.drawImage(logoImg, 56, height - 90, bottomLogoSize, bottomLogoSize);
        ctx.restore();

        finishDownload();
      };
      logoImg.onerror = () => {
        finishDownload();
      };
      logoImg.src = '/favicon.ico';
      if (logoImg.complete) {
        logoImg.onload?.(new Event('load'));
      }
    } catch {
      window.print();
    }
  };

  const avatarUrl = getUserAvatarUrl(userName || 'SieLabs', avatarStyle, avatarSeed);
  const initial = (userName?.trim().charAt(0) || 'U').toUpperCase();

  return (
    <div
      style={{
        backgroundColor: 'var(--bg, #FAF9F5)',
        color: 'var(--text, #141413)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'var(--font-sans, system-ui, sans-serif)',
      }}
    >
      {/* ── SIELABS HEADER NAVBAR ── */}
      <header
        style={{
          borderBottom: '1px solid rgba(20, 20, 19, 0.08)',
          backgroundColor: 'var(--bg, #FAF9F5)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <nav
            aria-label="Main navigation"
            style={{
              padding: '16px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '24px',
            }}
          >
            {/* SieLabs Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
              <Link
                href="/"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  textDecoration: 'none',
                  color: '#141413',
                }}
              >
                <img
                  src="/favicon.ico"
                  alt="SieLabs Logo"
                  style={{
                    width: '30px',
                    height: '30px',
                    objectFit: 'contain',
                    borderRadius: '4px',
                    display: 'block',
                  }}
                />
                <span
                  style={{
                    fontFamily: 'var(--font-serif, "DM Serif Display", Georgia, serif)',
                    fontSize: '20px',
                    fontWeight: 500,
                    letterSpacing: '-0.01em',
                    color: 'var(--text, #141413)',
                  }}
                >
                  SieLabs
                </span>
              </Link>

              {/* Navigation Links */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '22px',
                  fontSize: '14.5px',
                  fontWeight: 500,
                }}
              >
                <Link
                  href="/programs/index.html"
                  style={{
                    color: '#6E6D68',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'color 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#141413')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#6E6D68')}
                >
                  Explore
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}>
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </Link>
                <Link
                  href="/#tracks"
                  style={{ color: '#6E6D68', textDecoration: 'none', transition: 'color 0.15s ease' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#141413')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#6E6D68')}
                >
                  Programs
                </Link>
                <Link
                  href="/products/index.html"
                  style={{ color: '#6E6D68', textDecoration: 'none', transition: 'color 0.15s ease' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#141413')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#6E6D68')}
                >
                  Products
                </Link>
                <Link
                  href="/careers/index.html"
                  style={{ color: '#6E6D68', textDecoration: 'none', transition: 'color 0.15s ease' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#141413')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#6E6D68')}
                >
                  Careers
                </Link>
              </div>
            </div>

            {/* Header Right: Search bar (Ctrl K) + Community + Auth */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {/* Search Box */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#F3F1EC',
                  border: '1px solid #E5E3DC',
                  borderRadius: '9999px',
                  padding: '7px 14px',
                  width: '260px',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5, flexShrink: 0 }}>
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search programs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: 'var(--text, #141413)',
                    fontSize: '13px',
                    flex: 1,
                    minWidth: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: '11px',
                    color: '#9C9A92',
                    backgroundColor: '#EAE6DF',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontWeight: 600,
                  }}
                >
                  Ctrl K
                </span>
              </div>

              {/* Whatsapp Community CTA */}
              <a
                href="https://chat.whatsapp.com/FhMDzQ9D6oVJ7E9WT21Xw6?s=cl&p=a&ilr=1"
                target="_blank"
                rel="noreferrer"
                style={{
                  padding: '7px 16px',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#FFFFFF',
                  color: '#141413',
                  border: '1px solid #E5E3DC',
                  borderRadius: '9999px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'all 0.15s ease',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F3F1EC')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="#D97757">
                  <path d="M17.472 14.382c-.301-.15-1.777-.878-2.053-.978-.276-.1-.477-.15-.677.15-.2.3-.776.978-.952 1.178-.175.2-.351.225-.651.075-.3-.15-1.265-.466-2.41-1.487-.893-.796-1.496-1.78-1.671-2.08-.175-.3-.019-.462.13-.611.135-.134.301-.35.451-.525.15-.176.201-.301.301-.5.1-.2.05-.376-.025-.526-.075-.15-.677-1.632-.927-2.232-.244-.583-.493-.504-.677-.514-.175-.01-.376-.01-.576-.01-.2 0-.525.075-.8.375-.276.3-1.053 1.029-1.053 2.509 0 1.48 1.077 2.908 1.227 3.109.15.2 2.119 3.235 5.134 4.536.717.31 1.277.495 1.713.633.72.228 1.376.195 1.895.118.578-.086 1.777-.726 2.027-1.428.25-.7.25-1.3.175-1.428-.075-.128-.276-.228-.576-.378z" />
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.986-1.308A9.948 9.948 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.734 0-3.344-.462-4.737-1.268l-.34-.196-2.955.775.789-2.883-.217-.345A7.954 7.954 0 014 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8z" />
                </svg>
                <span>Community</span>
              </a>

              {/* User Dropdown / Sign in button */}
              {userName ? (
                <div ref={dropdownRef} style={{ position: 'relative' }}>
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                    aria-label="User profile menu"
                    aria-expanded={isDropdownOpen}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(217, 119, 87, 0.15)',
                      border: isDropdownOpen ? '2px solid #D97757' : '1px solid rgba(217, 119, 87, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      overflow: 'hidden',
                      padding: 0,
                    }}
                  >
                    <img
                      src={avatarUrl}
                      alt={userName || 'Profile'}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = 'none';
                      }}
                    />
                  </button>

                  {isDropdownOpen && (
                    <div
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: 'calc(100% + 10px)',
                        width: '230px',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        boxShadow: '0 14px 36px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.03)',
                        border: '1px solid #E5E3DC',
                        padding: '8px',
                        zIndex: 1000,
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 12px',
                          backgroundColor: '#F3F1EC',
                          borderRadius: '10px',
                          marginBottom: '6px',
                        }}
                      >
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            backgroundColor: '#EAE6DF',
                            flexShrink: 0,
                          }}
                        >
                          <img src={avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#141413', truncate: true } as React.CSSProperties}>
                            {userName}
                          </div>
                          <Link
                            href="/profile"
                            onClick={() => setIsDropdownOpen(false)}
                            style={{ fontSize: '11.5px', color: '#D97757', textDecoration: 'none', fontWeight: 500 }}
                          >
                            View Profile →
                          </Link>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleLogout}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: 'none',
                          backgroundColor: 'transparent',
                          color: '#DC2626',
                          fontSize: '13px',
                          fontWeight: 500,
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FEE2E2')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        Log out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  style={{
                    backgroundColor: '#141413',
                    color: '#FAF9F5',
                    padding: '8px 18px',
                    borderRadius: '9999px',
                    fontSize: '13px',
                    fontWeight: 600,
                    textDecoration: 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  Sign in
                </Link>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '40px 20px 60px',
        }}
      >
        <div style={{ width: '100%', maxWidth: '820px' }}>
          {/* Breadcrumb Navigation in SieLabs Style */}
          <div style={{ marginBottom: '24px' }}>
            <Link
              href="/programs/index.html"
              style={{
                color: '#6E6D68',
                textDecoration: 'none',
                fontSize: '13.5px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'color 0.15s ease',
                fontWeight: 500,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#141413')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#6E6D68')}
            >
              <span>←</span>
              <span>Programs</span>
              <span style={{ color: '#DCD7CC' }}>/</span>
              <span>Courses</span>
              <span style={{ color: '#DCD7CC' }}>/</span>
              <span style={{ color: '#141413', fontWeight: 600 }}>{courseName}</span>
            </Link>
          </div>

          {/* ── THE OFFICIAL SIELABS CERTIFICATE BADGE CARD ── */}
          <div
            ref={cardRef}
            id="certificateBadgeCard"
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '16 / 10.2',
              backgroundColor: '#D97757', // Signature Terracotta
              borderRadius: '24px',
              boxShadow: '0 24px 60px rgba(217, 119, 87, 0.22), 0 8px 24px rgba(0, 0, 0, 0.08)',
              overflow: 'hidden',
              userSelect: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Academic Rosette Badge Seal (Upright & Level) */}
            <div
              id="completionBadgeSeal"
              style={{
                position: 'absolute',
                left: '50%',
                top: '48%',
                transform: 'translate(-50%, -50%)',
                transformOrigin: 'center center',
                width: 'min(55%, 380px)',
                aspectRatio: '1 / 1.08',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                filter: 'drop-shadow(0 14px 32px rgba(0, 0, 0, 0.2))',
                zIndex: 10,
              }}
            >
              {/* SVG 32-Point Rosette & Hanging Ribbon Tails */}
              <svg
                viewBox="0 0 520 540"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  overflow: 'visible',
                  pointerEvents: 'none',
                }}
              >
                {/* Ribbon Tails behind Rosette */}
                <g filter="drop-shadow(0 4px 10px rgba(0, 0, 0, 0.15))">
                  {/* Left Ribbon Tail */}
                  <polygon
                    points="218,390 178,485 208,460 238,480 238,390"
                    fill="#BF5935"
                    stroke="#A84A2C"
                    strokeWidth="1.5"
                  />
                  {/* Right Ribbon Tail */}
                  <polygon
                    points="282,390 282,480 312,460 342,485 302,390"
                    fill="#BF5935"
                    stroke="#A84A2C"
                    strokeWidth="1.5"
                  />
                </g>

                {/* 32-Point Scalloped Rosette Seal Body */}
                <polygon
                  points="260.0,32.0 297.5,47.7 338.1,47.5 366.7,76.4 404.2,91.8 419.6,129.3 448.5,157.9 448.3,198.5 464.0,236.0 448.3,273.5 448.5,314.1 419.6,342.7 404.2,380.2 366.7,395.6 338.1,424.5 297.5,424.3 260.0,440.0 222.5,424.3 181.9,424.5 153.3,395.6 115.8,380.2 100.4,342.7 71.5,314.1 71.7,273.5 56.0,236.0 71.7,198.5 71.5,157.9 100.4,129.3 115.8,91.8 153.3,76.4 181.9,47.5 222.5,47.7"
                  fill="#FAF6F0"
                  stroke="#E8DFD3"
                  strokeWidth="2"
                  filter="drop-shadow(0 4px 12px rgba(0, 0, 0, 0.08))"
                />

                {/* Inner Solid Terracotta Ring */}
                <circle
                  cx="260"
                  cy="236"
                  r="182"
                  fill="none"
                  stroke="#D97757"
                  strokeWidth="2.5"
                />

                {/* Inner Dashed Gold Ring */}
                <circle
                  cx="260"
                  cy="236"
                  r="172"
                  fill="none"
                  stroke="#E5A93C"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                />

                {/* Curved Text Arc across the Upper Perimeter */}
                <path
                  id="rosetteTextArc"
                  d="M 108,236 A 152,152 0 0,1 412,236"
                  fill="none"
                />

                <text style={{ userSelect: 'none' }}>
                  <textPath
                    href="#rosetteTextArc"
                    startOffset="50%"
                    textAnchor="middle"
                    fill="#D97757"
                    fontSize="11.5"
                    fontWeight="700"
                    letterSpacing="2.8px"
                    fontFamily="system-ui, -apple-system, sans-serif"
                  >
                    ★ COURSE COMPLETED • SIELABS ★
                  </textPath>
                </text>
              </svg>

              {/* Rosette Center Content: Logo + Verified Pill + Course Title + Presented to + Recipient */}
              <div
                style={{
                  position: 'relative',
                  zIndex: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  padding: '16px 24px',
                  maxWidth: '78%',
                  marginTop: '-16px',
                }}
              >
                {/* SieLabs Logo from favicon.ico - Guaranteed vertical clearance from arc */}
                <div
                  style={{
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(217, 119, 87, 0.25), 0 1px 3px rgba(0, 0, 0, 0.08)',
                    backgroundColor: '#FFFFFF',
                    padding: '2px',
                  }}
                >
                  <img
                    src="/favicon.ico"
                    alt="SieLabs Logo"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      borderRadius: '8px',
                      display: 'block',
                    }}
                  />
                </div>

                {/* Verified Achievement Badge Chip */}
                <div
                  style={{
                    backgroundColor: 'rgba(217, 119, 87, 0.1)',
                    border: '1px solid rgba(217, 119, 87, 0.3)',
                    color: '#D97757',
                    fontSize: '9.5px',
                    fontWeight: 700,
                    letterSpacing: '1px',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    textTransform: 'uppercase',
                    marginBottom: '4px',
                  }}
                >
                  Verified Achievement
                </div>

                {/* Course Name */}
                <h1
                  style={{
                    fontFamily: 'var(--font-serif, "DM Serif Display", Georgia, serif)',
                    fontSize: 'clamp(17px, 2.3vw, 24px)',
                    fontWeight: 600,
                    color: '#141413',
                    margin: '0 0 4px 0',
                    lineHeight: 1.15,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {courseName}
                </h1>

                {/* "Presented to" */}
                <p
                  style={{
                    fontSize: '10px',
                    color: '#78716C',
                    margin: '0 0 3px 0',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '1.8px',
                  }}
                >
                  Presented to
                </p>

                {/* Recipient Name */}
                <h2
                  style={{
                    fontFamily: 'var(--font-serif, "DM Serif Display", Georgia, serif)',
                    fontSize: 'clamp(16px, 2.2vw, 22px)',
                    fontWeight: 700,
                    color: '#141413',
                    margin: 0,
                    lineHeight: 1.2,
                  }}
                >
                  {recipientName}
                </h2>
              </div>
            </div>

            {/* Bottom-Left: SieLabs Brand */}
            <div
              style={{
                position: 'absolute',
                bottom: '22px',
                left: '26px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: '#FFFFFF',
                zIndex: 12,
              }}
            >
              <img
                src="/favicon.ico"
                alt="SieLabs Logo"
                style={{
                  width: '26px',
                  height: '26px',
                  objectFit: 'contain',
                  borderRadius: '6px',
                  display: 'block',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-serif, Georgia, serif)',
                  fontSize: 'clamp(14px, 1.8vw, 17px)',
                  fontWeight: 500,
                  color: '#FFFFFF',
                  letterSpacing: '0.01em',
                }}
              >
                SieLabs
              </span>
            </div>

            {/* Bottom-Right: Issue Date */}
            <div
              style={{
                position: 'absolute',
                bottom: '24px',
                right: '26px',
                color: 'rgba(255, 255, 255, 0.88)',
                fontSize: 'clamp(9px, 1.2vw, 11.5px)',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontFamily: 'system-ui, -apple-system, monospace',
                zIndex: 12,
              }}
            >
              ISSUED {issueDate.toUpperCase()}
            </div>
          </div>

          {/* ── ACTION BUTTONS IN SIELABS PALETTE ── */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              marginTop: '28px',
              flexWrap: 'wrap',
            }}
          >
            {/* Edit Name */}
            <button
              type="button"
              onClick={() => {
                setTempName(recipientName);
                setTempCourse(courseName);
                setIsEditModalOpen(true);
              }}
              style={{
                backgroundColor: '#FFFFFF',
                color: '#141413',
                border: '1px solid #E5E3DC',
                padding: '10px 20px',
                borderRadius: '9999px',
                fontSize: '13.5px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F3F1EC';
                e.currentTarget.style.borderColor = '#DCD7CC';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.borderColor = '#E5E3DC';
              }}
            >
              Edit name
            </button>

            {/* Download PDF / Image */}
            <button
              type="button"
              onClick={handleDownloadImage}
              style={{
                backgroundColor: '#FFFFFF',
                color: '#141413',
                border: '1px solid #E5E3DC',
                padding: '10px 20px',
                borderRadius: '9999px',
                fontSize: '13.5px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.15s ease',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F3F1EC';
                e.currentTarget.style.borderColor = '#DCD7CC';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.borderColor = '#E5E3DC';
              }}
              title="Download High-Res Badge Image & Print PDF"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Download PDF</span>
            </button>

            {/* Add to LinkedIn */}
            <button
              type="button"
              onClick={handleAddToLinkedIn}
              style={{
                backgroundColor: '#D97757', // SieLabs signature accent
                color: '#FFFFFF',
                border: '1px solid #D97757',
                padding: '10px 20px',
                borderRadius: '9999px',
                fontSize: '13.5px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s ease',
                boxShadow: '0 4px 14px rgba(217, 119, 87, 0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#C96442';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#D97757';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span>Add to LinkedIn</span>
              <span style={{ fontSize: '14px', lineHeight: 1 }}>↗</span>
            </button>
          </div>

          {/* ── VERIFICATION / SHARE NOTICE ── */}
          <div
            style={{
              textAlign: 'center',
              marginTop: '22px',
              fontSize: '13px',
              color: '#6E6D68',
              lineHeight: 1.5,
            }}
          >
            <span>Anyone with the link can see this badge, including your name, and confirm it's yours. </span>
            <button
              type="button"
              onClick={handleCopyLink}
              style={{
                background: 'none',
                border: 'none',
                color: '#D97757',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '13px',
                padding: 0,
              }}
            >
              Copy link
            </button>
          </div>
        </div>
      </main>

      {/* ── SIELABS OFFICIAL FOOTER ── */}
      <footer
        style={{
          borderTop: '1px solid rgba(20, 20, 19, 0.08)',
          backgroundColor: '#F3F1EC',
          padding: '48px 0 32px',
          color: '#6E6D68',
          fontSize: '13px',
          marginTop: 'auto',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: '32px',
              paddingBottom: '32px',
              borderBottom: '1px solid rgba(20, 20, 19, 0.06)',
            }}
          >
            {/* Brand Column */}
            <div style={{ maxWidth: '340px' }}>
              <Link
                href="/"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  textDecoration: 'none',
                  color: '#141413',
                  fontFamily: 'var(--font-serif, "DM Serif Display", Georgia, serif)',
                  fontSize: '18px',
                }}
              >
                <img
                  src="/favicon.ico"
                  alt="SieLabs Logo"
                  style={{ width: '24px', height: '24px', objectFit: 'contain', borderRadius: '4px', display: 'block' }}
                />
                SieLabs
              </Link>
              <p style={{ color: '#6E6D68', marginTop: '12px', lineHeight: 1.6 }}>
                Applied software engineering, open source tools, and high-impact learning initiatives.
              </p>
              <div style={{ marginTop: '12px', color: '#9C9A92', fontSize: '12.5px' }}>
                EuroKids PreSchool Near Maratha Hotel in Narhe, Pune
              </div>
            </div>

            {/* Quick Links Column */}
            <div>
              <h4 style={{ color: '#141413', fontSize: '14px', fontWeight: 600, margin: '0 0 12px' }}>Navigation</h4>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Link href="/programs/index.html" style={{ color: '#6E6D68', textDecoration: 'none' }}>Programs</Link>
                <Link href="/products/index.html" style={{ color: '#6E6D68', textDecoration: 'none' }}>Products</Link>
                <Link href="/careers/index.html" style={{ color: '#6E6D68', textDecoration: 'none' }}>Careers</Link>
                <Link href="/certificate" style={{ color: '#D97757', textDecoration: 'none', fontWeight: 600 }}>Certificate Verification</Link>
              </nav>
            </div>

            {/* Social & Community Column */}
            <div>
              <h4 style={{ color: '#141413', fontSize: '14px', fontWeight: 600, margin: '0 0 12px' }}>Community & Social</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <a
                  href="https://chat.whatsapp.com/FhMDzQ9D6oVJ7E9WT21Xw6?s=cl&p=a&ilr=1"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#6E6D68', textDecoration: 'none' }}
                >
                  WhatsApp Community
                </a>
                <a
                  href="https://www.youtube.com/@sielabs"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#6E6D68', textDecoration: 'none' }}
                >
                  YouTube
                </a>
                <a
                  href="https://www.instagram.com/sielabs"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#6E6D68', textDecoration: 'none' }}
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>

          {/* Copyright bar */}
          <div
            style={{
              paddingTop: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              color: '#9C9A92',
              fontSize: '12.5px',
            }}
          >
            <div>© 2026 SieLabs. All rights reserved.</div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <span>Pune, Maharashtra, India</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ── EDIT NAME MODAL (SIELABS LIGHT THEME) ── */}
      {isEditModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-name-title"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(20, 20, 19, 0.45)',
            backdropFilter: 'blur(5px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setIsEditModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E3DC',
              borderRadius: '20px',
              padding: '28px',
              width: '100%',
              maxWidth: '440px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              id="edit-name-title"
              style={{
                fontSize: '19px',
                fontWeight: 600,
                color: '#141413',
                margin: '0 0 6px',
                fontFamily: 'var(--font-serif, "DM Serif Display", Georgia, serif)',
              }}
            >
              Update Certificate Details
            </h3>
            <p style={{ fontSize: '13px', color: '#6E6D68', margin: '0 0 20px', lineHeight: 1.4 }}>
              Customize your recipient name or course title as you want it to appear on your official certificate badge.
            </p>

            <form onSubmit={handleSaveName}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#141413', marginBottom: '6px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="e.g. Abhishek Bhosale"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #E5E3DC',
                    backgroundColor: '#F3F1EC',
                    color: '#141413',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#D97757')}
                  onBlur={(e) => (e.target.style.borderColor = '#E5E3DC')}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#141413', marginBottom: '6px' }}>
                  Course / Program Title
                </label>
                <input
                  type="text"
                  value={tempCourse}
                  onChange={(e) => setTempCourse(e.target.value)}
                  placeholder="e.g. Python with Machine Learning"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #E5E3DC',
                    backgroundColor: '#F3F1EC',
                    color: '#141413',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#D97757')}
                  onBlur={(e) => (e.target.style.borderColor = '#E5E3DC')}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  style={{
                    padding: '9px 18px',
                    borderRadius: '9999px',
                    border: '1px solid #E5E3DC',
                    backgroundColor: 'transparent',
                    color: '#6E6D68',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '9px 20px',
                    borderRadius: '9999px',
                    border: 'none',
                    backgroundColor: '#D97757',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(217, 119, 87, 0.25)',
                  }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── TOAST NOTIFICATION ── */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#141413',
            color: '#FAF9F5',
            padding: '12px 24px',
            borderRadius: '9999px',
            fontSize: '13.5px',
            fontWeight: 500,
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.25)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── CSS PRINT RULES FOR PDF EXPORT ── */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #certificateBadgeCard, #certificateBadgeCard * {
            visibility: visible !important;
          }
          #certificateBadgeCard {
            position: fixed !important;
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) !important;
            width: 90vw !important;
            max-width: 900px !important;
            box-shadow: none !important;
            margin: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
}

export default function CertificatePage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#FAF9F5',
            color: '#6E6D68',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          Loading SieLabs Certificate...
        </div>
      }
    >
      <CertificateContent />
    </Suspense>
  );
}
