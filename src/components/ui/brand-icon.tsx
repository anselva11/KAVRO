import React from "react";

export function BrandIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="7" fill="#111827" stroke="#1F2937" strokeWidth="1.5" />
      <path
        d="M9 8V24M9 16L18 8M13.5 13.5L23 24"
        stroke="#4F46E5"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="23" cy="8" r="2" fill="#6366F1" />
    </svg>
  );
}
