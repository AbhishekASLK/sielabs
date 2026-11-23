"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { getUserAvatarUrl, DiceBearStyle } from "@/lib/avatar";

export default function AboutPage() {
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [avatarStyle, setAvatarStyle] = useState<DiceBearStyle>("fun-emoji");
  const [avatarSeed, setAvatarSeed] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const u = localStorage.getItem("user");
      const em = localStorage.getItem("user_email");
      const role = localStorage.getItem("user_role");
      if (u) {
        setUserName(u);
        setUserEmail(em || (u.includes("@") ? u : null));
        setIsAdmin(role === "admin" || u === "admin" || u === "admin@sielabs.com" || em === "admin@sielabs.com");
      }
      const savedStyle = localStorage.getItem("user_avatar_style") as DiceBearStyle;
      const savedSeed = localStorage.getItem("user_avatar_seed");
      if (savedStyle) setAvatarStyle(savedStyle);
      if (savedSeed) setAvatarSeed(savedSeed);
    } catch {}

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsDropdownOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUserName(null);
    setIsDropdownOpen(false);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  const avatarUrl = getUserAvatarUrl(userName || "SieLabs", avatarStyle, avatarSeed);
  const initial = (userName?.trim().charAt(0) || "U").toUpperCase();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg, #FAF9F5)", display: "flex", flexDirection: "column", color: "var(--text, #141413)", fontFamily: "var(--font-sans, Outfit, sans-serif)" }}>
      {/* ── HEADER NAVBAR (Homepage Style, no About button) ── */}
      <header style={{ borderBottom: "1px solid rgba(20, 20, 19, 0.08)", backgroundColor: "var(--bg, #FAF9F5)", position: "sticky", top: 0, zIndex: 100 }}>
        <div className="header-container" style={{ width: "100%", padding: "0 36px", boxSizing: "border-box" }}>
          <nav aria-label="Main navigation" style={{ padding: "16px 0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "24px" }}>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
              <Link href="/" className="nav-brand" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", color: "inherit" }}>
                <img
                  src="/favicon.ico"
                  alt="SieLabs Logo"
                  style={{ width: "30px", height: "30px", objectFit: "contain", borderRadius: "4px", display: "block" }}
                />
                <span style={{ fontFamily: "var(--font-serif, 'DM Serif Display', Georgia, serif)", fontSize: "20px", fontWeight: 500, letterSpacing: "-0.01em" }}>
                  SieLabs
                </span>
              </Link>

              {/* Navigation Links (No About button) */}
              <div className={`nav-links ${isNavOpen ? "show" : ""}`} id="navLinks" style={{ display: "flex", gap: "28px" }}>
                <a href="/programs/index.html" style={{ display: "inline-flex", alignItems: "center", gap: "4px", textDecoration: "none", color: "var(--text-muted, #6E6D68)", fontSize: "14px", fontWeight: 450 }}>
                  Explore
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}>
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </a>
                <a href="/programs/index.html" style={{ textDecoration: "none", color: "var(--text-muted, #6E6D68)", fontSize: "14px", fontWeight: 450 }}>
                  Programs
                </a>
                <a href="/products/index.html" style={{ textDecoration: "none", color: "var(--text-muted, #6E6D68)", fontSize: "14px", fontWeight: 450 }}>
                  Products
                </a>
                <a href="/careers/index.html" style={{ textDecoration: "none", color: "var(--text-muted, #6E6D68)", fontSize: "14px", fontWeight: 450 }}>
                  Careers
                </a>
              </div>
            </div>

            {/* Header Right */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              {/* WhatsApp Community Button */}
              <a
                href="https://chat.whatsapp.com/FhMDzQ9D6oVJ7E9WT21Xw6?s=cl&p=a&ilr=1"
                target="_blank"
                rel="noreferrer"
                style={{
                  padding: "7px 16px",
                  fontSize: "13px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  backgroundColor: "#FFFFFF",
                  color: "#141413",
                  border: "1px solid #E5E3DC",
                  borderRadius: "9999px",
                  fontWeight: 600,
                  textDecoration: "none",
                  transition: "all 0.15s ease",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F3F1EC")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#FFFFFF")}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="#D97757">
                  <path d="M17.472 14.382c-.301-.15-1.777-.878-2.053-.978-.276-.1-.477-.15-.677.15-.2.3-.776.978-.952 1.178-.175.2-.351.225-.651.075-.3-.15-1.265-.466-2.41-1.487-.893-.796-1.496-1.78-1.671-2.08-.175-.3-.019-.462.13-.611.135-.134.301-.35.451-.525.15-.176.201-.301.301-.5.1-.2.05-.376-.025-.526-.075-.15-.677-1.632-.927-2.232-.244-.583-.493-.504-.677-.514-.175-.01-.376-.01-.576-.01-.2 0-.525.075-.8.375-.276.3-1.053 1.029-1.053 2.509 0 1.48 1.077 2.908 1.227 3.109.15.2 2.119 3.235 5.134 4.536.717.31 1.277.495 1.713.633.72.228 1.376.195 1.895.118.578-.086 1.777-.726 2.027-1.428.25-.7.25-1.3.175-1.428-.075-.128-.276-.228-.576-.378z" />
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.986-1.308A9.948 9.948 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.734 0-3.344-.462-4.737-1.268l-.34-.196-2.955.775.789-2.883-.217-.345A7.954 7.954 0 014 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8z" />
                </svg>
                <span>Community</span>
              </a>

              {/* User Dropdown */}
              {userName ? (
                <div ref={dropdownRef} style={{ position: "relative" }}>
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                    aria-label="User profile menu"
                    aria-expanded={isDropdownOpen}
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      backgroundColor: "rgba(218, 119, 86, 0.15)",
                      border: isDropdownOpen ? "2px solid #D97757" : "1px solid rgba(218, 119, 86, 0.4)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      padding: 0,
                      overflow: "hidden",
                    }}
                  >
                    <img src={avatarUrl} alt={userName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </button>

                  {isDropdownOpen && (
                    <div
                      style={{
                        position: "absolute",
                        right: 0,
                        top: "calc(100% + 8px)",
                        width: "204px",
                        backgroundColor: "#FFFFFF",
                        borderRadius: "14px",
                        boxShadow: "0 14px 40px rgba(0, 0, 0, 0.1), 0 2px 6px rgba(0, 0, 0, 0.04)",
                        border: "1px solid #E5E3DC",
                        padding: "5px",
                        zIndex: 9999,
                      }}
                      role="menu"
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "7px 10px 6px" }}>
                        <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(217, 119, 87, 0.12)", border: "1px solid rgba(217, 119, 87, 0.3)", overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <img src={avatarUrl} alt={userName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "#141413", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", lineHeight: 1.25 }}>
                            {userEmail || userName}
                          </p>
                          <p style={{ margin: "1px 0 0", fontSize: "11px", color: "#8E8D88", fontWeight: 400, lineHeight: 1.2 }}>
                            {isAdmin ? "Administrator" : "Personal"}
                          </p>
                        </div>
                      </div>

                      <div style={{ height: "1px", backgroundColor: "rgba(20, 20, 19, 0.08)", margin: "4px 6px 5px" }} />

                      {isAdmin && (
                        <a
                          href="/admin"
                          onClick={() => setIsDropdownOpen(false)}
                          style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", borderRadius: "8px", fontSize: "13.5px", fontWeight: 500, color: "#141413", textDecoration: "none" }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F3F1EC")}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#6E6D68", flexShrink: 0 }}>
                            <rect width="18" height="18" x="3" y="3" rx="2" />
                            <path d="M9 3v18" />
                            <path d="m14 9 3 3-3 3" />
                          </svg>
                          <span>Admin Panel</span>
                        </a>
                      )}

                      <Link
                        href="/profile"
                        onClick={() => setIsDropdownOpen(false)}
                        style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", borderRadius: "8px", fontSize: "13.5px", fontWeight: 500, color: "#141413", textDecoration: "none" }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F3F1EC")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#6E6D68", flexShrink: 0 }}>
                          <circle cx="12" cy="8" r="4" />
                          <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
                        </svg>
                        <span>My Profile</span>
                      </Link>

                      <a
                        href="/programs/index.html"
                        onClick={() => setIsDropdownOpen(false)}
                        style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", borderRadius: "8px", fontSize: "13.5px", fontWeight: 500, color: "#141413", textDecoration: "none" }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F3F1EC")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#6E6D68", flexShrink: 0 }}>
                          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                        </svg>
                        <span>My Courses</span>
                      </a>

                      <Link
                        href="/certificate"
                        onClick={() => setIsDropdownOpen(false)}
                        style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", borderRadius: "8px", fontSize: "13.5px", fontWeight: 500, color: "#141413", textDecoration: "none" }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F3F1EC")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#6E6D68", flexShrink: 0 }}>
                          <circle cx="12" cy="8" r="6" />
                          <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
                        </svg>
                        <span>Certificates</span>
                      </Link>

                      <div style={{ height: "1px", backgroundColor: "rgba(20, 20, 19, 0.08)", margin: "4px 6px" }} />

                      <button
                        type="button"
                        onClick={handleLogout}
                        style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", borderRadius: "8px", border: "none", backgroundColor: "transparent", color: "#141413", fontSize: "13.5px", fontWeight: 500, cursor: "pointer", textAlign: "left" }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#F3F1EC";
                          e.currentTarget.style.color = "#DC2626";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.color = "#141413";
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ color: "inherit", flexShrink: 0 }}>
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                          <polyline points="16 17 21 12 16 7" />
                          <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        <span>Log out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  style={{
                    color: "var(--text, #141413)",
                    fontSize: "14px",
                    fontWeight: 500,
                    textDecoration: "none",
                    padding: "8px 16px",
                    borderRadius: "9999px",
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
      <main style={{ flex: 1, padding: "56px 24px 80px", maxWidth: "980px", width: "100%", margin: "0 auto", boxSizing: "border-box" }}>
        {/* Breadcrumb navigation */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--text-muted, #6E6D68)", marginBottom: "28px" }}>
          <Link href="/" style={{ color: "#D97757", textDecoration: "none", fontWeight: 500 }}>
            ← Home
          </Link>
          <span>/</span>
          <span style={{ color: "#141413", fontWeight: 500 }}>About</span>
        </div>

        {/* Hero Section */}
        <div style={{ marginBottom: "48px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 12px", borderRadius: "9999px", backgroundColor: "rgba(217, 119, 87, 0.12)", color: "#D97757", fontSize: "12px", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: "16px" }}>
            <span>Founder & Creator</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-serif, 'DM Serif Display', Georgia, serif)", fontSize: "clamp(36px, 4.5vw, 52px)", fontWeight: 400, lineHeight: 1.15, letterSpacing: "-0.02em", margin: "0 0 16px", color: "#141413" }}>
            Abhishek Bhosale
          </h1>
          <p style={{ fontSize: "18px", color: "#6E6D68", lineHeight: 1.6, maxWidth: "680px", margin: 0, fontWeight: 400 }}>
            Software engineer, systems enthusiast, and the founder of <strong style={{ color: "#141413", fontWeight: 600 }}>SieLabs</strong>. Crafting practical software architectures, deep cohort-based engineering programs, and modern digital platforms.
          </p>
        </div>

        {/* Profile Card & Connect Section */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px", marginBottom: "40px" }}>
          
          {/* Card 1: Official Profiles & Direct Links */}
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: "18px", border: "1px solid #E5E3DC", padding: "28px 24px", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "22px" }}>
              <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "linear-gradient(135deg, #D97757 0%, #A05236 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF", fontWeight: 700, fontSize: "20px", boxShadow: "0 4px 12px rgba(217, 119, 87, 0.3)" }}>
                AB
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 600, color: "#141413" }}>
                  Abhishek Bhosale
                </h3>
                <p style={{ margin: "3px 0 0", fontSize: "13px", color: "#8E8D88" }}>
                  Founder & Engineer @ SieLabs
                </p>
              </div>
            </div>

            <div style={{ height: "1px", backgroundColor: "rgba(20, 20, 19, 0.08)", margin: "0 0 20px" }} />

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {/* LinkedIn */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderRadius: "12px", border: "1px solid #EFECE4", backgroundColor: "#FAF9F5", transition: "all 0.15s ease" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "8px", backgroundColor: "#0A66C2", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0 0-3.28 1.64 1.64 0 0 0 0 3.28m1.39 9.74v-8.37H5.07v8.37h2.78z" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: "11px", fontWeight: 600, color: "#8E8D88", textTransform: "uppercase", letterSpacing: "0.04em" }}>LinkedIn</div>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "#141413" }}>abhishekaslk</div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <button
                    type="button"
                    onClick={() => handleCopy("https://linkedin.com/in/abhishekaslk", "linkedin")}
                    style={{ padding: "6px 10px", fontSize: "12px", borderRadius: "6px", border: "1px solid #DCD8CD", backgroundColor: "#FFFFFF", color: "#6E6D68", cursor: "pointer", fontWeight: 500 }}
                  >
                    {copiedLink === "linkedin" ? "Copied! ✓" : "Copy"}
                  </button>
                  <a
                    href="https://linkedin.com/in/abhishekaslk"
                    target="_blank"
                    rel="noreferrer"
                    style={{ padding: "6px 12px", fontSize: "12px", borderRadius: "6px", backgroundColor: "#0A66C2", color: "#FFFFFF", textDecoration: "none", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}
                  >
                    <span>Visit</span>
                    <span style={{ fontSize: "10px" }}>↗</span>
                  </a>
                </div>
              </div>

              {/* Instagram: Personal */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderRadius: "12px", border: "1px solid #EFECE4", backgroundColor: "#FAF9F5", transition: "all 0.15s ease" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: "11px", fontWeight: 600, color: "#8E8D88", textTransform: "uppercase", letterSpacing: "0.04em" }}>Personal Instagram</div>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "#141413" }}>@abhishekaslk</div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <button
                    type="button"
                    onClick={() => handleCopy("https://instagram.com/abhishekaslk", "ig-personal")}
                    style={{ padding: "6px 10px", fontSize: "12px", borderRadius: "6px", border: "1px solid #DCD8CD", backgroundColor: "#FFFFFF", color: "#6E6D68", cursor: "pointer", fontWeight: 500 }}
                  >
                    {copiedLink === "ig-personal" ? "Copied! ✓" : "Copy"}
                  </button>
                  <a
                    href="https://instagram.com/abhishekaslk"
                    target="_blank"
                    rel="noreferrer"
                    style={{ padding: "6px 12px", fontSize: "12px", borderRadius: "6px", backgroundColor: "#141413", color: "#FFFFFF", textDecoration: "none", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}
                  >
                    <span>Open</span>
                    <span style={{ fontSize: "10px" }}>↗</span>
                  </a>
                </div>
              </div>

              {/* Instagram: SieLabs */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderRadius: "12px", border: "1px solid #EFECE4", backgroundColor: "#FAF9F5", transition: "all 0.15s ease" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "8px", backgroundColor: "rgba(217, 119, 87, 0.15)", border: "1px solid rgba(217, 119, 87, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#D97757" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: "11px", fontWeight: 600, color: "#8E8D88", textTransform: "uppercase", letterSpacing: "0.04em" }}>SieLabs Instagram</div>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "#141413" }}>@sielabs</div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <button
                    type="button"
                    onClick={() => handleCopy("https://instagram.com/sielabs", "ig-sielabs")}
                    style={{ padding: "6px 10px", fontSize: "12px", borderRadius: "6px", border: "1px solid #DCD8CD", backgroundColor: "#FFFFFF", color: "#6E6D68", cursor: "pointer", fontWeight: 500 }}
                  >
                    {copiedLink === "ig-sielabs" ? "Copied! ✓" : "Copy"}
                  </button>
                  <a
                    href="https://instagram.com/sielabs"
                    target="_blank"
                    rel="noreferrer"
                    style={{ padding: "6px 12px", fontSize: "12px", borderRadius: "6px", backgroundColor: "#D97757", color: "#FFFFFF", textDecoration: "none", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}
                  >
                    <span>Open</span>
                    <span style={{ fontSize: "10px" }}>↗</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Mission & SieLabs Vision */}
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: "18px", border: "1px solid #E5E3DC", padding: "28px 24px", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "8px", backgroundColor: "rgba(217, 119, 87, 0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "#D97757" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                </div>
                <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 600, color: "#141413" }}>
                  About SieLabs
                </h3>
              </div>

              <p style={{ fontSize: "14.5px", color: "#6E6D68", lineHeight: 1.6, margin: "0 0 16px" }}>
                SieLabs was founded with a singular purpose: to bring back depth, intention, and real engineering craftsmanship into modern software education.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "16px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "13.5px", color: "#141413" }}>
                  <span style={{ color: "#D97757", fontWeight: 700 }}>•</span>
                  <span><strong>Cohort-based Engineering:</strong> Small-batch, hands-on masterclasses in Python, ML, and Systems.</span>
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "13.5px", color: "#141413" }}>
                  <span style={{ color: "#D97757", fontWeight: 700 }}>•</span>
                  <span><strong>Open Source Mindset:</strong> Navigating production codebases, contributing upstream, and collaborating.</span>
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "13.5px", color: "#141413" }}>
                  <span style={{ color: "#D97757", fontWeight: 700 }}>•</span>
                  <span><strong>Engineering Lab Culture:</strong> Learning through execution, architecture reviews, and production systems craft.</span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: "24px", paddingTop: "18px", borderTop: "1px solid rgba(20, 20, 19, 0.08)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "13px" }}>
                <span style={{ color: "#8E8D88" }}>Location</span>
                <span style={{ fontWeight: 600, color: "#141413" }}>Pune, Maharashtra, India</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Contact Banner */}
        <div style={{ backgroundColor: "#FAF5EE", borderRadius: "16px", border: "1px solid #EBE4D5", padding: "24px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h4 style={{ margin: "0 0 4px", fontSize: "16px", fontWeight: 600, color: "#141413" }}>
              Want to collaborate or connect directly?
            </h4>
            <p style={{ margin: 0, fontSize: "13.5px", color: "#6E6D68" }}>
              Reach out via LinkedIn or join our official WhatsApp Community.
            </p>
          </div>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <a
              href="https://linkedin.com/in/abhishekaslk"
              target="_blank"
              rel="noreferrer"
              style={{ padding: "8px 18px", fontSize: "13px", fontWeight: 600, backgroundColor: "#0A66C2", color: "#FFFFFF", borderRadius: "9999px", textDecoration: "none" }}
            >
              Message on LinkedIn
            </a>
            <a
              href="https://chat.whatsapp.com/FhMDzQ9D6oVJ7E9WT21Xw6?s=cl&p=a&ilr=1"
              target="_blank"
              rel="noreferrer"
              style={{ padding: "8px 18px", fontSize: "13px", fontWeight: 600, backgroundColor: "#FFFFFF", color: "#141413", border: "1px solid #DCD8CD", borderRadius: "9999px", textDecoration: "none" }}
            >
              Join WhatsApp
            </a>
          </div>
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "1px solid rgba(20, 20, 19, 0.08)", padding: "28px 24px", backgroundColor: "#FFFFFF", textAlign: "center", fontSize: "13px", color: "#8E8D88" }}>
        <div style={{ maxWidth: "980px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <div>
            © {new Date().getFullYear()} SieLabs. Founded by Abhishek Bhosale.
          </div>
          <div style={{ display: "flex", gap: "20px" }}>
            <Link href="/" style={{ color: "#6E6D68", textDecoration: "none" }}>Home</Link>
            <a href="/programs/index.html" style={{ color: "#6E6D68", textDecoration: "none" }}>Programs</a>
            <a href="https://instagram.com/sielabs" target="_blank" rel="noreferrer" style={{ color: "#6E6D68", textDecoration: "none" }}>@sielabs</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
