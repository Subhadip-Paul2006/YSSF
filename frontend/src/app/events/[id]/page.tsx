"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { ArrowLeft, Calendar, Clock, MapPin, Users, Send, CheckCircle2, Loader2 } from "lucide-react";
import { apiGetEventBySlug, apiRegisterForEvent } from "@/lib/api";

type EventDetail = Awaited<ReturnType<typeof apiGetEventBySlug>>;

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [registered, setRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);

  // Fetch event by slug
  useEffect(() => {
    let cancelled = false;
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const data = await apiGetEventBySlug(id);
        if (!cancelled) {
          if (data) {
            setEvent(data);
          } else {
            setError("Event not found");
          }
        }
      } catch {
        if (!cancelled) setError("Failed to load event");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchEvent();
    return () => { cancelled = true; };
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <Loader2 className="w-10 h-10 text-primary-900 mx-auto mb-4 animate-spin" />
        <p className="font-heading font-bold text-sm text-primary-900/60">Loading event...</p>
      </div>
    );
  }

  // Error / not found state
  if (error || !event) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="font-heading font-extrabold text-3xl text-primary-900 mb-4">Event Not Found</h1>
        <p className="font-sans text-foreground/80 mb-8">This event may have been removed or the link is incorrect.</p>
        <Link href="/events" className="px-6 py-3 bg-primary-900 hover:bg-primary-800 text-white font-heading font-bold text-sm rounded-xl transition-all shadow-md">Browse Events</Link>
      </div>
    );
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegistering(true);
    setRegisterError(null);

    try {
      await apiRegisterForEvent(event.slug, { name, email, phone });
      setRegistering(false);
      setRegistered(true);
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 }, colors: ["#0B5D3B", "#8FD694", "#F4B400"] });
    } catch (err) {
      setRegisterError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setRegistering(false);
    }
  };

  const registrations = event.registrations || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-surface-100/40 via-white to-surface-100/20">
      {/* Hero Banner */}
      <section className="relative h-72 sm:h-96 w-full bg-primary-900/10">
        <Image src={event.imageSrc} alt={event.title} fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900/80 via-primary-900/30 to-transparent" />
        <div className="absolute bottom-8 left-0 right-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/events" className="inline-flex items-center gap-2 text-white/80 font-heading font-semibold text-sm hover:text-white mb-4">
              <ArrowLeft className="w-4 h-4" /> Back to Events
            </Link>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-heading font-bold mb-3 ${event.badgeColor}`}>{event.badge}</span>
            <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-white leading-tight">{event.title}</h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Details */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-8 space-y-8">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="yssf-card p-4 text-center border border-primary-200/30">
                  <Calendar className="w-5 h-5 text-primary-900 mx-auto mb-2" />
                  <p className="font-heading font-bold text-xs text-primary-900">{event.date}</p>
                </div>
                <div className="yssf-card p-4 text-center border border-primary-200/30">
                  <Clock className="w-5 h-5 text-primary-900 mx-auto mb-2" />
                  <p className="font-heading font-bold text-xs text-primary-900">{event.time}</p>
                </div>
                <div className="yssf-card p-4 text-center border border-primary-200/30">
                  <MapPin className="w-5 h-5 text-primary-900 mx-auto mb-2" />
                  <p className="font-heading font-bold text-xs text-primary-900">{event.location}</p>
                </div>
                <div className="yssf-card p-4 text-center border border-primary-200/30">
                  <Users className="w-5 h-5 text-primary-900 mx-auto mb-2" />
                  <p className="font-heading font-bold text-xs text-primary-900">{event.schoolPartner}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="font-heading font-extrabold text-2xl text-primary-900">About This Event</h2>
                <p className="font-sans text-base text-foreground/80 leading-relaxed">{event.fullDescription}</p>
              </div>

              {/* Recent Registrations */}
              {registrations.length > 0 && (
                <div className="space-y-4">
                  <h2 className="font-heading font-extrabold text-xl text-primary-900 flex items-center gap-2"><Users className="w-5 h-5" /> Recent Registrations</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {registrations.map((reg) => (
                      <div key={reg.id} className="flex items-center gap-3 p-3 rounded-xl border border-primary-200/30 bg-white">
                        <div className="w-8 h-8 rounded-full bg-surface-100 flex items-center justify-center text-primary-900 font-heading font-bold text-xs">{reg.name.charAt(0)}</div>
                        <span className="font-heading font-semibold text-sm text-primary-900">{reg.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Registration Sidebar */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-4">
              <div className="yssf-card p-6 border border-primary-200/40 sticky top-28">
                {registered ? (
                  <div className="text-center space-y-4 py-6">
                    <div className="w-16 h-16 bg-accent-500 rounded-full flex items-center justify-center text-primary-900 mx-auto border-4 border-primary-900">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h3 className="font-heading font-extrabold text-xl text-primary-900">You&apos;re Registered!</h3>
                    <p className="font-sans text-sm text-foreground/75">Confirmation details sent to <strong className="text-primary-900">{email}</strong>. We look forward to seeing you there.</p>
                  </div>
                ) : (
                  <form onSubmit={handleRegister} className="space-y-4">
                    <h3 className="font-heading font-extrabold text-lg text-primary-900">Register to Volunteer</h3>
                    <p className="font-sans text-xs text-foreground/70">Sign up for this event and we will send you all the details.</p>

                    {registerError && (
                      <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 font-sans text-xs">{registerError}</div>
                    )}

                    <div className="space-y-1.5">
                      <label htmlFor="reg-name" className="font-heading font-semibold text-xs text-primary-900">Full Name</label>
                      <input id="reg-name" type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full px-4 py-3 rounded-xl border border-primary-200 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 text-foreground" />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="reg-email" className="font-heading font-semibold text-xs text-primary-900">Email</label>
                      <input id="reg-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" className="w-full px-4 py-3 rounded-xl border border-primary-200 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 text-foreground" />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="reg-phone" className="font-heading font-semibold text-xs text-primary-900">Phone</label>
                      <input id="reg-phone" type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" className="w-full px-4 py-3 rounded-xl border border-primary-200 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 text-foreground" />
                    </div>
                    <button type="submit" disabled={registering} className="w-full py-3.5 bg-accent-500 hover:bg-accent-600 disabled:bg-accent-500/50 text-primary-900 font-heading font-extrabold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer border-2 border-primary-900/10">
                      {registering ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>Register Now</span><Send className="w-4 h-4" /></>}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
