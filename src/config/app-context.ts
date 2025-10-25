/*
  Centralized application context for WedSpace
  - Aggregates environment config, routes, feature flags, roles/permissions
  - Provides safe client/server partitioning (no server secrets on client)
  - Single source for SEO defaults, payments/maps config, storage buckets, UI standards

  Usage:
    import { APP_CONTEXT } from "@/config/app-context";
    const { env, routes, flags } = APP_CONTEXT;

  Note:
    - Public values derive from NEXT_PUBLIC_*.
    - Server-only values are only read when not executing in the browser.
*/

/* eslint-disable no-restricted-globals */

export type UserRole = "user" | "vendor" | "venue_owner" | "admin";

export interface EnvPublic {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  GOOGLE_MAPS_API_KEY: string;
  RAZORPAY_KEY_ID: string;
  // Optional: AI provider keys that are allowed client-side if any
}

export interface EnvServer {
  SUPABASE_SERVICE_ROLE?: string; // server only
  RAZORPAY_KEY_SECRET?: string;   // server only
  RAZORPAY_WEBHOOK_SECRET?: string; // server only
  // Optional AI keys (server-only)
}

export interface RoutesRegistry {
  // Public site
  home: string;
  venues: string;
  venueDetail: (id: string) => string;
  vendors: string;
  vendorDetail: (id: string) => string;
  search: string;
  favorites: string;
  explore: string;
  ideas: string;
  dashboard: string;
  about: string;
  contact: string;
  careers: string;
  press: string;
  privacy: string;
  terms: string;
  cookies: string;

  // Auth
  auth: {
    login: string;
    signup: string;
    forgotPassword: string;
    legacyLogin: string; // redirects
    legacySignup: string; // redirects
  };

  // Business
  vendor: {
    signup: string;
    login: string;
    dashboard: string;
    advertise: string;
    successStories: string;
  };
  venue: {
    signup: string;
    login: string;
    dashboard: string;
    advertise: string;
    successStories: string;
  };

  // Admin
  admin: {
    approvals: string;
    disputes: string;
    settings: string;
  };
}

export interface FeatureFlags {
  aiAssistant: boolean;
  aiSort: boolean;
  imageStyleMatch: boolean;
  reels: boolean;
  moodboards: boolean;
  negotiations: boolean;
  bookings: boolean;
  paymentsRazorpay: boolean;
  reviewsVerifiedOnly: boolean;
}

export interface SeoDefaults {
  siteName: string;
  siteTagline: string;
  twitterHandle?: string;
  locale: string;
  baseUrl?: string;
  defaultOgImage?: string;
  noindexBusinessAndAdmin: boolean;
}

export interface PaymentsConfig {
  RAZORPAY: {
    KEY_ID: string;
    KEY_SECRET: string;
  };
  provider: "razorpay";
  currency: "INR";
}

export interface MapsConfig {
  apiKey: string; // public
  defaultZoom: number;
}

export interface StorageBuckets {
  publicMedia: string;
  protectedMedia: string;
  reels: string;
}

export interface RolePermissions {
  canView: (role: UserRole, area: "public" | "vendor" | "venue" | "admin") => boolean;
}

export interface UiStandards {
  theme: {
    primary: string; // tailwind token name
    accent: string;
  };
  spacingScale: number[];
  typography: {
    baseLineHeight: number;
    maxContentWidthClass: string;
  };
  accessibility: {
    minContrastRatio: string;
    motionReducedRespect: boolean;
  };
}

export interface AppContext {
  env: {
    public: EnvPublic;
    server: EnvServer | null; // null on client
  };
  routes: RoutesRegistry;
  flags: FeatureFlags;
  seo: SeoDefaults;
  payments: PaymentsConfig;
  maps: MapsConfig;
  storage: StorageBuckets;
  roles: RolePermissions;
  ui: UiStandards;
}

const isBrowser = typeof window !== "undefined";

function readPublicEnv(): EnvPublic {
  return {
    SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
  };
}

function readServerEnv(): EnvServer | null {
  if (isBrowser) return null; // never expose server secrets to client bundles
  return {
    SUPABASE_SERVICE_ROLE: process.env.SUPABASE_SERVICE_ROLE,
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
    RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET,
  };
}

