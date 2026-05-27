"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Leaf,
  Heart,
  Globe,
  Shield,
  Users,
  Target,
  Award,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  ChevronDown,
  ChevronUp,
  HandHeart,
  TreePine,
  Droplets,
  BookOpen,
  School,
  MapPin,
  Calendar,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Data                                                              */
/* ------------------------------------------------------------------ */

const FOUNDING_STORY = {
  year: "2022",
  title: "From a Small Campus Idea to a State-Wide Movement",
  paragraphs: [
    "Youth Sakti Social Foundation (YSSF) was born in the corridors of a local school in Bankura, West Bengal. A small group of students noticed that while their communities struggled with deforestation, blood shortages, and underfunded classrooms, no structured youth-led organization existed to channel their energy into meaningful action.",
    "What started as a weekend tree-planting outing with 15 students quickly grew into a registered NGO ecosystem. Within two years, YSSF had partnered with over 10 institutions, planted more than 12,000 trees, organized life-saving blood donation camps, and established scholar learning centers for underprivileged children.",
    "Today, YSSF operates as a fully youth-led trust with transparent financial reporting, 80G tax-exempt status, and a growing network of volunteers, donors, and institutional partners who share a single belief: small collective actions drive breathtaking global restorations.",
  ],
};

const CORE_VALUES = [
  {
    icon: "Leaf",
    title: "Environmental Stewardship",
    description:
      "We believe that restoring green cover is the single most impactful action a community can take. Every sapling we plant is a promise to future generations.",
    color: "bg-primary-900 text-white",
    iconColor: "text-primary-400",
  },
  {
    icon: "Heart",
    title: "Compassionate Healthcare",
    description:
      "Blood saves lives. Our camps follow strict clinical protocols and partner with certified medical centers to ensure every donation unit meets hospital-grade standards.",
    color: "bg-alert-500 text-white",
    iconColor: "text-white",
  },
  {
    icon: "BookOpen",
    title: "Education Equity",
    description:
      "Every child deserves access to books, technology, and mentorship. Our scholar centers provide safe after-school environments where learning is celebrated.",
    color: "bg-accent-500 text-primary-900",
    iconColor: "text-primary-900",
  },
  {
    icon: "Shield",
    title: "Radical Transparency",
    description:
      "We publish every rupee received, every expense incurred, and every impact metric generated. Donors deserve to see exactly where their money goes.",
    color: "bg-primary-700 text-white",
    iconColor: "text-primary-400",
  },
];

const LEADERSHIP_TEAM = [
  {
    name: "Arijit Chakraborty",
    role: "Founder & President",
    bio: "A passionate social entrepreneur who envisioned YSSF as a platform where youth energy meets structured community impact. Arijit oversees strategic partnerships, institutional collaborations, and organizational growth.",
    imageSrc: "/Assets/Borjora_HS_01.png",
  },
  {
    name: "Priya Mondal",
    role: "Head of Operations",
    bio: "Priya manages day-to-day logistics for all YSSF campaigns, from plantation drives to blood donation camps. Her organizational skills ensure every event runs smoothly and safely.",
    imageSrc: "/Assets/dps_01.png",
  },
  {
    name: "Rahul Shaw",
    role: "Volunteer Coordinator",
    bio: "Rahul recruits, trains, and manages our growing network of student volunteers. He is the bridge between school administrations and our on-ground teams.",
    imageSrc: "/Assets/narayana_01.png",
  },
  {
    name: "Sneha Sen",
    role: "Education & Outreach Lead",
    bio: "Sneha designs curriculum for our scholar centers and leads awareness workshops on environmental topics in partner schools across West Bengal.",
    imageSrc: "/Assets/st_peters_01.png",
  },
];

