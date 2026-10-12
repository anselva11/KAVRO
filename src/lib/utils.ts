import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string | Date): string {
  const date = typeof dateString === "string" ? new Date(dateString) : dateString;
  if (isNaN(date.getTime())) return "Invalid date";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatDateTime(dateString: string | Date): string {
  const date = typeof dateString === "string" ? new Date(dateString) : dateString;
  if (isNaN(date.getTime())) return "Invalid date";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

export function estimateTokens(text: string): number {
  if (!text) return 0;
  // Approximation: average English word is 4 chars or ~1.3 tokens
  return Math.ceil(text.length / 3.8);
}

export function estimateCost(inputTokens: number, outputTokens: number, model: string = "gpt-4o-mini"): number {
  // Conservative baseline rates per 1k tokens:
  // Input: $0.00015 / 1k ($0.00000015/tok)
  // Output: $0.00060 / 1k ($0.00000060/tok)
  const inputRate = 0.00015 / 1000;
  const outputRate = 0.00060 / 1000;
  return Number((inputTokens * inputRate + outputTokens * outputRate).toFixed(6));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
