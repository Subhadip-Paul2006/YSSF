"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  IndianRupee,
  PieChart,
  FileText,
  Download,
  Shield,
  ArrowUpRight,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Wallet,
  Receipt,
  Building2,
} from "lucide-react";

interface ExpenseCategory {
  name: string;
  amount: number;
  percent: number;
  color: string;
  details: string[];
}

interface FinancialRecord {
  quarter: string;
  income: number;
  expenses: number;
  surplus: number;
  status: "Audited" | "Pending Audit";
}

const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  {
    name: "Campaign Operations",
    amount: 410000,
    percent: 55,
    color: "bg-primary-900",
    details: [
      "Sapling procurement: Rs 1,85,000",
      "Blood camp medical supplies: Rs 72,000",
      "Scholar center books & tablets: Rs 98,000",
      "Fencing & compost materials: Rs 55,000",
    ],
  },
  {
    name: "Volunteer Logistics",
    amount: 148000,
    percent: 20,
    color: "bg-accent-500",
    details: [
      "Transportation for volunteers: Rs 68,000",
      "Volunteer kits & safety gear: Rs 42,000",
      "Food & refreshments at camps: Rs 38,000",
    ],
  },
  {
    name: "Technology & Platform",
    amount: 74000,
    percent: 10,
    color: "bg-primary-700",
    details: [
      "Website hosting & domain: Rs 18,000",
      "Blood directory dashboard dev: Rs 36,000",
      "SMS/Email notification services: Rs 20,000",
    ],
  },
  {
    name: "Administrative",
    amount: 55500,
    percent: 7.5,
    color: "bg-warning-500",
    details: [
      "Legal & compliance fees: Rs 22,000",
      "Office supplies & printing: Rs 18,000",
      "Insurance & registrations: Rs 15,500",
    ],
  },
  {
    name: "Emergency Reserve",
    amount: 55500,
    percent: 7.5,
    color: "bg-alert-500",
    details: [
      "Contingency fund for disaster response: Rs 55,500",
      "Held in fixed deposit (SBI A/C: ***7890)",
    ],
  },
];

const FINANCIAL_RECORDS: FinancialRecord[] = [
  { quarter: "Q1 2025", income: 280000, expenses: 245000, surplus: 35000, status: "Audited" },
  { quarter: "Q2 2025", income: 340000, expenses: 310000, surplus: 30000, status: "Audited" },
  { quarter: "Q3 2025", income: 420000, expenses: 385000, surplus: 35000, status: "Audited" },
  { quarter: "Q4 2025", income: 310000, expenses: 295000, surplus: 15000, status: "Audited" },
  { quarter: "Q1 2026", income: 395000, expenses: 370000, surplus: 25000, status: "Audited" },
  { quarter: "Q2 2026", income: 245000, expenses: 210000, surplus: 35000, status: "Pending Audit" },
];

function formatCurrency(val: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(val);
}

