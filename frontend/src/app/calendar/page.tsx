"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Clock,
  MapPin,
  Users,
  ChevronLeft,
  ChevronRight,
  Filter,
  ArrowRight,
} from "lucide-react";
import { apiGetEvents } from "@/lib/api";
import { EVENTS as STATIC_EVENTS } from "@/lib/events-data";

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  dateObj: Date;
  time: string;
  location: string;
  schoolPartner: string;
  category: string;
  description: string;
  volunteerSlots: number;
  registeredVolunteers: number;
}

const getSlotsForEvent = (title: string, category: string): number => {
  if (title.includes("Eco-Restoration")) return 80;
  if (title.includes("Life-Saving")) return 50;
  if (title.includes("Green Workshop")) return 30;
  if (title.includes("Cleanliness")) return 100;
  if (title.includes("Leadership")) return 120;
  if (title.includes("Beachwood")) return 150;
  if (title.includes("Science Fair")) return 45;
  if (category === "Healthcare") return 200;
  return 100;
};

const getMockRegistered = (id: string): number => {
  if (id === "1") return 62;
  if (id === "2") return 38;
  if (id === "3") return 24;
  if (id === "4") return 71;
  if (id === "5") return 95;
  return 12;
};

const CATEGORIES = ["All", "Environment", "Healthcare", "Education", "Sanitation", "Youth"];

