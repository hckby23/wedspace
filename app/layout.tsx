"use client";

import { Analytics } from "@vercel/analytics/react";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import Footer from "@/components/footer";
import Link from "next/link";
import { Building2, Search, ShoppingCart, User, Users } from "lucide-react";
import { CartProvider } from "@/context/cart-context";
import { Toaster } from "sonner";
import { useCart } from "@/context/cart-context";
import { useState } from "react";
import { LoginModal } from "@/components/login-modal";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

function Header() {
  const { state: { items } } = useCart();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#1e293b] border-b border-gray-700 h-16 md:h-24">
      <div className="container mx-auto h-full px-4">
        <div className="flex items-center h-full">
          {/* Left Section */}
          <div className="flex items-center gap-2">
            <Sidebar />
            {/* Logo */}
            <Link href="/" className="text-3xl md:text-5xl font-bold flex items-center">
              <span className="text-[#ff6b6b]">wed</span>
              <span className="text-[#ffd93d]">space</span>
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center ml-auto">
            {/* Venues and Vendors */}
            <div className="hidden md:flex items-center gap-5 mr-6">
              <Link href="/venues" className="text-gray-200 hover:text-white transition-colors px-6 py-3 text-lg font-medium rounded-lg hover:bg-[rgba(255,255,255,0.1)] flex items-center gap-3">
                <Building2 className="w-6 h-6" />
                Venues
              </Link>
              <Link href="/vendors" className="text-gray-200 hover:text-white transition-colors px-6 py-3 text-lg font-medium rounded-lg hover:bg-[rgba(255,255,255,0.1)] flex items-center gap-3">
                <Users className="w-6 h-6" />
                Vendors
              </Link>
            </div>

            {/* Icons */}
            <div className="flex items-center gap-4">
              <Link 
                href="/search" 
                className="hidden md:block text-gray-200 hover:text-white transition-colors p-3 rounded-lg hover:bg-[rgba(255,255,255,0.1)]"
              >
                <Search className="w-6 h-6" />
              </Link>
              <Link 
                href="/cart" 
                className="text-gray-200 hover:text-white transition-colors p-3 rounded-lg hover:bg-[rgba(255,255,255,0.1)] relative"
              >
                <ShoppingCart className="w-6 h-6" />
                {items.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#ff6b6b] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {items.length}
                  </span>
                )}
              </Link>
              <button 
                onClick={() => setIsLoginOpen(true)}
                className="hidden md:block text-gray-200 hover:text-white transition-colors p-3 rounded-lg hover:bg-[rgba(255,255,255,0.1)]"
              >
                <User className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />
    </header>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-[#0f172a] min-h-screen flex flex-col">
        <CartProvider>
          <Header />
          {/* Main Content */}
          <main className="pt-20 md:pt-28 flex-grow">
            <div className="container mx-auto px-4 md:px-6 lg:px-8">
              {children}
            </div>
          </main>

          {/* Footer */}
          <Footer />
          <Toaster position="top-center" richColors />
          <Analytics />
        </CartProvider>
      </body>
    </html>
  );
}
