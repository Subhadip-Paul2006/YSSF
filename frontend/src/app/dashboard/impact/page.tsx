"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Leaf,
  GraduationCap,
  Droplets,
  Users,
  TreePine,
  BookOpen,
  Activity,
  MapPin,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";

interface ImpactZone {
  id: string;
  district: string;
  state: string;
  treesPlanted: number;
  bloodUnits: number;
  studentsReached: number;
  volunteersActive: number;
  imageSrc: string;
}

interface YearlyMetric {
  year: string;
  trees: number;
  bloodUnits: number;
  students: number;
  volunteers: number;
}

const IMPACT_ZONES: ImpactZone[] = [
  {
    id: "bankura",
    district: "Bankura",
    state: "West Bengal",
    treesPlanted: 4200,
    bloodUnits: 1200,
    studentsReached: 350,
    volunteersActive: 85,
    imageSrc: "/Assets/Borjora_HS_01.png",
  },
  {
    id: "kolkata",
    district: "Kolkata",
    state: "West Bengal",
    treesPlanted: 1800,
    bloodUnits: 2800,
    studentsReached: 520,
    volunteersActive: 140,
    imageSrc: "/Assets/narayana_01.png",
  },
  {
    id: "saltlake",
    district: "Salt Lake / Bidhannagar",
    state: "West Bengal",
    treesPlanted: 3200,
    bloodUnits: 800,
    studentsReached: 280,
    volunteersActive: 65,
    imageSrc: "/Assets/dps_01.png",
  },
  {
    id: "howrah",
    district: "Howrah",
    state: "West Bengal",
    treesPlanted: 3200,
    bloodUnits: 400,
    studentsReached: 190,
    volunteersActive: 45,
    imageSrc: "/Assets/st_michale_01.png",
  },
];

const YEARLY_DATA: YearlyMetric[] = [
  { year: "2022", trees: 1200, bloodUnits: 600, students: 80, volunteers: 40 },
  { year: "2023", trees: 3400, bloodUnits: 1400, students: 220, volunteers: 95 },
  { year: "2024", trees: 6200, bloodUnits: 2800, students: 540, volunteers: 180 },
  { year: "2025", trees: 10800, bloodUnits: 4200, students: 820, volunteers: 260 },
  { year: "2026*", trees: 12400, bloodUnits: 5200, students: 1050, volunteers: 335 },
];

function formatNumber(val: number) {
  return new Intl.NumberFormat("en-IN").format(val);
}

