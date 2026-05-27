"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Calendar, Clock, MapPin, ArrowRight, Loader2 } from "lucide-react";
import { apiGetEvents } from "@/lib/api";

const CATEGORIES = ["All", "Environment", "Healthcare", "Education", "Sanitation", "Youth"];
const STATUSES = ["All", "Upcoming", "Completed"];

const BADGE_COLORS: Record<string, string> = {
  Environment: "bg-primary-900 text-white",
  Healthcare: "bg-alert-500 text-white",
  Education: "bg-accent-500 text-primary-900",
  Sanitation: "bg-primary-400 text-primary-900",
  Youth: "bg-warning-500 text-white",
};

type EventItem = Awaited<ReturnType<typeof apiGetEvents>>[number];

export default function EventsPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch events when filters change
  useEffect(() => {
    let cancelled = false;
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const data = await apiGetEvents({
          category,
          status,
          search: debouncedSearch || undefined,
        });
        if (!cancelled) {
          setEvents(data);
        }
      } catch {
        if (!cancelled) setEvents([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchEvents();
    return () => { cancelled = true; };
  }, [debouncedSearch, category, status]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-surface-100/40 via-white to-surface-100/20">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-surface-100/60 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-900/10 border border-primary-900/15 text-primary-900 text-xs font-heading font-semibold">
            <Calendar className="w-4 h-4 text-accent-500" /> Community Events
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-heading font-extrabold text-4xl sm:text-5xl text-primary-900">
            Upcoming <span className="handwritten-highlight inline-block font-handwritten text-accent-500">Events</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="font-sans text-foreground/75 max-w-lg mx-auto">
            Join our community campaigns, plantation drives, blood donation camps, and educational workshops.
          </motion.p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b border-primary-900/5 sticky top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search events..." className="w-full pl-11 pr-4 py-3 rounded-xl border border-primary-200 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 text-foreground" />
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button key={c} onClick={() => setCategory(c)} className={`px-4 py-2 rounded-xl text-xs font-heading font-bold transition-all border cursor-pointer ${category === c ? "bg-primary-900 border-primary-900 text-white shadow-sm" : "border-primary-200 text-primary-900/80 hover:bg-surface-100"}`}>{c}</button>
              ))}
            </div>
            <div className="flex gap-2">
              {STATUSES.map((s) => (
                <button key={s} onClick={() => setStatus(s)} className={`px-3 py-2 rounded-xl text-xs font-heading font-bold transition-all border cursor-pointer ${status === s ? "bg-accent-500 border-accent-500 text-primary-900" : "border-primary-200 text-primary-900/80 hover:bg-surface-100"}`}>{s}</button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-20">
              <Loader2 className="w-10 h-10 text-primary-900 mx-auto mb-4 animate-spin" />
              <p className="font-heading font-bold text-sm text-primary-900/60">Loading events...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-20">
              <Calendar className="w-12 h-12 text-primary-200 mx-auto mb-4" />
              <p className="font-heading font-bold text-lg text-primary-900/50">No events found.</p>
              <p className="font-sans text-sm text-foreground/60 mt-1">Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event, index) => (
                <motion.div key={event.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.08 }}>
                  <Link href={`/events/${event.slug}`} className="yssf-card overflow-hidden flex flex-col h-full border border-primary-200/40 bg-white group">
                    <div className="relative h-48 w-full overflow-hidden bg-primary-200/20">
                      <Image src={event.imageSrc} alt={event.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-heading font-bold ${BADGE_COLORS[event.category] || "bg-primary-900 text-white"}`}>{event.badge}</div>
                      {event.status === "completed" && <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-heading font-bold bg-white/90 text-primary-900">Completed</div>}
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="font-heading font-extrabold text-lg text-primary-900 mb-2 leading-tight group-hover:text-primary-700 transition-colors">{event.title}</h3>
                      <p className="font-sans text-sm text-foreground/80 leading-relaxed mb-4 flex-grow line-clamp-2">{event.description}</p>
                      <div className="border-t border-primary-100 pt-4 grid grid-cols-2 gap-2 text-xs text-foreground/70 font-sans mb-4">
                        <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-primary-900" />{event.date}</span>
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-primary-900" />{event.time}</span>
                        <span className="flex items-center gap-1.5 col-span-2"><MapPin className="w-3.5 h-3.5 text-primary-900" /><span className="truncate">{event.location}</span></span>
                      </div>
                      <div className="flex items-center gap-2 text-primary-900 font-heading font-semibold text-xs group-hover:gap-3 transition-all">
                        View Details <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
