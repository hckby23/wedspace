import React from 'react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo'; // Shadcn UI Button
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {

  // Placeholder for animated background logic
  // const scenes = ['scene1.jpg', 'scene2.jpg', 'scene3.jpg'];
  // const [currentScene, setCurrentScene] = useState(0);
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrentScene((prev) => (prev + 1) % scenes.length);
  //   }, 5000); // Change scene every 5 seconds
  //   return () => clearInterval(interval);
  // }, [scenes.length]);

  return (
    <section 
      className="relative min-h-screen flex flex-col items-center justify-center text-center p-4 pt-20 md:pt-24 bg-gradient-to-br from-hero-gradient-from via-hero-gradient-to to-background"
      // style={{ backgroundImage: `url(${scenes[currentScene]})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {/* Placeholder for animated elements like floating marigolds, fairy lights */}
      <div className="absolute inset-0 bg-black/5 z-0"></div> {/* Optional subtle overlay if needed for text contrast */}
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="mb-16 text-center">
          <Logo className="text-6xl sm:text-7xl md:text-8xl" />
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-text-primary mb-6 leading-tight">
          🎉 Big Dreams. <span className="text-primary">Beautiful Venues.</span> Zero Stress.
          Plan Your Perfect <span className="text-secondary">Indian Wedding</span> – All in One Place
        </h1>
        <p className="text-lg md:text-xl text-text-secondary mb-10 max-w-2xl mx-auto">
          Compare Venues, Customize Vendor Packages, Book Seamlessly – WedSpace is almost here!
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-6 border-primary text-primary hover:bg-primary/10 hover:text-primary">
            <Link to="/contact">
              📞 Vendor? Partner With Us
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-6 border-secondary text-secondary hover:bg-secondary/10 hover:text-secondary">
            <Link to="/contact">
              🏠 List Your Venue
            </Link>
          </Button>
        </div>
      </div>

      {/* Placeholder for subtle animation elements */}
      {/* e.g., <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-background to-transparent z-0"></div> */}
    </section>
  );
};

export default HeroSection;