export default function FinancialsDashboard() {
  const totalIncome = FINANCIAL_RECORDS.reduce((s, r) => s + r.income, 0);
  const totalExpenses = FINANCIAL_RECORDS.reduce((s, r) => s + r.expenses, 0);
  const totalSurplus = FINANCIAL_RECORDS.reduce((s, r) => s + r.surplus, 0);
  const auditedQuarters = FINANCIAL_RECORDS.filter((r) => r.status === "Audited").length;

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
            <div className="p-2 rounded-xl bg-accent-500/15 text-accent-600">
              <IndianRupee className="w-6 h-6" />
            </div>
            <span className="font-display font-semibold text-primary-700 uppercase tracking-widest text-sm">
              Financial Transparency
            </span>
          </div>
          <h1 className="font-heading font-extrabold text-4xl text-primary-900 leading-tight">
            Open Financial Ledger
          </h1>
          <p className="font-sans text-foreground/80 mt-2 max-w-2xl">
            Every rupee received and spent by YSSF is accounted for below. Our books are independently audited
            quarterly and filed with the Registrar of Societies.
          </p>
        </motion.div>

        {/* Registration & Compliance Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="yssf-card p-6 bg-primary-900 text-white border-primary-400 mb-12"
        >
          <div className="flex items-start gap-4">
            <Shield className="w-8 h-8 text-accent-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-heading font-extrabold text-lg mb-2">Compliance & Registration Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm font-sans">
                <div>
                  <p className="text-primary-200 text-xs font-heading font-semibold uppercase tracking-wider">NGO Registration</p>
                  <p className="text-white font-heading font-bold mt-1">YSSF/2024/WB098</p>
                </div>
                <div>
                  <p className="text-primary-200 text-xs font-heading font-semibold uppercase tracking-wider">PAN Number</p>
                  <p className="text-white font-heading font-bold mt-1">AACY09827B</p>
                </div>
                <div>
                  <p className="text-primary-200 text-xs font-heading font-semibold uppercase tracking-wider">80G Status</p>
                  <p className="text-accent-500 font-heading font-bold mt-1">Tax Exempt Eligible</p>
                </div>
                <div>
                  <p className="text-primary-200 text-xs font-heading font-semibold uppercase tracking-wider">FCRA Status</p>
                  <p className="text-primary-200 font-heading font-bold mt-1">Under Application</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="yssf-card p-6 bg-white border-primary-200/40"
          >
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-primary-900" />
              <span className="font-heading font-semibold text-xs text-primary-900/70">Total Income</span>
            </div>
            <p className="font-heading font-extrabold text-2xl text-primary-900">{formatCurrency(totalIncome)}</p>
            <p className="font-sans text-xs text-foreground/60 mt-1">Across 6 quarters</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="yssf-card p-6 bg-white border-primary-200/40"
          >
            <div className="flex items-center gap-2 mb-3">
              <Wallet className="w-5 h-5 text-accent-600" />
              <span className="font-heading font-semibold text-xs text-primary-900/70">Total Expenses</span>
            </div>
            <p className="font-heading font-extrabold text-2xl text-primary-900">{formatCurrency(totalExpenses)}</p>
            <p className="font-sans text-xs text-foreground/60 mt-1">Fully itemized below</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="yssf-card p-6 bg-white border-primary-200/40"
          >
            <div className="flex items-center gap-2 mb-3">
              <Receipt className="w-5 h-5 text-primary-700" />
              <span className="font-heading font-semibold text-xs text-primary-900/70">Operating Surplus</span>
            </div>
            <p className="font-heading font-extrabold text-2xl text-primary-900">{formatCurrency(totalSurplus)}</p>
            <p className="font-sans text-xs text-foreground/60 mt-1">Reinvested into reserve fund</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="yssf-card p-6 bg-white border-primary-200/40"
          >
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-5 h-5 text-primary-900" />
              <span className="font-heading font-semibold text-xs text-primary-900/70">Quarters Audited</span>
            </div>
            <p className="font-heading font-extrabold text-2xl text-primary-900">{auditedQuarters}/{FINANCIAL_RECORDS.length}</p>
            <p className="font-sans text-xs text-foreground/60 mt-1">Independent CA verification</p>
          </motion.div>
        </div>

        {/* Expense Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="yssf-card p-8 bg-white border-primary-200/40 mb-12"
        >
          <div className="flex items-center gap-2 mb-6">
            <PieChart className="w-5 h-5 text-primary-900" />
            <h2 className="font-heading font-extrabold text-xl text-primary-900">Expense Breakdown (FY 2025-26)</h2>
          </div>

          <div className="space-y-6">
            {EXPENSE_CATEGORIES.map((cat) => (
              <div key={cat.name}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${cat.color}`} />
                    <span className="font-heading font-semibold text-sm text-primary-900">{cat.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-heading font-bold text-sm text-primary-900">{formatCurrency(cat.amount)}</span>
                    <span className="font-sans text-xs text-foreground/60 ml-2">({cat.percent}%)</span>
                  </div>
                </div>
                <div className="w-full h-3 bg-surface-100 rounded-full overflow-hidden border border-primary-200/20 mb-2">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${cat.percent}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full ${cat.color} rounded-full`}
                  />
                </div>
                <ul className="ml-6 space-y-1">
                  {cat.details.map((detail) => (
                    <li key={detail} className="font-sans text-xs text-foreground/65 flex items-start gap-1.5">
                      <span className="text-foreground/30 mt-0.5">&#8226;</span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quarterly Records Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="yssf-card overflow-hidden bg-white border-primary-200/40 mb-12"
        >
          <div className="p-6 border-b border-primary-100 flex items-center justify-between">
            <div>
              <h2 className="font-heading font-extrabold text-xl text-primary-900">Quarterly Financial Summary</h2>
              <p className="font-sans text-xs text-foreground/60 mt-1">All figures in Indian Rupees (INR)</p>
            </div>
            <button className="inline-flex items-center gap-1.5 px-4 py-2 border-2 border-primary-900 text-primary-900 hover:bg-surface-100 font-heading font-semibold text-xs rounded-xl transition-colors">
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-100/30">
                <tr>
                  <th className="text-left px-6 py-3 font-heading font-semibold text-xs text-primary-900/70 uppercase tracking-wider">Quarter</th>
                  <th className="text-right px-6 py-3 font-heading font-semibold text-xs text-primary-900/70 uppercase tracking-wider">Income</th>
                  <th className="text-right px-6 py-3 font-heading font-semibold text-xs text-primary-900/70 uppercase tracking-wider">Expenses</th>
                  <th className="text-right px-6 py-3 font-heading font-semibold text-xs text-primary-900/70 uppercase tracking-wider">Surplus</th>
                  <th className="text-center px-6 py-3 font-heading font-semibold text-xs text-primary-900/70 uppercase tracking-wider">Audit Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-100/50">
                {FINANCIAL_RECORDS.map((record) => (
                  <tr key={record.quarter} className="hover:bg-surface-100/20 transition-colors">
                    <td className="px-6 py-4 font-heading font-bold text-sm text-primary-900">{record.quarter}</td>
                    <td className="px-6 py-4 text-right font-heading font-semibold text-sm text-primary-900">{formatCurrency(record.income)}</td>
                    <td className="px-6 py-4 text-right font-heading font-semibold text-sm text-foreground/80">{formatCurrency(record.expenses)}</td>
                    <td className="px-6 py-4 text-right font-heading font-bold text-sm text-primary-900">{formatCurrency(record.surplus)}</td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-heading font-semibold ${
                          record.status === "Audited"
                            ? "bg-primary-900/10 text-primary-900 border border-primary-900/15"
                            : "bg-warning-500/10 text-warning-500 border border-warning-500/20"
                        }`}
                      >
                        {record.status === "Audited" ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <AlertCircle className="w-3 h-3" />
                        )}
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Downloadable Reports */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="yssf-card p-8 bg-white border-primary-200/40 mb-12"
        >
          <div className="flex items-center gap-2 mb-6">
            <FileText className="w-5 h-5 text-primary-900" />
            <h2 className="font-heading font-extrabold text-xl text-primary-900">Audit Reports & Documents</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "Annual Report FY 2024-25", date: "Apr 15, 2025", size: "2.4 MB" },
              { title: "Quarterly Audit Q1 2026", date: "Apr 30, 2026", size: "1.1 MB" },
              { title: "80G Compliance Certificate", date: "Jan 10, 2026", size: "340 KB" },
              { title: "Trust Registration Document", date: "Mar 15, 2024", size: "890 KB" },
              { title: "Balance Sheet FY 2024-25", date: "Apr 20, 2025", size: "1.8 MB" },
              { title: "Donor Receipt Summary Q4 2025", date: "Jan 05, 2026", size: "620 KB" },
            ].map((doc) => (
              <div
                key={doc.title}
                className="flex items-center gap-3 p-4 rounded-xl border border-primary-200/30 hover:border-primary-400 hover:bg-surface-100/20 transition-all group cursor-pointer"
              >
                <div className="p-2 rounded-lg bg-primary-900/10 text-primary-900 group-hover:bg-primary-900 group-hover:text-white transition-colors">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-heading font-semibold text-xs text-primary-900 truncate">{doc.title}</p>
                  <p className="font-sans text-[10px] text-foreground/50">{doc.date} | {doc.size}</p>
                </div>
                <Download className="w-4 h-4 text-foreground/30 group-hover:text-primary-900 transition-colors" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bank Accounts Disclosure */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="yssf-card p-8 bg-surface-100/30 border-primary-200/40 mb-12"
        >
          <div className="flex items-center gap-2 mb-6">
            <Building2 className="w-5 h-5 text-primary-900" />
            <h2 className="font-heading font-extrabold text-xl text-primary-900">Bank Account Details (Public Disclosure)</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-white rounded-2xl border border-primary-200/30">
              <h3 className="font-heading font-bold text-sm text-primary-900 mb-3">Primary Operations Account</h3>
              <div className="space-y-2 font-sans text-xs text-foreground/70">
                <p><span className="font-heading font-semibold text-primary-900">Bank:</span> State Bank of India (SBI)</p>
                <p><span className="font-heading font-semibold text-primary-900">Branch:</span> Salt Lake Sector V, Kolkata</p>
                <p><span className="font-heading font-semibold text-primary-900">A/C No:</span> 39876543210 (IFSC: SBIN0001234)</p>
                <p><span className="font-heading font-semibold text-primary-900">A/C Holder:</span> Youth Sakti Social Foundation</p>
              </div>
            </div>
            <div className="p-5 bg-white rounded-2xl border border-primary-200/30">
              <h3 className="font-heading font-bold text-sm text-primary-900 mb-3">Emergency Reserve Fund</h3>
              <div className="space-y-2 font-sans text-xs text-foreground/70">
                <p><span className="font-heading font-semibold text-primary-900">Bank:</span> Punjab National Bank (PNB)</p>
                <p><span className="font-heading font-semibold text-primary-900">Branch:</span> Park Street, Kolkata</p>
                <p><span className="font-heading font-semibold text-primary-900">A/C No:</span> 56789012345 (IFSC: PUNB0005678)</p>
                <p><span className="font-heading font-semibold text-primary-900">Type:</span> Fixed Deposit (Emergency Contingency)</p>
              </div>
            </div>
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
            href="/#donate"
            className="inline-flex items-center gap-2 px-8 py-4 bg-accent-500 hover:bg-accent-600 text-primary-900 font-heading font-extrabold rounded-2xl transition-all shadow-md shadow-accent-500/25 hover:shadow-lg hover:-translate-y-0.5 border-2 border-primary-900/10"
          >
            Donate With Confidence
            <ArrowUpRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
