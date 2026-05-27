"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Clock, Users } from "lucide-react";
import { apiGetEvents } from "@/lib/api";
import { EVENTS as STATIC_EVENTS } from "@/lib/events-data";

export default function EventTimeline() {
  const [events, setEvents] = useState<any[]>(() => 
    STATIC_EVENTS.filter((e) => e.status === "upcoming")
  );

  useEffect(() => {
    let active = true;
    apiGetEvents({ status: "upcoming" })
      .then((data) => {
        if (!active) return;
        if (data && data.length > 0) {
          setEvents(data);
        }
      })
      .catch((err) => {
        console.warn("Failed to fetch dynamic events for timeline, using static data fallback", err);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="relative">
      {/* Central timeline line for desktop */}
      <div className="absolute left-1/2 transform -translate-x-1/2 top-4 bottom-4 w-1 bg-primary-200/50 hidden md:block border-l border-dashed border-primary-900/20" />

      <div className="space-y-12 relative">
        {events.map((event, index) => {
          const isLeft = index % 2 === 0;

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className={`flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0 relative ${
                isLeft ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Central Leaf Pin */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-white border-4 border-primary-900 shadow-md hidden md:flex items-center justify-center z-10 transition-transform duration-300 hover:scale-125 hover:border-accent-500">
                <div className="w-2.5 h-2.5 rounded-full bg-primary-400" />
              </div>

              {/* Event Content Side */}
              <div className="w-full md:w-[45%]">
                <div className="yssf-card overflow-hidden bg-white border border-primary-200/30">
                  {/* Image banner */}
                  <div className="relative h-48 w-full bg-primary-900/5">
                    <Image
                      src={event.imageSrc}
                      alt={event.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 45vw"
                      className="object-cover"
                    />
                    <div className={`absolute top-4 left-4 border px-3 py-1 rounded-full text-xs font-heading font-bold shadow-sm ${event.badgeColor || "bg-primary-900 text-white"}`}>
                      {event.badge}
                    </div>
                  </div>

                  {/* Body details */}
                  <div className="p-6">
                    <h3 className="font-heading font-extrabold text-xl text-primary-900 mb-2 leading-tight">
                      {event.title}
                    </h3>
                    <p className="font-display font-medium text-sm text-primary-700 mb-4 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-accent-500" /> Partner: {event.schoolPartner}
                    </p>
                    <p className="font-sans text-sm text-foreground/80 leading-relaxed mb-6">
                      {event.description}
                    </p>

                    <div className="border-t border-primary-100 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-foreground/75 font-sans">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary-900" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary-900" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 sm:col-span-2">
                        <MapPin className="w-4 h-4 text-primary-900" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <Link
                        href={`/register?role=volunteer&event=${encodeURIComponent(event.title)}`}
                        className="px-5 py-2 bg-primary-900 hover:bg-primary-800 text-white font-heading font-semibold text-xs rounded-xl transition-all shadow-md shadow-primary-900/10 hover:shadow-lg"
                      >
                        Register to Volunteer
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Spacing card for layout balance on large displays */}
              <div className="w-full md:w-[45%] hidden md:block" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
