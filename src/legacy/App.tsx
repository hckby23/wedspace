import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { ThemeProvider } from './components/shared/ThemeProvider';

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import VenuesList from "./pages/VenuesList";
import VenueDetail from "./pages/VenueDetail";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Search from "./pages/Search";
import VendorsList from "./pages/vendors/VendorsList";
import VendorDetail from "./pages/vendors/VendorDetail";
import VendorSignup from "./pages/vendors/VendorSignup";
import VendorLogin from "./pages/vendors/VendorLogin";
import VendorDashboard from "./pages/vendors/VendorDashboard";
import SuccessStories from "./pages/vendors/SuccessStories";
import Advertise from "./pages/vendors/Advertise";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Checklist from "./pages/tools/Checklist";
import Budget from "./pages/tools/Budget";
import GuestList from "./pages/tools/GuestList";
import Timeline from "./pages/tools/Timeline";
import Explore from "./pages/Explore";
import Community from "./pages/Community";
import RealWeddings from "./pages/RealWeddings";
import WeddingIdeas from "./pages/WeddingIdeas";
import Careers from "./pages/Careers";
import Press from "./pages/Press";
import Terms from "./pages/legal/Terms";
import Privacy from "./pages/legal/Privacy";
import Cookies from "./pages/legal/Cookies";
import VenueLogin from "./pages/venues/VenueLogin";
import VenueSignup from "./pages/venues/VenueSignup";
import VenueDashboard from "./pages/venues/VenueDashboard";
import VenueSuccessStories from "./pages/venues/VenueSuccessStories";
import VenueAdvertise from "./pages/venues/VenueAdvertise";
import VendorVenueSignup from "./pages/vendor-venue/VendorVenueSignup";
import VendorVenueLogin from "./pages/vendor-venue/VendorVenueLogin";
import Favorites from "./pages/Favorites";
import PlanningPage from "./pages/Planning";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Analytics />
        <SpeedInsights />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/search" element={<Search />} />
            <Route path="/venues" element={<VenuesList />} />
            <Route path="/venues/:id" element={<VenueDetail />} />
            <Route path="/vendors" element={<VendorsList />} />
            <Route path="/vendors/:id" element={<VendorDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/tools/checklist" element={<Checklist />} />
            <Route path="/tools/budget" element={<Budget />} />
            <Route path="/tools/guests" element={<GuestList />} />
            <Route path="/tools/timeline" element={<Timeline />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/community" element={<Community />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/planning" element={<PlanningPage />} />
            
            {/* Discover Section */}
            <Route path="/real-weddings" element={<RealWeddings />} />
            <Route path="/ideas" element={<WeddingIdeas />} />
            
            {/* Vendor Section */}
            <Route path="/vendor/signup" element={<VendorSignup />} />
            <Route path="/vendor/login" element={<VendorLogin />} />
            <Route path="/vendor/dashboard" element={<VendorDashboard />} />
            <Route path="/vendor/success-stories" element={<SuccessStories />} />
            <Route path="/vendor/advertise" element={<Advertise />} />
            
            {/* Venue Section */}
            <Route path="/venue/signup" element={<VenueSignup />} />
            <Route path="/venue/login" element={<VenueLogin />} />
            <Route path="/venue/dashboard" element={<VenueDashboard />} />
            <Route path="/venue/success-stories" element={<VenueSuccessStories />} />
            <Route path="/venue/advertise" element={<VenueAdvertise />} />
            
            {/* Vendor/Venue Combined Section */}
            <Route path="/vendor-venue/signup" element={<VendorVenueSignup />} />
            <Route path="/vendor-venue/login" element={<VendorVenueLogin />} />
            
            {/* Company Section */}
            <Route path="/careers" element={<Careers />} />
            <Route path="/press" element={<Press />} />
            
            {/* Legal Pages */}
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/cookies" element={<Cookies />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
