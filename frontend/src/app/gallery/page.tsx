"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Leaf,
  Heart,
  BookOpen,
  SprayCan,
  GraduationCap,
  Camera,
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types & Data                                                      */
/* ------------------------------------------------------------------ */

type CategoryFilter = "all" | "environment" | "healthcare" | "education" | "sanitation" | "community";

interface GalleryImage {
  id: string;
  src: string;
  title: string;
  description: string;
  category: Exclude<CategoryFilter, "all">;
  location: string;
  date: string;
}

const GALLERY_IMAGES: GalleryImage[] = [
  {
    id: "1",
    src: "/Assets/Borjora_HS_01.png",
    title: "Barjora High School Plantation Drive",
    description:
      "Students and volunteers planting native saplings during our flagship Eco-Restoration drive in partnership with Barjora High School, Bankura district.",
    category: "environment",
    location: "Barjora, Bankura",
    date: "June 2025",
  },
  {
    id: "2",
    src: "/Assets/Tree_Plantation.gif",
    title: "Tree Plantation in Action",
    description:
      "Volunteers carefully planting saplings in prepared soil beds, contributing to our mission of planting 20,000 native trees across West Bengal.",
    category: "environment",
    location: "Bankura District",
    date: "May 2025",
  },
  {
    id: "3",
    src: "/Assets/narayana_01.png",
    title: "Sakti Blood Donation Camp",
    description:
      "Our annual blood collection drive organized in collaboration with Narayana Healthcare Center, where 120+ units of blood were collected in a single day.",
    category: "healthcare",
    location: "Narayana Healthcare, Kolkata",
    date: "March 2025",
  },
  {
    id: "4",
    src: "/Assets/narayana_02.png",
    title: "Blood Camp Registration Desk",
    description:
      "Volunteers managing the registration process at the blood donation camp, ensuring smooth check-in and medical screening for all donors.",
    category: "healthcare",
    location: "Narayana Healthcare, Kolkata",
    date: "March 2025",
  },
  {
    id: "5",
    src: "/Assets/dps_01.png",
    title: "DPS Green Workshop",
    description:
      "An interactive environmental awareness seminar at Delhi Public School, Salt Lake, where students learned about biodiversity, waste segregation, and eco-friendly living.",
    category: "education",
    location: "DPS Salt Lake, Kolkata",
    date: "April 2025",
  },
  {
    id: "6",
    src: "/Assets/dps_02.png",
    title: "Student Workshop Activities",
    description:
      "Hands-on group activities during the Green Workshop where students created eco-bricks and learned practical sustainability techniques.",
    category: "education",
    location: "DPS Salt Lake, Kolkata",
    date: "April 2025",
  },
  {
    id: "7",
    src: "/Assets/st_michale_01.png",
    title: "Community Cleanliness Campaign",
    description:
      "Volunteers and students from St. Michael's School leading a community cleanup drive to create awareness about plastic pollution and local hygiene.",
    category: "sanitation",
    location: "St. Michael's Grounds, Kolkata",
    date: "February 2025",
  },
  {
    id: "8",
    src: "/Assets/st_michale_02.png",
    title: "Sanitation Awareness Rally",
    description:
      "A spirited rally through local neighborhoods to spread awareness about waste management and the importance of community cleanliness.",
    category: "sanitation",
    location: "St. Michael's Suburbs, Kolkata",
    date: "February 2025",
  },
  {
    id: "9",
    src: "/Assets/st_peters_01.png",
    title: "Youth Leadership Camp",
    description:
      "Day-long leadership development camp at St. Peter's Academy focusing on community development, emergency response, and peer-to-peer mental health support.",
    category: "community",
    location: "St. Peter's Academy, Kolkata",
    date: "January 2025",
  },
  {
    id: "10",
    src: "/Assets/st_peters_02.png",
    title: "Leadership Team Building",
    description:
      "Students participating in team-building exercises during the Youth Leadership Sakti Camp, developing collaboration and communication skills.",
    category: "community",
    location: "St. Peter's Academy, Kolkata",
    date: "January 2025",
  },
  {
    id: "11",
    src: "/Assets/beachwood_01.png",
    title: "Beachwood Community Outreach",
    description:
      "An outreach program in the Beachwood community, connecting with local families and distributing educational materials and hygiene kits.",
    category: "community",
    location: "Beachwood, West Bengal",
    date: "December 2024",
  },
  {
    id: "12",
    src: "/Assets/beachwood_02.png",
    title: "Beachwood Volunteer Engagement",
    description:
      "Our volunteer team engaging with Beachwood residents during a community meeting to understand local needs and plan future interventions.",
    category: "community",
    location: "Beachwood, West Bengal",
    date: "December 2024",
  },
];