const CATEGORY_BADGE: Record<string, string> = {
  Environment: "bg-primary-900 text-white border-primary-400",
  Healthcare: "bg-alert-500 text-white border-alert-500",
  Education: "bg-accent-500 text-primary-900 border-accent-500",
  Sanitation: "bg-primary-400 text-primary-900 border-primary-400",
  Youth: "bg-warning-500 text-white border-warning-500",
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function CalendarPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentMonth, setCurrentMonth] = useState<number>(5); // June (0-indexed)
  const [currentYear] = useState<number>(2026);

  const [events, setEvents] = useState<CalendarEvent[]>(() => 
    STATIC_EVENTS.map((e) => ({
      id: e.id,
      title: e.title,
      date: e.date,
      dateObj: new Date(e.date),
      time: e.time,
      location: e.location,
      schoolPartner: e.schoolPartner,
      category: e.category,
      description: e.description,
      volunteerSlots: getSlotsForEvent(e.title, e.category),
      registeredVolunteers: getMockRegistered(e.id),
    }))
  );

  useEffect(() => {
    let active = true;
    apiGetEvents()
      .then((data) => {
        if (!active) return;
        if (data && data.length > 0) {
          const mapped = data.map((e: any) => ({
            id: e.id,
            title: e.title,
            date: e.date,
            dateObj: new Date(e.date),
            time: e.time,
            location: e.location,
            schoolPartner: e.schoolPartner,
            category: e.category,
            description: e.description,
            volunteerSlots: getSlotsForEvent(e.title, e.category),
            registeredVolunteers: e.registrations?.length || getMockRegistered(e.id),
          }));
          setEvents(mapped);
        }
      })
      .catch((err) => {
        console.warn("Failed to fetch dynamic calendar events, using static data", err);
      });
    return () => { active = false; };
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesCategory = activeCategory === "All" || event.category === activeCategory;
      const matchesMonth = event.dateObj.getMonth() === currentMonth && event.dateObj.getFullYear() === currentYear;
      return matchesCategory && matchesMonth;
    });
  }, [events, activeCategory, currentMonth, currentYear]);

  const allFilteredEvents = useMemo(() => {
    if (activeCategory === "All") return events.filter((e) => e.dateObj.getFullYear() === currentYear);
    return events.filter((e) => e.category === activeCategory && e.dateObj.getFullYear() === currentYear);
  }, [events, activeCategory, currentYear]);

  const navigateMonth = (direction: number) => {
    setCurrentMonth((prev) => {
      const next = prev + direction;
      if (next < 0) return 11;
      if (next > 11) return 0;
      return next;
    });
  };

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);

  const eventDays = useMemo(() => {
    return new Set(
      filteredEvents.map((e) => e.dateObj.getDate())
    );
  }, [filteredEvents]);

  return (
    <div className="relative overflow-x-hidden">
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-surface-100/60 via-surface-100/20 to-white pt-16 pb-16 lg:pt-24 lg:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-900/10 border border-primary-900/15 text-primary-900 text-xs sm:text-sm font-heading font-semibold"
          >
            <CalendarDays className="w-4 h-4 text-accent-500" />
            <span>Events & Drives</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading font-extrabold text-4xl sm:text-5xl text-primary-900 leading-tight"
          >
            Community{" "}
            <span className="handwritten-highlight inline-block font-handwritten text-accent-500 transform rotate-[-1deg] px-2 text-5xl sm:text-6xl">
              Calendar
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-sans text-lg text-foreground/80 leading-relaxed max-w-2xl mx-auto"
          >
            View all upcoming YSSF campaigns, drives, workshops, and events. Mark your calendar and register to volunteer for the causes you care about.
          </motion.p>
        </div>
      </section>

      {/* Category Filters */}
      <section className="bg-white border-b border-primary-900/5 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center gap-3 overflow-x-auto pb-1">
            <Filter className="w-4 h-4 text-primary-900 flex-shrink-0" />
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-heading font-bold transition-all border whitespace-nowrap cursor-pointer ${
                  activeCategory === cat
                    ? "bg-primary-900 border-primary-900 text-white shadow-sm"
                    : "bg-transparent border-primary-200 text-primary-900/80 hover:bg-surface-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Calendar Widget */}
            <div className="lg:col-span-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="yssf-card p-6 border border-primary-200/40 bg-white sticky top-40"
              >
                {/* Month Navigation */}
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={() => navigateMonth(-1)}
                    className="p-2 rounded-lg hover:bg-surface-100 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5 text-primary-900" />
                  </button>
                  <h3 className="font-heading font-extrabold text-lg text-primary-900">
                    {MONTHS[currentMonth]} {currentYear}
                  </h3>
                  <button
                    onClick={() => navigateMonth(1)}
                    className="p-2 rounded-lg hover:bg-surface-100 transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5 text-primary-900" />
                  </button>
                </div>

                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="text-center font-heading font-bold text-[10px] text-primary-900/60 uppercase py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Empty cells before first day */}
                  {Array.from({ length: firstDay }, (_, i) => (
                    <div key={`empty-${i}`} className="aspect-square" />
                  ))}

                  {/* Day cells */}
                  {Array.from({ length: daysInMonth }, (_, i) => {
                    const day = i + 1;
                    const hasEvent = eventDays.has(day);

                    return (
                      <div
                        key={day}
                        className={`aspect-square flex items-center justify-center rounded-xl text-sm font-sans font-medium transition-colors ${
                          hasEvent
                            ? "bg-accent-500 text-primary-900 font-heading font-bold shadow-sm cursor-pointer"
                            : "text-foreground/70 hover:bg-surface-100/50"
                        }`}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="mt-6 pt-4 border-t border-primary-100 flex items-center gap-2 text-xs text-foreground/70 font-sans">
                  <div className="w-4 h-4 rounded bg-accent-500" />
                  <span>Event scheduled</span>
                </div>
              </motion.div>
            </div>

            {/* Events List */}
            <div className="lg:col-span-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-heading font-extrabold text-2xl text-primary-900">
                  {activeCategory === "All" ? "All Events" : activeCategory} in {MONTHS[currentMonth]}
                </h2>
                <span className="font-sans text-sm text-foreground/60">
                  {filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""}
                </span>
              </div>

              {filteredEvents.length === 0 ? (
                <div className="text-center py-16">
                  <CalendarDays className="w-12 h-12 text-primary-900/30 mx-auto mb-4" />
                  <p className="font-heading font-bold text-xl text-primary-900/50">No events scheduled this month.</p>
                  <p className="font-sans text-sm text-foreground/60 mt-2">Try selecting a different month or category.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredEvents.map((event, index) => {
                    const fillPercent = Math.round((event.registeredVolunteers / event.volunteerSlots) * 100);

                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                        className="yssf-card p-6 md:p-8 border border-primary-200/40 bg-white"
                      >
                        <div className="flex flex-col md:flex-row gap-6">
                          {/* Date Block */}
                          <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-primary-900 text-white flex flex-col items-center justify-center shadow-md">
                            <span className="font-heading font-bold text-2xl leading-none">{event.dateObj.getDate()}</span>
                            <span className="font-sans text-[10px] uppercase tracking-wider text-primary-200 mt-1">
                              {MONTHS[event.dateObj.getMonth()].slice(0, 3)}
                            </span>
                          </div>

                          {/* Event Details */}
                          <div className="flex-grow space-y-3">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-heading font-bold border ${CATEGORY_BADGE[event.category] || "bg-primary-900 text-white"}`}>
                                  {event.category}
                                </span>
                                <h3 className="font-heading font-extrabold text-xl text-primary-900 mt-2 leading-tight">
                                  {event.title}
                                </h3>
                              </div>
                            </div>

                            <p className="font-sans text-sm text-foreground/80 leading-relaxed">
                              {event.description}
                            </p>

                            {/* Info Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-foreground/70 font-sans pt-2">
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-primary-900 flex-shrink-0" />
                                <span>{event.time}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-primary-900 flex-shrink-0" />
                                <span className="truncate">{event.location}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-primary-900 flex-shrink-0" />
                                <span>{event.schoolPartner}</span>
                              </div>
                            </div>

                            {/* Volunteer Slots Bar */}
                            <div className="pt-3 space-y-2">
                              <div className="flex justify-between items-center text-xs font-heading font-semibold text-primary-900/80">
                                <span>{event.registeredVolunteers} / {event.volunteerSlots} volunteers registered</span>
                                <span>{fillPercent}% filled</span>
                              </div>
                              <div className="w-full h-2.5 bg-surface-100 rounded-full overflow-hidden border border-primary-200/20">
                                <motion.div
                                  initial={{ width: 0 }}
                                  whileInView={{ width: `${fillPercent}%` }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                                  className={`h-full rounded-full ${
                                    fillPercent >= 90
                                      ? "bg-alert-500"
                                      : fillPercent >= 70
                                      ? "bg-warning-500"
                                      : "bg-primary-900"
                                  }`}
                                />
                              </div>
                            </div>

                            {/* CTA */}
                            <div className="flex items-center gap-3 pt-2">
                              <Link
                                href={`/register?role=volunteer&event=${encodeURIComponent(event.title)}`}
                                className="px-5 py-2.5 bg-primary-900 hover:bg-primary-800 text-white font-heading font-semibold text-xs rounded-xl transition-all shadow-md shadow-primary-900/10 hover:shadow-lg flex items-center gap-2"
                              >
                                Register to Volunteer
                                <ArrowRight className="w-3.5 h-3.5" />
                              </Link>
                              {fillPercent >= 90 && (
                                <span className="text-xs font-heading font-bold text-alert-500 animate-pulse">
                                  Almost Full!
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* Upcoming events across all months */}
              {allFilteredEvents.filter((e) => !filteredEvents.includes(e)).length > 0 && (
                <div className="mt-16 pt-12 border-t border-primary-100">
                  <h2 className="font-heading font-extrabold text-xl text-primary-900 mb-6">
                    Other Upcoming Events in {currentYear}
                  </h2>
                  <div className="space-y-4">
                    {allFilteredEvents
                      .filter((e) => e.dateObj.getMonth() !== currentMonth)
                      .map((event) => (
                        <Link
                          key={event.id}
                          href={`/register?role=volunteer&event=${encodeURIComponent(event.title)}`}
                          className="flex items-center gap-4 p-4 rounded-2xl border border-primary-200/30 hover:border-primary-400 hover:bg-surface-100/20 transition-all group"
                        >
                          <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary-900 text-white flex flex-col items-center justify-center">
                            <span className="font-heading font-bold text-lg leading-none">{event.dateObj.getDate()}</span>
                            <span className="font-sans text-[9px] uppercase text-primary-200">{MONTHS[event.dateObj.getMonth()].slice(0, 3)}</span>
                          </div>
                          <div className="flex-grow min-w-0">
                            <h4 className="font-heading font-bold text-sm text-primary-900 truncate group-hover:text-primary-700 transition-colors">
                              {event.title}
                            </h4>
                            <p className="font-sans text-xs text-foreground/60 flex items-center gap-2 mt-0.5">
                              <MapPin className="w-3 h-3" />
                              {event.location}
                            </p>
                          </div>
                          <span className={`hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-heading font-bold border ${CATEGORY_BADGE[event.category] || "bg-primary-900 text-white"}`}>
                            {event.category}
                          </span>
                          <ArrowRight className="w-4 h-4 text-primary-900/40 group-hover:text-primary-900 transition-colors flex-shrink-0" />
                        </Link>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
