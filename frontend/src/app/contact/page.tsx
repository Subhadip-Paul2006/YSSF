"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";
import { apiSubmitContact } from "@/lib/api";

const SUBJECTS = [
  "General Inquiry",
  "Volunteer Opportunities",
  "Donation Support",
  "NGO Partnership",
  "Media / Press",
  "Report an Issue",
];

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiSubmitContact({ name, email, phone: phone || undefined, subject, message });
      setLoading(false);
      setSubmitted(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#0B5D3B", "#8FD694", "#F4B400"],
      });
    } catch {
      setLoading(false);
      alert("Failed to send message. Please try again.");
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setName("");
    setEmail("");
    setPhone("");
    setSubject(SUBJECTS[0]);
    setMessage("");
  };

  const contactInfo = [
    { icon: Mail, label: "Email", value: "info@youthsakti.org", href: "mailto:info@youthsakti.org" },
    { icon: Phone, label: "Phone", value: "+91 98765 43210", href: "tel:+919876543210" },
    { icon: MapPin, label: "Address", value: "Block 4, Sector V, Salt Lake, Kolkata, West Bengal, 700091", href: null },
    { icon: Clock, label: "Office Hours", value: "Monday - Friday, 9:00 AM - 6:00 PM IST", href: null },
  ];

  return (
    <div className="relative overflow-x-hidden">
      {/* Hero */}
      <section className="bg-gradient-to-b from-surface-100/60 via-surface-100/20 to-white pt-16 pb-12 lg:pt-24 lg:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-900/10 border border-primary-900/15 text-primary-900 text-xs sm:text-sm font-heading font-semibold"
          >
            <MessageSquare className="w-4 h-4 text-accent-500" />
            <span>Reach Out To Us</span>
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-heading font-extrabold text-4xl sm:text-5xl text-primary-900"
          >
            Get In <span className="handwritten-highlight inline-block font-handwritten text-accent-500">Touch</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-sans text-lg text-foreground/80 max-w-2xl mx-auto"
          >
            Have questions, ideas, or want to partner with us? We&apos;d love to hear from you. Our team responds within 24 hours.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7"
            >
              <div className="yssf-card bg-white p-8 md:p-10 border border-primary-200/40 relative overflow-hidden">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <div className="w-20 h-20 bg-surface-100 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle2 className="w-12 h-12 text-primary-900" />
                    </div>
                    <h3 className="font-heading font-extrabold text-2xl text-primary-900 mb-3">Message Sent!</h3>
                    <p className="font-sans text-foreground/80 max-w-sm mb-6">
                      Thank you for reaching out. Our team will get back to you within 24 hours.
                    </p>
                    <button
                      onClick={handleReset}
                      className="px-6 py-2.5 bg-primary-900 text-white hover:bg-primary-800 font-heading font-bold text-sm rounded-xl transition-all shadow-md cursor-pointer"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="pb-4 border-b border-primary-100 mb-2">
                      <h2 className="font-heading font-extrabold text-xl text-primary-900">Send Us a Message</h2>
                      <p className="font-sans text-xs text-foreground/70 mt-1">Fill out the form and we&apos;ll respond promptly.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label htmlFor="contact-name" className="font-heading font-semibold text-xs text-primary-900">Full Name</label>
                        <input
                          id="contact-name"
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Soumya Chakraborty"
                          className="w-full px-4 py-3 rounded-xl border border-primary-200 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 text-foreground"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label htmlFor="contact-email" className="font-heading font-semibold text-xs text-primary-900">Email Address</label>
                        <input
                          id="contact-email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. soumya@example.com"
                          className="w-full px-4 py-3 rounded-xl border border-primary-200 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 text-foreground"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label htmlFor="contact-phone" className="font-heading font-semibold text-xs text-primary-900">Phone (Optional)</label>
                        <input
                          id="contact-phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="e.g. +91 98765 43210"
                          className="w-full px-4 py-3 rounded-xl border border-primary-200 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 text-foreground"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label htmlFor="contact-subject" className="font-heading font-semibold text-xs text-primary-900">Subject</label>
                        <select
                          id="contact-subject"
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-primary-200 bg-white font-sans text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 text-primary-900"
                        >
                          {SUBJECTS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="contact-message" className="font-heading font-semibold text-xs text-primary-900">Your Message</label>
                      <textarea
                        id="contact-message"
                        required
                        rows={5}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tell us how we can help, or share your ideas for collaboration..."
                        className="w-full px-4 py-3 rounded-xl border border-primary-200 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 resize-none text-foreground"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 bg-accent-500 hover:bg-accent-600 disabled:bg-accent-500/50 text-primary-900 font-heading font-bold text-sm rounded-xl transition-all shadow-md shadow-accent-500/20 hover:shadow-lg flex items-center justify-center gap-2 border-2 border-primary-900/10 cursor-pointer"
                    >
                      {loading ? (
                        <span>Sending Message...</span>
                      ) : (
                        <>
                          <span>Send Message</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>

            {/* Contact Info Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-5 space-y-6"
            >
              <div className="space-y-4 mb-8">
                <h2 className="font-heading font-extrabold text-2xl text-primary-900">Contact Information</h2>
                <p className="font-sans text-sm text-foreground/80 leading-relaxed">
                  Whether you want to volunteer, donate, or partner with us as an NGO, we&apos;re here to help. Reach out through any channel below.
                </p>
              </div>

              {contactInfo.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i }}
                  className="flex items-start gap-4 p-5 rounded-2xl bg-surface-100/30 border border-primary-200/20"
                >
                  <div className="p-3 rounded-xl bg-primary-900 text-white shrink-0">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-sm text-primary-900 mb-0.5">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="font-sans text-sm text-foreground/80 hover:text-primary-900 transition-colors">
                        {item.value}
                      </a>
                    ) : (
                      <p className="font-sans text-sm text-foreground/80">{item.value}</p>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Map Placeholder */}
              <div className="rounded-2xl overflow-hidden border border-primary-200/30 bg-surface-100/30 h-48 flex flex-col items-center justify-center">
                <MapPin className="w-8 h-8 text-primary-900/40 mb-2" />
                <p className="font-heading font-bold text-sm text-primary-900/60">YSSF Headquarters</p>
                <p className="font-sans text-xs text-foreground/50 text-center px-4 mt-1">Block 4, Sector V, Salt Lake, Kolkata, WB 700091</p>
              </div>

              {/* Social Links */}
              <div className="p-5 rounded-2xl bg-primary-900 text-white">
                <p className="font-heading font-bold text-sm mb-3">Follow Our Journey</p>
                <div className="flex gap-3">
                  {[
                    { label: "Twitter / X", icon: "X" },
                    { label: "Facebook", icon: "fb" },
                    { label: "LinkedIn", icon: "in" },
                    { label: "Instagram", icon: "ig" },
                  ].map((social) => (
                    <span
                      key={social.label}
                      className="w-10 h-10 rounded-full bg-white/10 hover:bg-accent-500 hover:text-primary-900 flex items-center justify-center cursor-pointer transition-colors text-xs font-bold"
                      title={social.label}
                    >
                      {social.icon}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
