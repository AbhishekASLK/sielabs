"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PROGRAMS as DEFAULT_PROGRAMS, ProgramDefinition } from "@/lib/programsData";

interface EnrolledProgramItem {
  programId: string;
  programName: string;
  enrolledAt: string;
}

interface StudentUser {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: string;
  enrolledPrograms: EnrolledProgramItem[];
  createdAt: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [currentEmail, setCurrentEmail] = useState<string | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Dynamic Programs state (persisted in MongoDB)
  const [programs, setPrograms] = useState<ProgramDefinition[]>(DEFAULT_PROGRAMS);
  const [loadingPrograms, setLoadingPrograms] = useState(false);

  // Global Program Progress state: { [programId]: string[] of completedModuleIds }
  const [globalProgress, setGlobalProgress] = useState<Record<string, string[]>>({});
  const [loadingProgress, setLoadingProgress] = useState(false);

  // Users / Students state
  const [students, setStudents] = useState<StudentUser[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProgramFilter, setSelectedProgramFilter] = useState("all");
  const [userTypeFilter, setUserTypeFilter] = useState<"all" | "enrolled" | "unenrolled">("all");

  // Layout states (matching dashboard style)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [adminTab, setAdminTab] = useState<"dashboard" | "programs" | "students" | "curriculum">("programs");
  const [selectedInspectorStudent, setSelectedInspectorStudent] = useState<StudentUser | null>(null);
  const [selectedInspectorProgram, setSelectedInspectorProgram] = useState<ProgramDefinition | null>(null);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

  // Curriculum Management states
  const [selectedCurriculumProgramId, setSelectedCurriculumProgramId] = useState<string>(DEFAULT_PROGRAMS[0].id);
  const [selectedModuleFilter, setSelectedModuleFilter] = useState<string>("all");
  const [isAddModuleModalOpen, setIsAddModuleModalOpen] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [newModuleSubtopics, setNewModuleSubtopics] = useState("");
  const [savingModule, setSavingModule] = useState(false);
  const [subtopicInputs, setSubtopicInputs] = useState<Record<string, string>>({});
  const [savingSubtopicKey, setSavingSubtopicKey] = useState<string | null>(null);
  const [expandedCurriculumModules, setExpandedCurriculumModules] = useState<Record<string, boolean>>({});
  const [isProgramDropdownOpen, setIsProgramDropdownOpen] = useState(false);
  const [isModuleDropdownOpen, setIsModuleDropdownOpen] = useState(false);
  const [isCohortDropdownOpen, setIsCohortDropdownOpen] = useState(false);
  const programDropdownRef = useRef<HTMLDivElement>(null);
  const moduleDropdownRef = useRef<HTMLDivElement>(null);
  const cohortDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (programDropdownRef.current && !programDropdownRef.current.contains(e.target as Node)) {
        setIsProgramDropdownOpen(false);
      }
      if (moduleDropdownRef.current && !moduleDropdownRef.current.contains(e.target as Node)) {
        setIsModuleDropdownOpen(false);
      }
      if (cohortDropdownRef.current && !cohortDropdownRef.current.contains(e.target as Node)) {
        setIsCohortDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  // Custom Confirmation Modal state (replacing browser default window.confirm)
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    confirmText?: string;
    confirmVariant?: "danger" | "primary";
    onConfirm: () => Promise<void> | void;
  } | null>(null);

  // Edit Module Modal state
  const [editingModule, setEditingModule] = useState<{
    programId: string;
    moduleId: string;
    title: string;
  } | null>(null);
  const [savingEditModule, setSavingEditModule] = useState(false);

  // Inline Edit Subtopic state
  const [editingSubtopic, setEditingSubtopic] = useState<{
    moduleId: string;
    index: number;
    text: string;
  } | null>(null);
  const [savingSubtopicEdit, setSavingSubtopicEdit] = useState(false);

  // Modal states for Student Enrollment
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [selectedStudentForEnroll, setSelectedStudentForEnroll] = useState("");
  const [selectedProgramForEnroll, setSelectedProgramForEnroll] = useState(DEFAULT_PROGRAMS[0].id);
  const [actionLoading, setActionLoading] = useState(false);

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
    const user = localStorage.getItem("user");
    const userEmail = localStorage.getItem("user_email");
    const userRole = localStorage.getItem("user_role");

    setCurrentUser(user);
    setCurrentEmail(userEmail);

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

  // Fetch dynamic programs (from MongoDB)
  const fetchPrograms = async () => {
    setLoadingPrograms(true);
    try {
      const res = await fetch("/api/admin/programs/modules");
      const data = await res.json();
      if (res.ok && data.programs) {
        setPrograms(data.programs);
      }
    } catch {
      // Fallback to default programs
    } finally {
      setLoadingPrograms(false);
    }
  };

  // Fetch Global Program Progress
  const fetchGlobalProgress = async () => {
    setLoadingProgress(true);
    try {
      const res = await fetch("/api/admin/modules/toggle");
      const data = await res.json();
      if (res.ok && (data.progressMap || data.progress)) {
        setGlobalProgress(data.progressMap || data.progress);
      }
    } catch {
      // Fallback
    } finally {
      setLoadingProgress(false);
    }
  };

  // Fetch Students & Registered Users
  const fetchStudents = async () => {
    setLoadingStudents(true);
    try {
      const admin = getAdminUser();
      const res = await fetch(`/api/admin/students?admin=${encodeURIComponent(admin)}`, {
        headers: { "x-admin-user": admin }
      });
      const data = await res.json();
      if (res.ok) {
        setStudents(data.students || []);
      } else {
        showToast(data.message || "Failed to load users", "error");
      }
    } catch {
      showToast("Network error while loading users", "error");
    } finally {
      setLoadingStudents(false);
    }
  };

