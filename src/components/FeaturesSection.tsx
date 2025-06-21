
import { MapPin, Users, Calendar, Handshake, Building } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';

const FeaturesSection = () => {
  const features = [
    {
      icon: MapPin,
      title: "Discover Dream Venues",
      description: "Search, compare & shortlist from thousands of verified venues across India with ease.",
      color: "rose",
      bgGradient: "from-rose-100 to-pink-200",
      iconColor: "text-rose-600",
      titleColor: "text-rose-700"
    },
    {
      icon: Users,
      title: "Tailored Vendor Packages",
      description: "Connect with photographers, caterers, decorators & more—get customized quotes instantly.",
      color: "amber",
      bgGradient: "from-amber-100 to-yellow-200",
      iconColor: "text-amber-600",
      titleColor: "text-amber-700"
    },
    {
      icon: Calendar,
      title: "Stress-Free Planning",
      description: "Guest lists, budget trackers & collaboration—all your wedding planning in one place.",
      color: "pink",
      bgGradient: "from-pink-100 to-rose-200",
      iconColor: "text-pink-600",
      titleColor: "text-pink-700"
    }
  ];

  const partnerSections = [
    {
      icon: Handshake,
      title: "Vendor Partners",
      description: "Join our network of trusted wedding vendors and grow your business.",
      buttonText: "Partner With Us",
      bgGradient: "from-white to-rose-50",
      buttonGradient: "from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700"
    },
    {
      icon: Building,
      title: "Venue Owners",
      description: "Showcase your venue to couples planning their dream wedding.",
      buttonText: "List Your Venue",
      bgGradient: "from-amber-50 to-orange-100",
      buttonGradient: "from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
    }
  ];

  return (
    <div className="py-20 px-4 bg-gradient-to-br from-pink-50 via-rose-50 to-amber-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-br from-rose-300 to-pink-300 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-amber-300 to-orange-300 rounded-full blur-xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Main Features */}
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6 flex items-center justify-center gap-4">
            <span className="text-gray-800">Why Couples Choose</span>
            <Logo size="lg" />
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-rose-500 to-amber-500 mx-auto mb-12 rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <Card key={index} className={`w-full max-w-xs mx-auto p-8 rounded-3xl bg-gradient-to-br ${feature.bgGradient} border-0 hover:shadow-2xl transition-all duration-500 transform hover:scale-105 cursor-pointer group`}>
              <div className={`w-16 h-16 bg-gradient-to-br ${feature.bgGradient} rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:rotate-6 transition-transform duration-300`}>
                <feature.icon className={`w-8 h-8 ${feature.iconColor} group-hover:scale-110 transition-transform duration-300`} />
              </div>
              <h3 className={`font-playfair text-2xl font-bold ${feature.titleColor} mb-4 text-center`}>
                {feature.title}
              </h3>
              <p className="font-inter text-gray-600 text-center leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>

        {/* Partner Sections */}
        <div className="grid md:grid-cols-2 gap-8">
          {partnerSections.map((section, index) => (
            <Card key={index} className={`p-8 rounded-3xl bg-gradient-to-br ${section.bgGradient} border-0 hover:shadow-2xl transition-all duration-500 transform hover:scale-105 group`}>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/50 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:rotate-6 transition-transform duration-300">
                  <section.icon className="w-8 h-8 text-gray-600 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="font-playfair text-2xl font-bold text-gray-700 mb-4">
                  {section.title}
                </h3>
                <p className="font-inter text-gray-600 mb-6 leading-relaxed">
                  {section.description}
                </p>
                <Link to="/contact">
                  <Button className={`px-8 py-3 bg-gradient-to-r ${section.buttonGradient} text-white font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-0`}>
                    {section.buttonText}
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
