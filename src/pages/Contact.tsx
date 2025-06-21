
import { Mail, Instagram, Phone, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-amber-50 to-pink-100 py-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Logo */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Logo size="xl" />
          </div>
        </div>

        {/* Contact Card */}
        <Card className="p-8 rounded-3xl bg-white/80 backdrop-blur-md shadow-2xl border-0 hover:shadow-3xl transition-all duration-500">
          <div className="text-center">
            <h2 className="font-playfair text-3xl font-bold text-rose-600 mb-6">
              Contact Us
            </h2>
            
            <p className="text-amber-600 text-lg mb-8 leading-relaxed">
              We'd love to hear from you! For any inquiries, partnership opportunities, 
              or just to say hello, please reach out to us through the following channels:
            </p>

            <div className="space-y-4 mb-8">
              {/* Email */}
              <div className="group">
                <div className="flex items-center justify-center p-4 bg-gradient-to-r from-rose-100 to-pink-100 rounded-2xl hover:from-rose-200 hover:to-pink-200 transition-all duration-300 cursor-pointer">
                  <Mail className="w-6 h-6 text-rose-600 mr-3 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-rose-700 font-medium">wedspaceindia@gmail.com</span>
                </div>
              </div>

              {/* Instagram */}
              <div className="group">
                <div className="flex items-center justify-center p-4 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-2xl hover:from-amber-200 hover:to-yellow-200 transition-all duration-300 cursor-pointer">
                  <Instagram className="w-6 h-6 text-amber-600 mr-3 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-amber-700 font-medium">@wedspace.in on Instagram</span>
                </div>
              </div>

              {/* Phone */}
              <div className="group">
                <div className="flex items-center justify-center p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl hover:from-green-200 hover:to-emerald-200 transition-all duration-300 cursor-pointer">
                  <Phone className="w-6 h-6 text-green-600 mr-3 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-green-700 font-medium">+91 93055 94735</span>
                </div>
              </div>
            </div>

            {/* Back to Home Button */}
            <Link to="/">
              <Button className="group bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:from-rose-600 hover:via-pink-600 hover:to-amber-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                Back to Home
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Contact;
