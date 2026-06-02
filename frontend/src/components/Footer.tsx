"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register" || pathname.startsWith("/auth");

  if (isAuthPage) return null;

  return (
    <footer className="relative overflow-hidden text-white border-t-4 border-accent-500" style={{ background: 'linear-gradient(135deg, #071B11 0%, #0D2D1F 35%, #163B2D 65%, #0B1512 100%)' }}>
      {/* Atmospheric glow overlays */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[120%] rounded-full opacity-[0.08]" style={{ background: 'radial-gradient(ellipse at center, #2dd4a8 0%, #0d9668 30%, transparent 70%)', filter: 'blur(80px)' }} />
        <div className="absolute -top-20 -left-20 w-[45%] h-[55%] rounded-full opacity-[0.06]" style={{ background: 'radial-gradient(ellipse at center, #10b981 0%, #065f46 40%, transparent 70%)', filter: 'blur(60px)' }} />
        <div className="absolute -bottom-16 -right-16 w-[40%] h-[50%] rounded-full opacity-[0.05]" style={{ background: 'radial-gradient(ellipse at center, #34d399 0%, #064e3b 40%, transparent 70%)', filter: 'blur(70px)' }} />
        <div className="absolute top-0 right-1/4 w-[30%] h-[40%] rounded-full opacity-[0.04]" style={{ background: 'radial-gradient(ellipse at center, #6ee7b7 0%, transparent 60%)', filter: 'blur(50px)' }} />
        <div className="absolute -bottom-10 left-1/3 w-[35%] h-[35%] rounded-full opacity-[0.05]" style={{ background: 'radial-gradient(ellipse at center, #059669 0%, transparent 65%)', filter: 'blur(55px)' }} />
        <div className="absolute inset-0 opacity-[0.03]" style={{ background: 'linear-gradient(180deg, rgba(16,185,129,0.15) 0%, transparent 40%, rgba(6,78,59,0.1) 100%)' }} />
        <div className="absolute inset-0 opacity-[0.015]" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">

        {/* === TOP BRANDING === */}
        <div className="flex flex-col items-center mb-14">
          <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border-2 border-accent-500 flex items-center justify-center mb-4">
            <span className="font-heading font-extrabold text-white text-xl">YS</span>
          </div>
          <h2 className="font-heading font-bold text-white text-xl tracking-wide text-center">Youth Shakti Social Foundation</h2>
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-accent-500 to-transparent mt-3" />
        </div>

        {/* === 5-COLUMN LAYOUT === */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-6 mb-14">
          {/* Column 1 — About YSSF */}
          <div>
            <h4 className="font-heading font-bold text-accent-500 text-xs uppercase tracking-[0.15em] mb-5">About YSSF</h4>
            <ul className="space-y-3">
              {['About Us', 'Our Mission', 'Our Vision', 'Impact Stories', 'Transparency'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-emerald-100/60 hover:text-white hover:drop-shadow-[0_0_6px_rgba(16,185,129,0.4)] transition-all duration-300">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2 — Our Work */}
          <div>
            <h4 className="font-heading font-bold text-accent-500 text-xs uppercase tracking-[0.15em] mb-5">Our Work</h4>
            <ul className="space-y-3">
              {['Tree Plantation', 'Women Safety Awareness', 'Child Education', 'Health Camps', 'Environmental Drives'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-emerald-100/60 hover:text-white hover:drop-shadow-[0_0_6px_rgba(16,185,129,0.4)] transition-all duration-300">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Campaigns */}
          <div>
            <h4 className="font-heading font-bold text-accent-500 text-xs uppercase tracking-[0.15em] mb-5">Campaigns</h4>
            <ul className="space-y-3">
              {['Green Earth Mission', 'Yellow Fellow', 'Blood Donation Camps', 'Clean City Drive', 'Education For All'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-emerald-100/60 hover:text-white hover:drop-shadow-[0_0_6px_rgba(16,185,129,0.4)] transition-all duration-300">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Join Us */}
          <div>
            <h4 className="font-heading font-bold text-accent-500 text-xs uppercase tracking-[0.15em] mb-5">Join Us</h4>
            <ul className="space-y-3">
              {['Core Team', 'Creative Team', 'Volunteers', 'Partner Organizations', 'Become One Of Us'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-emerald-100/60 hover:text-white hover:drop-shadow-[0_0_6px_rgba(16,185,129,0.4)] transition-all duration-300">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5 — Support */}
          <div>
            <h4 className="font-heading font-bold text-accent-500 text-xs uppercase tracking-[0.15em] mb-5">Support</h4>
            <ul className="space-y-3">
              {['Donate Now', 'Sponsor A Cause', 'FAQs', 'Tax Benefits', 'Contact Us'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-emerald-100/60 hover:text-white hover:drop-shadow-[0_0_6px_rgba(16,185,129,0.4)] transition-all duration-300">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* === CENTER COMMUNITY SECTION === */}
        <div className="flex flex-col items-center mb-14">
          <h3 className="font-heading font-bold text-white text-sm uppercase tracking-[0.2em] mb-2">Stay Connected With Change</h3>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-accent-500/60 to-transparent mb-6" />
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-lg">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full sm:flex-1 px-5 py-3 rounded-full bg-white/[0.06] border border-white/[0.1] text-sm text-white placeholder:text-emerald-200/30 focus:outline-none focus:border-accent-500/50 focus:bg-white/[0.08] transition-all duration-300 backdrop-blur-sm"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full sm:flex-1 px-5 py-3 rounded-full bg-white/[0.06] border border-white/[0.1] text-sm text-white placeholder:text-emerald-200/30 focus:outline-none focus:border-accent-500/50 focus:bg-white/[0.08] transition-all duration-300 backdrop-blur-sm"
            />
            <button className="w-full sm:w-auto px-7 py-3 bg-accent-500 hover:bg-accent-600 text-primary-900 font-heading font-bold text-sm rounded-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent-500/25 whitespace-nowrap">
              Join Community
            </button>
          </div>
        </div>

        {/* === SOCIAL ICONS === */}
        <div className="flex items-center justify-center gap-0 mb-12">
          {[
            { label: 'YT', href: '#' },
            { label: '𝕏', href: '#' },
            { label: 'IG', href: '#' },
            { label: 'FB', href: '#' },
            { label: 'IN', href: '#' },
          ].map((social, i) => (
            <div key={social.label} className="flex items-center">
              <a
                href={social.href}
                className="w-10 h-10 rounded-full bg-white/[0.07] border border-white/[0.08] flex items-center justify-center text-emerald-200/70 text-sm hover:text-white hover:bg-emerald-500/20 hover:border-emerald-400/30 hover:shadow-[0_0_15px_rgba(16,185,129,0.25)] transition-all duration-300"
              >
                {social.label}
              </a>
              {i < 4 && (
                <div className="w-8 h-px mx-1 bg-gradient-to-r from-emerald-500/40 via-emerald-400/20 to-emerald-500/40" />
              )}
            </div>
          ))}
        </div>

        {/* === BOTTOM LINKS === */}
        <div className="border-t border-white/[0.06] pt-6">
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-xs text-emerald-100/40 font-sans">
            {['Annual Reports', 'YSSF Family', 'YSSF Developers', 'Blogs', "FAQ's", 'Donations'].map((item, i, arr) => (
              <div key={item} className="flex items-center">
                <a href="#" className="hover:text-emerald-300/80 transition-colors duration-300 px-2">{item}</a>
                {i < arr.length - 1 && (
                  <span className="text-emerald-500/30 text-[10px]">|</span>
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-[11px] text-emerald-100/25 mt-5 font-sans">
            &copy; {new Date().getFullYear()} Youth Shakti Social Foundation. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