  // Enroll Student in Program
  const handleEnrollStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForEnroll || !selectedProgramForEnroll) {
      showToast("Please choose user and program", "error");
      return;
    }

    setActionLoading(true);
    try {
      const admin = getAdminUser();
      const res = await fetch("/api/admin/enroll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-user": admin
        },
        body: JSON.stringify({
          adminUser: admin,
          studentIdentifier: selectedStudentForEnroll,
          programId: selectedProgramForEnroll
        })
      });

      const data = await res.json();
      if (res.ok) {
        showToast(`Successfully enrolled into cohort!`);
        setIsEnrollModalOpen(false);
        setSelectedStudentForEnroll("");
        fetchStudents();
      } else {
        showToast(data.message || "Failed to enroll user", "error");
      }
    } catch {
      showToast("Network error while enrolling user", "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Unenroll Student from Program (with custom confirmation modal)
  const executeUnenroll = async (studentEmail: string, programId: string, programName: string) => {
    try {
      const admin = getAdminUser();
      const res = await fetch("/api/admin/enroll", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-admin-user": admin
        },
        body: JSON.stringify({
          adminUser: admin,
          studentIdentifier: studentEmail,
          programId
        })
      });

      const data = await res.json();
      if (res.ok) {
        showToast(`Unenrolled from ${programName}`);
        fetchStudents();
        if (selectedInspectorStudent) {
          setSelectedInspectorStudent(prev => prev ? {
            ...prev,
            enrolledPrograms: prev.enrolledPrograms.filter(ep => ep.programId !== programId)
          } : null);
        }
      } else {
        showToast(data.message || "Failed to unenroll", "error");
      }
    } catch {
      showToast("Network error while unenrolling", "error");
    }
  };

  const handleUnenroll = (studentEmail: string, programId: string, programName: string) => {
    setConfirmModal({
      isOpen: true,
      title: `Unenroll from ${programName}?`,
      description: `Are you sure you want to unenroll ${studentEmail} from this cohort? They will lose access to program progress tracking.`,
      confirmText: "Unenroll User",
      confirmVariant: "danger",
      onConfirm: async () => {
        await executeUnenroll(studentEmail, programId, programName);
        setConfirmModal(null);
      }
    });
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
  const handleAddModule = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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
          programId: selectedCurriculumProgramId,
          title: newModuleTitle.trim(),
          subtopics: subtopicsList
        })
      });

      const data = await res.json();
      if (res.ok) {
        showToast(`New module added successfully!`);
        setIsAddModuleModalOpen(false);
        setNewModuleTitle("");
        setNewModuleSubtopics("");
        if (data.program?.modules) {
          const lastMod = data.program.modules[data.program.modules.length - 1];
          if (lastMod?.id) {
            setExpandedCurriculumModules(prev => ({ ...prev, [lastMod.id]: true }));
          }
        }
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

  // Remove Module from Program (with custom confirmation modal)
  const executeRemoveModule = async (targetProgramId: string, moduleId: string) => {
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
          programId: targetProgramId,
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

  const handleRemoveModule = (targetProgramId: string, moduleId: string, moduleTitle: string) => {
    setConfirmModal({
      isOpen: true,
      title: `Delete Module ${moduleId}?`,
      description: `Are you sure you want to delete "${moduleTitle}"? This will permanently delete this module and all of its subtopics. This action cannot be undone.`,
      confirmText: "Delete Module",
      confirmVariant: "danger",
      onConfirm: async () => {
        await executeRemoveModule(targetProgramId, moduleId);
        setConfirmModal(null);
      }
    });
  };

  // Update Module (Title and Subtopics)
  const handleUpdateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingModule || !editingModule.title.trim()) {
      showToast("Module title is required", "error");
      return;
    }

    setSavingEditModule(true);
    try {
      const admin = getAdminUser();
      const res = await fetch("/api/admin/programs/modules", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-user": admin
        },
        body: JSON.stringify({
          adminUser: admin,
          programId: editingModule.programId,
          moduleId: editingModule.moduleId,
          title: editingModule.title.trim()
        })
      });

      const data = await res.json();
      if (res.ok) {
        showToast(`Module ${editingModule.moduleId} updated successfully!`);
        setEditingModule(null);
        fetchPrograms();
      } else {
        showToast(data.message || "Failed to update module", "error");
      }
    } catch {
      showToast("Network error while updating module", "error");
    } finally {
      setSavingEditModule(false);
    }
  };

  // Add Subtopic to Module
  const handleAddSubtopic = async (targetProgramId: string, moduleId: string) => {
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
          programId: targetProgramId,
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

  // Remove Subtopic from Module (with custom confirmation modal)
  const executeRemoveSubtopic = async (targetProgramId: string, moduleId: string, subtopicIndex: number, subtopicText: string) => {
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
          programId: targetProgramId,
          moduleId,
          subtopicIndex,
          subtopicText
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

  const handleRemoveSubtopic = (targetProgramId: string, moduleId: string, subtopicIndex: number, subtopicText: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Subtopic?",
      description: `Are you sure you want to remove "${subtopicText}" from Module ${moduleId}?`,
      confirmText: "Delete Subtopic",
      confirmVariant: "danger",
      onConfirm: async () => {
        await executeRemoveSubtopic(targetProgramId, moduleId, subtopicIndex, subtopicText);
        setConfirmModal(null);
      }
    });
  };

  // Update Subtopic text in Module
  const handleSaveSubtopicEdit = async () => {
    if (!editingSubtopic || !editingSubtopic.text.trim()) {
      showToast("Subtopic text cannot be empty", "error");
      return;
    }

    setSavingSubtopicEdit(true);
    try {
      const admin = getAdminUser();
      const res = await fetch("/api/admin/programs/subtopics", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-user": admin
        },
        body: JSON.stringify({
          adminUser: admin,
          programId: selectedCurriculumProgramId,
          moduleId: editingSubtopic.moduleId,
          subtopicIndex: editingSubtopic.index,
          newText: editingSubtopic.text.trim()
        })
      });

      const data = await res.json();
      if (res.ok) {
        showToast(`Subtopic updated successfully`);
        setEditingSubtopic(null);
        fetchPrograms();
      } else {
        showToast(data.message || "Failed to update subtopic", "error");
      }
    } catch {
      showToast("Network error while updating subtopic", "error");
    } finally {
      setSavingSubtopicEdit(false);
    }
  };

  // All Non-Admin Users (both enrolled learners and normal registered users)
  const allNonAdminUsers = students.filter(s => s.role !== "admin" && s.email !== currentEmail && s.name !== currentUser);
  const totalUsersCount = allNonAdminUsers.length;
  const enrolledLearnersCount = allNonAdminUsers.filter(s => (s.enrolledPrograms || []).length > 0).length;
  const normalUsersCount = totalUsersCount - enrolledLearnersCount;
  const enrolledPercentage = totalUsersCount > 0 ? Math.round((enrolledLearnersCount / totalUsersCount) * 100) : 0;
  const normalPercentage = 100 - enrolledPercentage;

  // Filter users based on search, cohort, and account type
  const filteredStudents = allNonAdminUsers.filter(s => {
    const matchQuery =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.mobile && s.mobile.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchQuery) return false;

    const isEnrolled = (s.enrolledPrograms || []).length > 0;

    // Filter by Account Type
    if (userTypeFilter === "enrolled" && !isEnrolled) return false;
    if (userTypeFilter === "unenrolled" && isEnrolled) return false;

    // Filter by Program Cohort
    if (selectedProgramFilter === "unenrolled") {
      if (isEnrolled) return false;
    } else if (selectedProgramFilter !== "all") {
      if (!(s.enrolledPrograms || []).some(ep => ep.programId === selectedProgramFilter)) return false;
    }

    return true;
  });

  // Calculate Executive Stats
  const totalModulesCount = programs.reduce((acc, p) => acc + (p.modules?.length || 0), 0);
  const totalCompletedCount = Object.values(globalProgress).reduce((acc, list) => acc + (list?.length || 0), 0);
  const overallCompletionRate = totalModulesCount > 0 ? Math.round((totalCompletedCount / totalModulesCount) * 100) : 0;

  // Active Curriculum Program for in-window curriculum editing
  const activeCurriculumProgram = programs.find(p => p.id === selectedCurriculumProgramId) || programs[0] || DEFAULT_PROGRAMS[0];
  const activeProgramModules = activeCurriculumProgram?.modules || [];
  const activeProgramCompleted = globalProgress[activeCurriculumProgram?.id] || [];
  const activeProgressPct = activeProgramModules.length > 0 ? Math.round((activeProgramCompleted.length / activeProgramModules.length) * 100) : 0;
  const displayedModules = selectedModuleFilter === "all"
    ? activeProgramModules
    : activeProgramModules.filter(m => m.id === selectedModuleFilter);

  // Next Module number and badge for compact Add Module card
  const nextModuleNum = activeProgramModules.reduce((max, m) => {
    const num = parseInt(m.id, 10);
    return !isNaN(num) ? Math.max(max, num) : max;
  }, 0) + 1;
  const nextModuleBadge = `Module ${String(nextModuleNum).padStart(2, "0")}`;

  const isModuleExpanded = (modId: string, index: number) => {
    if (selectedModuleFilter !== "all") return true;
    if (expandedCurriculumModules[modId] !== undefined) {
      return expandedCurriculumModules[modId];
    }
    return index === 0;
  };

  const toggleModuleExpanded = (modId: string, index: number) => {
    setExpandedCurriculumModules(prev => ({
      ...prev,
      [modId]: !isModuleExpanded(modId, index)
    }));
  };

  const handleExportCurriculumCSV = () => {
    if (!activeCurriculumProgram) return;
    const rows = [["Module ID", "Module Title", "Status", "Subtopic Number", "Subtopic Content"]];
    const completedIds = globalProgress[activeCurriculumProgram.id] || [];

    (activeCurriculumProgram.modules || []).forEach(m => {
      const status = completedIds.includes(m.id) ? "Completed" : "In Progress";
      if (!m.subtopics || m.subtopics.length === 0) {
        rows.push([m.id, `"${(m.title || "").replace(/"/g, '""')}"`, status, "", ""]);
      } else {
        m.subtopics.forEach((sub, idx) => {
          rows.push([m.id, `"${(m.title || "").replace(/"/g, '""')}"`, status, String(idx + 1), `"${sub.replace(/"/g, '""')}"`]);
        });
      }
    });

    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${activeCurriculumProgram.id}_curriculum.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${activeCurriculumProgram.title} curriculum to CSV!`);
  };

  // Toggle row selection for table
  const toggleRowSelect = (id: string) => {
    setSelectedRowIds(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  if (isLoadingAuth) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#0F1523", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", color: "#FFFFFF" }}>
          <div style={{ width: "56px", height: "56px", margin: "0 auto 16px", borderRadius: "10px", backgroundColor: "rgba(255, 255, 255, 0.08)", padding: "6px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255, 255, 255, 0.12)" }}>
            <img src="/favicon.ico" alt="SieLabs" width={42} height={42} style={{ objectFit: "contain", borderRadius: "6px" }} />
          </div>
          <div style={{ width: "30px", height: "30px", border: "3px solid rgba(154, 123, 26, 0.3)", borderTopColor: "#9A7B1A", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
          <p style={{ color: "#94A3B8", fontSize: "14px", fontWeight: 500 }}>Loading SieLabs Operations Panel...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#0F1523", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
        <div style={{ backgroundColor: "#171F32", borderRadius: "20px", padding: "48px 36px", maxWidth: "460px", textAlign: "center", border: "1px solid rgba(255, 255, 255, 0.1)", boxShadow: "0 20px 50px rgba(0, 0, 0, 0.4)" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "16px", backgroundColor: "rgba(220, 38, 38, 0.12)", color: "#F87171", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h2 style={{ fontSize: "20px", fontWeight: 700, margin: "0 0 8px", color: "#FFFFFF" }}>Admin Access Restricted</h2>
          <p style={{ fontSize: "14px", color: "#94A3B8", lineHeight: 1.6, margin: "0 0 24px" }}>
            The SieLabs Administration Dashboard is restricted to verified administrator accounts.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <Link href="/login" style={{ backgroundColor: "#9A7B1A", color: "#FFFFFF", padding: "10px 22px", borderRadius: "10px", fontWeight: 600, fontSize: "14px", textDecoration: "none" }}>
              Sign In
            </Link>
            <Link href="/" style={{ backgroundColor: "transparent", color: "#E2E8F0", border: "1px solid rgba(255, 255, 255, 0.2)", padding: "10px 22px", borderRadius: "10px", fontWeight: 600, fontSize: "14px", textDecoration: "none" }}>
              Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", backgroundColor: "#F8F9FA", color: "#0F172A", fontFamily: "var(--font-outfit, system-ui, sans-serif)" }}>
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
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "14px",
            fontWeight: 600
          }}
        >
          <span>{toast.type === "success" ? "✓" : "⚠"}</span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════ */}
      {/* 1. LEFT SIDEBAR (Dark Navy/Slate #0F1523 matching screenshot) */}
      {/* ═════════════════════════════════════════════════════════════════ */}
      <aside
        style={{
          width: sidebarCollapsed ? "72px" : "236px",
          backgroundColor: "#0F1523",
          color: "#E2E8F0",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          transition: "width 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          flexShrink: 0,
          borderRight: "1px solid rgba(255, 255, 255, 0.06)",
          zIndex: 40,
        }}
      >
        <div>
          {/* Top Brand Logo & Collapse Toggle */}
          <div
            style={{
              padding: "20px 18px",
              display: "flex",
              alignItems: "center",
              justifyContent: sidebarCollapsed ? "center" : "space-between",
              borderBottom: "1px solid rgba(255, 255, 255, 0.06)"
            }}
          >
            <Link
              href="/"
              title="Return to SieLabs Website"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                textDecoration: "none",
                cursor: "pointer"
              }}
            >
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  border: "1px solid rgba(255, 255, 255, 0.14)",
                  padding: "3px",
                  boxSizing: "border-box"
                }}
              >
                <img
                  src="/favicon.ico"
                  alt="SieLabs Logo"
                  width={32}
                  height={32}
                  style={{ width: "100%", height: "100%", objectFit: "contain", display: "block", borderRadius: "6px" }}
                />
              </div>
              {!sidebarCollapsed && (
                <div style={{ overflow: "hidden" }}>
                  <span style={{ fontSize: "16px", fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.01em", display: "block", lineHeight: 1.1 }}>
                    SieLabs
                  </span>
                  <span style={{ fontSize: "10px", fontWeight: 600, color: "#9A7B1A", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Operations
                  </span>
                </div>
              )}
            </Link>

            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              style={{
                background: "transparent",
                border: "none",
                color: "#64748B",
                cursor: "pointer",
                padding: "6px",
                display: sidebarCollapsed ? "none" : "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "6px"
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="6" />
                <line x1="6" y1="6" x2="6" y2="18" />
                <line x1="18" y1="6" x2="18" y2="18" />
                <polyline points="10 10 6 6 10 2" />
              </svg>
            </button>
          </div>

          {/* Primary Nav Menu */}
          <nav style={{ padding: "14px 10px 8px", display: "flex", flexDirection: "column", gap: "4px" }}>
            {/* Dashboard / Overview */}
            <button
              onClick={() => setAdminTab("dashboard")}
              title="Dashboard Overview"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                width: "100%",
                padding: "9px 12px",
                borderRadius: "8px",
                backgroundColor: adminTab === "dashboard" ? "rgba(255, 255, 255, 0.1)" : "transparent",
                color: adminTab === "dashboard" ? "#FFFFFF" : "#94A3B8",
                border: "none",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: adminTab === "dashboard" ? 700 : 500,
                textAlign: "left",
                justifyContent: sidebarCollapsed ? "center" : "flex-start",
                transition: "all 0.15s ease"
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              {!sidebarCollapsed && <span>Dashboard</span>}
            </button>

            {/* Programs / Cohorts */}
            <button
              onClick={() => setAdminTab("programs")}
              title="Programs Directory"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: sidebarCollapsed ? "center" : "space-between",
                width: "100%",
                padding: "9px 12px",
                borderRadius: "8px",
                backgroundColor: adminTab === "programs" ? "rgba(255, 255, 255, 0.1)" : "transparent",
                color: adminTab === "programs" ? "#FFFFFF" : "#94A3B8",
                border: "none",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: adminTab === "programs" ? 700 : 500,
                textAlign: "left",
                transition: "all 0.15s ease"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
                {!sidebarCollapsed && <span>Programs</span>}
              </div>
              {!sidebarCollapsed && (
                <span style={{ fontSize: "10px", fontWeight: 700, padding: "1px 6px", borderRadius: "10px", backgroundColor: adminTab === "programs" ? "#9A7B1A" : "rgba(255, 255, 255, 0.08)", color: "#FFFFFF" }}>
                  {programs.length}
                </span>
              )}
            </button>

            {/* Users Directory */}
            <button
              onClick={() => setAdminTab("students")}
              title="Users Directory"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: sidebarCollapsed ? "center" : "space-between",
                width: "100%",
                padding: "9px 12px",
                borderRadius: "8px",
                backgroundColor: adminTab === "students" ? "rgba(255, 255, 255, 0.1)" : "transparent",
                color: adminTab === "students" ? "#FFFFFF" : "#94A3B8",
                border: "none",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: adminTab === "students" ? 700 : 500,
                textAlign: "left",
                transition: "all 0.15s ease"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                {!sidebarCollapsed && <span>Users</span>}
              </div>
              {!sidebarCollapsed && (
                <span style={{ fontSize: "10px", fontWeight: 700, padding: "1px 6px", borderRadius: "10px", backgroundColor: adminTab === "students" ? "#9A7B1A" : "rgba(255, 255, 255, 0.08)", color: "#FFFFFF" }}>
                  {totalUsersCount}
                </span>
              )}
            </button>

            {/* Curriculum Modules */}
            <button
              onClick={() => setAdminTab("curriculum")}
              title="Manage Program Curriculum"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: sidebarCollapsed ? "center" : "space-between",
                width: "100%",
                padding: "9px 12px",
                borderRadius: "8px",
                backgroundColor: adminTab === "curriculum" ? "rgba(255, 255, 255, 0.1)" : "transparent",
                color: adminTab === "curriculum" ? "#FFFFFF" : "#94A3B8",
                border: "none",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: adminTab === "curriculum" ? 700 : 500,
                textAlign: "left",
                transition: "all 0.15s ease"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                  <polyline points="2 17 12 22 22 17" />
                  <polyline points="2 12 12 17 22 12" />
                </svg>
                {!sidebarCollapsed && <span>Curriculum</span>}
              </div>
              {!sidebarCollapsed && (
                <span style={{ fontSize: "10px", fontWeight: 700, padding: "1px 6px", borderRadius: "10px", backgroundColor: adminTab === "curriculum" ? "#9A7B1A" : "rgba(255, 255, 255, 0.08)", color: "#FFFFFF" }}>
                  {totalModulesCount}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Bottom Utility Menu */}
        <div style={{ padding: "10px", borderTop: "1px solid rgba(255, 255, 255, 0.06)", display: "flex", flexDirection: "column", gap: "4px" }}>
          {/* Settings / Profile */}
          <Link
            href="/profile"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "8px 12px",
              borderRadius: "8px",
              color: "#94A3B8",
              fontSize: "13px",
              textDecoration: "none",
              justifyContent: sidebarCollapsed ? "center" : "flex-start"
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            {!sidebarCollapsed && <span>Settings</span>}
          </Link>

          {/* User Profile Mini Bar */}
          <div style={{ marginTop: "6px", paddingTop: "8px", borderTop: "1px solid rgba(255, 255, 255, 0.06)", display: "flex", alignItems: "center", justifyContent: sidebarCollapsed ? "center" : "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", backgroundColor: "#9A7B1A", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 800 }}>
                A
              </div>
              {!sidebarCollapsed && (
                <div style={{ overflow: "hidden" }}>
                  <p style={{ margin: 0, fontSize: "12px", fontWeight: 700, color: "#FFFFFF", whiteSpace: "nowrap" }}>
                    Abhishek
                  </p>
                  <p style={{ margin: 0, fontSize: "10px", color: "#94A3B8" }}>Administrator</p>
                </div>
              )}
            </div>

            {!sidebarCollapsed && (
              <button
                onClick={() => {
                  localStorage.removeItem("user");
                  router.push("/login");
                }}
                title="Sign Out"
                style={{ background: "transparent", border: "none", color: "#DC2626", cursor: "pointer", padding: "4px" }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* ═════════════════════════════════════════════════════════════════ */}
      {/* 2. CENTER MAIN CONTENT AREA (High-density SaaS layout)        */}
      {/* ═════════════════════════════════════════════════════════════════ */}
      <main style={{ flex: 1, minWidth: 0, backgroundColor: "#FFFFFF", display: "flex", flexDirection: "column", overflowY: "auto", position: "relative" }}>
        {/* Top Header Row with Action Buttons */}
        <div style={{ padding: "20px 32px 16px", borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "10px",
                backgroundColor: "#F8FAFC",
                border: "1px solid #E2E8F0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "4px",
                flexShrink: 0,
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)"
              }}
            >
              <img
                src="/favicon.ico"
                alt="SieLabs Logo"
                width={38}
                height={38}
                style={{ objectFit: "contain", display: "block", borderRadius: "6px" }}
              />
            </div>
            <div>
              <h1 style={{ fontSize: "22px", fontWeight: 800, margin: 0, color: "#0F172A", letterSpacing: "-0.02em" }}>
                {adminTab === "programs"
                  ? "Programs & Cohorts"
                  : adminTab === "students"
                  ? "Users Directory"
                  : adminTab === "curriculum"
                  ? "Curriculum & Modules"
                  : "Operations Overview"}
              </h1>
              <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#64748B" }}>
                {adminTab === "programs"
                  ? "Active curriculum batches, schedule tracks, and user milestones."
                  : adminTab === "students"
                  ? `Directory of registered accounts (${totalUsersCount} total, ${enrolledLearnersCount} enrolled, ${normalUsersCount} normal accounts).`
                  : adminTab === "curriculum"
                  ? "Edit modules, subtopics and milestones"
                  : "Real-time key performance indicators and cohort milestones."}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              onClick={() => {
                if (adminTab === "curriculum") {
                  handleExportCurriculumCSV();
                } else {
                  showToast("Exporting data to CSV...");
                }
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                borderRadius: "8px",
                border: "1px solid #E2E8F0",
                backgroundColor: "#FFFFFF",
                fontSize: "12px",
                fontWeight: 600,
                color: "#0F172A",
                cursor: "pointer"
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
              <span>Export</span>
            </button>

            {adminTab !== "curriculum" && (
              <button
                onClick={() => setIsEnrollModalOpen(true)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  backgroundColor: "#0F172A",
                  color: "#FFFFFF",
                  fontSize: "12px",
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(15, 23, 42, 0.15)"
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                <span>Enroll User in Cohort</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills Toolbar (strictly for Users / Students Directory tab) */}
        {adminTab === "students" && (
          <div style={{ padding: "14px 32px", display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", borderBottom: "1px solid #F8FAFC", backgroundColor: "#FAFAF8" }}>
            {/* Account Type Segmented Filter (All / Enrolled / Normal) */}
            <div style={{ display: "inline-flex", backgroundColor: "#FFFFFF", borderRadius: "6px", border: "1px solid #E2E8F0", padding: "2px", gap: "2px" }}>
              <button
                onClick={() => setUserTypeFilter("all")}
                style={{
                  padding: "5px 12px",
                  borderRadius: "4px",
                  border: "none",
                  fontSize: "11px",
                  fontWeight: 700,
                  cursor: "pointer",
                  backgroundColor: userTypeFilter === "all" ? "#0F172A" : "transparent",
                  color: userTypeFilter === "all" ? "#FFFFFF" : "#64748B",
                  transition: "all 0.15s ease"
                }}
              >
                All Users ({totalUsersCount})
              </button>
              <button
                onClick={() => setUserTypeFilter("enrolled")}
                style={{
                  padding: "5px 12px",
                  borderRadius: "4px",
                  border: "none",
                  fontSize: "11px",
                  fontWeight: 700,
                  cursor: "pointer",
                  backgroundColor: userTypeFilter === "enrolled" ? "#059669" : "transparent",
                  color: userTypeFilter === "enrolled" ? "#FFFFFF" : "#64748B",
                  transition: "all 0.15s ease"
                }}
              >
                Enrolled Users ({enrolledLearnersCount})
              </button>
              <button
                onClick={() => setUserTypeFilter("unenrolled")}
                style={{
                  padding: "5px 12px",
                  borderRadius: "4px",
                  border: "none",
                  fontSize: "11px",
                  fontWeight: 700,
                  cursor: "pointer",
                  backgroundColor: userTypeFilter === "unenrolled" ? "#D97706" : "transparent",
                  color: userTypeFilter === "unenrolled" ? "#FFFFFF" : "#64748B",
                  transition: "all 0.15s ease"
                }}
              >
                Normal Users ({normalUsersCount})
              </button>
            </div>

            {/* Cohort Filter Selector (Custom Dropdown) */}
            <div ref={cohortDropdownRef} style={{ position: "relative" }}>
              <button
                type="button"
                onClick={() => setIsCohortDropdownOpen(prev => !prev)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "8px",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: isCohortDropdownOpen ? "1.5px solid #0F172A" : "1px solid #E2E8F0",
                  backgroundColor: "#FFFFFF",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#0F172A",
                  cursor: "pointer",
                  outline: "none",
                  boxShadow: isCohortDropdownOpen ? "0 0 0 3px rgba(15, 23, 42, 0.08)" : "0 1px 2px rgba(0, 0, 0, 0.03)",
                  transition: "all 0.15s ease",
                  whiteSpace: "nowrap"
                }}
              >
                <span>
                  {selectedProgramFilter === "all"
                    ? "All Programs"
                    : selectedProgramFilter === "unenrolled"
                    ? "None (Normal Users)"
                    : programs.find(p => p.id === selectedProgramFilter)?.title || selectedProgramFilter}
                </span>
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#64748B"
                  strokeWidth="2.5"
                  style={{
                    transform: isCohortDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.15s ease"
                  }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {isCohortDropdownOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 5px)",
                    left: 0,
                    minWidth: "250px",
                    maxHeight: "300px",
                    overflowY: "auto",
                    backgroundColor: "#FFFFFF",
                    borderRadius: "8px",
                    border: "1px solid #E2E8F0",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.04)",
                    padding: "5px",
                    zIndex: 60
                  }}
                >
                  {/* All Programs */}
                  <div
                    onClick={() => {
                      setSelectedProgramFilter("all");
                      setIsCohortDropdownOpen(false);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 10px",
                      borderRadius: "6px",
                      backgroundColor: selectedProgramFilter === "all" ? "#F1F5F9" : "transparent",
                      cursor: "pointer"
                    }}
                    onMouseEnter={e => {
                      if (selectedProgramFilter !== "all") e.currentTarget.style.backgroundColor = "#F8FAFC";
                    }}
                    onMouseLeave={e => {
                      if (selectedProgramFilter !== "all") e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    {selectedProgramFilter === "all" ? (
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0F172A" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <span style={{ width: "13px" }} />
                    )}
                    <span style={{ fontSize: "12px", fontWeight: selectedProgramFilter === "all" ? 700 : 500, color: "#0F172A" }}>
                      All Programs
                    </span>
                  </div>

                  {/* Individual Programs */}
                  {programs.map(prog => {
                    const isSelected = selectedProgramFilter === prog.id;

                    return (
                      <div
                        key={prog.id}
                        onClick={() => {
                          setSelectedProgramFilter(prog.id);
                          setIsCohortDropdownOpen(false);
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          padding: "8px 10px",
                          borderRadius: "6px",
                          backgroundColor: isSelected ? "#F1F5F9" : "transparent",
                          cursor: "pointer"
                        }}
                        onMouseEnter={e => {
                          if (!isSelected) e.currentTarget.style.backgroundColor = "#F8FAFC";
                        }}
                        onMouseLeave={e => {
                          if (!isSelected) e.currentTarget.style.backgroundColor = "transparent";
                        }}
                      >
                        {isSelected ? (
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0F172A" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        ) : (
                          <span style={{ width: "13px" }} />
                        )}
                        <span style={{ fontSize: "12px", fontWeight: isSelected ? 700 : 500, color: "#0F172A", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {prog.title}
                        </span>
                      </div>
                    );
                  })}

                  {/* Unenrolled */}
                  <div
                    onClick={() => {
                      setSelectedProgramFilter("unenrolled");
                      setIsCohortDropdownOpen(false);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 10px",
                      borderRadius: "6px",
                      backgroundColor: selectedProgramFilter === "unenrolled" ? "#F1F5F9" : "transparent",
                      cursor: "pointer"
                    }}
                    onMouseEnter={e => {
                      if (selectedProgramFilter !== "unenrolled") e.currentTarget.style.backgroundColor = "#F8FAFC";
                    }}
                    onMouseLeave={e => {
                      if (selectedProgramFilter !== "unenrolled") e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    {selectedProgramFilter === "unenrolled" ? (
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0F172A" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <span style={{ width: "13px" }} />
                    )}
                    <span style={{ fontSize: "12px", fontWeight: selectedProgramFilter === "unenrolled" ? 700 : 500, color: "#0F172A" }}>
                      None (Normal Users)
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Reset Filters */}
            {(userTypeFilter !== "all" || selectedProgramFilter !== "all" || searchQuery) && (
              <button
                onClick={() => {
                  setUserTypeFilter("all");
                  setSelectedProgramFilter("all");
                  setSearchQuery("");
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "1px dashed #CBD5E1",
                  backgroundColor: "transparent",
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "#64748B",
                  cursor: "pointer"
                }}
              >
                <span>Reset filters</span>
              </button>
            )}
          </div>
        )}

        {/* ── HIGH-DENSITY DATA TABLE ── */}
        <div style={{ flex: 1, padding: "0 32px 40px", overflowX: "auto" }}>
          {/* TAB: PROGRAMS TABLE VIEW */}
          {adminTab === "programs" && (
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #E2E8F0", color: "#64748B", fontSize: "12px", fontWeight: 600 }}>
                  <th style={{ padding: "14px 10px", width: "36px" }}>
                    <input
                      type="checkbox"
                      checked={selectedRowIds.length === programs.length && programs.length > 0}
                      onChange={() => {
                        if (selectedRowIds.length === programs.length) setSelectedRowIds([]);
                        else setSelectedRowIds(programs.map(p => p.id));
                      }}
                      style={{ cursor: "pointer" }}
                    />
                  </th>
                  <th style={{ padding: "14px 12px" }}>Program / Cohort</th>
                  <th style={{ padding: "14px 12px" }}>Schedule &amp; Batch</th>
                  <th style={{ padding: "14px 12px" }}>Enrolled Users</th>
                  <th style={{ padding: "14px 12px" }}>Milestone Status</th>
                  <th style={{ padding: "14px 12px" }}>Curriculum Progress</th>
                  <th style={{ padding: "14px 12px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {programs.map(program => {
                  const completedModules = globalProgress[program.id] || [];
                  const totalModules = program.modules?.length || 0;
                  const completedCount = completedModules.length;
                  const percentage = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;
                  const isChecked = selectedRowIds.includes(program.id);

                  const enrolledStudentsCount = students.filter(s =>
                    s.role !== "admin" &&
                    (s.enrolledPrograms || []).some(ep => ep.programId === program.id)
                  ).length;

                  return (
                    <tr
                      key={program.id}
                      onClick={() => {
                        setSelectedCurriculumProgramId(program.id);
                        setAdminTab("curriculum");
                      }}
                      style={{
                        borderBottom: "1px solid #F1F5F9",
                        backgroundColor: isChecked ? "rgba(154, 123, 26, 0.04)" : "transparent",
                        transition: "background-color 0.1s ease",
                        cursor: "pointer"
                      }}
                    >
                      {/* Checkbox */}
                      <td style={{ padding: "14px 10px" }} onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleRowSelect(program.id)}
                          style={{ cursor: "pointer" }}
                        />
                      </td>

                      {/* Program Title & ID */}
                      <td style={{ padding: "14px 12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "8px",
                              backgroundColor: "rgba(154, 123, 26, 0.1)",
                              color: "#9A7B1A",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 800,
                              fontSize: "12px",
                              flexShrink: 0
                            }}
                          >
                            {program.title.charAt(0)}
                          </div>
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <span style={{ fontWeight: 700, color: "#0F172A", fontSize: "13px" }}>
                                {program.title}
                              </span>
                              <span style={{ fontSize: "10px", fontWeight: 700, color: "#9A7B1A", backgroundColor: "rgba(154, 123, 26, 0.1)", padding: "1px 6px", borderRadius: "4px" }}>
                                {program.id}
                              </span>
                            </div>
                            <span style={{ fontSize: "11px", color: "#64748B" }}>{program.badge}</span>
                          </div>
                        </div>
                      </td>

                      {/* Schedule & Duration */}
                      <td style={{ padding: "14px 12px", color: "#475569" }}>
                        <div style={{ fontSize: "12px", fontWeight: 600 }}>{program.schedule}</div>
                        <div style={{ fontSize: "11px", color: "#94A3B8" }}>Duration: {program.duration}</div>
                      </td>

                      {/* Enrolled Users */}
                      <td style={{ padding: "14px 12px" }}>
                        <span style={{ backgroundColor: "#F1F5F9", color: "#334155", fontSize: "11px", fontWeight: 700, padding: "3px 8px", borderRadius: "6px" }}>
                          {enrolledStudentsCount} {enrolledStudentsCount === 1 ? "User" : "Users"}
                        </span>
                      </td>

                      {/* Status */}
                      <td style={{ padding: "14px 12px" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "12px", fontWeight: 700, color: percentage === 100 ? "#059669" : "#D97706" }}>
                          <span>{percentage === 100 ? "✓" : "●"}</span>
                          <span>{percentage === 100 ? "Completed" : "In Progress"}</span>
                        </span>
                      </td>

                      {/* Progress Bar & Rate */}
                      <td style={{ padding: "14px 12px", width: "170px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div style={{ flex: 1, height: "6px", backgroundColor: "#E2E8F0", borderRadius: "3px", overflow: "hidden" }}>
                            <div style={{ width: `${percentage}%`, height: "100%", backgroundColor: percentage === 100 ? "#10B981" : "#9A7B1A", borderRadius: "3px" }} />
                          </div>
                          <span style={{ fontSize: "11px", fontWeight: 700, color: "#0F172A", minWidth: "32px" }}>
                            {percentage}%
                          </span>
                        </div>
                        <span style={{ fontSize: "10px", color: "#64748B" }}>
                          {completedCount}/{totalModules} modules
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: "14px 12px", textAlign: "right" }} onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => {
                            setSelectedCurriculumProgramId(program.id);
                            setAdminTab("curriculum");
                          }}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                            backgroundColor: "#9A7B1A",
                            color: "#FFFFFF",
                            padding: "6px 12px",
                            borderRadius: "7px",
                            fontSize: "12px",
                            fontWeight: 700,
                            border: "none",
                            cursor: "pointer"
                          }}
                        >
                          <span>Manage</span>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {/* TAB: USERS TABLE VIEW */}
          {adminTab === "students" && (
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #E2E8F0", color: "#64748B", fontSize: "12px", fontWeight: 600 }}>
                  <th style={{ padding: "14px 10px", width: "36px" }}>
                    <input
                      type="checkbox"
                      checked={selectedRowIds.length === filteredStudents.length && filteredStudents.length > 0}
                      onChange={() => {
                        if (selectedRowIds.length === filteredStudents.length) setSelectedRowIds([]);
                        else setSelectedRowIds(filteredStudents.map(s => s.id));
                      }}
                      style={{ cursor: "pointer" }}
                    />
                  </th>
                  <th style={{ padding: "14px 12px" }}>Account ID</th>
                  <th style={{ padding: "14px 12px" }}>User &amp; Contact</th>
                  <th style={{ padding: "14px 12px" }}>Mobile</th>
                  <th style={{ padding: "14px 12px" }}>Account Status</th>
                  <th style={{ padding: "14px 12px" }}>Enrolled Cohorts</th>
                  <th style={{ padding: "14px 12px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: "48px 0", textAlign: "center", color: "#64748B" }}>
                      No user accounts match your active filter.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map(student => {
                    const isChecked = selectedRowIds.includes(student.id);
                    const initial = (student.name.charAt(0) || "U").toUpperCase();
                    const enrollCount = (student.enrolledPrograms || []).length;
                    const isNormalUser = enrollCount === 0;

                    return (
                      <tr
                        key={student.id}
                        onClick={() => setSelectedInspectorStudent(student)}
                        style={{
                          borderBottom: "1px solid #F1F5F9",
                          backgroundColor: isChecked ? "rgba(154, 123, 26, 0.04)" : "transparent",
                          cursor: "pointer",
                          transition: "background-color 0.1s ease"
                        }}
                      >
                        {/* Checkbox */}
                        <td style={{ padding: "14px 10px" }} onClick={e => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleRowSelect(student.id)}
                            style={{ cursor: "pointer" }}
                          />
                        </td>

                        {/* ID */}
                        <td style={{ padding: "14px 12px" }}>
                          <span style={{ fontSize: "12px", fontWeight: 700, color: "#64748B" }}>
                            #{student.id.slice(-6).toUpperCase()}
                          </span>
                        </td>

                        {/* User Contact */}
                        <td style={{ padding: "14px 12px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div
                              style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "50%",
                                backgroundColor: isNormalUser ? "#F1F5F9" : "#EDECE8",
                                color: isNormalUser ? "#64748B" : "#0F172A",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "12px",
                                fontWeight: 800,
                                flexShrink: 0
                              }}
                            >
                              {initial}
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, color: "#0F172A" }}>{student.name}</div>
                              <div style={{ fontSize: "11px", color: "#64748B" }}>{student.email}</div>
                            </div>
                          </div>
                        </td>

                        {/* Mobile */}
                        <td style={{ padding: "14px 12px", color: "#475569", fontSize: "12px" }}>
                          {student.mobile || "—"}
                        </td>

                        {/* Account Status */}
                        <td style={{ padding: "14px 12px" }}>
                          {isNormalUser ? (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "11px", fontWeight: 700, color: "#D97706", backgroundColor: "#FEF3C7", padding: "3px 8px", borderRadius: "6px" }}>
                              <span>○</span>
                              <span>Normal User</span>
                            </span>
                          ) : (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "11px", fontWeight: 700, color: "#059669", backgroundColor: "#ECFDF5", padding: "3px 8px", borderRadius: "6px" }}>
                              <span>✓</span>
                              <span>Enrolled ({enrollCount})</span>
                            </span>
                          )}
                        </td>

                        {/* Enrolled Programs */}
                        <td style={{ padding: "14px 12px" }}>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                            {isNormalUser ? (
                              <span style={{ fontSize: "11px", color: "#94A3B8", fontStyle: "italic" }}>
                                No programs enrolled
                              </span>
                            ) : (
                              student.enrolledPrograms.map(ep => (
                                <span
                                  key={ep.programId}
                                  style={{
                                    fontSize: "11px",
                                    fontWeight: 600,
                                    padding: "2px 7px",
                                    borderRadius: "4px",
                                    backgroundColor: "rgba(154, 123, 26, 0.1)",
                                    color: "#9A7B1A"
                                  }}
                                >
                                  {ep.programName || ep.programId}
                                </span>
                              ))
                            )}
                          </div>
                        </td>

                        {/* Actions */}
                        <td style={{ padding: "14px 12px", textAlign: "right" }} onClick={e => e.stopPropagation()}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "6px" }}>
                            {isNormalUser && (
                              <button
                                onClick={() => {
                                  setSelectedStudentForEnroll(student.email);
                                  setIsEnrollModalOpen(true);
                                }}
                                style={{
                                  backgroundColor: "#0F172A",
                                  color: "#FFFFFF",
                                  border: "none",
                                  padding: "5px 10px",
                                  borderRadius: "6px",
                                  fontSize: "11px",
                                  fontWeight: 700,
                                  cursor: "pointer",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "3px"
                                }}
                              >
                                <span>+ Enroll</span>
                              </button>
                            )}
                            <button
                              onClick={() => setSelectedInspectorStudent(student)}
                              style={{
                                backgroundColor: "transparent",
                                border: "1px solid #E2E8F0",
                                color: "#0F172A",
                                padding: "5px 10px",
                                borderRadius: "6px",
                                fontSize: "11px",
                                fontWeight: 600,
                                cursor: "pointer"
                              }}
                            >
                              Details
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}

          {/* TAB: CURRICULUM MODULES VIEW (Compact SaaS Redesign) */}
          {adminTab === "curriculum" && (
            <div style={{ paddingTop: "16px" }}>
              {/* 1. FILTER & METADATA TOOLBAR (Unified single horizontal row) */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "16px",
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                  borderRadius: "10px",
                  padding: "10px 16px",
                  marginBottom: "16px",
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.02)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap", flex: 1, minWidth: 0 }}>
                  {/* PROGRAM SELECT (Custom Dropdown) */}
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ fontSize: "11px", fontWeight: 800, color: "#64748B", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                      PROGRAM
                    </span>
                    <div ref={programDropdownRef} style={{ position: "relative" }}>
                      <button
                        type="button"
                        onClick={() => {
                          setIsProgramDropdownOpen(prev => !prev);
                          setIsModuleDropdownOpen(false);
                        }}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "8px",
                          padding: "6px 12px",
                          borderRadius: "7px",
                          border: isProgramDropdownOpen ? "1.5px solid #0F172A" : "1px solid #CBD5E1",
                          backgroundColor: "#FFFFFF",
                          fontSize: "12.5px",
                          fontWeight: 600,
                          color: "#0F172A",
                          cursor: "pointer",
                          outline: "none",
                          boxShadow: isProgramDropdownOpen ? "0 0 0 3px rgba(15, 23, 42, 0.08)" : "0 1px 2px rgba(0, 0, 0, 0.03)",
                          transition: "all 0.15s ease",
                          whiteSpace: "nowrap"
                        }}
                      >
                        <span>
                          {activeCurriculumProgram.title} ({activeProgramCompleted.length}/{activeProgramModules.length})
                        </span>
                        <svg
                          width="11"
                          height="11"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#64748B"
                          strokeWidth="2.5"
                          style={{
                            transform: isProgramDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.15s ease"
                          }}
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>

                      {isProgramDropdownOpen && (
                        <div
                          style={{
                            position: "absolute",
                            top: "calc(100% + 5px)",
                            left: 0,
                            minWidth: "270px",
                            backgroundColor: "#FFFFFF",
                            borderRadius: "8px",
                            border: "1px solid #E2E8F0",
                            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.04)",
                            padding: "5px",
                            zIndex: 60
                          }}
                        >
                          {programs.map(prog => {
                            const comp = (globalProgress[prog.id] || []).length;
                            const tot = prog.modules?.length || 0;
                            const isSelected = prog.id === selectedCurriculumProgramId;

                            return (
                              <div
                                key={prog.id}
                                onClick={() => {
                                  setSelectedCurriculumProgramId(prog.id);
                                  setSelectedModuleFilter("all");
                                  setIsProgramDropdownOpen(false);
                                }}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  gap: "10px",
                                  padding: "8px 10px",
                                  borderRadius: "6px",
                                  backgroundColor: isSelected ? "#F1F5F9" : "transparent",
                                  cursor: "pointer",
                                  transition: "background-color 0.1s ease"
                                }}
                                onMouseEnter={e => {
                                  if (!isSelected) e.currentTarget.style.backgroundColor = "#F8FAFC";
                                }}
                                onMouseLeave={e => {
                                  if (!isSelected) e.currentTarget.style.backgroundColor = "transparent";
                                }}
                              >
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                  {isSelected ? (
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0F172A" strokeWidth="2.5">
                                      <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                  ) : (
                                    <span style={{ width: "13px" }} />
                                  )}
                                  <span style={{ fontSize: "12.5px", fontWeight: isSelected ? 700 : 500, color: "#0F172A" }}>
                                    {prog.title}
                                  </span>
                                </div>

                                <span
                                  style={{
                                    fontSize: "11px",
                                    fontWeight: 700,
                                    padding: "1px 6px",
                                    borderRadius: "8px",
                                    backgroundColor: isSelected ? "#0F172A" : "#F1F5F9",
                                    color: isSelected ? "#FFFFFF" : "#64748B"
                                  }}
                                >
                                  {comp}/{tot}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* MODULE SELECT (Custom Dropdown) */}
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ fontSize: "11px", fontWeight: 800, color: "#64748B", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                      MODULE
                    </span>
                    <div ref={moduleDropdownRef} style={{ position: "relative" }}>
                      <button
                        type="button"
                        onClick={() => {
                          setIsModuleDropdownOpen(prev => !prev);
                          setIsProgramDropdownOpen(false);
                        }}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "8px",
                          padding: "6px 12px",
                          borderRadius: "7px",
                          border: isModuleDropdownOpen ? "1.5px solid #0F172A" : "1px solid #CBD5E1",
                          backgroundColor: "#FFFFFF",
                          fontSize: "12.5px",
                          fontWeight: 600,
                          color: "#0F172A",
                          cursor: "pointer",
                          outline: "none",
                          boxShadow: isModuleDropdownOpen ? "0 0 0 3px rgba(15, 23, 42, 0.08)" : "0 1px 2px rgba(0, 0, 0, 0.03)",
                          transition: "all 0.15s ease",
                          whiteSpace: "nowrap"
                        }}
                      >
                        <span>
                          {selectedModuleFilter === "all"
                            ? `All (${activeProgramModules.length})`
                            : `Module ${!isNaN(Number(selectedModuleFilter)) ? String(selectedModuleFilter).padStart(2, "0") : selectedModuleFilter}`}
                        </span>
                        <svg
                          width="11"
                          height="11"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#64748B"
                          strokeWidth="2.5"
                          style={{
                            transform: isModuleDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.15s ease"
                          }}
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>

                      {isModuleDropdownOpen && (
                        <div
                          style={{
                            position: "absolute",
                            top: "calc(100% + 5px)",
                            left: 0,
                            minWidth: "250px",
                            maxHeight: "300px",
                            overflowY: "auto",
                            backgroundColor: "#FFFFFF",
                            borderRadius: "8px",
                            border: "1px solid #E2E8F0",
                            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.04)",
                            padding: "5px",
                            zIndex: 60
                          }}
                        >
                          <div
                            onClick={() => {
                              setSelectedModuleFilter("all");
                              setIsModuleDropdownOpen(false);
                            }}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              padding: "8px 10px",
                              borderRadius: "6px",
                              backgroundColor: selectedModuleFilter === "all" ? "#F1F5F9" : "transparent",
                              cursor: "pointer"
                            }}
                            onMouseEnter={e => {
                              if (selectedModuleFilter !== "all") e.currentTarget.style.backgroundColor = "#F8FAFC";
                            }}
                            onMouseLeave={e => {
                              if (selectedModuleFilter !== "all") e.currentTarget.style.backgroundColor = "transparent";
                            }}
                          >
                            {selectedModuleFilter === "all" ? (
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0F172A" strokeWidth="2.5">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            ) : (
                              <span style={{ width: "13px" }} />
                            )}
                            <span style={{ fontSize: "12.5px", fontWeight: selectedModuleFilter === "all" ? 700 : 500, color: "#0F172A" }}>
                              All Modules ({activeProgramModules.length})
                            </span>
                          </div>

                          {activeProgramModules.map(mod => {
                            const isSelected = selectedModuleFilter === mod.id;
                            const formattedId = !isNaN(Number(mod.id)) ? String(mod.id).padStart(2, "0") : mod.id;

                            return (
                              <div
                                key={mod.id}
                                onClick={() => {
                                  setSelectedModuleFilter(mod.id);
                                  setIsModuleDropdownOpen(false);
                                }}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                  padding: "8px 10px",
                                  borderRadius: "6px",
                                  backgroundColor: isSelected ? "#F1F5F9" : "transparent",
                                  cursor: "pointer"
                                }}
                                onMouseEnter={e => {
                                  if (!isSelected) e.currentTarget.style.backgroundColor = "#F8FAFC";
                                }}
                                onMouseLeave={e => {
                                  if (!isSelected) e.currentTarget.style.backgroundColor = "transparent";
                                }}
                              >
                                {isSelected ? (
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0F172A" strokeWidth="2.5">
                                    <polyline points="20 6 9 17 4 12" />
                                  </svg>
                                ) : (
                                  <span style={{ width: "13px" }} />
                                )}
                                <span style={{ fontSize: "12px", fontWeight: 700, color: "#10B981" }}>
                                  {formattedId}
                                </span>
                                <span style={{ fontSize: "12.5px", fontWeight: isSelected ? 700 : 500, color: "#0F172A", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                  {mod.title}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* SCHEDULE & DURATION */}
                  <span style={{ fontSize: "12px", color: "#64748B", whiteSpace: "nowrap" }}>
                    {activeCurriculumProgram.schedule?.replace("Fri, Sat & Sun", "Fri-Sun").replace(":00", "").replace(":00", "") || "Fri-Sun, 7-9 PM"} · {activeCurriculumProgram.duration || "4 months"}
                  </span>
                </div>

                {/* RIGHT PROGRESS BAR */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
                  <div style={{ width: "95px", height: "5px", backgroundColor: "#E2E8F0", borderRadius: "3px", overflow: "hidden" }}>
                    <div
                      style={{
                        width: `${activeProgressPct}%`,
                        height: "100%",
                        backgroundColor: "#EA580C",
                        borderRadius: "3px",
                        transition: "width 0.3s ease"
                      }}
                    />
                  </div>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#0F172A", whiteSpace: "nowrap" }}>
                    {activeProgramCompleted.length}/{activeProgramModules.length} - {activeProgressPct}%
                  </span>
                </div>
              </div>

              {/* 2. INLINE ADD MODULE CARD */}
              <form
                onSubmit={handleAddModule}
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                  borderRadius: "10px",
                  padding: "12px 14px",
                  marginBottom: "16px",
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.02)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                  <span
                    style={{
                      backgroundColor: "#0F172A",
                      color: "#FFFFFF",
                      fontSize: "12px",
                      fontWeight: 700,
                      padding: "6px 12px",
                      borderRadius: "6px",
                      whiteSpace: "nowrap",
                      letterSpacing: "0.02em"
                    }}
                  >
                    {nextModuleBadge}
                  </span>
                  <input
                    type="text"
                    placeholder="Module title, e.g. Data Visualization"
                    value={newModuleTitle}
                    onChange={e => setNewModuleTitle(e.target.value)}
                    style={{
                      flex: 1,
                      padding: "7px 12px",
                      fontSize: "13px",
                      color: "#0F172A",
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #CBD5E1",
                      borderRadius: "6px",
                      outline: "none"
                    }}
                  />
                  <button
                    type="submit"
                    disabled={savingModule}
                    style={{
                      backgroundColor: "#EA580C",
                      color: "#FFFFFF",
                      fontSize: "13px",
                      fontWeight: 700,
                      padding: "7px 18px",
                      borderRadius: "6px",
                      border: "none",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      transition: "opacity 0.15s ease",
                      opacity: savingModule ? 0.7 : 1
                    }}
                  >
                    {savingModule ? "Adding..." : "Add module"}
                  </button>
                </div>

                <textarea
                  placeholder="Subtopics: one per line (optional)"
                  value={newModuleSubtopics}
                  onChange={e => setNewModuleSubtopics(e.target.value)}
                  rows={2}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    fontSize: "12.5px",
                    color: "#0F172A",
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #CBD5E1",
                    borderRadius: "6px",
                    outline: "none",
                    resize: "none",
                    boxSizing: "border-box",
                    fontFamily: "inherit"
                  }}
                />
              </form>

              {/* 3. MODULES LIST (Compact & Collapsible) */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {displayedModules.length === 0 ? (
                  <div style={{ padding: "40px 20px", textAlign: "center", backgroundColor: "#FFFFFF", borderRadius: "10px", border: "1px dashed #CBD5E1" }}>
                    <p style={{ margin: "0 0 6px", fontSize: "14px", fontWeight: 700, color: "#0F172A" }}>
                      {activeProgramModules.length === 0 ? "No Modules in this Program Yet" : "No Module Matching Selection"}
                    </p>
                    <p style={{ margin: 0, fontSize: "12px", color: "#64748B" }}>
                      {activeProgramModules.length === 0 ? "Use the form above to add the first module." : "Reset module filter to view all modules."}
                    </p>
                  </div>
                ) : (
                  displayedModules.map((mod, modIdx) => {
                    const isCompleted = activeProgramCompleted.includes(mod.id);
                    const subtopics = mod.subtopics || [];
                    const isExpanded = isModuleExpanded(mod.id, modIdx);
                    const formattedNum = !isNaN(Number(mod.id))
                      ? String(mod.id).padStart(2, "0")
                      : mod.id;

                    return (
                      <div
                        key={mod.id}
                        style={{
                          backgroundColor: "#FFFFFF",
                          borderRadius: "10px",
                          border: "1px solid #E2E8F0",
                          overflow: "hidden",
                          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.02)",
                          transition: "border-color 0.15s ease"
                        }}
                      >
                        {/* Module Header Row */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "10px 16px",
                            backgroundColor: "#FFFFFF",
                            gap: "12px"
                          }}
                        >
                          {/* Clickable Title Area to Expand/Collapse */}
                          <div
                            onClick={() => toggleModuleExpanded(mod.id, modIdx)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                              flex: 1,
                              cursor: "pointer",
                              userSelect: "none",
                              minWidth: 0
                            }}
                          >
                            <span
                              style={{
                                fontSize: "13.5px",
                                fontWeight: 800,
                                color: "#10B981",
                                minWidth: "22px",
                                letterSpacing: "0.02em"
                              }}
                            >
                              {formattedNum}
                            </span>
                            <h3
                              style={{
                                margin: 0,
                                fontSize: "14px",
                                fontWeight: 700,
                                color: "#0F172A",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis"
                              }}
                            >
                              {mod.title}
                            </h3>
                          </div>

                          {/* Right Meta & Actions */}
                          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
                            {/* Collapsed / Subtopic count status */}
                            <span
                              onClick={() => toggleModuleExpanded(mod.id, modIdx)}
                              style={{
                                fontSize: "12px",
                                color: isExpanded ? "#64748B" : "#94A3B8",
                                cursor: "pointer",
                                userSelect: "none"
                              }}
                            >
                              {isExpanded ? `${subtopics.length} subtopics` : "collapsed"}
                            </span>

                            {/* Status Badge */}
                            {isCompleted ? (
                              <span
                                style={{
                                  fontSize: "11px",
                                  fontWeight: 700,
                                  color: "#059669",
                                  backgroundColor: "#ECFDF5",
                                  border: "1px solid #A7F3D0",
                                  padding: "2px 8px",
                                  borderRadius: "12px"
                                }}
                              >
                                Completed
                              </span>
                            ) : (
                              <span
                                style={{
                                  fontSize: "11px",
                                  fontWeight: 600,
                                  color: "#64748B",
                                  backgroundColor: "#F8FAFC",
                                  border: "1px solid #E2E8F0",
                                  padding: "2px 8px",
                                  borderRadius: "12px"
                                }}
                              >
                                In Progress
                              </span>
                            )}

                            {/* Action Buttons: Checkmark, Edit, Delete */}
                            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                              {/* Complete Toggle Button */}
                              <button
                                onClick={() => handleToggleGlobalModule(activeCurriculumProgram.id, mod.id, isCompleted)}
                                title={isCompleted ? "Mark Incomplete" : "Mark Complete"}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  width: "28px",
                                  height: "28px",
                                  borderRadius: "6px",
                                  border: "1px solid #E2E8F0",
                                  backgroundColor: isCompleted ? "#ECFDF5" : "#FFFFFF",
                                  color: isCompleted ? "#059669" : "#64748B",
                                  cursor: "pointer",
                                  padding: 0
                                }}
                              >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              </button>

                              {/* Edit Module Title Button */}
                              <button
                                onClick={() =>
                                  setEditingModule({
                                    programId: activeCurriculumProgram.id,
                                    moduleId: mod.id,
                                    title: mod.title
                                  })
                                }
                                title="Edit Module Title"
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  width: "28px",
                                  height: "28px",
                                  borderRadius: "6px",
                                  border: "1px solid #E2E8F0",
                                  backgroundColor: "#FFFFFF",
                                  color: "#64748B",
                                  cursor: "pointer",
                                  padding: 0
                                }}
                              >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                              </button>

                              {/* Delete Module Button */}
                              <button
                                onClick={() => handleRemoveModule(activeCurriculumProgram.id, mod.id, mod.title)}
                                title="Delete Module"
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  width: "28px",
                                  height: "28px",
                                  borderRadius: "6px",
                                  border: "1px solid #FEE2E2",
                                  backgroundColor: "#FFFFFF",
                                  color: "#EF4444",
                                  cursor: "pointer",
                                  padding: 0
                                }}
                              >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <polyline points="3 6 5 6 21 6" />
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Subtopics Section (When Expanded) */}
                        {isExpanded && (
                          <div style={{ borderTop: "1px solid #F1F5F9", padding: "10px 18px 14px 44px", backgroundColor: "#FAFAFA" }}>
                            {subtopics.length === 0 ? (
                              <div style={{ padding: "8px 0", fontSize: "12px", color: "#94A3B8" }}>
                                No subtopics added yet.
                              </div>
                            ) : (
                              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                {subtopics.map((subtopic, idx) => {
                                  const isEditing = editingSubtopic?.moduleId === mod.id && editingSubtopic?.index === idx;

                                  return (
                                    <div
                                      key={idx}
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        gap: "10px",
                                        padding: isEditing ? "6px 8px" : "4px 0",
                                        backgroundColor: isEditing ? "#FFFFFF" : "transparent",
                                        border: isEditing ? "1px solid #CBD5E1" : "none",
                                        borderRadius: isEditing ? "6px" : "0"
                                      }}
                                    >
                                      {isEditing ? (
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
                                          <input
                                            type="text"
                                            value={editingSubtopic.text}
                                            onChange={e => setEditingSubtopic({ ...editingSubtopic, text: e.target.value })}
                                            onKeyDown={e => {
                                              if (e.key === "Enter") {
                                                e.preventDefault();
                                                handleSaveSubtopicEdit();
                                              } else if (e.key === "Escape") {
                                                setEditingSubtopic(null);
                                              }
                                            }}
                                            autoFocus
                                            style={{
                                              flex: 1,
                                              padding: "5px 10px",
                                              borderRadius: "6px",
                                              border: "1px solid #CBD5E1",
                                              fontSize: "12.5px",
                                              outline: "none"
                                            }}
                                          />
                                          <button
                                            onClick={handleSaveSubtopicEdit}
                                            disabled={savingSubtopicEdit}
                                            style={{
                                              padding: "5px 10px",
                                              borderRadius: "6px",
                                              backgroundColor: "#0F172A",
                                              color: "#FFFFFF",
                                              fontSize: "11px",
                                              fontWeight: 700,
                                              border: "none",
                                              cursor: "pointer"
                                            }}
                                          >
                                            Save
                                          </button>
                                          <button
                                            onClick={() => setEditingSubtopic(null)}
                                            style={{
                                              padding: "5px 8px",
                                              borderRadius: "6px",
                                              backgroundColor: "transparent",
                                              color: "#64748B",
                                              border: "1px solid #CBD5E1",
                                              fontSize: "11px",
                                              cursor: "pointer"
                                            }}
                                          >
                                            Cancel
                                          </button>
                                        </div>
                                      ) : (
                                        <>
                                          <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", flex: 1, minWidth: 0 }}>
                                            <span style={{ fontSize: "12.5px", fontWeight: 600, color: "#64748B", minWidth: "16px" }}>
                                              {idx + 1}.
                                            </span>
                                            <span style={{ fontSize: "12.5px", color: "#334155", fontWeight: 450, lineHeight: 1.45 }}>
                                              {subtopic}
                                            </span>
                                          </div>

                                          <div style={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0 }}>
                                            {/* Edit Subtopic Icon */}
                                            <button
                                              onClick={() => setEditingSubtopic({ moduleId: mod.id, index: idx, text: subtopic })}
                                              title="Edit subtopic"
                                              style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                width: "24px",
                                                height: "24px",
                                                borderRadius: "4px",
                                                border: "1px solid #E2E8F0",
                                                backgroundColor: "#FFFFFF",
                                                color: "#64748B",
                                                cursor: "pointer",
                                                padding: 0
                                              }}
                                            >
                                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                              </svg>
                                            </button>

                                            {/* Delete Subtopic Icon */}
                                            <button
                                              onClick={() => handleRemoveSubtopic(activeCurriculumProgram.id, mod.id, idx, subtopic)}
                                              title="Delete subtopic"
                                              style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                width: "24px",
                                                height: "24px",
                                                borderRadius: "4px",
                                                border: "1px solid #E2E8F0",
                                                backgroundColor: "#FFFFFF",
                                                color: "#94A3B8",
                                                cursor: "pointer",
                                                padding: 0
                                              }}
                                              onMouseEnter={e => {
                                                e.currentTarget.style.color = "#DC2626";
                                                e.currentTarget.style.borderColor = "#FEE2E2";
                                              }}
                                              onMouseLeave={e => {
                                                e.currentTarget.style.color = "#94A3B8";
                                                e.currentTarget.style.borderColor = "#E2E8F0";
                                              }}
                                            >
                                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                <line x1="18" y1="6" x2="6" y2="18" />
                                                <line x1="6" y1="6" x2="18" y2="18" />
                                              </svg>
                                            </button>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {/* Inline Add Subtopic Input */}
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "10px" }}>
                              <input
                                type="text"
                                placeholder="+ Add subtopic and press Enter"
                                value={subtopicInputs[mod.id] || ""}
                                onChange={e => {
                                  const val = e.target.value;
                                  setSubtopicInputs(prev => ({ ...prev, [mod.id]: val }));
                                }}
                                onKeyDown={e => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleAddSubtopic(activeCurriculumProgram.id, mod.id);
                                  }
                                }}
                                style={{
                                  flex: 1,
                                  padding: "6px 12px",
                                  borderRadius: "6px",
                                  border: "1px solid #CBD5E1",
                                  backgroundColor: "#FFFFFF",
                                  fontSize: "12px",
                                  outline: "none"
                                }}
                              />
                              <button
                                onClick={() => handleAddSubtopic(activeCurriculumProgram.id, mod.id)}
                                disabled={savingSubtopicKey === mod.id}
                                style={{
                                  padding: "6px 14px",
                                  borderRadius: "6px",
                                  backgroundColor: "#0F172A",
                                  color: "#FFFFFF",
                                  fontSize: "12px",
                                  fontWeight: 700,
                                  border: "none",
                                  cursor: "pointer",
                                  whiteSpace: "nowrap"
                                }}
                              >
                                {savingSubtopicKey === mod.id ? "Adding..." : "Add"}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB: DASHBOARD OVERVIEW */}
          {adminTab === "dashboard" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px", paddingTop: "20px" }}>
              {/* SieLabs Welcome Banner */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: "#0F1523",
                  color: "#FFFFFF",
                  borderRadius: "14px",
                  padding: "24px 28px",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                  flexWrap: "wrap",
                  gap: "16px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
                  <div
                    style={{
                      width: "64px",
                      height: "64px",
                      borderRadius: "12px",
                      backgroundColor: "rgba(255, 255, 255, 0.08)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "6px",
                      boxSizing: "border-box",
                      flexShrink: 0
                    }}
                  >
                    <img
                      src="/favicon.ico"
                      alt="SieLabs Logo"
                      width={50}
                      height={50}
                      style={{ objectFit: "contain", display: "block", borderRadius: "8px" }}
                    />
                  </div>
                  <div>
                    <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: "#FFFFFF" }}>
                      SieLabs Operations Dashboard
                    </h2>
                    <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#94A3B8" }}>
                      Welcome back, {currentUser || "Administrator"} • Live platform operations, cohort progress, and curriculum management.
                    </p>
                  </div>
                </div>

                <Link
                  href="/"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "9px 18px",
                    borderRadius: "8px",
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    color: "#FFFFFF",
                    fontSize: "12px",
                    fontWeight: 600,
                    textDecoration: "none"
                  }}
                >
                  <span>Visit SieLabs Site →</span>
                </Link>
              </div>

              {/* Stats Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
                <div style={{ backgroundColor: "#F8FAFC", borderRadius: "14px", padding: "20px", border: "1px solid #E2E8F0" }}>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>Registered Platform Users</span>
                  <h3 style={{ fontSize: "28px", fontWeight: 800, margin: "6px 0 2px", color: "#0F172A" }}>{totalUsersCount}</h3>
                  <p style={{ margin: 0, fontSize: "12px", color: "#64748B" }}>{enrolledLearnersCount} enrolled in cohorts • {normalUsersCount} normal accounts</p>
                </div>

                <div style={{ backgroundColor: "#F8FAFC", borderRadius: "14px", padding: "20px", border: "1px solid #E2E8F0" }}>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>Active Live Cohorts</span>
                  <h3 style={{ fontSize: "28px", fontWeight: 800, margin: "6px 0 2px", color: "#0F172A" }}>{programs.length}</h3>
                  <p style={{ margin: 0, fontSize: "12px", color: "#64748B" }}>Running on hybrid weekend schedule in Pune</p>
                </div>

                <div style={{ backgroundColor: "#F8FAFC", borderRadius: "14px", padding: "20px", border: "1px solid #E2E8F0" }}>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>Curriculum Progress</span>
                  <h3 style={{ fontSize: "28px", fontWeight: 800, margin: "6px 0 2px", color: overallCompletionRate === 100 ? "#059669" : "#9A7B1A" }}>{overallCompletionRate}%</h3>
                  <p style={{ margin: 0, fontSize: "12px", color: "#64748B" }}>{totalCompletedCount} of {totalModulesCount} syllabus modules completed</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* FLOATING INSPECTOR POPOVER CARD                                */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {selectedInspectorStudent && (
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "420px",
              maxWidth: "92vw",
              backgroundColor: "#FFFFFF",
              borderRadius: "14px",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.22), 0 0 0 1px rgba(0, 0, 0, 0.08)",
              zIndex: 100,
              overflow: "hidden"
            }}
          >
            {/* Dark Topbar */}
            <div style={{ backgroundColor: "#111625", color: "#FFFFFF", padding: "12px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "13px", fontWeight: 800 }}>Account #{selectedInspectorStudent.id.slice(-6).toUpperCase()}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button
                  onClick={() => setSelectedInspectorStudent(null)}
                  style={{ background: "transparent", border: "none", color: "#94A3B8", cursor: "pointer", fontSize: "14px", padding: "2px" }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Contact details */}
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #F1F5F9" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: (selectedInspectorStudent.enrolledPrograms || []).length === 0 ? "#F1F5F9" : "#EDECE8", color: "#0F172A", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "13px" }}>
                  {selectedInspectorStudent.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: "15px", fontWeight: 800, color: "#0F172A" }}>{selectedInspectorStudent.name}</h4>
                  <span style={{ fontSize: "11px", color: (selectedInspectorStudent.enrolledPrograms || []).length > 0 ? "#059669" : "#D97706", fontWeight: 700 }}>
                    {(selectedInspectorStudent.enrolledPrograms || []).length > 0 ? "Enrolled User" : "Normal Registered User"}
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "12px", color: "#475569" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span>✉</span>
                  <span>{selectedInspectorStudent.email}</span>
                </div>
                {selectedInspectorStudent.mobile && (
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span>✆</span>
                    <span>{selectedInspectorStudent.mobile}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Cohorts / Status Details in card */}
            <div style={{ padding: "14px 20px", maxHeight: "220px", overflowY: "auto" }}>
              {(selectedInspectorStudent.enrolledPrograms || []).length === 0 ? (
                <div style={{ backgroundColor: "#F8FAFC", borderRadius: "10px", padding: "16px", border: "1px dashed #CBD5E1", textAlign: "center" }}>
                  <p style={{ margin: "0 0 6px", fontSize: "13px", fontWeight: 700, color: "#0F172A" }}>
                    Normal Registered User
                  </p>
                  <p style={{ margin: "0 0 12px", fontSize: "12px", color: "#64748B", lineHeight: 1.4 }}>
                    This user has created an account on SieLabs but is not enrolled in any programs yet.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedStudentForEnroll(selectedInspectorStudent.email);
                      setIsEnrollModalOpen(true);
                      setSelectedInspectorStudent(null);
                    }}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "8px",
                      backgroundColor: "#0F172A",
                      color: "#FFFFFF",
                      fontSize: "12px",
                      fontWeight: 700,
                      border: "none",
                      cursor: "pointer"
                    }}
                  >
                    + Assign / Enroll in Cohort
                  </button>
                </div>
              ) : (
                <>
                  <p style={{ margin: "0 0 10px", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#94A3B8", letterSpacing: "0.05em" }}>
                    Active Cohort Enrollments ({selectedInspectorStudent.enrolledPrograms.length}):
                  </p>
                  {selectedInspectorStudent.enrolledPrograms.map(ep => {
                    const prog = programs.find(p => p.id === ep.programId);
                    const comp = globalProgress[ep.programId] || [];
                    const tot = prog?.modules.length || 6;
                    const pct = Math.round((comp.length / tot) * 100);

                    return (
                      <div
                        key={ep.programId}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "10px 12px",
                          borderRadius: "8px",
                          backgroundColor: "#F8FAFC",
                          border: "1px solid #E2E8F0",
                          marginBottom: "8px"
                        }}
                      >
                        <div>
                          <p style={{ margin: 0, fontSize: "12px", fontWeight: 700, color: "#0F172A" }}>
                            {ep.programName || prog?.title}
                          </p>
                          <span style={{ fontSize: "11px", color: "#059669", fontWeight: 600 }}>
                            {comp.length}/{tot} Modules ({pct}%)
                          </span>
                        </div>
                        <button
                          onClick={() => handleUnenroll(selectedInspectorStudent.email, ep.programId, ep.programName || prog?.title || "")}
                          style={{ background: "transparent", border: "none", color: "#DC2626", fontSize: "11px", fontWeight: 600, cursor: "pointer", padding: "4px" }}
                        >
                          Unenroll
                        </button>
                      </div>
                    );
                  })}
                </>
              )}
            </div>

            {/* Footer action bar */}
            <div style={{ padding: "12px 20px", backgroundColor: "#F8FAFC", borderTop: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              {(selectedInspectorStudent.enrolledPrograms || []).length > 0 && (
                <button
                  onClick={() => {
                    setSelectedStudentForEnroll(selectedInspectorStudent.email);
                    setIsEnrollModalOpen(true);
                    setSelectedInspectorStudent(null);
                  }}
                  style={{ padding: "7px 14px", borderRadius: "8px", backgroundColor: "#0F172A", color: "#FFFFFF", fontSize: "12px", fontWeight: 700, border: "none", cursor: "pointer" }}
                >
                  + Enroll in Another Cohort
                </button>
              )}
              <button
                onClick={() => setSelectedInspectorStudent(null)}
                style={{ padding: "7px 14px", borderRadius: "8px", backgroundColor: "transparent", color: "#64748B", fontSize: "12px", fontWeight: 600, border: "1px solid #E2E8F0", cursor: "pointer", marginLeft: "auto" }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </main>



      {/* ═════════════════════════════════════════════════════════════════ */}
      {/* MODAL: ADD MODULE                                             */}
      {/* ═════════════════════════════════════════════════════════════════ */}
      {isAddModuleModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.55)",
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
              borderRadius: "16px",
              padding: "28px 30px",
              maxWidth: "520px",
              width: "100%",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.2)",
              border: "1px solid rgba(0, 0, 0, 0.08)",
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
              <div>
                <h2 style={{ fontSize: "18px", fontWeight: 800, margin: 0, color: "#0F172A" }}>
                  Add Module to {activeCurriculumProgram.title}
                </h2>
                <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#64748B" }}>
                  Create a new syllabus module with subtopics.
                </p>
              </div>
              <button
                onClick={() => setIsAddModuleModalOpen(false)}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "#94A3B8", fontSize: "16px" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddModule} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#64748B", marginBottom: "5px" }}>
                  Module Title *
                </label>
                <input
                  type="text"
                  value={newModuleTitle}
                  onChange={e => setNewModuleTitle(e.target.value)}
                  required
                  placeholder="e.g. Advanced Transformer Architectures"
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "8px",
                    border: "1px solid #CBD5E1",
                    backgroundColor: "#FAFAF8",
                    fontSize: "13px",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#64748B", marginBottom: "5px" }}>
                  Subtopics (One per line)
                </label>
                <textarea
                  value={newModuleSubtopics}
                  onChange={e => setNewModuleSubtopics(e.target.value)}
                  placeholder={"Attention mechanism\nFeedforward neural networks\nFine-tuning with LoRA"}
                  rows={4}
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "8px",
                    border: "1px solid #CBD5E1",
                    backgroundColor: "#FAFAF8",
                    fontSize: "13px",
                    outline: "none",
                    resize: "vertical",
                    fontFamily: "system-ui, sans-serif",
                    boxSizing: "border-box"
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
                    border: "1px solid #E2E8F0",
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
                    backgroundColor: "#0F172A",
                    color: "#FFFFFF",
                    border: "none",
                    cursor: "pointer"
                  }}
                >
                  {savingModule ? "Saving..." : "Add Module"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════ */}
      {/* MODAL: ENROLL STUDENT                                         */}
      {/* ═════════════════════════════════════════════════════════════════ */}
      {isEnrollModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.55)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px"
          }}
          onClick={() => setIsEnrollModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "16px",
              padding: "28px 30px",
              maxWidth: "460px",
              width: "100%",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.2)",
              border: "1px solid rgba(0, 0, 0, 0.08)",
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
              <div>
                <h2 style={{ fontSize: "18px", fontWeight: 800, margin: 0, color: "#0F172A" }}>Enroll User in Cohort</h2>
                <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#64748B" }}>
                  Assign any registered platform user to an active cohort batch.
                </p>
              </div>
              <button
                onClick={() => setIsEnrollModalOpen(false)}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "#94A3B8", fontSize: "16px" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEnrollStudent} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#64748B", marginBottom: "5px" }}>
                  Select User Account
                </label>
                <select
                  value={selectedStudentForEnroll}
                  onChange={e => setSelectedStudentForEnroll(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "8px",
                    border: "1px solid #CBD5E1",
                    backgroundColor: "#FAFAF8",
                    fontSize: "13px",
                    outline: "none"
                  }}
                >
                  <option value="">-- Choose user account --</option>
                  {students
                    .filter(s => s.role !== "admin" && s.email !== currentEmail && s.name !== currentUser)
                    .map(s => {
                      const isUnenrolled = (s.enrolledPrograms || []).length === 0;
                      return (
                        <option key={s.id} value={s.email}>
                          {s.name} ({s.email}) {isUnenrolled ? "— [Normal User / Not Enrolled]" : `— [Enrolled: ${s.enrolledPrograms.length}]`}
                        </option>
                      );
                    })}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#64748B", marginBottom: "5px" }}>
                  Select Program Cohort
                </label>
                <select
                  value={selectedProgramForEnroll}
                  onChange={e => setSelectedProgramForEnroll(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "8px",
                    border: "1px solid #CBD5E1",
                    backgroundColor: "#FAFAF8",
                    fontSize: "13px",
                    outline: "none"
                  }}
                >
                  {programs.map(prog => (
                    <option key={prog.id} value={prog.id}>
                      {prog.title} ({prog.duration})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "8px" }}>
                <button
                  type="button"
                  onClick={() => setIsEnrollModalOpen(false)}
                  style={{
                    padding: "9px 16px",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: 600,
                    backgroundColor: "transparent",
                    border: "1px solid #E2E8F0",
                    color: "#0F172A",
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
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
                  {actionLoading ? "Enrolling..." : "Confirm Enrollment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════ */}
      {/* MODAL: EDIT MODULE (Title and Subtopics)                       */}
      {/* ═════════════════════════════════════════════════════════════════ */}
      {editingModule && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.55)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px"
          }}
          onClick={() => setEditingModule(null)}
        >
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "16px",
              padding: "28px 30px",
              maxWidth: "520px",
              width: "100%",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.2)",
              border: "1px solid rgba(0, 0, 0, 0.08)"
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
              <div>
                <span style={{ fontSize: "11px", fontWeight: 800, color: "#9A7B1A", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Curriculum Editor
                </span>
                <h2 style={{ fontSize: "18px", fontWeight: 800, margin: "2px 0 0", color: "#0F172A" }}>
                  Edit Module {editingModule.moduleId}
                </h2>
              </div>
              <button
                onClick={() => setEditingModule(null)}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "#94A3B8", fontSize: "16px" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateModule} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#64748B", marginBottom: "5px" }}>
                  Module Title
                </label>
                <input
                  type="text"
                  value={editingModule.title}
                  onChange={e => setEditingModule({ ...editingModule, title: e.target.value })}
                  required
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "8px",
                    border: "1px solid #CBD5E1",
                    backgroundColor: "#FAFAF8",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#0F172A",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "8px" }}>
                <button
                  type="button"
                  onClick={() => setEditingModule(null)}
                  style={{
                    padding: "9px 16px",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: 600,
                    backgroundColor: "transparent",
                    border: "1px solid #E2E8F0",
                    color: "#0F172A",
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEditModule}
                  style={{
                    padding: "9px 20px",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: 700,
                    backgroundColor: "#0F172A",
                    color: "#FFFFFF",
                    border: "none",
                    cursor: "pointer"
                  }}
                >
                  {savingEditModule ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════ */}
      {/* MODAL: CUSTOM CONFIRMATION PROMPT (No browser confirm())       */}
      {/* ═════════════════════════════════════════════════════════════════ */}
      {confirmModal?.isOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1100,
            padding: "20px"
          }}
          onClick={() => setConfirmModal(null)}
        >
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "16px",
              padding: "26px 28px",
              maxWidth: "440px",
              width: "100%",
              boxShadow: "0 25px 60px rgba(0, 0, 0, 0.25)",
              border: "1px solid rgba(0, 0, 0, 0.08)"
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", marginBottom: "16px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  backgroundColor: confirmModal.confirmVariant === "danger" ? "#FEF2F2" : "#FEF3C7",
                  color: confirmModal.confirmVariant === "danger" ? "#DC2626" : "#D97706",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: "0 0 6px", fontSize: "16px", fontWeight: 800, color: "#0F172A" }}>
                  {confirmModal.title}
                </h3>
                <p style={{ margin: 0, fontSize: "13px", color: "#64748B", lineHeight: 1.5 }}>
                  {confirmModal.description}
                </p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "10px", marginTop: "22px" }}>
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                style={{
                  padding: "9px 16px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: 600,
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #CBD5E1",
                  color: "#475569",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (confirmModal.onConfirm) {
                    await confirmModal.onConfirm();
                  }
                }}
                style={{
                  padding: "9px 18px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: 700,
                  backgroundColor: confirmModal.confirmVariant === "danger" ? "#DC2626" : "#0F172A",
                  color: "#FFFFFF",
                  border: "none",
                  cursor: "pointer",
                  boxShadow: confirmModal.confirmVariant === "danger" ? "0 2px 8px rgba(220, 38, 38, 0.25)" : "0 2px 8px rgba(15, 23, 42, 0.2)"
                }}
              >
                {confirmModal.confirmText || "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
