"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface UserProfileData {
  name: string;
  email: string;
  mobile: string;
  enrolledPrograms: string[];
}

interface CountryCode {
  code: string;
  label: string;
  flagKey: string;
  name: string;
}

function FlagIN({ width = 21, height = 14 }: { width?: number; height?: number }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 16" style={{ borderRadius: "2px", overflow: "hidden", display: "block", boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.15)", flexShrink: 0 }}>
      <rect width="24" height="5.33" fill="#FF9933" />
      <rect y="5.33" width="24" height="5.33" fill="#FFFFFF" />
      <rect y="10.67" width="24" height="5.33" fill="#138808" />
      <circle cx="12" cy="8" r="2.1" stroke="#000080" strokeWidth="0.5" fill="none" />
      <circle cx="12" cy="8" r="0.6" fill="#000080" />
      <g stroke="#000080" strokeWidth="0.3">
        <line x1="12" y1="5.9" x2="12" y2="10.1" />
        <line x1="9.9" y1="8" x2="14.1" y2="8" />
        <line x1="10.5" y1="6.5" x2="13.5" y2="9.5" />
        <line x1="10.5" y1="9.5" x2="13.5" y2="6.5" />
        <line x1="11.2" y1="5.9" x2="12.8" y2="10.1" />
        <line x1="12.8" y1="5.9" x2="11.2" y2="10.1" />
      </g>
    </svg>
  );
}

function FlagUS({ width = 21, height = 14 }: { width?: number; height?: number }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 16" style={{ borderRadius: "2px", overflow: "hidden", display: "block", boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.15)", flexShrink: 0 }}>
      <rect width="24" height="16" fill="#B22234" />
      <rect y="2" width="24" height="2" fill="#FFFFFF" />
      <rect y="6" width="24" height="2" fill="#FFFFFF" />
      <rect y="10" width="24" height="2" fill="#FFFFFF" />
      <rect y="14" width="24" height="2" fill="#FFFFFF" />
      <rect width="10" height="9" fill="#3C3B6E" />
      <circle cx="3" cy="2.5" r="0.6" fill="#FFFFFF" />
      <circle cx="7" cy="2.5" r="0.6" fill="#FFFFFF" />
      <circle cx="5" cy="4.5" r="0.6" fill="#FFFFFF" />
      <circle cx="3" cy="6.5" r="0.6" fill="#FFFFFF" />
      <circle cx="7" cy="6.5" r="0.6" fill="#FFFFFF" />
    </svg>
  );
}

function FlagGB({ width = 21, height = 14 }: { width?: number; height?: number }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 16" style={{ borderRadius: "2px", overflow: "hidden", display: "block", boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.15)", flexShrink: 0 }}>
      <rect width="24" height="16" fill="#012169" />
      <path d="M0 0 L24 16 M24 0 L0 16" stroke="#FFFFFF" strokeWidth="3" />
      <path d="M0 0 L24 16 M24 0 L0 16" stroke="#C8102E" strokeWidth="1.5" />
      <path d="M12 0 V16 M0 8 H24" stroke="#FFFFFF" strokeWidth="5" />
      <path d="M12 0 V16 M0 8 H24" stroke="#C8102E" strokeWidth="3" />
    </svg>
  );
}

function FlagAE({ width = 21, height = 14 }: { width?: number; height?: number }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 16" style={{ borderRadius: "2px", overflow: "hidden", display: "block", boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.15)", flexShrink: 0 }}>
      <rect width="24" height="5.33" fill="#00732F" />
      <rect y="5.33" width="24" height="5.33" fill="#FFFFFF" />
      <rect y="10.67" width="24" height="5.33" fill="#000000" />
      <rect width="6" height="16" fill="#FF0000" />
    </svg>
  );
}

function FlagSG({ width = 21, height = 14 }: { width?: number; height?: number }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 16" style={{ borderRadius: "2px", overflow: "hidden", display: "block", boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.15)", flexShrink: 0 }}>
      <rect width="24" height="8" fill="#ED2939" />
      <rect y="8" width="24" height="8" fill="#FFFFFF" />
      <circle cx="5" cy="4" r="2.4" fill="#FFFFFF" />
      <circle cx="5.8" cy="4" r="2.1" fill="#ED2939" />
    </svg>
  );
}

function FlagDE({ width = 21, height = 14 }: { width?: number; height?: number }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 16" style={{ borderRadius: "2px", overflow: "hidden", display: "block", boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.15)", flexShrink: 0 }}>
      <rect width="24" height="5.33" fill="#000000" />
      <rect y="5.33" width="24" height="5.33" fill="#DD0000" />
      <rect y="10.67" width="24" height="5.33" fill="#FFCE00" />
    </svg>
  );
}

function FlagAU({ width = 21, height = 14 }: { width?: number; height?: number }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 16" style={{ borderRadius: "2px", overflow: "hidden", display: "block", boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.15)", flexShrink: 0 }}>
      <rect width="24" height="16" fill="#00008B" />
      <rect width="10" height="7" fill="#012169" />
      <path d="M0 0 L10 7 M10 0 L0 7" stroke="#FFFFFF" strokeWidth="1.5" />
      <path d="M5 0 V7 M0 3.5 H10" stroke="#FFFFFF" strokeWidth="2.5" />
      <path d="M5 0 V7 M0 3.5 H10" stroke="#C8102E" strokeWidth="1.2" />
      <circle cx="17" cy="4" r="0.8" fill="#FFFFFF" />
      <circle cx="20" cy="7" r="0.8" fill="#FFFFFF" />
      <circle cx="15" cy="9" r="0.8" fill="#FFFFFF" />
      <circle cx="19" cy="12" r="0.8" fill="#FFFFFF" />
      <circle cx="5" cy="12" r="1.2" fill="#FFFFFF" />
    </svg>
  );
}

function FlagCA({ width = 21, height = 14 }: { width?: number; height?: number }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 16" style={{ borderRadius: "2px", overflow: "hidden", display: "block", boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.15)", flexShrink: 0 }}>
      <rect width="6" height="16" fill="#FF0000" />
      <rect x="6" width="12" height="16" fill="#FFFFFF" />
      <rect x="18" width="6" height="16" fill="#FF0000" />
      <path d="M12 4 L13 7 L15 6 L14 8 L16 9 L13.5 10 L14 12 L12 11 L10 12 L10.5 10 L8 9 L10 8 L9 6 L11 7 Z" fill="#FF0000" />
    </svg>
  );
}

