
import Logo from '@/components/Logo';

const HeroSection = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 via-amber-50 to-orange-50 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="/indian-wedding.jpg" 
          alt="Indian Wedding Ceremony" 
          className="w-full h-full object-cover opacity-95"
        />
        
      </div>

      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-rose-300 to-pink-300 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-24 h-24 bg-gradient-to-br from-amber-300 to-orange-300 rounded-full blur-lg animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-20 w-40 h-40 bg-gradient-to-br from-pink-300 to-rose-300 rounded-full blur-2xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-32 w-28 h-28 bg-gradient-to-br from-orange-300 to-amber-300 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-2xl mx-auto bg-white/30 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
          {/* Logo */}
          <div className="flex justify-center items-center mb-8">
            <Logo size="xl" />
          </div>
          
          {/* Main Heading with Gradient Text */}
          <h1 className="font-playfair text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            <span className="block bg-gradient-to-r from-rose-600 via-pink-500 to-amber-500 bg-clip-text text-transparent">
              Big Dreams.
            </span>
            <span className="block bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">
              Beautiful Venues.
            </span>
            <span className="block bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 bg-clip-text text-transparent">
              Zero Stress.
            </span>
          </h1>
          
          {/* Subheading */}
          <p className="font-inter text-xl md:text-2xl text-gray-800 mb-8 max-w-2xl mx-auto leading-relaxed font-semibold">
            Plan Your Perfect Indian Wedding – All in One Place
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
