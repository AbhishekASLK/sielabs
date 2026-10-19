"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { PROGRAMS as DEFAULT_PROGRAMS, ProgramDefinition } from "@/lib/programsData";

interface StudentUser {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: string;
  enrolledPrograms: { programId: string; programName: string }[];
}

export default function ProgramEditPage() {
  const router = useRouter();
  const params = useParams();
  const programId = (params?.programId as string) || "";

  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Programs state
  const [programs, setPrograms] = useState<ProgramDefinition[]>(DEFAULT_PROGRAMS);
  const [loadingPrograms, setLoadingPrograms] = useState(true);

  // Global Program Progress state
  const [globalProgress, setGlobalProgress] = useState<Record<string, string[]>>({});
  const [loadingProgress, setLoadingProgress] = useState(true);

  // Students state (to show enrolled count for this program)
  const [students, setStudents] = useState<StudentUser[]>([]);

  // Modal state for Adding Module
  const [isAddModuleModalOpen, setIsAddModuleModalOpen] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [newModuleSummary, setNewModuleSummary] = useState("");
  const [newModuleSubtopics, setNewModuleSubtopics] = useState("");
  const [savingModule, setSavingModule] = useState(false);

  // Inline Subtopic adding state: { [moduleId]: string }
  const [subtopicInputs, setSubtopicInputs] = useState<Record<string, string>>({});
  const [savingSubtopicKey, setSavingSubtopicKey] = useState<string | null>(null);

  // Toast notifications
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const getAdminUser = () => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("user") || localStorage.getItem("user_email") || "";
  };

  // Auth check: verified against administrative account
  useEffect(() => {
    const userRole = localStorage.getItem("user_role");
    const isAdmin = userRole === "admin";

    if (isAdmin) {
      setIsAuthorized(true);
      fetchPrograms();
      fetchGlobalProgress();
      fetchStudents();
    } else {
      setIsAuthorized(false);
    }
    setIsLoadingAuth(false);
  }, []);

  const fetchPrograms = async () => {
    setLoadingPrograms(true);
    try {
      const res = await fetch("/api/admin/programs/modules");
      const data = await res.json();
      if (res.ok && data.programs) {
        setPrograms(data.programs);
      }
    } catch {
      // Fallback
    } finally {
      setLoadingPrograms(false);
    }
  };

  const fetchGlobalProgress = async () => {
    setLoadingProgress(true);
    try {
      const res = await fetch("/api/admin/modules/toggle");
      const data = await res.json();
      if (res.ok && data.progressMap) {
        setGlobalProgress(data.progressMap);
      }
    } catch {
      // Fallback
    } finally {
      setLoadingProgress(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const admin = getAdminUser();
      const res = await fetch(`/api/admin/students?admin=${encodeURIComponent(admin)}`, {
        headers: { "x-admin-user": admin }
      });
      const data = await res.json();
      if (res.ok) {
        setStudents(data.students || []);
      }
    } catch {
      // Fallback
    }
  };

  // Toggle Global Module Completion
  const handleToggleGlobalModule = async (
    targetProgramId: string,
    moduleId: string,
    currentCompleted: boolean
  ) => {
    const nextCompleted = !currentCompleted;

    // Optimistic UI update
    setGlobalProgress(prev => {
      const currentList = prev[targetProgramId] || [];
      const updated = nextCompleted
        ? [...new Set([...currentList, moduleId])]
        : currentList.filter(m => m !== moduleId);
      return { ...prev, [targetProgramId]: updated };
    });

    try {
      const admin = getAdminUser();
      const res = await fetch("/api/admin/modules/toggle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-user": admin
        },
        body: JSON.stringify({
          adminUser: admin,
          programId: targetProgramId,
          moduleId,
          completed: nextCompleted
        })
      });

      const data = await res.json();
      if (res.ok) {
        showToast(`Module ${moduleId} marked ${nextCompleted ? "Completed ✓" : "Incomplete"}`);
      } else {
        showToast(data.message || "Failed to update module", "error");
        fetchGlobalProgress();
      }
    } catch {
      showToast("Network error while updating module", "error");
      fetchGlobalProgress();
    }
  };

  // Add Module to Program
  const handleAddModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModuleTitle.trim()) {
      showToast("Module title is required", "error");
      return;
    }

    setSavingModule(true);
    try {
      const subtopicsList = newModuleSubtopics
        .split("\n")
        .map(s => s.trim())
        .filter(Boolean);

      const admin = getAdminUser();
      const res = await fetch("/api/admin/programs/modules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-user": admin
        },
        body: JSON.stringify({
          adminUser: admin,
          programId,
          title: newModuleTitle,
          summary: newModuleSummary,
          subtopics: subtopicsList
        })
      });

      const data = await res.json();
      if (res.ok) {
        showToast(`New module added successfully!`);
        setIsAddModuleModalOpen(false);
        setNewModuleTitle("");
        setNewModuleSummary("");
        setNewModuleSubtopics("");
        fetchPrograms();
      } else {
        showToast(data.message || "Failed to add module", "error");
      }
    } catch {
      showToast("Network error while adding module", "error");
    } finally {
      setSavingModule(false);
    }
  };

  // Remove Module from Program
  const handleRemoveModule = async (moduleId: string, moduleTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete Module ${moduleId}: "${moduleTitle}"? This cannot be undone.`)) {
      return;
    }

    try {
      const admin = getAdminUser();
      const res = await fetch("/api/admin/programs/modules", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-admin-user": admin
        },
        body: JSON.stringify({
          adminUser: admin,
          programId,
          moduleId
        })
      });

      const data = await res.json();
      if (res.ok) {
        showToast(`Module ${moduleId} deleted`);
        fetchPrograms();
        fetchGlobalProgress();
      } else {
        showToast(data.message || "Failed to delete module", "error");
      }
    } catch {
      showToast("Network error while deleting module", "error");
    }
  };

  // Add Subtopic to Module
  const handleAddSubtopic = async (moduleId: string) => {
    const subtopicText = (subtopicInputs[moduleId] || "").trim();

    if (!subtopicText) {
      showToast("Please enter a subtopic name", "error");
      return;
    }

    setSavingSubtopicKey(moduleId);
    try {
      const admin = getAdminUser();
      const res = await fetch("/api/admin/programs/subtopics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-user": admin
        },
        body: JSON.stringify({
          adminUser: admin,
          programId,
          moduleId,
          subtopic: subtopicText
        })
      });

      const data = await res.json();
      if (res.ok) {
        showToast(`Subtopic added to Module ${moduleId}`);
        setSubtopicInputs(prev => ({ ...prev, [moduleId]: "" }));
        fetchPrograms();
      } else {
        showToast(data.message || "Failed to add subtopic", "error");
      }
    } catch {
      showToast("Network error while adding subtopic", "error");
    } finally {
      setSavingSubtopicKey(null);
    }
  };

  // Remove Subtopic from Module
  const handleRemoveSubtopic = async (moduleId: string, subtopicIndex: number, subtopicText: string) => {
    if (!window.confirm(`Remove subtopic: "${subtopicText}"?`)) {
      return;
    }

    try {
      const admin = getAdminUser();
      const res = await fetch("/api/admin/programs/subtopics", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-admin-user": admin
        },
        body: JSON.stringify({
          adminUser: admin,
          programId,
          moduleId,
          subtopicIndex
        })
      });

      const data = await res.json();
      if (res.ok) {
        showToast(`Subtopic removed`);
        fetchPrograms();
      } else {
        showToast(data.message || "Failed to remove subtopic", "error");
      }
    } catch {
      showToast("Network error while removing subtopic", "error");
    }
  };

  if (isLoadingAuth) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#FAFAF8", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: "36px", height: "36px", border: "3px solid rgba(154, 123, 26, 0.2)", borderTopColor: "#9A7B1A", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
          <p style={{ color: "rgba(15, 23, 42, 0.65)", fontSize: "14px", fontWeight: 500 }}>Verifying administrator credentials...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#FAFAF8", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
        <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", padding: "48px 36px", maxWidth: "460px", textAlign: "center", border: "1px solid rgba(0, 0, 0, 0.08)", boxShadow: "0 10px 40px rgba(0, 0, 0, 0.04)" }}>
          <h2 style={{ fontSize: "20px", fontWeight: 700, margin: "0 0 8px", color: "#0F172A" }}>Admin Access Restricted</h2>
          <p style={{ fontSize: "14px", color: "rgba(15, 23, 42, 0.6)", lineHeight: 1.6, margin: "0 0 24px" }}>
            The SieLabs Administration Console is strictly restricted to authorized administrative accounts.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <Link href="/login" style={{ backgroundColor: "#9A7B1A", color: "#FFFFFF", padding: "10px 22px", borderRadius: "10px", fontWeight: 600, fontSize: "14px", textDecoration: "none" }}>
              Sign In as Admin
            </Link>
            <Link href="/" style={{ backgroundColor: "transparent", color: "#0F172A", border: "1px solid rgba(0, 0, 0, 0.15)", padding: "10px 22px", borderRadius: "10px", fontWeight: 600, fontSize: "14px", textDecoration: "none" }}>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const program = programs.find(p => p.id === programId);

  if (!program && !loadingPrograms) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#FAFAF8", padding: "40px 24px" }}>
        <div style={{ maxWidth: "600px", margin: "60px auto", backgroundColor: "#FFFFFF", borderRadius: "20px", padding: "40px", textAlign: "center", border: "1px solid rgba(0, 0, 0, 0.08)" }}>
          <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#0F172A", margin: "0 0 8px" }}>Program Not Found</h2>
          <p style={{ color: "rgba(15, 23, 42, 0.6)", fontSize: "14px", margin: "0 0 24px" }}>
            The requested program ID &quot;{programId}&quot; does not exist in the curriculum database.
          </p>
          <Link
            href="/admin"
            style={{
              backgroundColor: "#9A7B1A",
              color: "#FFFFFF",
              padding: "10px 20px",
              borderRadius: "10px",
              fontWeight: 700,
              fontSize: "14px",
              textDecoration: "none",
              display: "inline-block"
            }}
          >
            ← Back to Admin Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const completedModules = globalProgress[programId] || [];
  const totalModules = program?.modules?.length || 0;
  const completedCount = completedModules.length;
  const percentage = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;

  const enrolledStudentsCount = students.filter(s =>
    s.role !== "admin" &&
    (s.enrolledPrograms || []).some(ep => ep.programId === programId)
  ).length;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FAFAF8", color: "#0F172A", fontFamily: "var(--font-outfit, inherit)" }}>
      {/* Toast Notification */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: "28px",
            right: "28px",
            zIndex: 9999,
            backgroundColor: toast.type === "success" ? "#065F46" : "#991B1B",
            color: "#FFFFFF",
            padding: "12px 20px",
            borderRadius: "12px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.18)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          <span style={{ fontSize: "16px" }}>{toast.type === "success" ? "✓" : "⚠"}</span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* TOPBAR NAVIGATION */}
      <header style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.06)", backgroundColor: "#FFFFFF", position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(12px)" }}>
        <div style={{ maxWidth: "1320px", margin: "0 auto", padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", color: "#0F172A", fontWeight: 800, fontSize: "17px", letterSpacing: "-0.02em" }}>
              <img src="/favicon.ico" alt="SieLabs Logo" style={{ width: "26px", height: "26px", borderRadius: "6px" }} />
              <span>SieLabs</span>
            </Link>

            <div style={{ width: "1px", height: "18px", backgroundColor: "rgba(0, 0, 0, 0.12)" }} />

            <div style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "rgba(154, 123, 26, 0.08)", border: "1px solid rgba(154, 123, 26, 0.2)", padding: "3px 10px", borderRadius: "20px" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#10B981", display: "inline-block", boxShadow: "0 0 6px rgba(16, 185, 129, 0.6)" }} />
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#9A7B1A", letterSpacing: "0.06em", textTransform: "uppercase" }}>Admin Console</span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Link
              href="/admin"
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#0F172A",
                textDecoration: "none",
                padding: "7px 14px",
                borderRadius: "8px",
                border: "1px solid rgba(0, 0, 0, 0.12)",
                backgroundColor: "#FFFFFF",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              <span>← Back to Dashboard</span>
            </Link>

            <Link
              href="/profile"
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#0F172A",
                textDecoration: "none",
                padding: "7px 14px",
                borderRadius: "8px",
                border: "1px solid rgba(0, 0, 0, 0.12)",
                backgroundColor: "#FAFAF8",
              }}
            >
              My Profile →
            </Link>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main style={{ maxWidth: "1320px", margin: "0 auto", padding: "28px 28px 80px" }}>
        {/* Breadcrumb Navigation */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "rgba(15, 23, 42, 0.6)", marginBottom: "20px" }}>
          <Link href="/admin" style={{ color: "#9A7B1A", textDecoration: "none", fontWeight: 600 }}>
            Admin Dashboard
          </Link>
          <span>/</span>
          <span>Programs</span>
          <span>/</span>
          <span style={{ color: "#0F172A", fontWeight: 700 }}>
            {program?.title || programId}
          </span>
        </div>

        {/* Program Hero Header Card */}
        {program && (
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", padding: "28px 32px", border: "1px solid rgba(0, 0, 0, 0.06)", boxShadow: "0 2px 14px rgba(0, 0, 0, 0.02)", marginBottom: "32px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "20px", marginBottom: "20px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <span style={{ backgroundColor: "rgba(154, 123, 26, 0.12)", color: "#9A7B1A", fontSize: "11px", fontWeight: 700, padding: "3px 8px", borderRadius: "6px" }}>
                    {program.badge}
                  </span>
                  <span style={{ backgroundColor: "#F3F2EE", color: "rgba(15, 23, 42, 0.65)", fontSize: "11px", fontWeight: 600, padding: "3px 8px", borderRadius: "6px" }}>
                    {enrolledStudentsCount} {enrolledStudentsCount === 1 ? "Student" : "Students"} Enrolled
                  </span>
                </div>

                <h1 style={{ fontSize: "28px", fontWeight: 800, margin: "0 0 8px", color: "#0F172A", letterSpacing: "-0.02em" }}>
                  {program.title}
                </h1>

                <p style={{ margin: 0, fontSize: "13px", color: "rgba(15, 23, 42, 0.6)" }}>
                  {program.schedule} • {program.duration}
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "18px", fontWeight: 800, color: percentage === 100 ? "#10B981" : "#9A7B1A" }}>
                    {completedCount} / {totalModules} Modules Completed
                  </span>
                  <p style={{ margin: "2px 0 0", fontSize: "12px", fontWeight: 600, color: percentage === 100 ? "#10B981" : "rgba(15, 23, 42, 0.55)" }}>
                    {percentage}% Milestone Progress
                  </p>
                </div>

                <button
                  onClick={() => setIsAddModuleModalOpen(true)}
                  style={{
                    backgroundColor: "#9A7B1A",
                    color: "#FFFFFF",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "10px",
                    fontSize: "13px",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    boxShadow: "0 4px 14px rgba(154, 123, 26, 0.25)",
                    transition: "all 0.15s ease"
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  <span>+ Add Module</span>
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div style={{ width: "100%", height: "8px", backgroundColor: "rgba(0, 0, 0, 0.06)", borderRadius: "4px", overflow: "hidden" }}>
              <div
                style={{
                  width: `${percentage}%`,
                  height: "100%",
                  backgroundColor: percentage === 100 ? "#10B981" : "#9A7B1A",
                  borderRadius: "4px",
                  transition: "width 0.3s ease",
                }}
              />
            </div>
          </div>
        )}

        {/* Modules Section Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: 800, margin: 0, color: "#0F172A" }}>
              Curriculum Modules &amp; Subtopics
            </h2>
            <p style={{ margin: "2px 0 0", fontSize: "13px", color: "rgba(15, 23, 42, 0.55)" }}>
              Manage syllabus units, check off completed milestones, and edit subtopics for this cohort.
            </p>
          </div>
        </div>

        {/* Modules List */}
        {program && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {program.modules?.length === 0 ? (
              <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", padding: "48px 32px", textAlign: "center", border: "1px solid rgba(0, 0, 0, 0.06)" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 8px" }}>No modules created yet</h3>
                <p style={{ fontSize: "13px", color: "rgba(15, 23, 42, 0.55)", margin: "0 0 16px" }}>
                  Get started by adding the first curriculum module for this program.
                </p>
                <button
                  onClick={() => setIsAddModuleModalOpen(true)}
                  style={{ backgroundColor: "#9A7B1A", color: "#FFFFFF", border: "none", padding: "9px 18px", borderRadius: "8px", fontWeight: 700, fontSize: "13px", cursor: "pointer" }}
                >
                  + Add First Module
                </button>
              </div>
            ) : (
              program.modules.map(mod => {
                const isDone = completedModules.includes(mod.id);
                const currentSubtopicVal = subtopicInputs[mod.id] || "";

                return (
                  <div
                    key={mod.id}
                    style={{
                      backgroundColor: isDone ? "#F0FDF4" : "#FFFFFF",
                      border: isDone ? "1.5px solid rgba(16, 185, 129, 0.45)" : "1px solid rgba(0, 0, 0, 0.08)",
                      borderRadius: "14px",
                      padding: "20px 24px",
                      boxShadow: isDone ? "0 2px 10px rgba(16, 185, 129, 0.06)" : "0 1px 4px rgba(0, 0, 0, 0.02)",
                      transition: "all 0.15s ease"
                    }}
                  >
                    {/* Module Header Bar */}
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginBottom: "10px" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", flex: 1, minWidth: "260px" }}>
                        {/* Checkbox / Toggle Button */}
                        <button
                          type="button"
                          onClick={() => handleToggleGlobalModule(programId, mod.id, isDone)}
                          title={isDone ? "Click to mark as Incomplete" : "Click to mark as Completed"}
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "8px",
                            backgroundColor: isDone ? "#10B981" : "#FFFFFF",
                            border: isDone ? "none" : "2px solid rgba(0, 0, 0, 0.2)",
                            color: "#FFFFFF",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            flexShrink: 0,
                            marginTop: "2px",
                            boxShadow: isDone ? "0 2px 6px rgba(16, 185, 129, 0.3)" : "none",
                            transition: "all 0.15s ease"
                          }}
                        >
                          {isDone ? (
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          ) : (
                            <span style={{ fontSize: "12px", fontWeight: 700, color: "rgba(15, 23, 42, 0.45)" }}>{mod.id}</span>
                          )}
                        </button>

                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                            <span style={{ fontSize: "11px", fontWeight: 700, color: isDone ? "#065F46" : "#9A7B1A", textTransform: "uppercase" }}>
                              Module {mod.id}
                            </span>
                            {isDone ? (
                              <span style={{ backgroundColor: "#D1FAE5", color: "#065F46", fontSize: "10px", fontWeight: 700, padding: "2px 7px", borderRadius: "6px" }}>
                                ✓ Completed
                              </span>
                            ) : (
                              <span style={{ backgroundColor: "#F3F2EE", color: "rgba(15, 23, 42, 0.55)", fontSize: "10px", fontWeight: 600, padding: "2px 7px", borderRadius: "6px" }}>
                                In Progress
                              </span>
                            )}
                          </div>

                          <h3 style={{ margin: "0 0 4px", fontSize: "16px", fontWeight: 700, color: isDone ? "#065F46" : "#0F172A" }}>
                            {mod.title}
                          </h3>

                          {mod.summary && (
                            <p style={{ margin: 0, fontSize: "13px", color: isDone ? "rgba(6, 95, 70, 0.8)" : "rgba(15, 23, 42, 0.6)", lineHeight: 1.45 }}>
                              {mod.summary}
                            </p>
                          )}
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <button
                          onClick={() => handleToggleGlobalModule(programId, mod.id, isDone)}
                          style={{
                            backgroundColor: isDone ? "rgba(16, 185, 129, 0.12)" : "#FFFFFF",
                            color: isDone ? "#065F46" : "#0F172A",
                            border: isDone ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid rgba(0, 0, 0, 0.12)",
                            borderRadius: "8px",
                            padding: "6px 12px",
                            fontSize: "12px",
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "all 0.15s ease"
                          }}
                        >
                          {isDone ? "Mark Incomplete" : "Mark Complete"}
                        </button>

                        <button
                          onClick={() => handleRemoveModule(mod.id, mod.title)}
                          title="Delete this module"
                          style={{
                            backgroundColor: "rgba(220, 38, 38, 0.06)",
                            color: "#DC2626",
                            border: "1px solid rgba(220, 38, 38, 0.18)",
                            borderRadius: "8px",
                            padding: "6px 10px",
                            fontSize: "12px",
                            fontWeight: 600,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            transition: "all 0.15s ease"
                          }}
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>

                    {/* Subtopics Section */}
                    <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px dashed rgba(0, 0, 0, 0.08)" }}>
                      <p style={{ margin: "0 0 8px", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "rgba(15, 23, 42, 0.55)", letterSpacing: "0.04em" }}>
                        Subtopics Covered ({(mod.subtopics || []).length}):
                      </p>

                      {/* Subtopics tags list */}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "12px" }}>
                        {(mod.subtopics || []).length === 0 ? (
                          <span style={{ fontSize: "12px", color: "rgba(15, 23, 42, 0.4)", fontStyle: "italic" }}>
                            No subtopics added yet. Use the input below to add subtopics to this module.
                          </span>
                        ) : (
                          mod.subtopics?.map((sub, sIdx) => (
                            <div
                              key={sIdx}
                              style={{
                                backgroundColor: isDone ? "rgba(16, 185, 129, 0.1)" : "#FAFAF8",
                                border: isDone ? "1px solid rgba(16, 185, 129, 0.25)" : "1px solid rgba(0, 0, 0, 0.08)",
                                borderRadius: "6px",
                                padding: "3px 8px",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                fontSize: "12px",
                                color: isDone ? "#065F46" : "#0F172A",
                                fontWeight: 500
                              }}
                            >
                              <span>{sub}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveSubtopic(mod.id, sIdx, sub)}
                                title="Remove subtopic"
                                style={{
                                  background: "transparent",
                                  border: "none",
                                  color: "#DC2626",
                                  cursor: "pointer",
                                  padding: 0,
                                  fontSize: "12px",
                                  fontWeight: 700,
                                  lineHeight: 1,
                                  opacity: 0.6
                                }}
                              >
                                ✕
                              </button>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Inline Add Subtopic Input */}
                      <div style={{ display: "flex", gap: "8px", maxWidth: "520px" }}>
                        <input
                          type="text"
                          placeholder="+ Add subtopic (e.g. Regularization, Feature Scaling)..."
                          value={currentSubtopicVal}
                          onChange={e => setSubtopicInputs(prev => ({ ...prev, [mod.id]: e.target.value }))}
                          onKeyDown={e => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddSubtopic(mod.id);
                            }
                          }}
                          style={{
                            flex: 1,
                            padding: "7px 12px",
                            fontSize: "12px",
                            borderRadius: "8px",
                            border: "1px solid rgba(0, 0, 0, 0.12)",
                            backgroundColor: "#FFFFFF",
                            outline: "none"
                          }}
                        />
                        <button
                          type="button"
                          disabled={savingSubtopicKey === mod.id}
                          onClick={() => handleAddSubtopic(mod.id)}
                          style={{
                            padding: "7px 14px",
                            fontSize: "12px",
                            fontWeight: 700,
                            borderRadius: "8px",
                            backgroundColor: "#9A7B1A",
                            color: "#FFFFFF",
                            border: "none",
                            cursor: "pointer",
                            whiteSpace: "nowrap"
                          }}
                        >
                          {savingSubtopicKey === mod.id ? "Adding..." : "Add Subtopic"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </main>

      {/* MODAL: ADD MODULE */}
      {isAddModuleModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.45)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px"
          }}
          onClick={() => setIsAddModuleModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "18px",
              padding: "28px 30px",
              maxWidth: "540px",
              width: "100%",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.15)",
              border: "1px solid rgba(0, 0, 0, 0.06)",
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
              <div>
                <h2 style={{ fontSize: "18px", fontWeight: 800, margin: 0, color: "#0F172A" }}>Add Module to {program?.title}</h2>
                <p style={{ margin: "2px 0 0", fontSize: "12px", color: "rgba(15, 23, 42, 0.55)" }}>
                  Create a new curriculum module and configure its initial subtopics.
                </p>
              </div>
              <button
                onClick={() => setIsAddModuleModalOpen(false)}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "rgba(15, 23, 42, 0.45)", fontSize: "18px" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddModule} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "rgba(15, 23, 42, 0.65)", marginBottom: "5px" }}>
                  Module Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. LLMs, Transformers & Agentic Workflows"
                  value={newModuleTitle}
                  onChange={e => setNewModuleTitle(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "8px",
                    border: "1px solid rgba(0, 0, 0, 0.12)",
                    backgroundColor: "#FAFAF8",
                    fontSize: "13px",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "rgba(15, 23, 42, 0.65)", marginBottom: "5px" }}>
                  Module Summary (Optional)
                </label>
                <textarea
                  placeholder="Brief summary of what this module covers..."
                  value={newModuleSummary}
                  onChange={e => setNewModuleSummary(e.target.value)}
                  rows={2}
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "8px",
                    border: "1px solid rgba(0, 0, 0, 0.12)",
                    backgroundColor: "#FAFAF8",
                    fontSize: "13px",
                    outline: "none",
                    boxSizing: "border-box",
                    fontFamily: "inherit"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "rgba(15, 23, 42, 0.65)", marginBottom: "5px" }}>
                  Subtopics (One per line)
                </label>
                <textarea
                  placeholder="Attention mechanisms&#10;Vector search and embeddings&#10;Fine-tuning LoRA adapters&#10;Tool calling and evaluation"
                  value={newModuleSubtopics}
                  onChange={e => setNewModuleSubtopics(e.target.value)}
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "8px",
                    border: "1px solid rgba(0, 0, 0, 0.12)",
                    backgroundColor: "#FAFAF8",
                    fontSize: "12px",
                    outline: "none",
                    boxSizing: "border-box",
                    fontFamily: "inherit"
                  }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "8px" }}>
                <button
                  type="button"
                  onClick={() => setIsAddModuleModalOpen(false)}
                  style={{
                    padding: "9px 16px",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: 600,
                    backgroundColor: "transparent",
                    border: "1px solid rgba(0, 0, 0, 0.12)",
                    color: "#0F172A",
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingModule}
                  style={{
                    padding: "9px 20px",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: 700,
                    backgroundColor: "#9A7B1A",
                    color: "#FFFFFF",
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(154, 123, 26, 0.25)"
                  }}
                >
                  {savingModule ? "Saving..." : "Add Module"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