const MAX_TREES = 12400;
const MAX_BLOOD = 5200;
const MAX_STUDENTS = 1050;
export default function ImpactDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-surface-100/40 via-white to-surface-100/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary-900 font-heading font-semibold text-sm hover:underline mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-primary-900/10 text-primary-900">
              <Activity className="w-6 h-6" />
            </div>
            <span className="font-display font-semibold text-primary-700 uppercase tracking-widest text-sm">
              Impact Metrics
            </span>
          </div>
          <h1 className="font-heading font-extrabold text-4xl text-primary-900 leading-tight">
            Real Impact, Real Communities
          </h1>
          <p className="font-sans text-foreground/80 mt-2 max-w-2xl">
            Verified metrics tracking trees planted, blood units collected, students reached, and volunteer engagement
            across West Bengal. Updated quarterly.
          </p>
        </motion.div>

        {/* Big Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            { icon: TreePine, value: "12,400+", label: "Trees Planted", desc: "Indigenous species across 4 districts", color: "text-primary-900", bg: "bg-primary-900/10" },
            { icon: Droplets, value: "5,200+", label: "Blood Units", desc: "Collected at 20+ camp drives", color: "text-alert-500", bg: "bg-alert-500/10" },
            { icon: BookOpen, value: "1,050+", label: "Students Reached", desc: "Through scholar centers & workshops", color: "text-accent-600", bg: "bg-accent-500/10" },
            { icon: Users, value: "335+", label: "Active Volunteers", desc: "Registered and deployed youth", color: "text-primary-700", bg: "bg-primary-700/10" },
          ].map((stat, i) => {
            const IconComp = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * (i + 1) }}
                className="yssf-card p-6 bg-white border-primary-200/40 text-center"
              >
                <div className={`inline-flex p-3 rounded-full ${stat.bg} ${stat.color} mb-3`}>
                  <IconComp className="w-6 h-6" />
                </div>
                <p className="font-heading font-extrabold text-3xl text-primary-900">{stat.value}</p>
                <p className="font-heading font-semibold text-sm text-primary-900 mt-1">{stat.label}</p>
                <p className="font-sans text-xs text-foreground/60 mt-1">{stat.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Year-over-Year Growth Chart */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="yssf-card p-8 bg-white border-primary-200/40 mb-16"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-primary-900" />
            <h2 className="font-heading font-extrabold text-xl text-primary-900">Year-over-Year Growth</h2>
          </div>
          <p className="font-sans text-xs text-foreground/60 mb-8">* 2026 data is cumulative year-to-date (through May)</p>

          <div className="space-y-8">
            {/* Trees */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Leaf className="w-4 h-4 text-primary-900" />
                <span className="font-heading font-bold text-sm text-primary-900">Trees Planted</span>
              </div>
              <div className="space-y-2">
                {YEARLY_DATA.map((d) => (
                  <div key={d.year} className="flex items-center gap-4">
                    <span className="font-heading font-bold text-xs text-primary-900/70 w-12">{d.year}</span>
                    <div className="flex-1 h-6 bg-surface-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(d.trees / MAX_TREES) * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full bg-primary-900 rounded-full flex items-center justify-end pr-2"
                      >
                        <span className="font-heading font-bold text-[10px] text-white">{formatNumber(d.trees)}</span>
                      </motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Blood Units */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Droplets className="w-4 h-4 text-alert-500" />
                <span className="font-heading font-bold text-sm text-primary-900">Blood Units Collected</span>
              </div>
              <div className="space-y-2">
                {YEARLY_DATA.map((d) => (
                  <div key={d.year} className="flex items-center gap-4">
                    <span className="font-heading font-bold text-xs text-primary-900/70 w-12">{d.year}</span>
                    <div className="flex-1 h-6 bg-surface-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(d.bloodUnits / MAX_BLOOD) * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full bg-alert-500 rounded-full flex items-center justify-end pr-2"
                      >
                        <span className="font-heading font-bold text-[10px] text-white">{formatNumber(d.bloodUnits)}</span>
                      </motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Students */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <GraduationCap className="w-4 h-4 text-accent-600" />
                <span className="font-heading font-bold text-sm text-primary-900">Students Reached</span>
              </div>
              <div className="space-y-2">
                {YEARLY_DATA.map((d) => (
                  <div key={d.year} className="flex items-center gap-4">
                    <span className="font-heading font-bold text-xs text-primary-900/70 w-12">{d.year}</span>
                    <div className="flex-1 h-6 bg-surface-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(d.students / MAX_STUDENTS) * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full bg-accent-500 rounded-full flex items-center justify-end pr-2"
                      >
                        <span className="font-heading font-bold text-[10px] text-primary-900">{formatNumber(d.students)}</span>
                      </motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Geographic Impact Zones */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5 text-primary-900" />
              <h2 className="font-heading font-extrabold text-xl text-primary-900">Impact by Region</h2>
            </div>
            <p className="font-sans text-sm text-foreground/70">Districts in West Bengal where YSSF campaigns are actively deployed.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {IMPACT_ZONES.map((zone, index) => (
              <motion.div
                key={zone.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="yssf-card overflow-hidden bg-white border-primary-200/40"
              >
                <div className="relative h-40 w-full">
                  <Image
                    src={zone.imageSrc}
                    alt={`${zone.district} impact zone`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-900/80 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <h3 className="font-heading font-extrabold text-lg text-white">{zone.district}</h3>
                    <p className="font-sans text-xs text-white/80">{zone.state}</p>
                  </div>
                </div>
                <div className="p-5 grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <Leaf className="w-4 h-4 text-primary-900 mx-auto mb-1" />
                    <p className="font-heading font-extrabold text-lg text-primary-900">{formatNumber(zone.treesPlanted)}</p>
                    <p className="font-sans text-xs text-foreground/60">Trees Planted</p>
                  </div>
                  <div className="text-center">
                    <Droplets className="w-4 h-4 text-alert-500 mx-auto mb-1" />
                    <p className="font-heading font-extrabold text-lg text-primary-900">{formatNumber(zone.bloodUnits)}</p>
                    <p className="font-sans text-xs text-foreground/60">Blood Units</p>
                  </div>
                  <div className="text-center">
                    <GraduationCap className="w-4 h-4 text-accent-600 mx-auto mb-1" />
                    <p className="font-heading font-extrabold text-lg text-primary-900">{formatNumber(zone.studentsReached)}</p>
                    <p className="font-sans text-xs text-foreground/60">Students</p>
                  </div>
                  <div className="text-center">
                    <Users className="w-4 h-4 text-primary-700 mx-auto mb-1" />
                    <p className="font-heading font-extrabold text-lg text-primary-900">{formatNumber(zone.volunteersActive)}</p>
                    <p className="font-sans text-xs text-foreground/60">Volunteers</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Link
            href="/register?role=volunteer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary-900 hover:bg-primary-800 text-white font-heading font-extrabold rounded-2xl transition-all shadow-md shadow-primary-900/10 hover:shadow-lg hover:-translate-y-0.5"
          >
            Join As Volunteer
            <ArrowUpRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
