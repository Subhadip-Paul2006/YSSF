"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Users,
  Calendar,
  Clock,
  Award,
  MapPin,
  CheckCircle2,
  X,
  Plus,
  AlertTriangle,
  Heart,
} from "lucide-react";
import { apiGetDashboardStats, apiUpdateProfile, type DashboardStatsResponse } from "@/lib/api";

function VolunteerSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-surface-100/40 via-white to-surface-100/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="h-5 w-28 bg-surface-100 rounded animate-pulse mb-8" />
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-surface-100 animate-pulse" />
            <div className="h-4 w-32 bg-surface-100 rounded animate-pulse" />
          </div>
          <div className="h-10 w-72 bg-surface-100 rounded animate-pulse mb-2" />
          <div className="h-5 w-80 bg-surface-100 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="yssf-card p-5 bg-white border-primary-200/40 text-center">
              <div className="w-5 h-5 bg-surface-100 mx-auto mb-2 animate-pulse" />
              <div className="h-8 w-16 bg-surface-100 rounded mx-auto animate-pulse" />
              <div className="h-4 w-24 bg-surface-100 rounded mx-auto mt-2 animate-pulse" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-3">
            <div className="h-6 w-40 bg-surface-100 rounded animate-pulse mb-4" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-surface-100/50 rounded-2xl animate-pulse" />
            ))}
          </div>
          <div className="lg:col-span-5 space-y-10">
            <div>
              <div className="h-6 w-24 bg-surface-100 rounded animate-pulse mb-4" />
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-8 w-24 bg-surface-100 rounded-full animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const PREDEFINED_SKILLS = [
  "Tree Plantation",
  "First Aid",
  "Event Coordination",
  "Public Speaking",
  "Teaching",
  "Social Media",
  "Fundraising",
  "Disaster Relief",
  "Content Writing",
  "Graphic Design",
];

