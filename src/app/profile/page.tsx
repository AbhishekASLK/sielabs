"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getUserAvatarUrl, DICEBEAR_STYLES, DiceBearStyle, getRandomAvatarSeed } from "@/lib/avatar";

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
  const [isNavOpen, setIsNavOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

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

  const fetchProgramProgress = async (userOverride?: string) => {
    const targetUser = userOverride || userName || (typeof window !== "undefined" ? localStorage.getItem("user") : null) || "";
    if (!targetUser) {
      setLoadingProgress(false);
      return;
    }

    setLoadingProgress(true);
    try {
      const email = typeof window !== "undefined" ? (localStorage.getItem("user_email") || "") : "";
      const query = new URLSearchParams();
      query.set("user", targetUser);
      if (email) query.set("email", email);

      const res = await fetch(`/api/user/progress?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data?.programs && Array.isArray(data.programs)) {
          setEnrolledProgramsProgress(data.programs);
        }
        if (data?.role) {
          setUserRole(data.role);
          localStorage.setItem("user_role", data.role);
        }
      }
    } catch (err) {
      console.error("Failed to load program progress:", err);
    } finally {
      setLoadingProgress(false);
    }
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

  // Avatar customization states (DiceBear)
  const [avatarStyle, setAvatarStyle] = useState<DiceBearStyle>("fun-emoji");
  const [avatarSeed, setAvatarSeed] = useState<string>("");
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [tempAvatarStyle, setTempAvatarStyle] = useState<DiceBearStyle>("fun-emoji");
  const [tempAvatarSeed, setTempAvatarSeed] = useState<string>("");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsNavOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
        setIsNavOpen(false);
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
      fetchProgramProgress(user);

      // Load avatar preferences
      const savedStyle = (localStorage.getItem("user_avatar_style") as DiceBearStyle) || "fun-emoji";
      const savedSeed = localStorage.getItem("user_avatar_seed") || "";
      setAvatarStyle(savedStyle);
      setAvatarSeed(savedSeed);
      setTempAvatarStyle(savedStyle);
      setTempAvatarSeed(savedSeed);
    }

    const handleSyncAvatar = () => {
      const s = (localStorage.getItem("user_avatar_style") as DiceBearStyle) || "fun-emoji";
      const seed = localStorage.getItem("user_avatar_seed") || "";
      setAvatarStyle(s);
      setAvatarSeed(seed);
    };

    window.addEventListener("storage", handleSyncAvatar);
    window.addEventListener("sie_avatar_updated", handleSyncAvatar);

    return () => {
      window.removeEventListener("storage", handleSyncAvatar);
      window.removeEventListener("sie_avatar_updated", handleSyncAvatar);
    };
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

  const handleOpenAvatarModal = () => {
    setTempAvatarStyle(avatarStyle);
    setTempAvatarSeed(avatarSeed || userName || "SieLabs");
    setIsAvatarModalOpen(true);
  };

  const handleSaveAvatar = () => {
    setAvatarStyle(tempAvatarStyle);
    setAvatarSeed(tempAvatarSeed);
    localStorage.setItem("user_avatar_style", tempAvatarStyle);
    localStorage.setItem("user_avatar_seed", tempAvatarSeed);
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new CustomEvent("sie_avatar_updated"));
    setIsAvatarModalOpen(false);
  };

  const handleRandomizeAvatar = () => {
    setTempAvatarSeed(getRandomAvatarSeed());
  };

  const currentAvatarUrl = getUserAvatarUrl(userName || "SieLabs", avatarStyle, avatarSeed);
  const tempAvatarUrl = getUserAvatarUrl(userName || "SieLabs", tempAvatarStyle, tempAvatarSeed);

  const initial = (userName?.trim().charAt(0) || "U").toUpperCase();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FAFAF8", color: "#1A1A1A", overflowX: "hidden" }}>
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

        /* ── Profile Responsive Styles ── */
        .profile-main {
          max-width: 1160px;
          margin: 0 auto;
          padding: 40px 28px 80px;
          box-sizing: border-box;
        }

        .profile-summary-card {
          background-color: #FFFFFF;
          border-radius: 24px;
          padding: 32px;
          border: 1px solid rgba(0, 0, 0, 0.08);
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.03);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 28px;
          position: relative;
          overflow: hidden;
          margin-bottom: 32px;
        }

        .profile-summary-main {
          display: flex;
          align-items: center;
          gap: 24px;
          flex: 1;
          min-width: 0;
        }

        .profile-avatar-wrap {
          position: relative;
          flex-shrink: 0;
        }

        .profile-avatar {
          width: 82px;
          height: 82px;
          border-radius: 16px;
          background: linear-gradient(135deg, rgba(154, 123, 26, 0.18), rgba(154, 123, 26, 0.06));
          border: 2.5px solid #9A7B1A;
          color: #9A7B1A;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          font-weight: 700;
          box-shadow: 0 6px 20px rgba(154, 123, 26, 0.15);
        }

        .profile-status-dot {
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background-color: #10B981;
          border: 2.5px solid #FFFFFF;
        }

        .profile-bio {
          min-width: 0;
          flex: 1;
        }

        .profile-name {
          font-size: 24px;
          font-weight: 700;
          margin: 0 0 6px;
          letter-spacing: -0.02em;
          color: #1A1A1A;
          word-break: break-word;
        }

        .profile-details-line {
          margin: 0;
          font-size: 14px;
          color: rgba(26, 26, 26, 0.65);
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          word-break: break-word;
        }

        .profile-actions-col {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 10px;
          flex-shrink: 0;
        }

        .profile-logout-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background-color: transparent;
          color: #DC2626;
          border: 1px solid rgba(220, 38, 38, 0.25);
          padding: 8px 16px;
          border-radius: 10px;
          fontSize: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
          white-space: nowrap;
          font-family: inherit;
        }

        .profile-logout-btn:hover {
          background-color: rgba(220, 38, 38, 0.08);
          border-color: rgba(220, 38, 38, 0.4);
        }

        .profile-joined-text {
          font-size: 12px;
          color: rgba(26, 26, 26, 0.45);
          font-weight: 500;
          white-space: nowrap;
        }

        .profile-admin-banner {
          background-color: #FFFFFF;
          border: 1.5px solid #9A7B1A;
          border-radius: 16px;
          padding: 18px 24px;
          margin-bottom: 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          box-shadow: 0 4px 16px rgba(154, 123, 26, 0.12);
        }

        .profile-tabs-bar {
          display: flex;
          gap: 8px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
          margin-bottom: 32px;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }

        .profile-tabs-bar::-webkit-scrollbar {
          display: none;
        }

        .profile-tab-btn {
          padding: 12px 20px;
          font-size: 14px;
          font-weight: 600;
          background-color: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.15s ease;
          white-space: nowrap;
          flex-shrink: 0;
          font-family: inherit;
        }

        .profile-details-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 32px;
          width: 100%;
          max-width: 100%;
          min-width: 0;
          box-sizing: border-box;
        }

        .profile-details-grid > * {
          min-width: 0;
          max-width: 100%;
          width: 100%;
          box-sizing: border-box;
        }

        .profile-form-card {
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          background-color: #FFFFFF;
          border-radius: 20px;
          padding: 32px;
          border: 1px solid rgba(0, 0, 0, 0.08);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
          transition: all 0.3s ease;
          overflow: hidden;
        }

        .profile-side-col {
          display: flex;
          flex-direction: column;
          gap: 24px;
          width: 100%;
          max-width: 100%;
          min-width: 0;
          box-sizing: border-box;
        }

        .profile-side-card {
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          background-color: #FFFFFF;
          border-radius: 20px;
          padding: 24px;
          border: 1px solid rgba(0, 0, 0, 0.08);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
          overflow: hidden;
        }

        .profile-form-row {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          width: 100%;
        }

        .profile-save-btn-wrap {
          display: flex;
          justify-content: flex-start;
          margin-top: 10px;
          position: relative;
        }

        .profile-save-btn {
          width: auto;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        @media (max-width: 900px) {
          .profile-details-grid {
            grid-template-columns: minmax(0, 1fr);
            gap: 24px;
          }
        }

        @media (max-width: 768px) {
          .profile-main {
            padding: 20px 16px 60px;
            width: 100%;
            max-width: 100vw;
          }
        }

        @media (max-width: 640px) {
          .profile-summary-card {
            padding: 20px 16px;
            flex-direction: column;
            align-items: stretch;
            gap: 16px;
            border-radius: 20px;
          }

          .profile-summary-main {
            gap: 14px;
            align-items: flex-start;
          }

          .profile-avatar {
            width: 62px;
            height: 62px;
            border-radius: 13px;
            font-size: 24px;
            border-width: 2px;
          }

          .profile-name {
            font-size: 20px;
            margin-bottom: 4px;
          }

          .profile-details-line {
            font-size: 13px;
            gap: 6px;
          }

          .profile-actions-col {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            padding-top: 14px;
            border-top: 1px solid rgba(0, 0, 0, 0.06);
            margin-top: 2px;
          }

          .profile-admin-banner {
            padding: 16px;
            flex-direction: column;
            align-items: stretch;
            gap: 14px;
          }

          .profile-admin-banner-btn {
            width: 100%;
            justify-content: center;
          }

          .profile-form-row {
            flex-direction: column;
            gap: 16px;
          }

          .profile-save-btn-wrap {
            justify-content: flex-start;
          }

          .profile-save-btn {
            width: auto;
            max-width: 260px;
          }

          .profile-tab-btn {
            padding: 10px 14px;
            font-size: 13px;
          }

          .profile-form-card {
            padding: 20px 16px !important;
            border-radius: 16px !important;
          }

          .profile-side-card {
            padding: 20px 16px !important;
            border-radius: 16px !important;
          }

          .profile-program-card {
            padding: 20px 16px !important;
            border-radius: 18px !important;
          }
        }
      `}</style>

      {/* ── HEADER NAVBAR ── */}
      <header style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.08)", backgroundColor: "#FAFAF8", position: "relative", zIndex: 100 }}>
        <div className="container" style={{ maxWidth: "1160px", margin: "0 auto", padding: "0 28px", boxSizing: "border-box" }}>
          <nav aria-label="Main navigation">
            <Link href="/" className="nav-brand" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", color: "#1A1A1A", fontWeight: 600, fontSize: "17px" }}>
              <img
                src="/favicon.ico"
                alt="SieLabs Logo"
                className="nav-logo"
                style={{ width: "30px", height: "30px", objectFit: "contain", borderRadius: "4px", display: "block" }}
              />
              SieLabs
            </Link>

            <div ref={navRef} className={`nav-links ${isNavOpen ? 'show' : ''}`} id="navLinks">
              <a href="/programs/index.html" onClick={() => setIsNavOpen(false)}>Programs</a>
              <a href="/products/index.html" onClick={() => setIsNavOpen(false)}>Products</a>
              <a href="/careers/index.html" onClick={() => setIsNavOpen(false)}>Careers</a>
              <a
                href="https://chat.whatsapp.com/FhMDzQ9D6oVJ7E9WT21Xw6?s=cl&p=a&ilr=1"
                target="_blank"
                rel="noreferrer"
                className="nav-cta nav-cta-community mobile-cta"
                style={{ display: "flex", alignItems: "center", gap: "6px", color: "#FFFFFF" }}
                onClick={() => setIsNavOpen(false)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ color: "#FFFFFF" }}>
                  <path d="M17.472 14.382c-.301-.15-1.777-.878-2.053-.978-.276-.1-.477-.15-.677.15-.2.3-.776.978-.952 1.178-.175.2-.351.225-.651.075-.3-.15-1.265-.466-2.41-1.487-.893-.796-1.496-1.78-1.671-2.08-.175-.3-.019-.462.13-.611.135-.134.301-.35.451-.525.15-.176.201-.301.301-.5.1-.2.05-.376-.025-.526-.075-.15-.677-1.632-.927-2.232-.244-.583-.493-.504-.677-.514-.175-.01-.376-.01-.576-.01-.2 0-.525.075-.8.375-.276.3-1.053 1.029-1.053 2.509 0 1.48 1.077 2.908 1.227 3.109.15.2 2.119 3.235 5.134 4.536.717.31 1.277.495 1.713.633.72.228 1.376.195 1.895.118.578-.086 1.777-.726 2.027-1.428.25-.7.25-1.3.175-1.428-.075-.128-.276-.228-.576-.378z" />
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.986-1.308A9.948 9.948 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.734 0-3.344-.462-4.737-1.268l-.34-.196-2.955.775.789-2.883-.217-.345A7.954 7.954 0 014 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8z" />
                </svg>
                Join Community
              </a>
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
                        width: "38px",
                        height: "38px",
                        borderRadius: "9px",
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
                        overflow: "hidden",
                        padding: 0,
                      }}
                    >
                      <img
                        src={currentAvatarUrl}
                        alt={userName || "User Avatar"}
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = "none";
                          const fallback = (e.currentTarget.parentElement?.querySelector(".nav-avatar-fallback") as HTMLElement);
                          if (fallback) fallback.style.display = "flex";
                        }}
                      />
                      <span className="nav-avatar-fallback" style={{ display: "none" }}>{initial}</span>
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
                              borderRadius: "8px",
                              backgroundColor: "rgba(154, 123, 26, 0.15)",
                              color: "#9A7B1A",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 700,
                              fontSize: "14px",
                              flexShrink: 0,
                              border: "1px solid rgba(154, 123, 26, 0.3)",
                              overflow: "hidden",
                            }}
                          >
                            <img
                              src={currentAvatarUrl}
                              alt={userName || "User Avatar"}
                              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                              onError={(e) => {
                                (e.currentTarget as HTMLElement).style.display = "none";
                                const fallback = (e.currentTarget.parentElement?.querySelector(".dd-head-fallback") as HTMLElement);
                                if (fallback) fallback.style.display = "flex";
                              }}
                            />
                            <span className="dd-head-fallback" style={{ display: "none" }}>{initial}</span>
                          </div>
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <p style={{ margin: 0, fontSize: "13.5px", fontWeight: 600, color: "#1A1A1A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {userName}
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

                        {/* Customize Avatar Item */}
                        <button
                          type="button"
                          onClick={() => {
                            setIsDropdownOpen(false);
                            handleOpenAvatarModal();
                          }}
                          style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            padding: "10px 12px",
                            borderRadius: "10px",
                            fontSize: "13px",
                            fontWeight: 500,
                            color: "#1A1A1A",
                            backgroundColor: "transparent",
                            border: "none",
                            cursor: "pointer",
                            textAlign: "left",
                            fontFamily: "inherit",
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
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10" />
                              <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                              <line x1="9" y1="9" x2="9.01" y2="9" />
                              <line x1="15" y1="9" x2="15.01" y2="9" />
                            </svg>
                          </div>
                          <span>Change Avatar</span>
                        </button>

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
                    <Link href="/login" className="nav-auth-btn nav-auth-btn--primary">Log in</Link>
                  </div>
                )}
              </div>
            </div>

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
          </nav>
        </div>
      </header>

      {/* ── MAIN PROFILE CONTENT ── */}
      <main className="profile-main">
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
            </div>
          </div>
        ) : (
          /* Logged In Profile Dashboard */
          <>
            {/* Top Profile Summary Card */}
            <div className="profile-summary-card">
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

              <div className="profile-summary-main">
                {/* Avatar Photo / Badge (Rectangular with rounded corners & DiceBear Illustration) */}
                <div className="profile-avatar-wrap">
                  <div
                    className="profile-avatar"
                    style={{
                      overflow: "hidden",
                      position: "relative",
                      backgroundColor: "rgba(154, 123, 26, 0.08)",
                      cursor: "pointer",
                    }}
                    onClick={handleOpenAvatarModal}
                    title="Click to customize illustration"
                  >
                    <img
                      src={currentAvatarUrl}
                      alt={profile.name || "Profile illustration"}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = "none";
                        const fallback = (e.currentTarget.parentElement?.querySelector(".profile-avatar-fallback") as HTMLElement);
                        if (fallback) fallback.style.display = "flex";
                      }}
                    />
                    <div
                      className="profile-avatar-fallback"
                      style={{
                        display: "none",
                        width: "100%",
                        height: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: "32px",
                        color: "#9A7B1A",
                      }}
                    >
                      {initial}
                    </div>
                  </div>

                  {/* Edit / Change Avatar Button Overlay */}
                  <button
                    type="button"
                    onClick={handleOpenAvatarModal}
                    title="Change or randomize illustration"
                    aria-label="Change illustration avatar"
                    style={{
                      position: "absolute",
                      bottom: "-4px",
                      right: "-4px",
                      width: "28px",
                      height: "28px",
                      borderRadius: "8px",
                      backgroundColor: "#9A7B1A",
                      border: "2px solid #FFFFFF",
                      color: "#FFFFFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      boxShadow: "0 2px 8px rgba(154, 123, 26, 0.4)",
                      transition: "transform 0.15s ease, background-color 0.15s ease",
                      zIndex: 2,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                  </button>
                </div>

                {/* User Bio Details */}
                <div className="profile-bio">
                  <h1 className="profile-name">
                    {profile.name || "User"}
                  </h1>

                  <p className="profile-details-line">
                    <span>{profile.email?.includes("@") ? profile.email : `@${profile.email}`}</span>
                    {profile.mobile && (
                      <>
                        <span style={{ opacity: 0.5 }}>•</span>
                        <span>{profile.mobile}</span>
                      </>
                    )}
                  </p>

                  {/* Change Avatar Quick Trigger Pill */}
                  <div style={{ marginTop: "8px" }}>
                    <button
                      type="button"
                      onClick={handleOpenAvatarModal}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "4px 10px",
                        borderRadius: "8px",
                        backgroundColor: "rgba(154, 123, 26, 0.08)",
                        border: "1px solid rgba(154, 123, 26, 0.25)",
                        color: "#9A7B1A",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                        fontFamily: "inherit",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "rgba(154, 123, 26, 0.16)";
                        e.currentTarget.style.borderColor = "#9A7B1A";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "rgba(154, 123, 26, 0.08)";
                        e.currentTarget.style.borderColor = "rgba(154, 123, 26, 0.25)";
                      }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                        <line x1="9" y1="9" x2="9.01" y2="9" />
                        <line x1="15" y1="9" x2="15.01" y2="9" />
                      </svg>
                      <span>Change Illustration</span>
                      <span style={{ opacity: 0.65, fontSize: "11px" }}>• {DICEBEAR_STYLES.find((s) => s.id === avatarStyle)?.label || "Emoji"}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Actions & Meta */}
              <div className="profile-actions-col">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="profile-logout-btn"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  <span>Sign Out</span>
                </button>
                <span className="profile-joined-text">
                  Joined Oct 2026
                </span>
              </div>
            </div>

            {/* Admin Banner if user has admin role */}
            {userRole === "admin" && (
              <div className="profile-admin-banner">
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
                  className="profile-admin-banner-btn"
                  style={{
                    backgroundColor: "#9A7B1A",
                    color: "#FFFFFF",
                    padding: "10px 20px",
                    borderRadius: "10px",
                    fontSize: "13px",
                    fontWeight: 700,
                    textDecoration: "none",
                    boxShadow: "0 2px 10px rgba(154, 123, 26, 0.25)",
                    display: "inline-flex",
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
            <div className="profile-tabs-bar">
              <button
                type="button"
                onClick={() => setActiveTab("details")}
                className="profile-tab-btn"
                style={{
                  borderBottom: activeTab === "details" ? "2.5px solid #9A7B1A" : "2.5px solid transparent",
                  color: activeTab === "details" ? "#9A7B1A" : "rgba(26, 26, 26, 0.6)",
                }}
              >
                Profile Details
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("programs");
                  fetchProgramProgress();
                }}
                className="profile-tab-btn"
                style={{
                  borderBottom: activeTab === "programs" ? "2.5px solid #9A7B1A" : "2.5px solid transparent",
                  color: activeTab === "programs" ? "#9A7B1A" : "rgba(26, 26, 26, 0.6)",
                }}
              >
                My Enrolled Programs
              </button>
            </div>

            {/* ── TAB 1: PROFILE DETAILS FORM ── */}
            {activeTab === "details" && (
              <div className="profile-details-grid">
                {/* Editable Profile Information */}
                <div
                  className="profile-form-card"
                  style={{
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

                  <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "18px", width: "100%", maxWidth: "100%" }}>
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
                          maxWidth: "360px",
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

                    <div className="profile-form-row">
                      <div style={{ width: "100%", maxWidth: "240px" }}>
                        <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "rgba(26, 26, 26, 0.8)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                          Username
                        </label>
                        <input
                          type="text"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          placeholder="Enter username"
                          required
                          style={{
                            width: "100%",
                            maxWidth: "240px",
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

                      <div style={{ width: "100%", maxWidth: "280px" }}>
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
                            width: "100%",
                            maxWidth: "280px",
                            transition: "border-color 0.15s ease",
                          }}
                        >
                          {/* Country Code Picker (Default: IND +91) */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "5px",
                              padding: "0 8px",
                              backgroundColor: "rgba(0, 0, 0, 0.03)",
                              borderRight: "1px solid rgba(0, 0, 0, 0.1)",
                              position: "relative",
                              flexShrink: 0,
                              cursor: "pointer",
                            }}
                            title="Country Code (Default: India +91)"
                          >
                            <CountryFlag code={selectedCountry.flagKey} width={20} height={13} />
                            <span style={{ fontSize: "12px", fontWeight: 700, color: "#1A1A1A", letterSpacing: "0.02em" }}>{selectedCountry.label}</span>
                            <span style={{ fontSize: "12px", fontWeight: 600, color: "rgba(26, 26, 26, 0.65)" }}>{selectedCountry.code}</span>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "rgba(26, 26, 26, 0.4)", marginLeft: "1px" }}>
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
                            placeholder="10-digit number"
                            maxLength={10}
                            style={{
                              flex: 1,
                              minWidth: 0,
                              width: "100%",
                              padding: "10px 10px",
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

                    <div className="profile-save-btn-wrap">
                      {/* Confetti celebration burst */}
                      {justSaved && (
                        <div style={{ position: "absolute", top: "50%", left: "150px", pointerEvents: "none", zIndex: 10 }}>
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
                        className="profile-save-btn"
                        style={{
                          backgroundColor: justSaved ? "#10B981" : "#9A7B1A",
                          color: "#FFFFFF",
                          padding: "10px 24px",
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
                <div className="profile-side-col">
                  {/* Account Security Card */}
                  <div className="profile-side-card">
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
                    className="profile-side-card"
                    style={{
                      backgroundColor: "rgba(154, 123, 26, 0.05)",
                      borderColor: "rgba(154, 123, 26, 0.2)",
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
                    <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                      <a
                        href="/programs/index.html"
                        style={{ backgroundColor: "#9A7B1A", color: "#FFFFFF", padding: "10px 22px", borderRadius: "10px", fontSize: "13px", fontWeight: 600, textDecoration: "none" }}
                      >
                        Explore Programs →
                      </a>
                      <button
                        type="button"
                        onClick={() => fetchProgramProgress()}
                        style={{ backgroundColor: "rgba(154, 123, 26, 0.1)", color: "#9A7B1A", border: "1px solid rgba(154, 123, 26, 0.3)", padding: "10px 22px", borderRadius: "10px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
                      >
                        Refresh Progress
                      </button>
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
                        className="profile-program-card"
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
                        {/* Header Banner with Circular Progress in Same Row */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "20px" }}>
                          <div style={{ flex: 1, minWidth: "260px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", flexWrap: "wrap" }}>
                              <span style={{ backgroundColor: "#9A7B1A", color: "#FFFFFF", fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "12px", textTransform: "uppercase" }}>
                                PROGRAM
                              </span>
                              <span style={{ backgroundColor: prog.percentage === 100 ? "rgba(16, 185, 129, 0.15)" : "rgba(154, 123, 26, 0.12)", color: prog.percentage === 100 ? "#065F46" : "#9A7B1A", fontSize: "12px", fontWeight: 700, padding: "3px 10px", borderRadius: "12px" }}>
                                {(prog.badge || "Active Cohort").replace(/\s*•.*$/, "").trim() || "Active Cohort"}
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

                          {/* Circular Progress Widget in Same Row */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "14px",
                              backgroundColor: "#F8FAFC",
                              border: "1px solid #E2E8F0",
                              borderRadius: "14px",
                              padding: "10px 18px",
                              flexShrink: 0,
                              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)",
                            }}
                          >
                            <div style={{ position: "relative", width: "52px", height: "52px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <svg width="52" height="52" viewBox="0 0 52 52" style={{ transform: "rotate(-90deg)" }}>
                                <circle
                                  cx="26"
                                  cy="26"
                                  r="21"
                                  fill="transparent"
                                  stroke="#E2E8F0"
                                  strokeWidth="4.5"
                                />
                                <circle
                                  cx="26"
                                  cy="26"
                                  r="21"
                                  fill="transparent"
                                  stroke={prog.percentage === 100 ? "#10B981" : "#9A7B1A"}
                                  strokeWidth="4.5"
                                  strokeDasharray={131.95}
                                  strokeDashoffset={131.95 * (1 - (prog.percentage || 0) / 100)}
                                  strokeLinecap="round"
                                  style={{ transition: "stroke-dashoffset 0.6s ease" }}
                                />
                              </svg>
                              <div
                                style={{
                                  position: "absolute",
                                  fontSize: "12px",
                                  fontWeight: 800,
                                  color: prog.percentage === 100 ? "#10B981" : "#0F172A",
                                  letterSpacing: "-0.02em",
                                }}
                              >
                                {prog.percentage}%
                              </div>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                              <span style={{ fontSize: "13px", fontWeight: 700, color: "#0F172A", lineHeight: 1.2 }}>
                                {prog.completedCount} of {prog.totalModules} Modules
                              </span>
                              <span style={{ fontSize: "11px", fontWeight: 600, color: "#64748B" }}>
                                {prog.percentage === 100 ? "✓ All Complete" : `${prog.totalModules - prog.completedCount} remaining`}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Modules Breakdown List - Compact Style */}
                        <div>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "0 0 18px", flexWrap: "wrap", gap: "12px" }}>
                            <div>
                              <h4 style={{ fontSize: "18px", fontWeight: 800, margin: "0 0 4px", color: "#0F172A" }}>
                                Curriculum Modules &amp; Status
                              </h4>
                              <p style={{ margin: 0, fontSize: "13px", color: "#64748B", fontWeight: 400 }}>
                                (Updated by Admin)
                              </p>
                            </div>

                            {prog.modules && prog.modules.some((m: { subtopics?: string[] }) => (m.subtopics || []).length > 0) && (
                              <button
                                type="button"
                                onClick={() => toggleAllModulesForProgram(prog.modules, prog.programId)}
                                style={{
                                  background: "#FFFFFF",
                                  border: "1px solid #CBD5E1",
                                  color: "#0F172A",
                                  fontSize: "13px",
                                  fontWeight: 600,
                                  padding: "8px 16px",
                                  borderRadius: "8px",
                                  cursor: "pointer",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "8px",
                                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.04)",
                                  transition: "all 0.15s ease",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = "#F8FAFC";
                                  e.currentTarget.style.borderColor = "#94A3B8";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = "#FFFFFF";
                                  e.currentTarget.style.borderColor = "#CBD5E1";
                                }}
                              >
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  style={{
                                    transform: prog.modules.every((m: { id: string }) => Boolean(expandedModules[`${prog.programId}_${m.id}`]))
                                      ? "rotate(180deg)"
                                      : "rotate(0deg)",
                                    transition: "transform 0.2s ease",
                                  }}
                                >
                                  <polyline points="6 9 12 15 18 9" />
                                </svg>
                                <span>
                                  {prog.modules.every((m: { id: string }) => Boolean(expandedModules[`${prog.programId}_${m.id}`]))
                                    ? "Collapse All Submodules"
                                    : "Expand All Submodules"}
                                </span>
                              </button>
                            )}
                          </div>

                          {/* Compact Module List Container */}
                          <div
                            style={{
                              border: "1px solid #E2E8F0",
                              borderRadius: "14px",
                              overflow: "hidden",
                              backgroundColor: "#FFFFFF",
                              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.03)",
                            }}
                          >
                            {prog.modules.map((m: { id: string; title: string; isCompleted: boolean; subtopics?: string[] }, mIdx: number) => {
                              const moduleKey = `${prog.programId}_${m.id}`;
                              const hasSubtopics = Boolean(m.subtopics && m.subtopics.length > 0);
                              const isExpanded = Boolean(expandedModules[moduleKey]);
                              const isLast = mIdx === prog.modules.length - 1;

                              // Format module number (e.g., "01", "02")
                              const rawDigits = String(m.id).replace(/[^0-9]/g, "");
                              const moduleNumber = rawDigits ? rawDigits.padStart(2, "0") : String(mIdx + 1).padStart(2, "0");

                              return (
                                <div
                                  key={m.id}
                                  style={{
                                    borderBottom: isLast ? "none" : "1px solid #E2E8F0",
                                  }}
                                >
                                  <div
                                    onClick={() => {
                                      if (hasSubtopics) {
                                        toggleModuleSubtopics(moduleKey);
                                      }
                                    }}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                      padding: "16px 22px",
                                      gap: "16px",
                                      cursor: hasSubtopics ? "pointer" : "default",
                                      backgroundColor: isExpanded ? "#FAFAFA" : "#FFFFFF",
                                      transition: "background-color 0.15s ease",
                                    }}
                                    onMouseEnter={(e) => {
                                      if (hasSubtopics && !isExpanded) {
                                        e.currentTarget.style.backgroundColor = "#F8FAFC";
                                      }
                                    }}
                                    onMouseLeave={(e) => {
                                      if (!isExpanded) {
                                        e.currentTarget.style.backgroundColor = "#FFFFFF";
                                      }
                                    }}
                                  >
                                    {/* Left: MODULE 01 and Title */}
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "24px",
                                        flex: 1,
                                        minWidth: 0,
                                      }}
                                    >
                                      <span
                                        style={{
                                          fontSize: "12px",
                                          fontWeight: 700,
                                          color: "#94A3B8",
                                          textTransform: "uppercase",
                                          letterSpacing: "0.05em",
                                          minWidth: "85px",
                                          flexShrink: 0,
                                        }}
                                      >
                                        MODULE {moduleNumber}
                                      </span>

                                      <span
                                        style={{
                                          fontSize: "15px",
                                          fontWeight: 700,
                                          color: "#0F172A",
                                          lineHeight: 1.4,
                                        }}
                                      >
                                        {m.title}
                                      </span>
                                    </div>

                                    {/* Right: Status Pill and Chevron */}
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "16px",
                                        flexShrink: 0,
                                      }}
                                    >
                                      {m.isCompleted ? (
                                        <span
                                          style={{
                                            backgroundColor: "#F0FDF4",
                                            border: "1px solid #BBF7D0",
                                            color: "#15803D",
                                            fontSize: "10px",
                                            fontWeight: 700,
                                            padding: "2.5px 8px",
                                            borderRadius: "9999px",
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: "4px",
                                            lineHeight: 1.2,
                                          }}
                                        >
                                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12" />
                                          </svg>
                                          <span>Done</span>
                                        </span>
                                      ) : (
                                        <span
                                          style={{
                                            backgroundColor: "#F1F5F9",
                                            border: "1px solid #E2E8F0",
                                            color: "#475569",
                                            fontSize: "10px",
                                            fontWeight: 700,
                                            padding: "2.5px 8px",
                                            borderRadius: "9999px",
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: "5px",
                                            lineHeight: 1.2,
                                          }}
                                        >
                                          <span
                                            style={{
                                              width: "5px",
                                              height: "5px",
                                              borderRadius: "50%",
                                              backgroundColor: "#94A3B8",
                                              display: "inline-block",
                                            }}
                                          />
                                          <span>In Progress</span>
                                        </span>
                                      )}

                                      {hasSubtopics ? (
                                        <svg
                                          width="18"
                                          height="18"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="#94A3B8"
                                          strokeWidth="2.5"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          style={{
                                            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                                            transition: "transform 0.2s ease",
                                            flexShrink: 0,
                                          }}
                                        >
                                          <polyline points="6 9 12 15 18 9" />
                                        </svg>
                                      ) : (
                                        <div style={{ width: "18px" }} />
                                      )}
                                    </div>
                                  </div>

                                  {/* Submodules Accordion Section */}
                                  {hasSubtopics && isExpanded && (
                                    <div
                                      style={{
                                        backgroundColor: "#F8FAFC",
                                        borderTop: "1px solid #E2E8F0",
                                        padding: "16px 24px 20px 48px",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "10px",
                                      }}
                                    >
                                      <div
                                        style={{
                                          fontSize: "11px",
                                          fontWeight: 700,
                                          color: "#64748B",
                                          textTransform: "uppercase",
                                          letterSpacing: "0.05em",
                                          marginBottom: "2px",
                                        }}
                                      >
                                        Submodules &amp; Syllabus Coverage ({m.subtopics!.length})
                                      </div>

                                      <div
                                        style={{
                                          display: "grid",
                                          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                                          gap: "8px",
                                        }}
                                      >
                                        {m.subtopics!.map((sub: string, sIdx: number) => (
                                          <div
                                            key={sIdx}
                                            style={{
                                              display: "flex",
                                              alignItems: "center",
                                              gap: "10px",
                                              backgroundColor: "#FFFFFF",
                                              border: "1px solid #E2E8F0",
                                              borderRadius: "8px",
                                              padding: "8px 12px",
                                              fontSize: "13px",
                                              color: "#1E293B",
                                              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.02)",
                                            }}
                                          >
                                            <span
                                              style={{
                                                width: "6px",
                                                height: "6px",
                                                borderRadius: "50%",
                                                backgroundColor: m.isCompleted ? "#10B981" : "#94A3B8",
                                                flexShrink: 0,
                                              }}
                                            />
                                            <span style={{ fontWeight: 500, lineHeight: 1.35 }}>{sub}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
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

      {/* ── DICEBEAR AVATAR CUSTOMIZER MODAL ── */}
      {isAvatarModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="avatar-modal-title"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            backgroundColor: "rgba(15, 23, 42, 0.55)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
            boxSizing: "border-box",
            animation: "fadeIn 0.2s ease-out",
          }}
          onClick={() => setIsAvatarModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "20px",
              width: "100%",
              maxWidth: "520px",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.08)",
              boxSizing: "border-box",
              padding: "24px",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "20px", gap: "12px" }}>
              <div>
                <h2 id="avatar-modal-title" style={{ margin: 0, fontSize: "19px", fontWeight: 700, color: "#1A1A1A" }}>
                  Customize Illustration
                </h2>
                <p style={{ margin: "4px 0 0", fontSize: "13px", color: "rgba(26, 26, 26, 0.6)" }}>
                  Choose an art style and roll the dice to generate a unique look.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAvatarModalOpen(false)}
                aria-label="Close modal"
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "rgba(26, 26, 26, 0.5)",
                  padding: "4px",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Live Preview & Randomizer Card */}
            <div
              style={{
                backgroundColor: "#FBFBF9",
                borderRadius: "16px",
                border: "1px solid rgba(154, 123, 26, 0.2)",
                padding: "20px",
                display: "flex",
                alignItems: "center",
                gap: "20px",
                marginBottom: "22px",
                flexWrap: "wrap",
              }}
            >
              {/* Preview Avatar Image (Rectangular 16px radius) */}
              <div
                style={{
                  width: "84px",
                  height: "84px",
                  borderRadius: "16px",
                  border: "2.5px solid #9A7B1A",
                  backgroundColor: "rgba(154, 123, 26, 0.08)",
                  overflow: "hidden",
                  boxShadow: "0 8px 24px rgba(154, 123, 26, 0.2)",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={tempAvatarUrl}
                  alt="Preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>

              {/* Controls next to preview */}
              <div style={{ flex: 1, minWidth: "180px", display: "flex", flexDirection: "column", gap: "10px" }}>
                <button
                  type="button"
                  onClick={handleRandomizeAvatar}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    backgroundColor: "#9A7B1A",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "10px",
                    padding: "9px 16px",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                    boxShadow: "0 3px 12px rgba(154, 123, 26, 0.25)",
                    transition: "transform 0.15s ease, background-color 0.15s ease",
                    fontFamily: "inherit",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#7A6015";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#9A7B1A";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <span style={{ fontSize: "16px" }}>🎲</span>
                  <span>Roll Random Look</span>
                </button>

                {/* Seed Input */}
                <div>
                  <label
                    htmlFor="custom-avatar-seed"
                    style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "rgba(26, 26, 26, 0.6)", marginBottom: "4px" }}
                  >
                    Custom seed or nickname:
                  </label>
                  <input
                    id="custom-avatar-seed"
                    type="text"
                    value={tempAvatarSeed}
                    onChange={(e) => setTempAvatarSeed(e.target.value)}
                    placeholder="e.g. SieLabs, Alex, Ninja..."
                    style={{
                      width: "100%",
                      padding: "7px 10px",
                      borderRadius: "8px",
                      border: "1px solid rgba(0, 0, 0, 0.15)",
                      fontSize: "12.5px",
                      backgroundColor: "#FFFFFF",
                      color: "#1A1A1A",
                      outline: "none",
                      boxSizing: "border-box",
                      fontFamily: "inherit",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Illustration Styles Selector */}
            <div style={{ marginBottom: "22px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#1A1A1A", marginBottom: "10px" }}>
                Select Art Style
              </label>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                  gap: "10px",
                }}
              >
                {DICEBEAR_STYLES.map((styleOpt) => {
                  const isSelected = tempAvatarStyle === styleOpt.id;
                  const previewThumbUrl = getUserAvatarUrl(tempAvatarSeed || userName || "SieLabs", styleOpt.id);

                  return (
                    <button
                      key={styleOpt.id}
                      type="button"
                      onClick={() => setTempAvatarStyle(styleOpt.id)}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                        padding: "12px 10px",
                        borderRadius: "14px",
                        border: isSelected ? "2px solid #9A7B1A" : "1.5px solid rgba(0, 0, 0, 0.08)",
                        backgroundColor: isSelected ? "rgba(154, 123, 26, 0.08)" : "#FFFFFF",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                        position: "relative",
                        fontFamily: "inherit",
                      }}
                    >
                      {/* Mini Thumbnail */}
                      <div
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "12px",
                          backgroundColor: isSelected ? "#FFFFFF" : "rgba(0, 0, 0, 0.03)",
                          border: isSelected ? "1.5px solid rgba(154, 123, 26, 0.3)" : "1px solid rgba(0, 0, 0, 0.06)",
                          overflow: "hidden",
                          marginBottom: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <img
                          src={previewThumbUrl}
                          alt={styleOpt.label}
                          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        />
                      </div>

                      {/* Label & Description */}
                      <span style={{ fontSize: "12px", fontWeight: 700, color: isSelected ? "#9A7B1A" : "#1A1A1A" }}>
                        {styleOpt.label}
                      </span>
                      <span style={{ fontSize: "10px", color: "rgba(26, 26, 26, 0.55)", marginTop: "2px", lineHeight: 1.3 }}>
                        {styleOpt.description}
                      </span>

                      {/* Active indicator badge */}
                      {isSelected && (
                        <div
                          style={{
                            position: "absolute",
                            top: "6px",
                            right: "6px",
                            width: "16px",
                            height: "16px",
                            borderRadius: "50%",
                            backgroundColor: "#9A7B1A",
                            color: "#FFFFFF",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "10px",
                            fontWeight: 700,
                          }}
                        >
                          ✓
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "10px", paddingTop: "8px" }}>
              <button
                type="button"
                onClick={() => setIsAvatarModalOpen(false)}
                style={{
                  backgroundColor: "transparent",
                  color: "#1A1A1A",
                  border: "1px solid rgba(0, 0, 0, 0.12)",
                  padding: "9px 18px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveAvatar}
                style={{
                  backgroundColor: "#9A7B1A",
                  color: "#FFFFFF",
                  border: "none",
                  padding: "9px 22px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: "0 3px 12px rgba(154, 123, 26, 0.25)",
                  fontFamily: "inherit",
                }}
              >
                Save Illustration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