const TIMELINE_MILESTONES = [
  {
    year: "2022",
    title: "Foundation Established",
    description: "YSSF was registered as a social trust in West Bengal with a mission to mobilize youth for grassroots community action.",
    icon: "Sparkles",
  },
  {
    year: "2023",
    title: "First 1,000 Trees Planted",
    description: "Partnered with Barjora High School for our inaugural large-scale plantation drive, establishing green corridors in Bankura district.",
    icon: "TreePine",
  },
  {
    year: "2023",
    title: "Inaugural Blood Donation Camp",
    description: "Organized our first blood camp in collaboration with Narayana Healthcare, collecting 120+ units in a single day.",
    icon: "Droplets",
  },
  {
    year: "2024",
    title: "10+ School Partnerships",
    description: "Expanded our institutional network to include DPS Salt Lake, St. Michael's, St. Peter's Academy, and several other key schools.",
    icon: "School",
  },
  {
    year: "2024",
    title: "80G Tax Exemption Achieved",
    description: "Received government certification for 80G tax exemption, enabling donors to claim tax deductions on contributions.",
    icon: "Award",
  },
  {
    year: "2025",
    title: "Scholar Learning Centers Launched",
    description: "Opened our first community learning center equipped with books, tablets, and volunteer teachers for underprivileged students.",
    icon: "BookOpen",
  },
  {
    year: "2026",
    title: "Digital Platform & Beyond",
    description: "Launched the YSSF digital ecosystem for transparent donations, volunteer registration, and real-time impact tracking.",
    icon: "Globe",
  },
];

const IMPACT_NUMBERS = [
  { value: "12,400+", label: "Trees Planted", icon: "Leaf" },
  { value: "5,200+", label: "Blood Units Collected", icon: "Heart" },
  { value: "35+", label: "Institution Partners", icon: "School" },
  { value: "2,000+", label: "Active Volunteers", icon: "Users" },
  { value: "50+", label: "Campaigns Completed", icon: "Target" },
  { value: "100%", label: "Fund Transparency", icon: "Shield" },
];

/* ------------------------------------------------------------------ */
/*  Icon Resolver                                                     */
/* ------------------------------------------------------------------ */

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Leaf,
  Heart,
  Globe,
  Shield,
  Users,
  Target,
  Award,
  CheckCircle2,
  Sparkles,
  HandHeart,
  TreePine,
  Droplets,
  BookOpen,
  School,
  MapPin,
  Calendar,
};

function ResolveIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICON_MAP[name];
  return Icon ? <Icon className={className} /> : null;
}

/* ------------------------------------------------------------------ */
/*  FAQ Accordion                                                     */
/* ------------------------------------------------------------------ */

