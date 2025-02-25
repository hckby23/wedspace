import Link from 'next/link';
import { Building2, Users, Heart, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1e293b] py-16 px-4 border-t border-[rgba(255,255,255,0.05)]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* About Section */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4">About WedSpace</h3>
          <p className="text-gray-400 mb-4">
            Your one-stop destination for finding the perfect wedding venues and vendors. 
            We make wedding planning easier by connecting you with the best professionals 
            in the industry.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-3xl font-bold flex items-center">
              <span className="text-[#ff6b6b]">wed</span>
              <span className="text-[#ffd93d]">space</span>
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Quick Links</h3>
          <div className="space-y-3">
            <Link 
              href="/venues" 
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <Building2 className="w-4 h-4" />
              <span>Find Venues</span>
            </Link>
            <Link 
              href="/vendors" 
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <Users className="w-4 h-4" />
              <span>Browse Vendors</span>
            </Link>
            <Link 
              href="/about" 
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <Heart className="w-4 h-4" />
              <span>About Us</span>
            </Link>
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Contact Us</h3>
          <div className="space-y-3">
            <a 
              href="mailto:adityarn37@gmail.com"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>adityarn37@gmail.com</span>
            </a>
            <a 
              href="tel:+919599441448"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>+91 9599441448</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-[rgba(255,255,255,0.05)]">
        <div className="text-center text-gray-400">
          <p>&#169; 2025 WedSpace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}