function CountryFlag({ code, width = 21, height = 14 }: { code: string; width?: number; height?: number }) {
  switch (code) {
    case "IN":
      return <FlagIN width={width} height={height} />;
    case "US":
      return <FlagUS width={width} height={height} />;
    case "GB":
      return <FlagGB width={width} height={height} />;
    case "AE":
      return <FlagAE width={width} height={height} />;
    case "SG":
      return <FlagSG width={width} height={height} />;
    case "DE":
      return <FlagDE width={width} height={height} />;
    case "AU":
      return <FlagAU width={width} height={height} />;
    case "CA":
      return <FlagCA width={width} height={height} />;
    default:
      return <FlagIN width={width} height={height} />;
  }
}

const COUNTRIES: CountryCode[] = [
  { code: "+91", label: "IND", flagKey: "IN", name: "India" },
  { code: "+1", label: "USA", flagKey: "US", name: "United States" },
  { code: "+44", label: "GBR", flagKey: "GB", name: "United Kingdom" },
  { code: "+971", label: "UAE", flagKey: "AE", name: "United Arab Emirates" },
  { code: "+65", label: "SGP", flagKey: "SG", name: "Singapore" },
  { code: "+49", label: "DEU", flagKey: "DE", name: "Germany" },
  { code: "+61", label: "AUS", flagKey: "AU", name: "Australia" },
  { code: "+1", label: "CAN", flagKey: "CA", name: "Canada" },
];

const parseMobileNumber = (mobileStr: string) => {
  if (!mobileStr) return { country: COUNTRIES[0], raw: "" };
  const trimmed = mobileStr.trim();
  const matched = COUNTRIES.find((c) => trimmed.startsWith(c.code));
  if (matched) {
    return {
      country: matched,
      raw: trimmed.slice(matched.code.length).trim(),
    };
  }
  return { country: COUNTRIES[0], raw: trimmed };
};

