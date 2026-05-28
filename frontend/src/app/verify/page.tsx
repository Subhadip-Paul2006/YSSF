"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Loader2, ArrowLeft, Mail } from "lucide-react";
import { apiVerifyLink } from "@/lib/api";
import confetti from "canvas-confetti";

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState<string>("Verifying your email address...");
  const [targetDashboard, setTargetDashboard] = useState<string>("/dashboard");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing or invalid.");
      return;
    }

    async function verifyToken() {
      try {
        const data = await apiVerifyLink(token as string);

        if (data.success) {
          setStatus("success");
          setMessage("Your email has been successfully verified! Redirecting to your dashboard...");
          
          const role = data.user?.role || "volunteer";
          const roleMap: Record<string, string> = {
            admin: "/dashboard/admin",
            volunteer: "/dashboard/volunteer",
            donor: "/dashboard/donor",
            ngo_partner: "/dashboard/volunteer",
          };
          const dashboardPath = roleMap[role.toLowerCase()] || "/dashboard";
          setTargetDashboard(dashboardPath);

          // Celebrate with confetti
          confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
            colors: ["#0B5D3B", "#8FD694", "#F4B400", "#FFFFFF"],
          });

          // Redirect to dashboard after 2 seconds
          setTimeout(() => {
            router.push(dashboardPath);
          }, 2000);
        } else {
          setStatus("error");
          setMessage(data.message || "The verification link is invalid or has expired.");
        }
      } catch (err: any) {
        console.error("Verification error:", err);
        setStatus("error");
        setMessage(err.message || "A network error occurred. Please try again later.");
      }
    }

    verifyToken();
  }, [token, router]);

  return (
    <div className="bg-white/95 backdrop-blur-xl border border-primary-200/30 rounded-[32px] shadow-2xl p-8 md:p-10 relative overflow-hidden min-h-[380px] flex flex-col items-center justify-center text-center">
      {/* Card Accent Top Line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary-900 via-accent-500 to-primary-700" />

      {status === "loading" && (
        <div className="space-y-6">
          <Loader2 className="w-16 h-16 text-primary-900 animate-spin mx-auto" />
          <h2 className="font-heading font-black text-2xl text-primary-900">Verifying Email</h2>
          <p className="font-sans text-sm text-primary-900/60 font-medium max-w-sm mx-auto">
            Please hold on while we verify your email address against our servers.
          </p>
        </div>
      )}

      {status === "success" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          <div className="w-20 h-20 bg-accent-500 rounded-full flex items-center justify-center text-primary-900 mx-auto border-4 border-white shadow-lg shadow-accent-500/20">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h2 className="font-heading font-black text-3xl text-primary-900">Email Verified!</h2>
          <p className="font-sans text-sm text-primary-900/60 font-semibold max-w-sm mx-auto leading-relaxed">
            {message}
          </p>
          <div className="pt-2 flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 text-primary-900/60 text-xs font-semibold">
              <Loader2 className="w-4 h-4 animate-spin text-primary-900" />
              <span>Redirecting...</span>
            </div>
            <Link
              href={targetDashboard}
              className="inline-flex w-full py-3 px-6 bg-primary-900 hover:bg-primary-800 text-white font-heading font-bold text-xs rounded-xl transition-all shadow-sm items-center justify-center cursor-pointer"
            >
              Not redirecting? Click here
            </Link>
          </div>
        </motion.div>
      )}

      {status === "error" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-red-600 mx-auto border-4 border-white shadow-lg">
            <XCircle className="w-12 h-12" />
          </div>
          <h2 className="font-heading font-black text-3xl text-primary-900">Verification Failed</h2>
          <p className="font-sans text-sm text-red-700/80 font-semibold max-w-sm mx-auto leading-relaxed">
            {message}
          </p>
          <div className="pt-2 space-y-3">
            <Link
              href="/login"
              className="inline-flex w-full py-3.5 px-8 bg-primary-900 hover:bg-primary-800 text-white font-heading font-bold text-sm rounded-2xl transition-all shadow-md items-center justify-center cursor-pointer"
            >
              Back to Sign In
            </Link>
            <div className="text-xs font-sans font-semibold text-primary-900/50">
              Need a new link? Try signing in to resend the verification email.
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#05291a] via-[#0B5D3B] to-[#DFF7E2] flex items-center justify-center p-4 relative overflow-hidden selection:bg-accent-500 selection:text-primary-900">
      {/* Background Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary-400/20 blur-[130px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-accent-500/10 blur-[130px] pointer-events-none animate-pulse duration-700" />

      <div className="w-full max-w-[480px] z-10">
        {/* Navigation Header */}
        <div className="flex justify-between items-center mb-6 px-1">
          <Link
            href="/"
            className="flex items-center gap-2 group text-white/80 hover:text-white text-sm font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            <div className="w-5.5 h-5.5 bg-accent-500 rounded-full flex items-center justify-center text-primary-900 font-display text-[10px] font-bold">
              YS
            </div>
            <span className="font-heading font-extrabold text-[10px] text-white tracking-widest uppercase">YSSF Portal</span>
          </div>
        </div>

        {/* Suspense boundary for useSearchParams */}
        <Suspense
          fallback={
            <div className="bg-white/95 backdrop-blur-xl border border-primary-200/30 rounded-[32px] shadow-2xl p-8 md:p-10 relative overflow-hidden min-h-[380px] flex flex-col items-center justify-center text-center">
              <Loader2 className="w-12 h-12 text-primary-900 animate-spin mb-4" />
              <p className="font-heading font-semibold text-primary-900">Loading...</p>
            </div>
          }
        >
          <VerifyContent />
        </Suspense>
      </div>
    </div>
  );
}
