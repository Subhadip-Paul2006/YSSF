"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Shield,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Eye,
  Settings,
  Trash2,
  X,
  Printer,
  Download,
  Check,
  Activity,
  Globe,
} from "lucide-react";
import {
  apiGetAdminStats,
  apiGetAllUsers,
  apiDeleteUser,
  apiVerifyNgo,
  apiUpdateCampaignStatus,
  apiUpdateBlogStatus,
  apiGetBlogPosts,
  apiGetCampaigns,
  type AdminStatsResponse,
  type UserProfile,
  type Campaign,
  type BlogPost,
} from "@/lib/api";

function formatCurrency(val: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val);
}

function timeAgo(date: string | Date) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months > 1 ? "s" : ""} ago`;
}

function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString("en-IN", { month: "short", year: "numeric" });
}

function AdminSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="h-5 w-28 bg-slate-100 rounded animate-pulse mb-8" />
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-slate-100 animate-pulse" />
            <div className="h-4 w-28 bg-slate-100 rounded animate-pulse" />
          </div>
          <div className="h-10 w-80 bg-slate-100 rounded animate-pulse mb-2" />
          <div className="h-5 w-96 bg-slate-100 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="yssf-card p-5 bg-white border-slate-200/60 text-center">
              <div className="w-5 h-5 bg-slate-100 mx-auto mb-2 animate-pulse" />
              <div className="h-8 w-16 bg-slate-100 rounded mx-auto animate-pulse" />
              <div className="h-4 w-24 bg-slate-100 rounded mx-auto mt-2 animate-pulse" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="yssf-card p-5 bg-white border-slate-200/60 h-24 animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7">
            <div className="h-6 w-36 bg-slate-100 rounded animate-pulse mb-4" />
            <div className="h-64 bg-slate-100/50 rounded-2xl animate-pulse" />
          </div>
          <div className="lg:col-span-5 space-y-8">
            <div className="h-6 w-44 bg-slate-100 rounded animate-pulse mb-4" />
            {[1, 2].map((i) => (
              <div key={i} className="h-28 bg-slate-100/50 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const QUICK_ACTIONS = [
  { label: "Approve NGO", icon: CheckCircle2, desc: "Review pending NGO partner applications" },
  { label: "Moderate Content", icon: Eye, desc: "Review blog posts and event submissions" },
  { label: "View Reports", icon: FileText, desc: "Access financial and impact reports" },
  { label: "Platform Settings", icon: Settings, desc: "Configure platform-wide settings" },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<AdminStatsResponse | null>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  // New Admin Panel States
  const [activeModal, setActiveModal] = useState<"ngo" | "moderate" | "reports" | "settings" | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserProfile | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [modLoading, setModLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [siteSettings, setSiteSettings] = useState({
    maintenanceMode: false,
    allowVolunteerSignup: true,
    requireEmailVerification: true,
    emergencyPhone: "9876543210",
  });

  const pendingNgos = users.filter(
    (u) => u.role === "ngo_partner" && u.roleLevel !== "approved" && u.roleLevel !== "rejected"
  );

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadModerationData = async () => {
    setModLoading(true);
    try {
      const [c, b] = await Promise.all([apiGetCampaigns(), apiGetBlogPosts()]);
      setCampaigns(c);
      setBlogPosts(b);
    } catch (err) {
      console.error("Error loading moderation data:", err);
      showToast("Failed to load campaigns/blogs", "error");
    } finally {
      setModLoading(false);
    }
  };

  useEffect(() => {
    Promise.all([apiGetAdminStats(), apiGetAllUsers()])
      .then(([adminStats, allUsers]) => {
        if (!adminStats) {
          router.push("/login");
          return;
        }
        setStats(adminStats);
        setUsers(allUsers);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading admin dashboard stats:", err);
        router.push("/login?error=load_failed");
      });

    // Load site settings if saved locally
    const saved = localStorage.getItem("yssf-settings");
    if (saved) {
      try {
        setSiteSettings(JSON.parse(saved));
      } catch (err) {
        console.error("Error loading settings:", err);
      }
    }
  }, [router]);

  const handleDeleteUser = async (userId: string) => {
    try {
      await apiDeleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      if (stats) {
        setStats({
          ...stats,
          totalUsers: stats.totalUsers - 1,
        });
      }
      showToast("User deleted successfully!");
      setUserToDelete(null);
    } catch (err) {
      console.error("Delete user failed:", err);
      showToast(err instanceof Error ? err.message : "Failed to delete user", "error");
    }
  };

  const handleVerifyNgo = async (userId: string, action: "approved" | "rejected") => {
    try {
      await apiVerifyNgo(userId, action);
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, roleLevel: action } : u)));
      if (stats && stats.pendingVerifications > 0) {
        setStats({
          ...stats,
          pendingVerifications: stats.pendingVerifications - 1,
        });
      }
      showToast(`NGO has been ${action} successfully!`);
    } catch (err) {
      console.error("Verify NGO failed:", err);
      showToast(err instanceof Error ? err.message : "Failed to verify NGO", "error");
    }
  };

  const handleToggleCampaign = async (campaignId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      await apiUpdateCampaignStatus(campaignId, nextStatus);
      setCampaigns((prev) => prev.map((c) => (c.id === campaignId ? { ...c, status: nextStatus } : c)));
      showToast(`Campaign is now ${nextStatus}!`);
    } catch (err) {
      console.error("Failed to toggle campaign status:", err);
      showToast(err instanceof Error ? err.message : "Failed to update status", "error");
    }
  };

  const handleToggleBlog = async (blogId: string, currentPublished: boolean) => {
    const nextPublished = !currentPublished;
    try {
      await apiUpdateBlogStatus(blogId, nextPublished);
      setBlogPosts((prev) => prev.map((b) => (b.id === blogId ? { ...b, published: nextPublished } : b)));
      showToast(`Blog post is now ${nextPublished ? "published" : "unpublished"}!`);
    } catch (err) {
      console.error("Failed to toggle blog post status:", err);
      showToast(err instanceof Error ? err.message : "Failed to update status", "error");
    }
  };

  const downloadReport = (format: "csv" | "json") => {
    let content = "";
    let filename = `yssf-report-${new Date().toISOString().slice(0, 10)}`;

    if (format === "json") {
      content = JSON.stringify(
        {
          generatedAt: new Date().toISOString(),
          stats,
          usersSummary: users.map((u) => ({ name: u.name, email: u.email, role: u.role, joined: u.createdAt })),
        },
        null,
        2
      );
      filename += ".json";
    } else {
      content =
        "Name,Email,Role,Joined Date\n" +
        users
          .map(
            (u) =>
              `"${u.name || "Unnamed"}","${u.email}","${u.role}","${new Date(
                u.createdAt
              ).toLocaleDateString()}"`
          )
          .join("\n");
      filename += ".csv";
    }

    const blob = new Blob([content], { type: format === "json" ? "application/json" : "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Report downloaded as ${format.toUpperCase()}!`);
  };

  const handleSaveSettings = () => {
    localStorage.setItem("yssf-settings", JSON.stringify(siteSettings));
    showToast("Platform settings saved successfully!");
    setActiveModal(null);
  };

  if (loading) return <AdminSkeleton />;
  if (!stats) return null;

  const PLATFORM_STATS = [
    { label: "Total Users", value: stats.totalUsers.toLocaleString("en-IN"), icon: Users, color: "text-primary-900" },
    { label: "Active Campaigns", value: String(stats.activeCampaigns), icon: TrendingUp, color: "text-accent-600" },
    { label: "Pending Verifications", value: String(stats.pendingVerifications), icon: AlertTriangle, color: "text-warning-500" },
    { label: "Total Donations", value: formatCurrency(stats.totalDonations), icon: TrendingUp, color: "text-primary-700" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-700 font-heading font-semibold text-sm hover:underline mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-slate-700/10 text-slate-700">
              <Shield className="w-6 h-6" />
            </div>
            <span className="font-display font-semibold text-slate-600 uppercase tracking-widest text-sm">Admin Panel</span>
          </div>
          <h1 className="font-heading font-extrabold text-4xl text-slate-900 leading-tight">
            Platform <span className="handwritten-highlight inline-block font-handwritten text-accent-500">Administration</span>
          </h1>
          <p className="font-sans text-slate-600 mt-2">Manage users, verify NGOs, review donations, and monitor platform health.</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {PLATFORM_STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="yssf-card p-5 bg-white border-slate-200/60 text-center">
                <Icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
                <p className="font-heading font-extrabold text-2xl text-slate-900">{stat.value}</p>
                <p className="font-sans text-xs text-slate-500 mt-1">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-10">
          <h2 className="font-heading font-extrabold text-xl text-slate-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  onClick={() => {
                    if (action.label === "Approve NGO") {
                      setActiveModal("ngo");
                    } else if (action.label === "Moderate Content") {
                      setActiveModal("moderate");
                      loadModerationData();
                    } else if (action.label === "View Reports") {
                      setActiveModal("reports");
                    } else if (action.label === "Platform Settings") {
                      setActiveModal("settings");
                    }
                  }}
                  className="yssf-card p-5 bg-white border-slate-200/60 text-left hover:border-slate-400 transition-colors cursor-pointer group"
                >
                  <Icon className="w-6 h-6 text-slate-700 mb-3 group-hover:text-slate-900 transition-colors" />
                  <h3 className="font-heading font-bold text-sm text-slate-900 mb-1">{action.label}</h3>
                  <p className="font-sans text-xs text-slate-500">{action.desc}</p>
                </button>
              );
            })}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* User Management */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-7">
            <h2 className="font-heading font-extrabold text-xl text-slate-900 mb-4">User Management</h2>
            <div className="yssf-card overflow-hidden bg-white border-slate-200/60">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left p-4 font-heading font-bold text-xs text-slate-500 uppercase tracking-wider">Name</th>
                      <th className="text-left p-4 font-heading font-bold text-xs text-slate-500 uppercase tracking-wider">Role</th>
                      <th className="text-center p-4 font-heading font-bold text-xs text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="text-right p-4 font-heading font-bold text-xs text-slate-500 uppercase tracking-wider">Joined</th>
                      <th className="text-center p-4 font-heading font-bold text-xs text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length > 0 ? users.slice(0, 10).map((user) => {
                      const role = user.profile?.role || user.role || "User";
                      return (
                        <tr key={user.id} className="border-b border-slate-100/50 last:border-0">
                          <td className="p-4">
                            <p className="font-heading font-semibold text-sm text-slate-900">{user.name || "Unnamed"}</p>
                            <p className="font-sans text-xs text-slate-500">{user.email}</p>
                          </td>
                          <td className="p-4">
                            <span className={`inline-block px-2 py-1 rounded-full text-[10px] font-heading font-bold ${
                              role === "ADMIN" ? "bg-slate-700 text-white" :
                              role === "VOLUNTEER" ? "bg-primary-900 text-white" :
                              role === "DONOR" ? "bg-accent-500 text-slate-900" :
                              "bg-primary-700 text-white"
                            }`}>
                              {role}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <span className="inline-flex items-center gap-1 text-xs font-heading font-semibold text-primary-900">
                              <CheckCircle2 className="w-3 h-3" />
                              Active
                            </span>
                          </td>
                          <td className="p-4 text-right font-sans text-xs text-slate-500">{formatDate(user.createdAt)}</td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => setUserToDelete(user)}
                              className="p-1.5 text-slate-400 hover:text-red-650 hover:bg-red-50 transition-all rounded-lg cursor-pointer"
                              title="Delete User"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </td>
                        </tr>
                      );
                    }) : (
                      <tr>
                        <td colSpan={5} className="p-6 text-center font-sans text-sm text-slate-500">No users found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

          <div className="lg:col-span-5 space-y-8">
            {/* Pending Verifications */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <h2 className="font-heading font-extrabold text-xl text-slate-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-warning-500" /> Pending Verifications
              </h2>
              {stats.pendingVerifications > 0 ? (
                <div className="yssf-card p-4 bg-white border-warning-500/20">
                  <p className="font-heading font-bold text-sm text-slate-900 mb-1">{stats.pendingVerifications} pending registration{stats.pendingVerifications !== 1 ? "s" : ""}</p>
                  <p className="font-sans text-xs text-slate-500 mb-3">Review and approve event registrations awaiting verification.</p>
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 bg-primary-900 hover:bg-primary-800 text-white font-heading font-bold text-xs rounded-xl cursor-pointer transition-colors">
                      Review All
                    </button>
                  </div>
                </div>
              ) : (
                <div className="yssf-card p-4 bg-white border-slate-200/60 text-center">
                  <CheckCircle2 className="w-6 h-6 text-primary-900 mx-auto mb-2" />
                  <p className="font-sans text-sm text-slate-500">All clear! No pending verifications.</p>
                </div>
              )}
            </motion.div>

            {/* Recent Donations */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <h2 className="font-heading font-extrabold text-xl text-slate-900 mb-4">Recent Donations</h2>
              {stats.recentDonations.length > 0 ? (
                <div className="space-y-2">
                  {stats.recentDonations.map((donation) => (
                    <div key={donation.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div>
                        <p className="font-heading font-semibold text-sm text-slate-900">Donation</p>
                        <p className="font-sans text-[10px] text-slate-500">{donation.campaign?.title || "General"} · {timeAgo(donation.createdAt)}</p>
                      </div>
                      <p className="font-heading font-bold text-sm text-primary-900">{formatCurrency(donation.amount)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
                  <p className="font-sans text-sm text-slate-500">No donations yet.</p>
                </div>
              )}
            </motion.div>

            {/* Recent Users */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <h2 className="font-heading font-extrabold text-xl text-slate-900 mb-4">Recent Users</h2>
              {stats.recentUsers.length > 0 ? (
                <div className="space-y-2">
                  {stats.recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div>
                        <p className="font-heading font-semibold text-sm text-slate-900">{user.name || "Unnamed"}</p>
                        <p className="font-sans text-[10px] text-slate-500">{user.email} · {timeAgo(user.createdAt)}</p>
                      </div>
                      <span className={`inline-block px-2 py-1 rounded-full text-[10px] font-heading font-bold ${
                        user.profile?.role === "ADMIN" ? "bg-slate-700 text-white" :
                        user.profile?.role === "VOLUNTEER" ? "bg-primary-900 text-white" :
                        user.profile?.role === "DONOR" ? "bg-accent-500 text-slate-900" :
                        "bg-primary-700 text-white"
                      }`}>
                        {user.profile?.role || "User"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
                  <p className="font-sans text-sm text-slate-500">No recent users.</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Toast Notification */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className={`fixed bottom-5 right-5 z-[100] flex items-center gap-2.5 px-5 py-3.5 rounded-2xl shadow-xl border text-sm font-heading font-semibold ${
                toast.type === "success"
                  ? "bg-slate-900 border-primary-400 text-white"
                  : "bg-red-950 border-red-800 text-red-200"
              }`}
            >
              {toast.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 text-accent-500 shrink-0 animate-bounce" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-alert-500 shrink-0" />
              )}
              <span>{toast.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {userToDelete && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setUserToDelete(null)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 15 }}
                className="relative bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 max-w-md w-full z-10 space-y-6"
              >
                <div className="flex items-center gap-4 text-red-650">
                  <div className="p-3 bg-red-50 rounded-2xl">
                    <Trash2 className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-heading font-extrabold text-lg text-slate-900">Delete User</h3>
                    <p className="font-sans text-xs text-slate-500">This action cannot be undone.</p>
                  </div>
                </div>

                <p className="font-sans text-sm text-slate-600 leading-relaxed">
                  Are you sure you want to delete <strong className="text-slate-900">{userToDelete.name || userToDelete.email}</strong>? Their login access will be removed, and event/donation associations will be safely dissociated.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setUserToDelete(null)}
                    className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 font-heading font-bold text-xs rounded-xl cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteUser(userToDelete.id)}
                    className="flex-1 py-3 bg-red-600 hover:bg-red-750 text-white font-heading font-bold text-xs rounded-xl cursor-pointer transition-colors"
                  >
                    Yes, Delete User
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Modal: NGO Approvals */}
        <AnimatePresence>
          {activeModal === "ngo" && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveModal(null)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 15 }}
                className="relative bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 max-w-2xl w-full z-10 flex flex-col max-h-[85vh]"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary-900" />
                    <h3 className="font-heading font-extrabold text-xl text-slate-900">NGO Partner Verifications</h3>
                  </div>
                  <button
                    onClick={() => setActiveModal(null)}
                    className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-grow overflow-y-auto space-y-4 pr-1">
                  {pendingNgos.length > 0 ? (
                    pendingNgos.map((ngo) => (
                      <div key={ngo.id} className="p-5 rounded-2xl border border-slate-150 bg-slate-50/50 space-y-4">
                        <div className="flex flex-wrap justify-between items-start gap-2">
                          <div>
                            <h4 className="font-heading font-bold text-base text-slate-900">{ngo.orgName || ngo.name || "Unnamed Org"}</h4>
                            <p className="font-sans text-xs text-slate-500">Contact: {ngo.name} ({ngo.email})</p>
                          </div>
                          <span className="text-[10px] font-heading font-bold bg-warning-500/10 text-warning-600 px-2.5 py-1 rounded-full uppercase tracking-wider">
                            Pending Verification
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-xs font-sans text-slate-650">
                          <div>
                            <strong>Reg Number:</strong> {ngo.regNumber || "N/A"}
                          </div>
                          <div>
                            <strong>Website:</strong>{" "}
                            {ngo.website ? (
                              <a href={ngo.website.startsWith("http") ? ngo.website : `https://${ngo.website}`} target="_blank" rel="noopener noreferrer" className="text-primary-900 hover:underline">
                                {ngo.website}
                              </a>
                            ) : (
                              "N/A"
                            )}
                          </div>
                          <div className="col-span-2">
                            <strong>Mission:</strong> {ngo.mission || "No mission statement provided."}
                          </div>
                          <div className="col-span-2 font-sans text-[11px] text-slate-500 bg-white p-3 rounded-xl border border-slate-100">
                            <strong>Address:</strong> {ngo.address || "N/A"}
                          </div>
                        </div>

                        <div className="flex gap-2 justify-end pt-2 border-t border-slate-100">
                          <button
                            onClick={() => handleVerifyNgo(ngo.id, "rejected")}
                            className="px-4 py-2 border border-slate-200 hover:bg-red-50 text-red-600 font-heading font-bold text-xs rounded-xl cursor-pointer transition-colors flex items-center gap-1.5"
                          >
                            <X className="w-3.5 h-3.5" /> Reject
                          </button>
                          <button
                            onClick={() => handleVerifyNgo(ngo.id, "approved")}
                            className="px-4 py-2 bg-primary-900 hover:bg-primary-850 text-white font-heading font-bold text-xs rounded-xl cursor-pointer transition-colors flex items-center gap-1.5"
                          >
                            <Check className="w-3.5 h-3.5" /> Verify & Approve
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-slate-400">
                      <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-slate-350" />
                      <p className="font-heading font-bold text-slate-800">No Pending NGO Partners</p>
                      <p className="font-sans text-xs text-slate-500 mt-1">All registered NGO partners are fully verified.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Modal: Moderate Content */}
        <AnimatePresence>
          {activeModal === "moderate" && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveModal(null)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 15 }}
                className="relative bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 max-w-3xl w-full z-10 flex flex-col max-h-[85vh]"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                  <div className="flex items-center gap-3">
                    <Eye className="w-5 h-5 text-slate-700" />
                    <h3 className="font-heading font-extrabold text-xl text-slate-900">Moderate Content</h3>
                  </div>
                  <button
                    onClick={() => setActiveModal(null)}
                    className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-grow overflow-y-auto space-y-8 pr-1">
                  {modLoading ? (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                      <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-700 rounded-full animate-spin mb-3" />
                      <p className="font-heading font-bold text-xs">Loading moderation data...</p>
                    </div>
                  ) : (
                    <>
                      {/* Campaigns Moderation */}
                      <div className="space-y-3">
                        <h4 className="font-heading font-extrabold text-sm text-slate-800 uppercase tracking-widest border-l-4 border-primary-900 pl-2">
                          Active Campaigns ({campaigns.length})
                        </h4>
                        <div className="space-y-2">
                          {campaigns.map((c) => (
                            <div key={c.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-150 bg-slate-50/50 gap-4">
                              <div className="min-w-0 flex-1">
                                <p className="font-heading font-bold text-sm text-slate-900 truncate">{c.title}</p>
                                <p className="font-sans text-[10px] text-slate-500">Category: {c.category} · Goal: {formatCurrency(c.goal)}</p>
                              </div>
                              <button
                                onClick={() => handleToggleCampaign(c.id, c.status)}
                                className={`px-3 py-1.5 font-heading font-bold text-xs rounded-xl cursor-pointer transition-all ${
                                  c.status === "active"
                                    ? "bg-primary-900 text-white hover:bg-primary-850"
                                    : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                                }`}
                              >
                                {c.status === "active" ? "Active" : "Paused"}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Blog Posts Moderation */}
                      <div className="space-y-3">
                        <h4 className="font-heading font-extrabold text-sm text-slate-800 uppercase tracking-widest border-l-4 border-accent-500 pl-2">
                          Blog Posts ({blogPosts.length})
                        </h4>
                        <div className="space-y-2">
                          {blogPosts.map((b) => (
                            <div key={b.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-150 bg-slate-50/50 gap-4">
                              <div className="min-w-0 flex-1">
                                <p className="font-heading font-bold text-sm text-slate-900 truncate">{b.title}</p>
                                <p className="font-sans text-[10px] text-slate-500">Author: {b.author} · {b.readTime}</p>
                              </div>
                              <button
                                onClick={() => handleToggleBlog(b.id, b.published)}
                                className={`px-3 py-1.5 font-heading font-bold text-xs rounded-xl cursor-pointer transition-all ${
                                  b.published
                                    ? "bg-primary-900 text-white hover:bg-primary-850"
                                    : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                                }`}
                              >
                                {b.published ? "Published" : "Draft"}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Modal: View Reports */}
        <AnimatePresence>
          {activeModal === "reports" && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveModal(null)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm print:hidden"
              />
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 15 }}
                className="relative bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 max-w-xl w-full z-10 flex flex-col max-h-[85vh] print:fixed print:inset-0 print:m-0 print:h-full print:w-full print:rounded-none print:border-none print:shadow-none print:max-h-none print:overflow-visible"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6 print:hidden">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-slate-700" />
                    <h3 className="font-heading font-extrabold text-xl text-slate-900">Platform Reports</h3>
                  </div>
                  <button
                    onClick={() => setActiveModal(null)}
                    className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-grow overflow-y-auto space-y-6 pr-1 print:overflow-visible print:max-h-none">
                  {/* Summary Header */}
                  <div className="text-center p-5 rounded-2xl bg-slate-50 border border-slate-150">
                    <Activity className="w-8 h-8 text-primary-900 mx-auto mb-2" />
                    <h4 className="font-heading font-bold text-base text-slate-900">YSSF Platform Status Report</h4>
                    <p className="font-sans text-xs text-slate-500 mt-0.5">Generated on {new Date().toLocaleDateString()}</p>
                  </div>

                  {/* Summary Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-slate-100 bg-white">
                      <p className="font-sans text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total User Accounts</p>
                      <p className="font-heading font-extrabold text-xl text-slate-900 mt-1">{stats.totalUsers}</p>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-100 bg-white">
                      <p className="font-sans text-[10px] text-slate-400 uppercase font-bold tracking-wider">NGO Partners</p>
                      <p className="font-heading font-extrabold text-xl text-slate-900 mt-1">
                        {users.filter(u => u.role === "ngo_partner").length}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-100 bg-white">
                      <p className="font-sans text-[10px] text-slate-400 uppercase font-bold tracking-wider">Donations Collected</p>
                      <p className="font-heading font-extrabold text-xl text-slate-900 mt-1">{formatCurrency(stats.totalDonations)}</p>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-100 bg-white">
                      <p className="font-sans text-[10px] text-slate-400 uppercase font-bold tracking-wider">Active Campaigns</p>
                      <p className="font-heading font-extrabold text-xl text-slate-900 mt-1">{stats.activeCampaigns}</p>
                    </div>
                  </div>

                  {/* Export Options */}
                  <div className="space-y-2 pt-4 border-t border-slate-100 print:hidden">
                    <span className="font-heading font-bold text-[11px] text-slate-500 uppercase tracking-wider block">Export Data</span>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => downloadReport("csv")}
                        className="py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-heading font-bold text-xs rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" /> CSV
                      </button>
                      <button
                        onClick={() => downloadReport("json")}
                        className="py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-heading font-bold text-xs rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" /> JSON
                      </button>
                      <button
                        onClick={() => window.print()}
                        className="py-2.5 bg-primary-900 hover:bg-primary-850 text-white font-heading font-bold text-xs rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Printer className="w-3.5 h-3.5" /> Print
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Modal: Platform Settings */}
        <AnimatePresence>
          {activeModal === "settings" && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveModal(null)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 15 }}
                className="relative bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 max-w-md w-full z-10 flex flex-col"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                  <div className="flex items-center gap-3">
                    <Settings className="w-5 h-5 text-slate-700" />
                    <h3 className="font-heading font-extrabold text-xl text-slate-900">Platform Settings</h3>
                  </div>
                  <button
                    onClick={() => setActiveModal(null)}
                    className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-5">
                  {/* Maintenance Mode Toggle */}
                  <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100">
                    <div>
                      <p className="font-heading font-bold text-xs text-slate-900">Maintenance Mode</p>
                      <p className="font-sans text-[10px] text-slate-500">Temporarily freeze platform services</p>
                    </div>
                    <button
                      onClick={() => setSiteSettings(prev => ({ ...prev, maintenanceMode: !prev.maintenanceMode }))}
                      className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 focus:outline-none ${
                        siteSettings.maintenanceMode ? "bg-red-600" : "bg-slate-200"
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                          siteSettings.maintenanceMode ? "translate-x-4" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {/* Allow Volunteer Signups */}
                  <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100">
                    <div>
                      <p className="font-heading font-bold text-xs text-slate-900">Volunteer Registration</p>
                      <p className="font-sans text-[10px] text-slate-500">Allow users to register as volunteers</p>
                    </div>
                    <button
                      onClick={() => setSiteSettings(prev => ({ ...prev, allowVolunteerSignup: !prev.allowVolunteerSignup }))}
                      className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 focus:outline-none ${
                        siteSettings.allowVolunteerSignup ? "bg-primary-900" : "bg-slate-200"
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                          siteSettings.allowVolunteerSignup ? "translate-x-4" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {/* Require Email Verification */}
                  <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100">
                    <div>
                      <p className="font-heading font-bold text-xs text-slate-900">Email Verification</p>
                      <p className="font-sans text-[10px] text-slate-500">Require email OTP/links for new users</p>
                    </div>
                    <button
                      onClick={() => setSiteSettings(prev => ({ ...prev, requireEmailVerification: !prev.requireEmailVerification }))}
                      className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 focus:outline-none ${
                        siteSettings.requireEmailVerification ? "bg-primary-900" : "bg-slate-200"
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                          siteSettings.requireEmailVerification ? "translate-x-4" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {/* Emergency Coordinate Contact */}
                  <div className="space-y-1.5 p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                    <label htmlFor="emergency-phone" className="font-heading font-bold text-[10px] text-slate-500 uppercase tracking-wider block">
                      Emergency Support Hotline
                    </label>
                    <input
                      id="emergency-phone"
                      type="tel"
                      value={siteSettings.emergencyPhone}
                      onChange={(e) => setSiteSettings(prev => ({ ...prev, emergencyPhone: e.target.value }))}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary-900/20 text-slate-900"
                    />
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-3 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => setActiveModal(null)}
                      className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 font-heading font-bold text-xs rounded-xl cursor-pointer transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveSettings}
                      className="flex-1 py-3 bg-primary-900 hover:bg-primary-850 text-white font-heading font-bold text-xs rounded-xl cursor-pointer transition-colors"
                    >
                      Save Settings
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