export default function ProfilePage() {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Country code & mobile state (Default: IND +91)
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(COUNTRIES[0]);
  const [rawMobile, setRawMobile] = useState("");

  // Enrolled programs dynamic progress state
  const [enrolledProgramsProgress, setEnrolledProgramsProgress] = useState<any[]>([]);
  const [loadingProgress, setLoadingProgress] = useState(false);
  const [userRole, setUserRole] = useState<string>("student");

  // Expanded state for curriculum modules (subtopics collapsed initially)
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  const toggleModuleSubtopics = (moduleKey: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleKey]: !prev[moduleKey]
    }));
  };

  const toggleAllModulesForProgram = (programModules: { id: string }[], programId: string) => {
    const allExpanded = programModules.every(m => Boolean(expandedModules[`${programId}_${m.id}`]));
    setExpandedModules(prev => {
      const next = { ...prev };
      programModules.forEach(m => {
        next[`${programId}_${m.id}`] = !allExpanded;
      });
      return next;
    });
  };

  // Profile Form State
  const [profile, setProfile] = useState<UserProfileData>({
    name: "",
    email: "",
    mobile: "",
    enrolledPrograms: ["Python with Machine Learning", "Open Source Mindset"],
  });

  const [activeTab, setActiveTab] = useState<"details" | "programs">("details");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const user = localStorage.getItem("user");
    setUserName(user);
    setMounted(true);

    if (user) {
      // Load saved profile or initialize from localStorage
      let savedMobile = localStorage.getItem("user_mobile") || localStorage.getItem("user_phone") || "";
      if (savedMobile === "+91 98765 43210") {
        savedMobile = "";
        localStorage.removeItem("user_mobile");
      }
      localStorage.removeItem("user_phone"); // Remove legacy key
      const parsed = parseMobileNumber(savedMobile);
      setSelectedCountry(parsed.country);
      setRawMobile(parsed.raw);

      let savedUsername = localStorage.getItem("user_email") || user;
      if (savedUsername.endsWith("@sielabs.org")) {
        savedUsername = savedUsername.replace("@sielabs.org", "");
      }

      setProfile({
        name: user,
        email: savedUsername,
        mobile: savedMobile,
        enrolledPrograms: ["Python with Machine Learning", "Open Source Mindset"],
      });

      const savedRole = localStorage.getItem("user_role") || "student";
      setUserRole(savedRole);

      // Fetch user profile from API
      fetch(`/api/user/profile?user=${encodeURIComponent(user)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.user) {
            const apiMobile = data.user.mobile || data.user.phone || "";
            setProfile((prev) => ({
              ...prev,
              name: data.user.name || prev.name,
              email: data.user.email || prev.email,
              mobile: apiMobile || prev.mobile,
            }));
            if (data.user.role) {
              setUserRole(data.user.role);
              localStorage.setItem("user_role", data.user.role);
            }
            if (apiMobile) {
              const parsedApiMobile = parseMobileNumber(apiMobile);
              setSelectedCountry(parsedApiMobile.country);
              setRawMobile(parsedApiMobile.raw);
            }
          }
        })
        .catch(() => {});

      // Fetch dynamic program progress
      setLoadingProgress(true);
      fetch(`/api/user/progress?user=${encodeURIComponent(user)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.programs) {
            setEnrolledProgramsProgress(data.programs);
          }
          if (data?.role) {
            setUserRole(data.role);
            localStorage.setItem("user_role", data.role);
          }
        })
        .catch(() => {})
        .finally(() => setLoadingProgress(false));
    }
  }, []);

  const handleCountryChange = (countryCode: string) => {
    const found = COUNTRIES.find((c) => c.code === countryCode) || COUNTRIES[0];
    setSelectedCountry(found);
    const updatedFullMobile = rawMobile.trim() ? `${found.code} ${rawMobile.trim()}` : "";
    setProfile((prev) => ({ ...prev, mobile: updatedFullMobile }));
  };

  const handleRawMobileChange = (val: string) => {
    const clean = val.replace(/[^0-9\s-]/g, "");
    setRawMobile(clean);
    const updatedFullMobile = clean.trim() ? `${selectedCountry.code} ${clean.trim()}` : "";
    setProfile((prev) => ({ ...prev, mobile: updatedFullMobile }));
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUserName(null);
    setIsDropdownOpen(false);
    router.push("/login");
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage(null);

    const fullMobile = rawMobile.trim() ? `${selectedCountry.code} ${rawMobile.trim()}` : "";
    const updatedProfile = { ...profile, mobile: fullMobile };

    try {
      // 1. Update localStorage so all tabs & navbar update instantly
      if (updatedProfile.name.trim()) {
        localStorage.setItem("user", updatedProfile.name.trim());
        setUserName(updatedProfile.name.trim());
      }
      localStorage.setItem("user_email", updatedProfile.email.trim());
      localStorage.setItem("user_mobile", fullMobile);
      localStorage.removeItem("user_phone");

      // 2. Sync to API route
      await fetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProfile),
      });

      setProfile(updatedProfile);
      setJustSaved(true);
      setSaveMessage({ type: "success", text: "Profile details updated successfully!" });
      setTimeout(() => setJustSaved(false), 3000);
      setTimeout(() => setSaveMessage(null), 4500);
    } catch {
      setProfile(updatedProfile);
      setJustSaved(true);
      setSaveMessage({ type: "success", text: "Profile updated locally!" });
      setTimeout(() => setJustSaved(false), 3000);
      setTimeout(() => setSaveMessage(null), 4500);
    } finally {
      setIsSaving(false);
    }
  };

  const initial = (userName?.trim().charAt(0) || "U").toUpperCase();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FAFAF8", color: "#1A1A1A" }}>
      {/* ── PROFILE ANIMATION KEYFRAMES ── */}
      <style>{`
        @keyframes profileSuccessPop {
          0% {
            opacity: 0;
            transform: translateY(-12px) scale(0.97);
          }
          60% {
            transform: translateY(2px) scale(1.01);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes profileCheckBounce {
          0% {
            transform: scale(0.3) rotate(-15deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.25) rotate(5deg);
          }
          75% {
            transform: scale(0.95);
          }
          100% {
            transform: scale(1) rotate(0);
            opacity: 1;
          }
        }
        @keyframes profilePulseGlow {
          0% {
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
            border-color: rgba(0, 0, 0, 0.08);
          }
          25% {
            box-shadow: 0 0 0 5px rgba(16, 185, 129, 0.22), 0 10px 30px rgba(16, 185, 129, 0.15);
            border-color: rgba(16, 185, 129, 0.45);
          }
          100% {
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
            border-color: rgba(0, 0, 0, 0.08);
          }
        }
        @keyframes profileShrinkTimer {
          from { width: 100%; }
          to { width: 0%; }
        }
        @keyframes profileConfetti {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(var(--dx), var(--dy)) scale(0.2);
          }
        }
        @keyframes profileButtonSuccess {
          0% {
            transform: scale(0.95);
          }
          50% {
            transform: scale(1.04);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>

      {/* ── HEADER NAVBAR ── */}
      <header style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.08)", backgroundColor: "#FAFAF8", position: "relative", zIndex: 100 }}>
        <div className="container" style={{ maxWidth: "1160px", margin: "0 auto", padding: "0 28px", boxSizing: "border-box" }}>
          <nav aria-label="Main navigation" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "28px 0" }}>
            <Link href="/" className="nav-brand" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", color: "#1A1A1A", fontWeight: 600, fontSize: "17px" }}>
              <img
                src="/favicon.ico"
                alt="SieLabs Logo"
                className="nav-logo"
                style={{ width: "30px", height: "30px", objectFit: "contain", borderRadius: "4px", display: "block" }}
              />
              SieLabs
            </Link>

            <div className="nav-links" style={{ display: "flex", gap: "36px", marginLeft: "auto" }}>
              <a href="/programs/index.html" style={{ textDecoration: "none", color: "rgba(26, 26, 26, 0.6)", fontSize: "14px", fontWeight: 400, transition: "color 0.2s" }}>Programs</a>
              <a href="/products/index.html" style={{ textDecoration: "none", color: "rgba(26, 26, 26, 0.6)", fontSize: "14px", fontWeight: 400, transition: "color 0.2s" }}>Products</a>
              <a href="/careers/index.html" style={{ textDecoration: "none", color: "rgba(26, 26, 26, 0.6)", fontSize: "14px", fontWeight: 400, transition: "color 0.2s" }}>Careers</a>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginLeft: "36px" }}>
              <a
                href="https://chat.whatsapp.com/FhMDzQ9D6oVJ7E9WT21Xw6?s=cl&p=a&ilr=1"
                target="_blank"
                rel="noreferrer"
                className="nav-cta nav-cta-community desktop-cta"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  backgroundColor: "#9A7B1A",
                  borderColor: "#9A7B1A",
                  color: "#FFFFFF",
                  textDecoration: "none",
                  fontSize: "13px",
                  fontWeight: 500,
                  padding: "8px 20px",
                  borderRadius: "8px",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.301-.15-1.777-.878-2.053-.978-.276-.1-.477-.15-.677.15-.2.3-.776.978-.952 1.178-.175.2-.351.225-.651.075-.3-.15-1.265-.466-2.41-1.487-.893-.796-1.496-1.78-1.671-2.08-.175-.3-.019-.462.13-.611.135-.134.301-.35.451-.525.15-.176.201-.301.301-.5.1-.2.05-.376-.025-.526-.075-.15-.677-1.632-.927-2.232-.244-.583-.493-.504-.677-.514-.175-.01-.376-.01-.576-.01-.2 0-.525.075-.8.375-.276.3-1.053 1.029-1.053 2.509 0 1.48 1.077 2.908 1.227 3.109.15.2 2.119 3.235 5.134 4.536.717.31 1.277.495 1.713.633.72.228 1.376.195 1.895.118.578-.086 1.777-.726 2.027-1.428.25-.7.25-1.3.175-1.428-.075-.128-.276-.228-.576-.378z" />
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.986-1.308A9.948 9.948 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.734 0-3.344-.462-4.737-1.268l-.34-.196-2.955.775.789-2.883-.217-.345A7.954 7.954 0 014 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8z" />
                </svg>
                Join Community
              </a>

              <div id="navAuthSection" style={{ display: "flex", alignItems: "center" }} suppressHydrationWarning>
                {mounted && userName ? (
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
                      {initial}
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
                        {/* Profile Header Item */}
                        <Link
                          href="/profile"
                          onClick={() => setIsDropdownOpen(false)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            padding: "10px 12px",
                            backgroundColor: "rgba(154, 123, 26, 0.08)",
                            borderRadius: "12px",
                            border: "1px solid rgba(154, 123, 26, 0.2)",
                            marginBottom: "6px",
                            textDecoration: "none",
                            cursor: "pointer",
                          }}
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
                            {initial}
                          </div>
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "#1A1A1A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {userName}
                            </p>
                            <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#9A7B1A", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
                              <span>User Profile</span>
                              <span>✓</span>
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
                          href="/programs/index.html"
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
                          }}
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
                          }}
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
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Link href="/login" className="nav-auth-btn nav-auth-btn--ghost">Log in</Link>
                    <Link href="/signup" className="nav-auth-btn nav-auth-btn--primary">Sign up</Link>
                  </div>
                )}
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* ── MAIN PROFILE CONTENT ── */}
      <main style={{ maxWidth: "1160px", margin: "0 auto", padding: "40px 28px 80px", boxSizing: "border-box" }}>
        {/* Breadcrumb Navigation */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "rgba(26, 26, 26, 0.5)", marginBottom: "28px" }}>
          <Link href="/" style={{ color: "rgba(26, 26, 26, 0.6)", textDecoration: "none", fontWeight: 500 }}>
            Home
          </Link>
          <span>/</span>
          <span style={{ color: "#9A7B1A", fontWeight: 600 }}>User Profile</span>
        </div>

        {!userName && mounted ? (
          /* Not Logged In Notice */
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "20px",
              padding: "48px 32px",
              textAlign: "center",
              border: "1px solid rgba(0, 0, 0, 0.08)",
              boxShadow: "0 8px 30px rgba(0, 0, 0, 0.04)",
              maxWidth: "500px",
              margin: "40px auto",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                backgroundColor: "rgba(154, 123, 26, 0.1)",
                color: "#9A7B1A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <h2 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "8px" }}>Sign in to View Profile</h2>
            <p style={{ fontSize: "14px", color: "rgba(26, 26, 26, 0.6)", marginBottom: "28px", lineHeight: 1.6 }}>
              Please log in to your account to view enrolled programs, update personal details, and check your contribution credentials.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
              <Link
                href="/login"
                style={{
                  backgroundColor: "#9A7B1A",
                  color: "#FFFFFF",
                  padding: "10px 24px",
                  borderRadius: "10px",
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: "14px",
                  boxShadow: "0 4px 14px rgba(154, 123, 26, 0.25)",
                }}
              >
                Log In
              </Link>
              <Link
                href="/signup"
                style={{
                  backgroundColor: "transparent",
                  color: "#1A1A1A",
                  border: "1px solid rgba(0, 0, 0, 0.15)",
                  padding: "10px 24px",
                  borderRadius: "10px",
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: "14px",
                }}
              >
                Sign Up
              </Link>
            </div>
          </div>
        ) : (
          /* Logged In Profile Dashboard */
          <>
            {/* Top Profile Summary Card */}
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "24px",
                padding: "36px",
                border: "1px solid rgba(0, 0, 0, 0.08)",
                boxShadow: "0 6px 24px rgba(0, 0, 0, 0.03)",
                display: "grid",
                gridTemplateColumns: "auto 1fr auto",
                alignItems: "center",
                gap: "32px",
                position: "relative",
                overflow: "hidden",
                marginBottom: "36px",
              }}
            >
              {/* Ambient Glow */}
              <div
                style={{
                  position: "absolute",
                  top: "-40%",
                  right: "-10%",
                  width: "350px",
                  height: "350px",
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(154, 123, 26, 0.08) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />

              {/* Avatar Photo / Badge */}
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    width: "88px",
                    height: "88px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, rgba(154, 123, 26, 0.2), rgba(154, 123, 26, 0.08))",
                    border: "3px solid #9A7B1A",
                    color: "#9A7B1A",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "34px",
                    fontWeight: 700,
                    boxShadow: "0 6px 20px rgba(154, 123, 26, 0.18)",
                  }}
                >
                  {initial}
                </div>
                {/* Active Status Dot */}
                <div
                  title="Active User Account"
                  style={{
                    position: "absolute",
                    bottom: "2px",
                    right: "4px",
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    backgroundColor: "#10B981",
                    border: "2.5px solid #FFFFFF",
                  }}
                />
              </div>

              {/* User Bio Details */}
              <div style={{ minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", marginBottom: "6px" }}>
                  <h1 style={{ fontSize: "26px", fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>
                    {profile.name || "User"}
                  </h1>
                </div>

                <p style={{ margin: 0, fontSize: "14px", color: "rgba(26, 26, 26, 0.6)" }}>
                  {profile.email?.includes("@") ? profile.email : `@${profile.email}`}{profile.mobile ? ` • ${profile.mobile}` : ""}
                </p>
              </div>

              {/* Quick Actions */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "flex-end" }}>
                <button
                  type="button"
                  onClick={handleLogout}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    backgroundColor: "transparent",
                    color: "#DC2626",
                    border: "1px solid rgba(220, 38, 38, 0.2)",
                    padding: "8px 16px",
                    borderRadius: "10px",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(220, 38, 38, 0.08)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Sign Out
                </button>
                <span style={{ fontSize: "11px", color: "rgba(26, 26, 26, 0.45)", fontWeight: 500 }}>
                  Joined Oct 2026
                </span>
              </div>
            </div>

            

            {/* Admin Banner if user has admin role */}
            {userRole === "admin" && (
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1.5px solid #9A7B1A",
                  borderRadius: "16px",
                  padding: "18px 24px",
                  marginBottom: "28px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "16px",
                  boxShadow: "0 4px 16px rgba(154, 123, 26, 0.12)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "10px",
                      backgroundColor: "rgba(154, 123, 26, 0.12)",
                      color: "#9A7B1A",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#1A1A1A" }}>
                      Administrator Privileges Active
                    </h3>
                    <p style={{ margin: "2px 0 0", fontSize: "13px", color: "rgba(26, 26, 26, 0.65)" }}>
                      You can enroll users and click on modules to mark them completed in the Admin Panel.
                    </p>
                  </div>
                </div>

                <Link
                  href="/admin"
                  style={{
                    backgroundColor: "#9A7B1A",
                    color: "#FFFFFF",
                    padding: "10px 20px",
                    borderRadius: "10px",
                    fontSize: "13px",
                    fontWeight: 700,
                    textDecoration: "none",
                    boxShadow: "0 2px 10px rgba(154, 123, 26, 0.25)",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span>Open Admin Panel</span>
                  <span>→</span>
                </Link>
              </div>
            )}

            {/* Navigation Tabs */}
            <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid rgba(0, 0, 0, 0.08)", marginBottom: "32px" }}>
              <button
                type="button"
                onClick={() => setActiveTab("details")}
                style={{
                  padding: "12px 20px",
                  fontSize: "14px",
                  fontWeight: 600,
                  backgroundColor: "transparent",
                  border: "none",
                  borderBottom: activeTab === "details" ? "2.5px solid #9A7B1A" : "2.5px solid transparent",
                  color: activeTab === "details" ? "#9A7B1A" : "rgba(26, 26, 26, 0.6)",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                Profile Details
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("programs")}
                style={{
                  padding: "12px 20px",
                  fontSize: "14px",
                  fontWeight: 600,
                  backgroundColor: "transparent",
                  border: "none",
                  borderBottom: activeTab === "programs" ? "2.5px solid #9A7B1A" : "2.5px solid transparent",
                  color: activeTab === "programs" ? "#9A7B1A" : "rgba(26, 26, 26, 0.6)",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                My Enrolled Programs
              </button>
              
            </div>

            {/* ── TAB 1: PROFILE DETAILS FORM ── */}
            {activeTab === "details" && (
              <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "32px" }}>
                {/* Editable Profile Information */}
                <div
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "20px",
                    padding: "32px",
                    border: "1px solid rgba(0, 0, 0, 0.08)",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
                    transition: "all 0.3s ease",
                    animation: justSaved ? "profilePulseGlow 1.4s ease-out" : "none",
                  }}
                >
                  <h2 style={{ fontSize: "18px", fontWeight: 700, margin: "0 0 6px" }}>Personal Details</h2>
                  <p style={{ fontSize: "13px", color: "rgba(26, 26, 26, 0.6)", margin: "0 0 24px" }}>
                    Update your display name and contact preferences for SieLabs learning cohorts.
                  </p>

                  {saveMessage && (
                    <div
                      style={{
                        position: "relative",
                        overflow: "hidden",
                        padding: "14px 18px",
                        borderRadius: "14px",
                        marginBottom: "22px",
                        backgroundColor: saveMessage.type === "success" ? "#ECFDF5" : "#FEF2F2",
                        border: `1.5px solid ${saveMessage.type === "success" ? "#A7F3D0" : "#FECACA"}`,
                        boxShadow: saveMessage.type === "success" ? "0 4px 16px rgba(16, 185, 129, 0.12)" : "0 4px 16px rgba(239, 68, 68, 0.1)",
                        animation: "profileSuccessPop 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "14px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div
                          style={{
                            width: "34px",
                            height: "34px",
                            borderRadius: "50%",
                            backgroundColor: saveMessage.type === "success" ? "#10B981" : "#EF4444",
                            color: "#FFFFFF",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            boxShadow: saveMessage.type === "success" ? "0 2px 8px rgba(16, 185, 129, 0.35)" : "0 2px 8px rgba(239, 68, 68, 0.35)",
                            animation: saveMessage.type === "success" ? "profileCheckBounce 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards" : "none",
                          }}
                        >
                          {saveMessage.type === "success" ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10" />
                              <line x1="12" y1="8" x2="12" y2="12" />
                              <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                          )}
                        </div>

                        <div>
                          <p style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: saveMessage.type === "success" ? "#065F46" : "#991B1B" }}>
                            {saveMessage.text}
                          </p>
                          {saveMessage.type === "success" && (
                            <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#047857", fontWeight: 500 }}>
                              Your account details have been synchronized.
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSaveMessage(null)}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: saveMessage.type === "success" ? "#059669" : "#DC2626",
                          cursor: "pointer",
                          padding: "4px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "6px",
                          opacity: 0.75,
                          transition: "opacity 0.15s ease",
                        }}
                        title="Dismiss"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>

                      {/* Shrinking progress timer bar */}
                      {saveMessage.type === "success" && (
                        <div
                          style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            height: "3px",
                            backgroundColor: "#10B981",
                            opacity: 0.45,
                            animation: "profileShrinkTimer 4.5s linear forwards",
                          }}
                        />
                      )}
                    </div>
                  )}

                  <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "rgba(26, 26, 26, 0.8)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        required
                        style={{
                          width: "100%",
                          padding: "10px 14px",
                          fontSize: "14px",
                          borderRadius: "10px",
                          border: "1px solid rgba(0, 0, 0, 0.12)",
                          backgroundColor: "#FAFAF8",
                          outline: "none",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "rgba(26, 26, 26, 0.8)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                          Username
                        </label>
                        <input
                          type="text"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          placeholder="Enter your username"
                          required
                          style={{
                            width: "100%",
                            padding: "10px 14px",
                            fontSize: "14px",
                            borderRadius: "10px",
                            border: "1px solid rgba(0, 0, 0, 0.12)",
                            backgroundColor: "#FAFAF8",
                            outline: "none",
                            boxSizing: "border-box",
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "rgba(26, 26, 26, 0.8)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                          Mobile / WhatsApp
                        </label>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "stretch",
                            backgroundColor: "#FAFAF8",
                            border: "1px solid rgba(0, 0, 0, 0.12)",
                            borderRadius: "10px",
                            overflow: "hidden",
                            boxSizing: "border-box",
                            transition: "border-color 0.15s ease",
                          }}
                        >
                          {/* Country Code Picker (Default: IND +91) */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              padding: "0 10px",
                              backgroundColor: "rgba(0, 0, 0, 0.03)",
                              borderRight: "1px solid rgba(0, 0, 0, 0.1)",
                              position: "relative",
                              flexShrink: 0,
                              cursor: "pointer",
                            }}
                            title="Country Code (Default: India +91)"
                          >
                            <CountryFlag code={selectedCountry.flagKey} width={21} height={14} />
                            <span style={{ fontSize: "12px", fontWeight: 700, color: "#1A1A1A", letterSpacing: "0.02em" }}>{selectedCountry.label}</span>
                            <span style={{ fontSize: "13px", fontWeight: 600, color: "rgba(26, 26, 26, 0.65)" }}>{selectedCountry.code}</span>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "rgba(26, 26, 26, 0.4)", marginLeft: "2px" }}>
                              <path d="m6 9 6 6 6-6" />
                            </svg>
                            <select
                              value={selectedCountry.code}
                              onChange={(e) => handleCountryChange(e.target.value)}
                              style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                opacity: 0,
                                cursor: "pointer",
                              }}
                              aria-label="Select Country Code"
                            >
                              {COUNTRIES.map((c) => (
                                <option key={c.label + c.code} value={c.code}>
                                  {c.label} ({c.code}) - {c.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Mobile input */}
                          <input
                            type="tel"
                            value={rawMobile}
                            onChange={(e) => handleRawMobileChange(e.target.value)}
                            placeholder="Enter 10-digit number"
                            maxLength={15}
                            style={{
                              flex: 1,
                              minWidth: 0,
                              padding: "10px 14px",
                              fontSize: "14px",
                              border: "none",
                              backgroundColor: "transparent",
                              outline: "none",
                              color: "#1A1A1A",
                              boxSizing: "border-box",
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    

                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px", position: "relative" }}>
                      {/* Confetti celebration burst */}
                      {justSaved && (
                        <div style={{ position: "absolute", top: "50%", right: "65px", pointerEvents: "none", zIndex: 10 }}>
                          {[
                            { x: -45, y: -45, color: "#10B981", size: 7, delay: "0ms" },
                            { x: 35, y: -48, color: "#9A7B1A", size: 6, delay: "40ms" },
                            { x: -55, y: -15, color: "#F59E0B", size: 8, delay: "20ms" },
                            { x: 50, y: -25, color: "#10B981", size: 7, delay: "60ms" },
                            { x: -35, y: 35, color: "#6366F1", size: 6, delay: "30ms" },
                            { x: 40, y: 30, color: "#10B981", size: 8, delay: "50ms" },
                            { x: 0, y: -55, color: "#9A7B1A", size: 7, delay: "10ms" },
                            { x: -20, y: -45, color: "#10B981", size: 5, delay: "70ms" },
                            { x: 20, y: -50, color: "#EC4899", size: 6, delay: "50ms" },
                            { x: -60, y: 5, color: "#F59E0B", size: 6, delay: "80ms" },
                            { x: 60, y: 5, color: "#10B981", size: 7, delay: "40ms" },
                            { x: 0, y: 40, color: "#9A7B1A", size: 6, delay: "90ms" },
                          ].map((p, i) => (
                            <span
                              key={i}
                              style={{
                                position: "absolute",
                                width: `${p.size}px`,
                                height: `${p.size}px`,
                                borderRadius: i % 2 === 0 ? "50%" : "2px",
                                backgroundColor: p.color,
                                animation: `profileConfetti 0.85s cubic-bezier(0.25, 1, 0.5, 1) ${p.delay} forwards`,
                                ["--dx" as string]: `${p.x}px`,
                                ["--dy" as string]: `${p.y}px`,
                              } as React.CSSProperties}
                            />
                          ))}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isSaving}
                        style={{
                          backgroundColor: justSaved ? "#10B981" : "#9A7B1A",
                          color: "#FFFFFF",
                          padding: "11px 28px",
                          borderRadius: "10px",
                          border: "none",
                          fontSize: "14px",
                          fontWeight: 600,
                          cursor: isSaving ? "not-allowed" : "pointer",
                          opacity: isSaving ? 0.7 : 1,
                          boxShadow: justSaved
                            ? "0 4px 16px rgba(16, 185, 129, 0.35)"
                            : "0 4px 14px rgba(154, 123, 26, 0.25)",
                          transition: "all 0.25s ease",
                          animation: justSaved ? "profileButtonSuccess 0.4s cubic-bezier(0.16, 1, 0.3, 1)" : "none",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        {isSaving ? (
                          <>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: "spin 0.8s linear infinite" }}>
                              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" />
                              <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" />
                            </svg>
                            <span>Saving...</span>
                          </>
                        ) : justSaved ? (
                          <>
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "profileCheckBounce 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}>
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <span>Saved!</span>
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Right Column: Security & Cohort Info */}
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  {/* Account Security Card */}
                  <div
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderRadius: "20px",
                      padding: "24px",
                      border: "1px solid rgba(0, 0, 0, 0.08)",
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
                    }}
                  >
                    <h3 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 8px" }}>Account Security</h3>
                    <p style={{ fontSize: "13px", color: "rgba(26, 26, 26, 0.6)", margin: "0 0 16px", lineHeight: 1.5 }}>
                      Manage your password credentials and account access settings.
                    </p>
                    <Link
                      href="/forgot-password"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        color: "#9A7B1A",
                        fontSize: "13px",
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      Reset Password →
                    </Link>
                  </div>

                  {/* Student Community Hub */}
                  <div
                    style={{
                      backgroundColor: "rgba(154, 123, 26, 0.05)",
                      borderRadius: "20px",
                      padding: "24px",
                      border: "1px solid rgba(154, 123, 26, 0.2)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                      <div style={{ width: "32px", height: "32px", borderRadius: "8px", backgroundColor: "#9A7B1A", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.986-1.308A9.948 9.948 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.734 0-3.344-.462-4.737-1.268l-.34-.196-2.955.775.789-2.883-.217-.345A7.954 7.954 0 014 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8z" />
                        </svg>
                      </div>
                      <h3 style={{ fontSize: "15px", fontWeight: 700, margin: 0, color: "#1A1A1A" }}>SieLabs Community WhatsApp</h3>
                    </div>
                    <p style={{ fontSize: "13px", color: "rgba(26, 26, 26, 0.7)", margin: "0 0 16px", lineHeight: 1.5 }}>
                      Stay updated with real-time class announcements, doubt resolution rooms, and weekend code review schedules.
                    </p>
                    <a
                      href="https://chat.whatsapp.com/FhMDzQ9D6oVJ7E9WT21Xw6?s=cl&p=a&ilr=1"
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: "inline-block",
                        backgroundColor: "#9A7B1A",
                        color: "#FFFFFF",
                        padding: "8px 16px",
                        borderRadius: "8px",
                        fontSize: "13px",
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      Open WhatsApp Community
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB 2: MY ENROLLED PROGRAMS & PROGRESS ── */}
            {activeTab === "programs" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {loadingProgress ? (
                  <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", padding: "48px 32px", textAlign: "center", border: "1px solid rgba(0, 0, 0, 0.08)" }}>
                    <div style={{ width: "36px", height: "36px", border: "3px solid rgba(154, 123, 26, 0.2)", borderTopColor: "#9A7B1A", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
                    <p style={{ margin: 0, fontSize: "14px", color: "rgba(26, 26, 26, 0.6)" }}>Loading your program progress and syllabus modules...</p>
                  </div>
                ) : enrolledProgramsProgress.length === 0 ? (
                  <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", padding: "48px 32px", textAlign: "center", border: "1px solid rgba(0, 0, 0, 0.08)", boxShadow: "0 4px 16px rgba(0, 0, 0, 0.02)" }}>
                    <div style={{ width: "56px", height: "56px", borderRadius: "50%", backgroundColor: "rgba(154, 123, 26, 0.1)", color: "#9A7B1A", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                        <path d="M6 12v5c3 3 9 3 12 0v-5" />
                      </svg>
                    </div>
                    <h3 style={{ fontSize: "18px", fontWeight: 700, margin: "0 0 8px" }}>No Enrolled Programs Yet</h3>
                    <p style={{ fontSize: "14px", color: "rgba(26, 26, 26, 0.6)", margin: "0 auto 24px", maxWidth: "420px", lineHeight: 1.5 }}>
                      You have not been enrolled into any cohort yet. Please contact the administrator or browse our available engineering programs.
                    </p>
                    <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                      <a
                        href="/programs/index.html"
                        style={{ backgroundColor: "#9A7B1A", color: "#FFFFFF", padding: "10px 22px", borderRadius: "10px", fontSize: "13px", fontWeight: 600, textDecoration: "none" }}
                      >
                        Explore Programs →
                      </a>
                      {userRole === "admin" && (
                        <Link
                          href="/admin"
                          style={{ backgroundColor: "rgba(154, 123, 26, 0.1)", color: "#9A7B1A", border: "1px solid rgba(154, 123, 26, 0.3)", padding: "10px 22px", borderRadius: "10px", fontSize: "13px", fontWeight: 600, textDecoration: "none" }}
                        >
                          Enroll in Admin Panel
                        </Link>
                      )}
                    </div>
                  </div>
                ) : (
                  enrolledProgramsProgress.map((prog) => {
                    return (
                      <div
                        key={prog.programId}
                        style={{
                          backgroundColor: "#FFFFFF",
                          borderRadius: "24px",
                          padding: "32px",
                          border: prog.percentage === 100 ? "1.5px solid rgba(16, 185, 129, 0.35)" : "1px solid rgba(154, 123, 26, 0.25)",
                          boxShadow: prog.percentage === 100 ? "0 6px 24px rgba(16, 185, 129, 0.08)" : "0 6px 24px rgba(154, 123, 26, 0.05)",
                          display: "flex",
                          flexDirection: "column",
                          gap: "24px",
                        }}
                      >
                        {/* Header Banner */}
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", flexWrap: "wrap" }}>
                              <span style={{ backgroundColor: "#9A7B1A", color: "#FFFFFF", fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "12px", textTransform: "uppercase" }}>
                                PROGRAM
                              </span>
                              <span style={{ backgroundColor: prog.percentage === 100 ? "rgba(16, 185, 129, 0.15)" : "rgba(154, 123, 26, 0.12)", color: prog.percentage === 100 ? "#065F46" : "#9A7B1A", fontSize: "12px", fontWeight: 700, padding: "3px 10px", borderRadius: "12px" }}>
                                {prog.badge || "Active Cohort"}
                              </span>
                              {prog.percentage === 100 && (
                                <span style={{ backgroundColor: "#D1FAE5", color: "#065F46", fontSize: "12px", fontWeight: 700, padding: "3px 10px", borderRadius: "12px" }}>
                                  ✓ 100% Completed
                                </span>
                              )}
                            </div>

                            <h3 style={{ fontSize: "24px", fontWeight: 800, margin: "0 0 8px", color: "#1A1A1A" }}>
                              {prog.programName}
                            </h3>

                            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", fontSize: "13px", color: "rgba(26, 26, 26, 0.65)" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9A7B1A" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                <span>{prog.schedule}</span>
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9A7B1A" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                                <span>{prog.duration}</span>
                              </div>
                            </div>
                          </div>

                          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                            <a
                              href={prog.link}
                              style={{
                                backgroundColor: "rgba(154, 123, 26, 0.08)",
                                color: "#9A7B1A",
                                border: "1px solid rgba(154, 123, 26, 0.3)",
                                padding: "9px 16px",
                                borderRadius: "10px",
                                fontSize: "13px",
                                fontWeight: 600,
                                textDecoration: "none",
                              }}
                            >
                              Syllabus Page →
                            </a>
                            <a
                              href="https://chat.whatsapp.com/FhMDzQ9D6oVJ7E9WT21Xw6?s=cl&p=a&ilr=1"
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                backgroundColor: "#9A7B1A",
                                color: "#FFFFFF",
                                padding: "9px 16px",
                                borderRadius: "10px",
                                fontSize: "13px",
                                fontWeight: 600,
                                textDecoration: "none",
                                boxShadow: "0 2px 10px rgba(154, 123, 26, 0.2)",
                              }}
                            >
                              WhatsApp Cohort
                            </a>
                          </div>
                        </div>

                        {/* Progress Bar & Percentage Metric */}
                        <div style={{ backgroundColor: "#FAFAF8", borderRadius: "16px", padding: "20px 24px", border: "1px solid rgba(0, 0, 0, 0.06)" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <span style={{ fontSize: "14px", fontWeight: 700, color: "#1A1A1A" }}>Program Completion:</span>
                              <span style={{ fontSize: "14px", fontWeight: 800, color: prog.percentage === 100 ? "#10B981" : "#9A7B1A" }}>
                                {prog.completedCount} of {prog.totalModules} Modules ({prog.percentage}%)
                              </span>
                            </div>

                            <span style={{ fontSize: "12px", color: "rgba(26, 26, 26, 0.5)", fontWeight: 500 }}>
                              {prog.percentage === 100 ? "All modules completed!" : `${prog.totalModules - prog.completedCount} modules remaining`}
                            </span>
                          </div>

                          <div style={{ width: "100%", height: "10px", backgroundColor: "rgba(0, 0, 0, 0.08)", borderRadius: "6px", overflow: "hidden" }}>
                            <div
                              style={{
                                width: `${prog.percentage}%`,
                                height: "100%",
                                backgroundColor: prog.percentage === 100 ? "#10B981" : "#9A7B1A",
                                borderRadius: "6px",
                                transition: "width 0.4s ease",
                                boxShadow: prog.percentage > 0 ? "0 0 10px rgba(154, 123, 26, 0.3)" : "none",
                              }}
                            />
                          </div>
                        </div>

                        {/* Modules Breakdown List */}
                        <div>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "0 0 14px", flexWrap: "wrap", gap: "10px" }}>
                            <h4 style={{ fontSize: "15px", fontWeight: 700, margin: 0, color: "#1A1A1A", display: "flex", alignItems: "center", gap: "8px" }}>
                              <span>Curriculum Modules &amp; Status</span>
                              <span style={{ fontSize: "12px", fontWeight: 500, color: "rgba(26, 26, 26, 0.5)" }}>
                                (Updated by Admin)
                              </span>
                            </h4>

                            {prog.modules && prog.modules.some((m: { subtopics?: string[] }) => (m.subtopics || []).length > 0) && (
                              <button
                                type="button"
                                onClick={() => toggleAllModulesForProgram(prog.modules, prog.programId)}
                                style={{
                                  background: "#FFFFFF",
                                  border: "1px solid rgba(0, 0, 0, 0.12)",
                                  color: "#1A1A1A",
                                  fontSize: "12px",
                                  fontWeight: 600,
                                  padding: "5px 12px",
                                  borderRadius: "8px",
                                  cursor: "pointer",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "6px",
                                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
                                  transition: "all 0.15s ease",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = "#F8F8F6";
                                  e.currentTarget.style.borderColor = "rgba(0, 0, 0, 0.2)";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = "#FFFFFF";
                                  e.currentTarget.style.borderColor = "rgba(0, 0, 0, 0.12)";
                                }}
                              >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
                                </svg>
                                <span>
                                  {prog.modules.every((m: { id: string }) => Boolean(expandedModules[`${prog.programId}_${m.id}`]))
                                    ? "Collapse All Submodules"
                                    : "Expand All Submodules"}
                                </span>
                              </button>
                            )}
                          </div>

                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "12px" }}>
                            {prog.modules.map((m: { id: string; title: string; isCompleted: boolean; subtopics?: string[] }) => {
                              const moduleKey = `${prog.programId}_${m.id}`;
                              const hasSubtopics = Boolean(m.subtopics && m.subtopics.length > 0);
                              const isExpanded = Boolean(expandedModules[moduleKey]);

                              return (
                                <div
                                  key={m.id}
                                  onClick={() => {
                                    if (hasSubtopics) {
                                      toggleModuleSubtopics(moduleKey);
                                    }
                                  }}
                                  style={{
                                    backgroundColor: m.isCompleted ? "#F0FDF4" : "#FFFFFF",
                                    border: m.isCompleted ? "1.5px solid #10B981" : "1px solid rgba(0, 0, 0, 0.1)",
                                    borderRadius: "14px",
                                    padding: "16px 18px",
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: "12px",
                                    boxShadow: m.isCompleted ? "0 2px 10px rgba(16, 185, 129, 0.1)" : "0 2px 8px rgba(0, 0, 0, 0.02)",
                                    cursor: hasSubtopics ? "pointer" : "default",
                                    transition: "all 0.15s ease",
                                  }}
                                  onMouseEnter={(e) => {
                                    if (hasSubtopics) {
                                      e.currentTarget.style.transform = "translateY(-1px)";
                                      e.currentTarget.style.boxShadow = m.isCompleted
                                        ? "0 4px 14px rgba(16, 185, 129, 0.16)"
                                        : "0 4px 14px rgba(0, 0, 0, 0.07)";
                                    }
                                  }}
                                  onMouseLeave={(e) => {
                                    if (hasSubtopics) {
                                      e.currentTarget.style.transform = "translateY(0)";
                                      e.currentTarget.style.boxShadow = m.isCompleted
                                        ? "0 2px 10px rgba(16, 185, 129, 0.1)"
                                        : "0 2px 8px rgba(0, 0, 0, 0.02)";
                                    }
                                  }}
                                >
                                  {/* Checkmark or Pending Indicator */}
                                  <div
                                    style={{
                                      width: "28px",
                                      height: "28px",
                                      borderRadius: "50%",
                                      backgroundColor: m.isCompleted ? "#10B981" : "rgba(0, 0, 0, 0.05)",
                                      color: m.isCompleted ? "#FFFFFF" : "rgba(26, 26, 26, 0.4)",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      flexShrink: 0,
                                      marginTop: "2px",
                                      fontWeight: 700,
                                      fontSize: "13px",
                                    }}
                                  >
                                    {m.isCompleted ? (
                                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                      </svg>
                                    ) : (
                                      m.id
                                    )}
                                  </div>

                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "6px", marginBottom: "4px" }}>
                                      <span style={{ fontSize: "11px", fontWeight: 700, color: m.isCompleted ? "#065F46" : "#9A7B1A", textTransform: "uppercase" }}>
                                        Module {m.id}
                                      </span>
                                      {m.isCompleted ? (
                                        <span style={{ backgroundColor: "#D1FAE5", color: "#065F46", fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "10px", display: "inline-flex", alignItems: "center", gap: "3px" }}>
                                          <span>✓</span>
                                          <span>COMPLETED</span>
                                        </span>
                                      ) : (
                                        <span style={{ backgroundColor: "#F3F2EE", color: "rgba(26, 26, 26, 0.6)", fontSize: "10px", fontWeight: 600, padding: "2px 8px", borderRadius: "10px" }}>
                                          IN PROGRESS
                                        </span>
                                      )}
                                    </div>

                                    <p style={{ margin: "0 0 8px", fontSize: "14px", fontWeight: 700, color: m.isCompleted ? "#065F46" : "#1A1A1A", lineHeight: 1.35 }}>
                                      {m.title}
                                    </p>

                                    {/* Subtopics Toggle Trigger & Collapsible Content */}
                                    {hasSubtopics && (
                                      <div style={{ marginTop: "8px" }}>
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            toggleModuleSubtopics(moduleKey);
                                          }}
                                          style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: "5px",
                                            background: isExpanded
                                              ? (m.isCompleted ? "rgba(16, 185, 129, 0.14)" : "rgba(154, 123, 26, 0.12)")
                                              : (m.isCompleted ? "rgba(16, 185, 129, 0.08)" : "#F4F4F0"),
                                            border: isExpanded
                                              ? (m.isCompleted ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid rgba(154, 123, 26, 0.3)")
                                              : (m.isCompleted ? "1px solid rgba(16, 185, 129, 0.18)" : "1px solid rgba(0, 0, 0, 0.08)"),
                                            color: m.isCompleted ? "#065F46" : "#9A7B1A",
                                            fontSize: "11px",
                                            fontWeight: 600,
                                            padding: "3px 8px",
                                            borderRadius: "6px",
                                            cursor: "pointer",
                                            transition: "all 0.15s ease",
                                          }}
                                          aria-expanded={isExpanded}
                                        >
                                          <svg
                                            width="11"
                                            height="11"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            style={{
                                              transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                                              transition: "transform 0.2s ease"
                                            }}
                                          >
                                            <polyline points="6 9 12 15 18 9" />
                                          </svg>
                                          <span>
                                            {isExpanded
                                              ? `Hide submodules (${m.subtopics!.length})`
                                              : `${m.subtopics!.length} submodules (click to view)`}
                                          </span>
                                        </button>

                                        {isExpanded && (
                                          <div
                                            style={{
                                              marginTop: "8px",
                                              display: "flex",
                                              flexDirection: "column",
                                              gap: "5px",
                                              paddingTop: "8px",
                                              borderTop: m.isCompleted ? "1px dashed rgba(16, 185, 129, 0.3)" : "1px dashed rgba(0, 0, 0, 0.1)",
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                          >
                                            {m.subtopics!.map((sub, sIdx) => (
                                              <div
                                                key={sIdx}
                                                style={{
                                                  fontSize: "11px",
                                                  lineHeight: 1.4,
                                                  padding: "6px 9px",
                                                  borderRadius: "6px",
                                                  backgroundColor: m.isCompleted ? "rgba(16, 185, 129, 0.08)" : "#F9F9F7",
                                                  border: m.isCompleted ? "1px solid rgba(16, 185, 129, 0.18)" : "1px solid rgba(0, 0, 0, 0.05)",
                                                  color: m.isCompleted ? "#065F46" : "#2A2A2A",
                                                  display: "flex",
                                                  alignItems: "flex-start",
                                                  gap: "6px",
                                                }}
                                              >
                                                <span
                                                  style={{
                                                    fontSize: "10px",
                                                    fontWeight: 700,
                                                    color: m.isCompleted ? "#065F46" : "#9A7B1A",
                                                    flexShrink: 0,
                                                    marginTop: "1px",
                                                  }}
                                                >
                                                  •
                                                </span>
                                                <span style={{ fontWeight: 500 }}>{sub}</span>
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            
          </>
        )}
      </main>
    </div>
  );
}