const FAQ_ITEMS = [
  {
    question: "How can I volunteer with YSSF?",
    answer:
      "Visit our registration page and sign up as a volunteer. You will be matched with upcoming campaigns based on your location, availability, and skills. We organize regular orientation sessions for new volunteers.",
  },
  {
    question: "Is my donation tax-exempt?",
    answer:
      "Yes. YSSF holds a valid 80G tax exemption certificate. When you donate, you will automatically receive a tax receipt via email that you can use for income tax deduction purposes.",
  },
  {
    question: "How does YSSF ensure fund transparency?",
    answer:
      "We publish detailed financial reports on our platform, including receipts, invoices, and photographs from every campaign. Our accounts are audited annually by an independent firm, and all reports are available for public review.",
  },
  {
    question: "Can my school or college partner with YSSF?",
    answer:
      "Absolutely. We actively seek institutional partnerships. Contact us at info@youthsakti.org with your institution details, and our outreach team will coordinate a meeting to discuss collaboration opportunities.",
  },
  {
    question: "What age group can volunteer?",
    answer:
      "Volunteers must be at least 16 years old. Those under 18 require parental or guardian consent. We have dedicated youth programs for students aged 16-25.",
  },
];

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-primary-200/40 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-surface-100/30 transition-colors text-left cursor-pointer"
      >
        <span className="font-heading font-bold text-sm text-primary-900 pr-4">{question}</span>
        {open ? (
          <ChevronUp className="w-5 h-5 text-primary-700 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-primary-700 flex-shrink-0" />
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-4 pt-0">
              <p className="font-sans text-sm text-foreground/80 leading-relaxed">{answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                    */
/* ------------------------------------------------------------------ */

export default function AboutPage() {
  return (
    <div className="relative overflow-x-hidden">
      {/* ============================================================ */}
      {/*  1. Hero Banner                                              */}
      {/* ============================================================ */}
      <section className="relative bg-gradient-to-b from-surface-100/60 via-surface-100/20 to-white pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden">
        {/* Decorative floating elements */}
        <div className="absolute top-1/4 left-10 w-12 h-12 text-primary-400 opacity-20 animate-bounce -z-10 hidden md:block">
          <Leaf className="w-full h-full rotate-45" />
        </div>
        <div className="absolute top-2/3 right-12 w-16 h-16 text-primary-900 opacity-10 animate-pulse -z-10 hidden md:block">
          <Leaf className="w-full h-full -rotate-12" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary-900 font-heading font-semibold text-sm hover:underline mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <div className="text-center max-w-3xl mx-auto space-y-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-900/10 border border-primary-900/15 text-primary-900 text-xs sm:text-sm font-heading font-semibold"
            >
              <Sparkles className="w-4 h-4 text-accent-500" />
              <span>Our Story, Mission & Impact</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-heading font-extrabold text-4xl sm:text-5xl text-primary-900 leading-tight"
            >
              About{" "}
              <span className="handwritten-highlight inline-block font-handwritten text-accent-500 transform rotate-[-1deg] px-2 text-5xl sm:text-6xl">
                Youth Sakti
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-sans text-lg text-foreground/80 leading-relaxed max-w-2xl mx-auto"
            >
              A youth-led NGO ecosystem channeling grassroots energy into reforestation, life-saving healthcare, education equity, and radical financial transparency.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  2. Founding Story                                           */}
      {/* ============================================================ */}
      <section className="py-24 bg-white border-y border-primary-900/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-5 flex justify-center order-last lg:order-first"
            >
              <div className="relative w-full max-w-sm aspect-[4/3] rounded-3xl overflow-hidden shadow-soft border-2 border-primary-200/50 bg-surface-100/50">
                <Image
                  src="/Assets/Tree_Plantation.gif"
                  alt="YSSF Tree Plantation Drive"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-7 space-y-6"
            >
              <span className="font-display font-semibold text-primary-700 uppercase tracking-widest text-sm block">
                Est. {FOUNDING_STORY.year}
              </span>
              <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-primary-900 leading-tight">
                {FOUNDING_STORY.title}
              </h2>
              {FOUNDING_STORY.paragraphs.map((p, i) => (
                <p key={i} className="font-sans text-base text-foreground/80 leading-relaxed">
                  {p}
                </p>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  3. Core Values                                              */}
      {/* ============================================================ */}
      <section className="py-24 bg-surface-100/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="font-display font-semibold text-primary-700 uppercase tracking-widest text-sm block">
              What Drives Us
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-primary-900">
              Our Core Values
            </h2>
            <p className="font-sans text-foreground/80">
              Every decision we make, every campaign we launch, and every rupee we spend is guided by these four principles.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {CORE_VALUES.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                whileHover={{ scale: 1.03, translateY: -4 }}
                className="yssf-card p-6 flex flex-col items-center text-center bg-white border-2 border-primary-200/40 relative overflow-hidden group"
              >
                <div className={`p-4 rounded-full ${value.color} mb-4 transition-all duration-300 group-hover:scale-110`}>
                  <ResolveIcon name={value.icon} className="w-8 h-8" />
                </div>
                <h3 className="font-heading font-extrabold text-lg text-primary-900 mb-2">{value.title}</h3>
                <p className="font-sans text-sm text-foreground/80 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  4. Impact Numbers                                           */}
      {/* ============================================================ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="font-display font-semibold text-primary-700 uppercase tracking-widest text-sm block">
              Our Reach
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-primary-900">
              Impact in Numbers
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {IMPACT_NUMBERS.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="text-center p-4"
              >
                <div className="w-12 h-12 mx-auto rounded-full bg-surface-100 flex items-center justify-center text-primary-900 mb-3">
                  <ResolveIcon name={stat.icon} className="w-6 h-6" />
                </div>
                <p className="font-heading font-extrabold text-2xl text-primary-900">{stat.value}</p>
                <p className="font-sans text-xs text-foreground/75 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  5. Journey Timeline                                         */}
      {/* ============================================================ */}
      <section className="py-24 bg-surface-100/20 border-t border-primary-200/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="font-display font-semibold text-primary-700 uppercase tracking-widest text-sm block">
              Our Journey
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-primary-900">
              Milestones That Define Us
            </h2>
          </div>

          <div className="relative max-w-3xl mx-auto">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-primary-200/50 hidden md:block" />

            <div className="space-y-8">
              {TIMELINE_MILESTONES.map((milestone, index) => (
                <motion.div
                  key={`${milestone.year}-${milestone.title}`}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: index * 0.08 }}
                  className="flex items-start gap-6"
                >
                  {/* Icon dot */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white border-4 border-primary-900 shadow-md flex items-center justify-center z-10">
                    <ResolveIcon name={milestone.icon} className="w-5 h-5 text-primary-900" />
                  </div>

                  {/* Content */}
                  <div className="yssf-card p-6 bg-white border border-primary-200/30 flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-primary-900 text-white text-xs font-heading font-bold rounded-full">
                        {milestone.year}
                      </span>
                      <h3 className="font-heading font-extrabold text-lg text-primary-900">
                        {milestone.title}
                      </h3>
                    </div>
                    <p className="font-sans text-sm text-foreground/80 leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  6. Leadership Team                                          */}
      {/* ============================================================ */}
      <section className="py-24 bg-white border-t border-primary-900/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="font-display font-semibold text-primary-700 uppercase tracking-widest text-sm block">
              The People Behind YSSF
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-primary-900">
              Our Leadership Team
            </h2>
            <p className="font-sans text-foreground/80">
              A dedicated team of young leaders committed to building a transparent, impactful, and sustainable NGO ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {LEADERSHIP_TEAM.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="yssf-card overflow-hidden bg-white border border-primary-200/40"
              >
                <div className="relative h-48 w-full bg-primary-200/20">
                  <Image
                    src={member.imageSrc}
                    alt={member.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-heading font-extrabold text-lg text-primary-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="font-display font-semibold text-sm text-accent-500 mb-3">{member.role}</p>
                  <p className="font-sans text-xs text-foreground/80 leading-relaxed">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  7. Partners & Institutions                                  */}
      {/* ============================================================ */}
      <section className="py-24 bg-surface-100/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="font-display font-semibold text-primary-700 uppercase tracking-widest text-sm block">
              Our Network
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-primary-900">
              Partner Institutions
            </h2>
            <p className="font-sans text-foreground/80">
              We collaborate with schools, colleges, and healthcare institutions to organize campaigns and reach more communities.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { name: "Barjora High School", image: "/Assets/Borjora_HS_01.png" },
              { name: "Delhi Public School", image: "/Assets/dps_01.png" },
              { name: "Narayana Healthcare", image: "/Assets/narayana_01.png" },
              { name: "St. Michael's School", image: "/Assets/st_michale_01.png" },
              { name: "St. Peter's Academy", image: "/Assets/st_peters_01.png" },
            ].map((partner, index) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="yssf-card p-4 flex flex-col items-center text-center bg-white border border-primary-200/40"
              >
                <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-3 bg-primary-200/10">
                  <Image
                    src={partner.image}
                    alt={partner.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 20vw"
                    className="object-cover"
                  />
                </div>
                <p className="font-heading font-bold text-xs text-primary-900">{partner.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  8. FAQ Section                                              */}
      {/* ============================================================ */}
      <section className="py-24 bg-white border-t border-primary-900/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-4">
            <span className="font-display font-semibold text-primary-700 uppercase tracking-widest text-sm block">
              Common Questions
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-primary-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {FAQ_ITEMS.map((item) => (
              <FaqItem key={item.question} question={item.question} answer={item.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  9. CTA Section                                              */}
      {/* ============================================================ */}
      <section className="py-24 bg-gradient-to-t from-surface-100/50 to-white border-t border-primary-900/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-primary-900 mb-4">
              Ready to Make a Difference?
            </h2>
            <p className="font-sans text-lg text-foreground/80 leading-relaxed mb-8 max-w-xl mx-auto">
              Whether you want to volunteer your time, donate to a cause, or partner your institution with us, there is a place for you in the YSSF ecosystem.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto px-8 py-4 bg-accent-500 hover:bg-accent-600 text-primary-900 font-heading font-extrabold rounded-2xl transition-all shadow-md shadow-accent-500/25 hover:shadow-lg hover:shadow-accent-500/40 hover:-translate-y-0.5 text-center border-2 border-primary-900/10"
              >
                Join As Volunteer
              </Link>
              <Link
                href="/register?role=donor"
                className="w-full sm:w-auto px-8 py-4 border-2 border-primary-900 text-primary-900 hover:bg-surface-100 font-heading font-bold rounded-2xl text-center transition-all hover:-translate-y-0.5"
              >
                Become a Donor
              </Link>
              <Link
                href="/gallery"
                className="w-full sm:w-auto px-8 py-4 border-2 border-primary-400 text-primary-900 hover:bg-surface-100 font-heading font-bold rounded-2xl text-center transition-all hover:-translate-y-0.5"
              >
                View Our Gallery
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
