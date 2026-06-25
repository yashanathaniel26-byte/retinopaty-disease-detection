"use client";

import { motion } from "motion/react";
import { WobbleCard } from "@/components/ui/wobble-card";

const featureCards = [
  {
    title: "Screening cepat",
    description:
      "Unggah citra retina dan dapatkan ringkasan risiko dengan waktu respons singkat.",
    Icon: RetinaScanIcon,
  },
  {
    title: "Metode transparan",
    description:
      "Skor probabilitas dan catatan klinis diringkas agar mudah dipahami tim medis.",
    Icon: SignalTraceIcon,
  },
  {
    title: "Privasi terjaga",
    description:
      "Data pasien diproses secara lokal dan hanya hasil agregat yang ditampilkan.",
    Icon: SecureShieldIcon,
  },
];

function RetinaScanIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6Z" />
      <path d="M9.25 11.25c1.8-1.8 3.7-1.8 5.5 0" />
      <path d="M8 14.5c2.7-2.7 5.3-2.7 8 0" />
      <circle cx="12" cy="12" r="2.25" />
    </svg>
  );
}

function SignalTraceIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 12h4l2.5-4 3.5 8 2.5-4H21" />
      <path d="M4 5h16" />
      <path d="M4 19h16" />
    </svg>
  );
}

function SecureShieldIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 4.5 18.5 7v5.2c0 4.1-2.8 7.2-6.5 8.3-3.7-1.1-6.5-4.2-6.5-8.3V7L12 4.5Z" />
      <path d="m9.5 12.3 1.9 1.9 3.6-3.6" />
    </svg>
  );
}

export default function FeatureWobbleCards() {
  return (
    <motion.div
      className="grid gap-4 sm:gap-6 sm:grid-cols-2 md:grid-cols-3"
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.12,
          },
        },
      }}
    >
      {featureCards.map(({ title, description, Icon }) => (
        <motion.div
          key={title}
          className="h-full"
          variants={{
            hidden: { opacity: 0, y: 14 },
            show: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.45, ease: "easeOut" },
            },
          }}
        >
          <WobbleCard
            containerClassName="min-h-[200px] h-full sm:min-h-[240px]"
            className="flex h-full flex-col px-5 py-8 sm:px-6 sm:py-10"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-slate-900 sm:mt-6 sm:text-lg">
              {title}
            </h3>
            <p className="mt-2 text-sm text-slate-600">{description}</p>
          </WobbleCard>
        </motion.div>
      ))}
    </motion.div>
  );
}
