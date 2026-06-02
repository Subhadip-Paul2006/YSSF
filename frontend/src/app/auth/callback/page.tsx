"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    let timeout: NodeJS.Timeout;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      if (session?.access_token) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/auth/google-supabase`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              supabaseToken: session.access_token,
              email: session.user.email,
              name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split("@")[0],
              avatarUrl: session.user.user_metadata?.avatar_url,
            }),
          });

          const data = await res.json();

          if (timeout) clearTimeout(timeout);

          if (!res.ok || !data.success || !data.token) {
            console.error("Backend OAuth validation failed:", data);
            const errMsg = data.error || "Failed to authenticate with backend server.";
            router.push(`/login?error=google_failed&details=${encodeURIComponent(errMsg)}`);
            return;
          }

          // Store our JWT token
          document.cookie = `yssf-session=${encodeURIComponent(data.token)}; path=/; max-age=${60 * 60 * 2}; SameSite=Strict${process.env.NODE_ENV === "production" ? "; Secure" : ""}`;
          
          // Redirect directly to the appropriate dashboard
          const userRole = data.user.role.toLowerCase();
          const roleDashboard: Record<string, string> = {
            admin: "/dashboard/admin",
            volunteer: "/dashboard/volunteer",
            donor: "/dashboard/donor",
            ngo_partner: "/dashboard/volunteer",
          };
          router.push(roleDashboard[userRole] || "/dashboard");
          return;
        } catch (err) {
          if (timeout) clearTimeout(timeout);
          console.error("Backend auth error:", err);
          router.push("/login?error=backend_failed");
          return;
        }
      }
    });

    // Fallback: If after 4 seconds nothing happens, check session and redirect if empty
    timeout = setTimeout(async () => {
      if (!isMounted) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login?error=no_session");
      }
    }, 4000);

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      if (timeout) clearTimeout(timeout);
    };
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary-900 mx-auto" />
        <p className="font-heading font-semibold text-primary-900">Completing sign in...</p>
      </div>
    </div>
  );
}
