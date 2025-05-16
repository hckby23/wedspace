
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to check if we're running in a Vercel production environment
export function isVercelProduction() {
  return process.env.VERCEL_ENV === 'production';
}

// Helper function to get the Vercel URL during build and deployment
export function getVercelURL() {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return '';
}