const FILTERS: { key: CategoryFilter; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "all", label: "All Photos", icon: Camera },
  { key: "environment", label: "Environment", icon: Leaf },
  { key: "healthcare", label: "Healthcare", icon: Heart },
  { key: "education", label: "Education", icon: BookOpen },
  { key: "sanitation", label: "Sanitation", icon: SprayCan },
  { key: "community", label: "Community", icon: GraduationCap },
];

/* ------------------------------------------------------------------ */
/*  Lightbox Component                                               */
/* ------------------------------------------------------------------ */

function Lightbox({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: {
  images: GalleryImage[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const image = images[currentIndex];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-primary-900/95 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10 cursor-pointer"
        aria-label="Close lightbox"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Previous button */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="absolute left-4 sm:left-8 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10 cursor-pointer"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* Next button */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-4 sm:right-8 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10 cursor-pointer"
          aria-label="Next image"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Content */}
      <div
        className="max-w-5xl w-full flex flex-col items-center gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={image.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-primary-900/50"
          >
            <Image
              src={image.src}
              alt={image.title}
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-contain"
            />
          </motion.div>
        </AnimatePresence>

        {/* Caption */}
        <div className="text-center max-w-2xl space-y-2">
          <h3 className="font-heading font-extrabold text-xl text-white">{image.title}</h3>
          <p className="font-sans text-sm text-primary-200 leading-relaxed">{image.description}</p>
          <div className="flex items-center justify-center gap-4 text-xs text-primary-300 font-sans">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {image.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {image.date}
            </span>
          </div>
          <p className="font-heading text-xs text-primary-300/70">
            {currentIndex + 1} of {images.length}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                    */
/* ------------------------------------------------------------------ */

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredImages =
    activeFilter === "all"
      ? GALLERY_IMAGES
      : GALLERY_IMAGES.filter((img) => img.category === activeFilter);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredImages.length) % filteredImages.length);
    }
  };
  const nextImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredImages.length);
    }
  };

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
          <Camera className="w-full h-full" />
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
              <Camera className="w-4 h-4 text-accent-500" />
              <span>Campaigns, Drives & Events</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-heading font-extrabold text-4xl sm:text-5xl text-primary-900 leading-tight"
            >
              Our{" "}
              <span className="handwritten-highlight inline-block font-handwritten text-accent-500 transform rotate-[-1deg] px-2 text-5xl sm:text-6xl">
                Gallery
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-sans text-lg text-foreground/80 leading-relaxed max-w-2xl mx-auto"
            >
              A visual journey through our plantation drives, blood donation camps, educational workshops, and community outreach programs across West Bengal.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  2. Filter Tabs                                              */}
      {/* ============================================================ */}
      <section className="py-8 bg-white border-b border-primary-900/5 sticky top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {FILTERS.map((filter) => {
              const isActive = activeFilter === filter.key;
              const Icon = filter.icon;
              return (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`px-5 py-2.5 rounded-xl font-heading font-bold text-xs sm:text-sm flex items-center gap-2 border transition-all cursor-pointer ${
                    isActive
                      ? "bg-primary-900 border-primary-900 text-white shadow-md"
                      : "bg-transparent border-primary-200 text-primary-900/80 hover:bg-surface-100 hover:border-primary-400"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{filter.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  3. Photo Grid                                               */}
      {/* ============================================================ */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results count */}
          <div className="mb-8 text-center">
            <p className="font-sans text-sm text-foreground/70">
              Showing{" "}
              <span className="font-heading font-bold text-primary-900">{filteredImages.length}</span>{" "}
              {filteredImages.length === 1 ? "photo" : "photos"}
              {activeFilter !== "all" && (
                <>
                  {" "}in{" "}
                  <span className="font-heading font-bold text-primary-900 capitalize">{activeFilter}</span>
                </>
              )}
            </p>
          </div>

          {/* Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="yssf-card overflow-hidden bg-white border border-primary-200/40 cursor-pointer group"
                  onClick={() => openLightbox(index)}
                >
                  {/* Image */}
                  <div className="relative h-56 w-full bg-primary-200/10 overflow-hidden">
                    <Image
                      src={image.src}
                      alt={image.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-primary-900/0 group-hover:bg-primary-900/30 transition-colors duration-300 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/0 group-hover:bg-white/90 flex items-center justify-center transition-all duration-300 scale-0 group-hover:scale-100">
                        <Camera className="w-5 h-5 text-primary-900" />
                      </div>
                    </div>
                    {/* Category badge */}
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm border border-primary-900/10 px-3 py-1 rounded-full text-xs font-heading font-semibold text-primary-900 capitalize">
                      {image.category}
                    </div>
                  </div>

                  {/* Caption */}
                  <div className="p-5">
                    <h3 className="font-heading font-extrabold text-base text-primary-900 mb-2 leading-tight">
                      {image.title}
                    </h3>
                    <p className="font-sans text-xs text-foreground/75 leading-relaxed mb-3 line-clamp-2">
                      {image.description}
                    </p>
                    <div className="flex items-center gap-4 text-[11px] text-foreground/60 font-sans">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-primary-700" />
                        {image.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-primary-700" />
                        {image.date}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Empty state */}
          {filteredImages.length === 0 && (
            <div className="text-center py-20">
              <Camera className="w-12 h-12 text-primary-200 mx-auto mb-4" />
              <p className="font-heading font-bold text-lg text-primary-900/60">
                No photos found for this category.
              </p>
              <p className="font-sans text-sm text-foreground/60 mt-1">
                Check back soon as we document more campaigns.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/*  4. Video Section                                            */}
      {/* ============================================================ */}
      <section className="py-24 bg-surface-100/30 border-t border-primary-200/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="font-display font-semibold text-primary-700 uppercase tracking-widest text-sm block">
              Watch Us In Action
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-primary-900">
              Campaign Highlights
            </h2>
            <p className="font-sans text-foreground/80">
              Short video clips capturing the energy and impact of our community campaigns.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="yssf-card overflow-hidden bg-white border border-primary-200/40"
            >
              <div className="relative aspect-video bg-primary-900/5">
                <video
                  src="/Assets/blood-donation-animation-gif-download-4007706.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5">
                <h3 className="font-heading font-bold text-base text-primary-900 mb-1">
                  Blood Donation Drive Highlights
                </h3>
                <p className="font-sans text-xs text-foreground/75">
                  A glimpse into our life-saving blood collection camps organized with Narayana Healthcare.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="yssf-card overflow-hidden bg-white border border-primary-200/40"
            >
              <div className="relative aspect-video bg-primary-900/5">
                <video
                  src="/Assets/environment-animation-gif-download-9600621.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5">
                <h3 className="font-heading font-bold text-base text-primary-900 mb-1">
                  Environment Restoration in Motion
                </h3>
                <p className="font-sans text-xs text-foreground/75">
                  Watch our reforestation efforts unfold as we plant thousands of native saplings across communities.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  5. CTA Section                                              */}
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
              Be Part of the Next Campaign
            </h2>
            <p className="font-sans text-lg text-foreground/80 leading-relaxed mb-8 max-w-xl mx-auto">
              Every tree planted, every blood unit collected, and every child educated starts with someone choosing to act. Join us and create stories worth telling.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto px-8 py-4 bg-accent-500 hover:bg-accent-600 text-primary-900 font-heading font-extrabold rounded-2xl transition-all shadow-md shadow-accent-500/25 hover:shadow-lg hover:shadow-accent-500/40 hover:-translate-y-0.5 text-center border-2 border-primary-900/10"
              >
                Join As Volunteer
              </Link>
              <Link
                href="/about"
                className="w-full sm:w-auto px-8 py-4 border-2 border-primary-900 text-primary-900 hover:bg-surface-100 font-heading font-bold rounded-2xl text-center transition-all hover:-translate-y-0.5"
              >
                Learn About YSSF
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Lightbox Overlay                                            */}
      {/* ============================================================ */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={filteredImages}
            currentIndex={lightboxIndex}
            onClose={closeLightbox}
            onPrev={prevImage}
            onNext={nextImage}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
