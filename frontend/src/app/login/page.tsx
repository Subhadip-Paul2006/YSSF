"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Users,
  Heart,
  Building,
  Shield,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Globe,
  Mail,
  KeyRound,
  AlertCircle,
} from "lucide-react";
import { apiSignIn, apiGoogleSignInMock } from "@/lib/api";

type AuthMethod = "google" | "email" | null;
type RoleType = "volunteer" | "donor" | "ngo" | "admin";

const ROLES = [
  { id: "volunteer" as RoleType, label: "Volunteer", icon: Users, color: "bg-primary-900 text-white", desc: "Participate in NGO events and drives" },
  { id: "donor" as RoleType, label: "Donor", icon: Heart, color: "bg-accent-500 text-primary-900", desc: "Support campaigns with donations" },
  { id: "ngo" as RoleType, label: "NGO Partner", icon: Building, color: "bg-primary-700 text-white", desc: "Organize and manage NGO events" },
  { id: "admin" as RoleType, label: "Admin", icon: Shield, color: "bg-slate-700 text-white", desc: "Platform management and moderation" },
];

export default function LoginPage() {
  const router = useRouter();
  const [authMethod, setAuthMethod] = useState<AuthMethod>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleType | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiGoogleSignInMock();
      if (result?.success) {
        setAuthenticated(true);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Google login failed";
      setError(message);
    }
    setLoading(false);
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const result = await apiSignIn(email, password);
      if (result?.success) {
        setAuthenticated(true);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
    }
    setLoading(false);
  };

  const handleRoleSelect = (role: RoleType) => {
    setSelectedRole(role);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsSuccess(true);
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#0B5D3B", "#8FD694", "#F4B400", "#FFFFFF"],
      });
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-surface-100/50 via-white to-surface-100/20 py-16 px-4">
      <div className="max-w-lg mx-auto">
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center gap-2 text-primary-900 font-heading font-semibold text-sm hover:underline mb-8">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-10 space-y-4">
          <h1 className="font-heading font-extrabold text-4xl text-primary-900 leading-tight">
            Welcome to <span className="handwritten-highlight inline-block font-handwritten text-accent-500 transform rotate-[-0.5deg]">Youth Sakti</span>
          </h1>
          <p className="font-sans text-foreground/80 max-w-md mx-auto">
            Sign in to access your dashboard, join events, and track your social impact.
          </p>
        </div>

        {/* Main Card */}
        <div className="yssf-card bg-white p-8 md:p-10 border border-primary-200/40 relative overflow-hidden min-h-[400px]">
          {/* Success Overlay */}
          <AnimatePresence>
            {isSuccess && selectedRole && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-primary-900 text-white flex flex-col items-center justify-center p-8 text-center z-20"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="w-20 h-20 bg-accent-500 rounded-full flex items-center justify-center text-primary-900 mb-6 border-4 border-white"
                >
                  <CheckCircle2 className="w-12 h-12" />
                </motion.div>
                <h3 className="font-heading font-extrabold text-3xl mb-3">Welcome Aboard!</h3>
                <p className="font-sans text-primary-200 text-base max-w-md mb-2">
                  You have been signed in and registered as a <strong className="text-accent-500">{selectedRole}</strong>.
                </p>
                <p className="font-sans text-primary-200/70 text-sm mb-8">
                  Redirecting to your dashboard...
                </p>
                <button
                  onClick={() => router.push("/dashboard")}
                  className="px-6 py-2.5 bg-white text-primary-900 hover:bg-surface-100 font-heading font-bold text-sm rounded-xl transition-all shadow-md cursor-pointer"
                >
                  Go to Dashboard
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2"
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="font-sans text-sm text-red-700">{error}</p>
            </motion.div>
          )}

          {/* Step 1: Auth Method Selection */}
          {!authenticated && !authMethod && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2 mb-8">
                <h2 className="font-heading font-bold text-xl text-primary-900">Choose Sign-In Method</h2>
                <p className="font-sans text-sm text-foreground/70">Select how you&apos;d like to authenticate</p>
              </div>

              {/* Google OAuth Button */}
              <button
                onClick={handleGoogleAuth}
                disabled={loading}
                className="w-full py-4 bg-white border-2 border-primary-200 hover:border-primary-400 text-primary-900 font-heading font-bold text-sm rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-3 cursor-pointer"
              >
                {loading && authMethod === "google" ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Globe className="w-5 h-5" />
                )}
                <span>Continue with Google</span>
              </button>

              {/* Divider */}
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-primary-200/50" />
                <span className="font-heading font-semibold text-xs text-foreground/50 uppercase tracking-wider">or</span>
                <div className="flex-1 h-px bg-primary-200/50" />
              </div>

              {/* Email/Password Button */}
              <button
                onClick={() => setAuthMethod("email")}
                className="w-full py-4 bg-primary-900 hover:bg-primary-800 text-white font-heading font-bold text-sm rounded-xl transition-all shadow-md shadow-primary-900/10 hover:shadow-lg flex items-center justify-center gap-3 cursor-pointer"
              >
                <Mail className="w-5 h-5" />
                <span>Continue with Email</span>
              </button>

              <p className="text-center font-sans text-xs text-foreground/60 pt-4">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="underline font-semibold text-primary-900 hover:text-primary-700">Register here</Link>
              </p>
            </motion.div>
          )}

          {/* Step 1b: Email/Password Login Flow */}
          {!authenticated && authMethod === "email" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <button
                onClick={() => { setAuthMethod(null); setPassword(""); setError(null); setFieldErrors({}); }}
                className="flex items-center gap-2 text-sm font-heading font-semibold text-primary-900/80 hover:text-primary-900 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Back to methods
              </button>

              <div className="text-center space-y-2">
                <div className="inline-flex p-3 rounded-full bg-surface-100 text-primary-900 mb-2">
                  <KeyRound className="w-8 h-8" />
                </div>
                <h2 className="font-heading font-bold text-xl text-primary-900">Sign In with Email</h2>
                <p className="font-sans text-sm text-foreground/70">
                  Enter your email and password to access your account
                </p>
              </div>

              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="login-email" className="font-heading font-semibold text-xs text-primary-900">Email Address</label>
                  <input
                    id="login-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. rahul@example.com"
                    className={`w-full px-4 py-3 rounded-xl border font-sans text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 text-foreground ${
                      fieldErrors.email ? "border-red-400" : "border-primary-200"
                    }`}
                  />
                  {fieldErrors.email && (
                    <p className="font-sans text-xs text-red-500 mt-1">{fieldErrors.email[0]}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="login-password" className="font-heading font-semibold text-xs text-primary-900">Password</label>
                  <input
                    id="login-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className={`w-full px-4 py-3 rounded-xl border font-sans text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 text-foreground ${
                      fieldErrors.password ? "border-red-400" : "border-primary-200"
                    }`}
                  />
                  {fieldErrors.password && (
                    <p className="font-sans text-xs text-red-500 mt-1">{fieldErrors.password[0]}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!email || !password || loading}
                  className="w-full py-3 bg-primary-900 hover:bg-primary-800 disabled:bg-primary-900/50 text-white font-heading font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                  <span>{loading ? "Signing in..." : "Sign In"}</span>
                </button>
              </form>
            </motion.div>
          )}

          {/* Step 2: Role Selection */}
          {authenticated && !selectedRole && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2 mb-4">
                <div className="inline-flex p-2 rounded-full bg-surface-100 text-primary-900 mb-2">
                  <CheckCircle2 className="w-6 h-6 text-primary-900" />
                </div>
                <h2 className="font-heading font-bold text-xl text-primary-900">Select Your Role</h2>
                <p className="font-sans text-sm text-foreground/70">Choose how you want to participate in the YSSF ecosystem</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ROLES.map((role) => (
                  <motion.button
                    key={role.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleRoleSelect(role.id)}
                    disabled={loading}
                    className="p-5 rounded-2xl border-2 border-primary-200/40 hover:border-primary-400 bg-white hover:bg-surface-100/20 transition-all text-left cursor-pointer group"
                  >
                    <div className={`inline-flex p-2.5 rounded-xl ${role.color} mb-3 transition-transform group-hover:scale-110`}>
                      <role.icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-heading font-bold text-sm text-primary-900 mb-1">{role.label}</h3>
                    <p className="font-sans text-xs text-foreground/70">{role.desc}</p>
                  </motion.button>
                ))}
              </div>

              {loading && (
                <div className="flex items-center justify-center gap-2 text-sm font-heading font-semibold text-primary-900/70">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Setting up your profile...</span>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