function buildRoutes(): RoutesRegistry {
  return {
    // Public
    home: "/",
    venues: "/venues",
    venueDetail: (id: string) => `/venues/${id}`,
    vendors: "/vendors",
    vendorDetail: (id: string) => `/vendors/${id}`,
    search: "/search",
    favorites: "/favorites",
    explore: "/explore",
    ideas: "/ideas",
    dashboard: "/dashboard",
    about: "/about",
    contact: "/contact",
    careers: "/careers",
    press: "/press",
    privacy: "/privacy",
    terms: "/terms",
    cookies: "/cookies",

    // Auth
    auth: {
      login: "/auth/login",
      signup: "/auth/signup",
      forgotPassword: "/auth/forgot-password",
      legacyLogin: "/login",
      legacySignup: "/signup",
    },

    // Business
    vendor: {
      signup: "/vendor/signup",
      login: "/vendor/login",
      dashboard: "/vendor/dashboard",
      advertise: "/vendor/advertise",
      successStories: "/vendor/success-stories",
    },
    venue: {
      signup: "/venue/signup",
      login: "/venue/login",
      dashboard: "/venue/dashboard",
      advertise: "/venue/advertise",
      successStories: "/venue/success-stories",
    },

    // Admin
    admin: {
      approvals: "/admin/approvals",
      disputes: "/admin/disputes",
      settings: "/admin/settings",
    },
  };
}

function buildFlags(): FeatureFlags {
  // Toggle via env when needed; defaults are conservative
  return {
    aiAssistant: true,
    aiSort: true,
    imageStyleMatch: false, // enable after embeddings pipeline
    reels: true,
    moodboards: true,
    negotiations: true,
    bookings: true,
    paymentsRazorpay: true,
    reviewsVerifiedOnly: true,
  };
}

function buildSeo(): SeoDefaults {
  return {
    siteName: "WedSpace",
    siteTagline: "Plan beautifully. Book confidently.",
    twitterHandle: "@wedspaceapp",
    locale: "en-IN",
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || undefined,
    defaultOgImage: "/favicon.png",
    noindexBusinessAndAdmin: true,
  };
}

function buildPayments(pub: EnvPublic, server: EnvServer | null): PaymentsConfig {
  return {
    RAZORPAY: {
      KEY_ID: pub.RAZORPAY_KEY_ID,
      KEY_SECRET: server?.RAZORPAY_KEY_SECRET || "",
    },
    provider: "razorpay",
    currency: "INR",
  };
}

function buildMaps(pub: EnvPublic): MapsConfig {
  return {
    apiKey: pub.GOOGLE_MAPS_API_KEY,
    defaultZoom: 12,
  };
}

function buildStorage(): StorageBuckets {
  return {
    publicMedia: "public-media",
    protectedMedia: "protected-media",
    reels: "reels",
  };
}

function buildRolePermissions(): RolePermissions {
  return {
    canView: (role, area) => {
      if (area === "public") return true;
      if (area === "vendor") return role === "vendor" || role === "admin";
      if (area === "venue") return role === "venue_owner" || role === "admin";
      if (area === "admin") return role === "admin";
      return false;
    },
  };
}

function buildUi(): UiStandards {
  return {
    theme: {
      primary: "text-red-600 dark:text-red-400",
      accent: "text-amber-600 dark:text-amber-400",
    },
    spacingScale: [4, 8, 12, 16, 20, 24, 32],
    typography: {
      baseLineHeight: 1.6,
      maxContentWidthClass: "max-w-3xl",
    },
    accessibility: {
      minContrastRatio: "4.5:1",
      motionReducedRespect: true,
    },
  };
}

function buildAppContext(): AppContext {
  const pub = readPublicEnv();
  const server = readServerEnv();
  return {
    env: {
      public: pub,
      server,
    },
    routes: buildRoutes(),
    flags: buildFlags(),
    seo: buildSeo(),
    payments: buildPayments(pub, server),
    maps: buildMaps(pub),
    storage: buildStorage(),
    roles: buildRolePermissions(),
    ui: buildUi(),
  };
}

export const APP_CONTEXT: AppContext = buildAppContext();

// Helper: list of public pages for route health checks
export const PUBLIC_ROUTE_SNAPSHOT: string[] = [
  "/",
  "/venues",
  "/vendors",
  "/search",
  "/favorites",
  "/explore",
  "/ideas",
  "/dashboard",
  "/about",
  "/contact",
  "/careers",
  "/press",
  "/privacy",
  "/terms",
  "/cookies",
  "/auth/login",
  "/auth/signup",
  "/auth/forgot-password",
];