export default function VolunteerDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Profile Edit States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [availability, setAvailability] = useState("");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    apiGetDashboardStats()
      .then((result) => {
        if (!result) {
          router.push("/login");
          return;
        }
        setData(result);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading volunteer dashboard stats:", err);
        router.push("/login?error=load_failed");
      });
  }, [router]);

  useEffect(() => {
    if (data) {
      setName(data.user.name || "");
      setPhone(data.user.phone || "");
      setLocation(data.user.location || "");
      setAvailability(data.user.availability || "");
      setEmergencyName(data.user.emergencyName || "");
      setEmergencyPhone(data.user.emergencyPhone || "");

      const userSkills = data.user.skills
        ? data.user.skills.split(",").map((s) => s.trim()).filter(Boolean)
        : [];
      setSelectedSkills(userSkills);
    }
  }, [data]);

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      await apiUpdateProfile({
        name,
        phone,
        location,
        availability,
        emergencyName,
        emergencyPhone,
        skills: selectedSkills.join(", "),
      });
      showToast("Profile updated successfully!");
      setIsEditModalOpen(false);
      const updatedStats = await apiGetDashboardStats();
      setData(updatedStats);
    } catch (err) {
      console.error("Failed to update profile:", err);
      showToast(err instanceof Error ? err.message : "Failed to update profile", "error");
    } finally {
      setEditLoading(false);
    }
  };

  if (loading) return <VolunteerSkeleton />;

  if (!data) return null;

  const VOLUNTEER_STATS = [
    { label: "Events Joined", value: String(data.stats.eventsAttended), icon: Calendar, color: "text-primary-900", bg: "bg-primary-900/10" },
    { label: "Hours Volunteered", value: String(data.stats.volunteerHours), icon: Clock, color: "text-primary-700", bg: "bg-primary-700/10" },
    { label: "Impact Score", value: String(data.stats.impactScore), icon: Award, color: "text-accent-600", bg: "bg-accent-500/10" },
    { label: "Total Donated", value: new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(data.stats.totalDonated), icon: Heart, color: "text-alert-500", bg: "bg-alert-500/10" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-surface-100/40 via-white to-surface-100/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-primary-900 font-heading font-semibold text-sm hover:underline mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-primary-900/10 text-primary-900">
                <Users className="w-6 h-6" />
              </div>
              <span className="font-display font-semibold text-primary-700 uppercase tracking-widest text-sm">Volunteer Dashboard</span>
            </div>
            <h1 className="font-heading font-extrabold text-4xl text-primary-900 leading-tight">
              Welcome, <span className="handwritten-highlight inline-block font-handwritten text-accent-500">{data.user.name || "Volunteer"}</span>
            </h1>
            <p className="font-sans text-foreground/80 mt-2">Track your volunteer journey, upcoming events, and earned badges.</p>
          </div>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="px-5 py-2.5 bg-primary-900 hover:bg-primary-850 text-white font-heading font-semibold text-sm rounded-xl transition-all shadow-md shadow-primary-900/10 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer self-start sm:self-auto"
          >
            Edit Profile
          </button>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {VOLUNTEER_STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="yssf-card p-5 bg-white border-primary-200/40 text-center"
              >
                <div className={`inline-flex p-2 rounded-full ${stat.bg} ${stat.color} mb-2`}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className="font-heading font-extrabold text-2xl text-primary-900">{stat.value}</p>
                <p className="font-sans text-xs text-foreground/60 mt-1">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-10">
            {/* Registered Events */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h2 className="font-heading font-extrabold text-xl text-primary-900 mb-4">Your Registered Events</h2>
              {data.recentRegistrations.length > 0 ? (
                <div className="space-y-3">
                  {data.recentRegistrations.map((reg, i) => (
                    <div key={reg.id || i} className="flex items-center justify-between p-4 rounded-2xl bg-white border border-primary-200/30">
                      <div>
                        <h3 className="font-heading font-bold text-sm text-primary-900">{reg.event.title}</h3>
                        {reg.event.date && (
                          <p className="font-sans text-xs text-foreground/60 flex items-center gap-1 mt-1">
                            <Calendar className="w-3 h-3" /> {reg.event.date}
                            {reg.event.location && <><span className="mx-1">·</span><MapPin className="w-3 h-3" /> {reg.event.location}</>}
                          </p>
                        )}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-heading font-bold ${
                        reg.status === "CONFIRMED" ? "bg-primary-900 text-white" :
                        reg.status === "COMPLETED" ? "bg-primary-700 text-white" :
                        "bg-accent-500 text-primary-900"
                      }`}>
                        {reg.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-white border border-primary-200/30 text-center">
                  <p className="font-sans text-sm text-foreground/60">No event registrations yet. Browse upcoming events to get started!</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-5 space-y-10">
            {/* Volunteer Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white border border-primary-200/30 rounded-2xl p-6 shadow-sm"
            >
              <h2 className="font-heading font-extrabold text-xl text-primary-900 mb-4">Volunteer Info</h2>
              <div className="space-y-3.5">
                <div className="flex justify-between border-b border-primary-100/50 pb-2">
                  <span className="text-xs text-foreground/60 font-sans">Availability</span>
                  <span className="text-xs font-heading font-bold text-primary-900">{data.user.availability || "Not Specified"}</span>
                </div>
                <div className="flex justify-between border-b border-primary-100/50 pb-2">
                  <span className="text-xs text-foreground/60 font-sans">Location</span>
                  <span className="text-xs font-heading font-bold text-primary-900">{data.user.location || "Not Specified"}</span>
                </div>
                <div className="flex justify-between border-b border-primary-100/50 pb-2">
                  <span className="text-xs text-foreground/60 font-sans">Emergency Contact</span>
                  <span className="text-xs font-heading font-bold text-primary-900">{data.user.emergencyName || "Not Specified"}</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="text-xs text-foreground/60 font-sans">Emergency Phone</span>
                  <span className="text-xs font-heading font-bold text-primary-900">{data.user.emergencyPhone || "Not Specified"}</span>
                </div>
              </div>
            </motion.div>

            {/* Skills */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <h2 className="font-heading font-extrabold text-xl text-primary-900 mb-4">Your Skills</h2>
              {selectedSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedSkills.map((skill) => (
                    <span key={skill} className="px-3 py-1.5 rounded-full bg-primary-900/10 text-primary-900 text-xs font-heading font-semibold border border-primary-900/15">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-white border border-primary-200/30 text-center">
                  <p className="font-sans text-xs text-foreground/60">No skills added yet.</p>
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="mt-2 text-xs font-heading font-bold text-primary-900 hover:underline flex items-center gap-1 mx-auto"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Skills
                  </button>
                </div>
              )}
            </motion.div>

            {/* Achievement Badges */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <h2 className="font-heading font-extrabold text-xl text-primary-900 mb-4">Achievement Badges</h2>
              <div className="p-6 rounded-2xl bg-white border border-primary-200/30 text-center">
                <CheckCircle2 className="w-8 h-8 text-primary-900 mx-auto mb-2" />
                <p className="font-heading font-bold text-sm text-primary-900">Keep Volunteering!</p>
                <p className="font-sans text-xs text-foreground/60 mt-1">
                  You&apos;ve attended {data.stats.eventsAttended} event{data.stats.eventsAttended !== 1 ? "s" : ""} and logged {data.stats.volunteerHours} volunteer hours. Badges unlock as you hit milestones!
                </p>
              </div>
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
                <CheckCircle2 className="w-5 h-5 text-accent-500 shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-alert-500 shrink-0" />
              )}
              <span>{toast.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Profile Modal */}
        <AnimatePresence>
          {isEditModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsEditModalOpen(false)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 15 }}
                className="relative bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 max-w-lg w-full z-10 flex flex-col max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                  <h3 className="font-heading font-extrabold text-xl text-slate-900">Edit Volunteer Profile</h3>
                  <button
                    onClick={() => setIsEditModalOpen(false)}
                    className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-655 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-heading font-bold text-[11px] text-slate-500 uppercase tracking-wider block">Full Name</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-250 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900/20 text-slate-900"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-heading font-bold text-[11px] text-slate-500 uppercase tracking-wider block">Phone Number</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-250 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900/20 text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-heading font-bold text-[11px] text-slate-500 uppercase tracking-wider block">Location (City)</label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Kolkata, WB"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-250 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900/20 text-slate-900"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-heading font-bold text-[11px] text-slate-500 uppercase tracking-wider block">Availability</label>
                      <select
                        value={availability}
                        onChange={(e) => setAvailability(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-250 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900/20 text-slate-900"
                      >
                        <option value="">Select Availability</option>
                        <option value="Weekends">Weekends</option>
                        <option value="Weekdays">Weekdays</option>
                        <option value="Evenings">Evenings</option>
                        <option value="Flexible">Flexible</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-primary-900/5 p-4 rounded-2xl border border-primary-900/10 space-y-4">
                    <h4 className="font-heading font-bold text-xs text-primary-900 uppercase tracking-wider">Emergency Contact Info</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="font-heading font-bold text-[10px] text-slate-500 uppercase tracking-wider block">Contact Name</label>
                        <input
                          type="text"
                          value={emergencyName}
                          onChange={(e) => setEmergencyName(e.target.value)}
                          placeholder="e.g. Jane Doe"
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-250 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900/20 text-slate-900"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-heading font-bold text-[10px] text-slate-500 uppercase tracking-wider block">Contact Phone</label>
                        <input
                          type="tel"
                          value={emergencyPhone}
                          onChange={(e) => setEmergencyPhone(e.target.value)}
                          placeholder="e.g. +91 98765 00000"
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-250 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900/20 text-slate-900"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="font-heading font-bold text-[11px] text-slate-500 uppercase tracking-wider block">Skills</label>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {PREDEFINED_SKILLS.map((skill) => {
                        const isSelected = selectedSkills.includes(skill);
                        return (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => toggleSkill(skill)}
                            className={`px-3 py-1.5 rounded-full text-xs font-heading font-semibold border transition-all cursor-pointer ${
                              isSelected
                                ? "bg-primary-900 text-white border-primary-900 shadow-sm"
                                : "bg-slate-50 border-slate-200 text-slate-655 hover:bg-slate-100"
                            }`}
                          >
                            {skill}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add custom skill..."
                        value={customSkill}
                        onChange={(e) => setCustomSkill(e.target.value)}
                        className="flex-grow px-3.5 py-2 bg-slate-50 border border-slate-250 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-900/20 text-slate-900"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          if (!customSkill.trim()) return;
                          if (!selectedSkills.includes(customSkill.trim())) {
                            setSelectedSkills([...selectedSkills, customSkill.trim()]);
                          }
                          setCustomSkill("");
                        }}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-heading font-bold text-xs rounded-xl cursor-pointer transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(false)}
                      className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 font-heading font-bold text-xs rounded-xl cursor-pointer transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={editLoading}
                      className="flex-1 py-3 bg-primary-900 hover:bg-primary-850 disabled:bg-primary-900/50 text-white font-heading font-bold text-xs rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                    >
                      {editLoading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
