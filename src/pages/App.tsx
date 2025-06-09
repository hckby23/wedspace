import { Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react'; // Corrected import if it was wrong, ensure it's from @vercel/analytics/react
import HeroSection from '@/sections/HeroSection';
import FeaturesSection from '@/sections/FeaturesSection';
import VendorVenueSection from '@/sections/VendorVenueSection';
import Footer from '@/components/Footer';
import ContactPage from '@/pages/ContactPage'; // Import the new ContactPage

const HomePageLayout: React.FC = () => (
  <div className="flex flex-col min-h-screen bg-background font-body text-text-primary">
    <main className="flex-grow">
      <HeroSection />
      <FeaturesSection />
      <VendorVenueSection />
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePageLayout />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
      <Analytics />
    </>
  );
}

export default App;
