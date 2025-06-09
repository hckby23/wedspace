import React from 'react';
import { MapPin, Package, Users, CalendarCheck, Lightbulb, Search } from 'lucide-react';
import Logo from '@/components/Logo';

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => {
  return (
    <div className="bg-card p-6 rounded-lg shadow-lg flex flex-col items-center text-center">
      <div className="bg-primary/10 p-3 rounded-full mb-4">
        <Icon className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-xl font-display font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-text-secondary text-sm leading-relaxed">{description}</p>
    </div>
  );
};

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Search, // Using Search as MapPin might be too specific if we broaden search later
      title: 'Discover Your Dream Venue',
      description: 'Easily search, compare, and shortlist from thousands of verified wedding venues. Filter by location, capacity, budget, and amenities.',
    },
    {
      icon: Users, // Users or Package are good fits
      title: 'Tailored Vendor Packages',
      description: 'Connect with top-rated photographers, caterers, decorators, and more. Get customized quotes and build your perfect vendor team.',
    },
    {
      icon: CalendarCheck,
      title: 'Stress-Free Planning Tools',
      description: 'Manage guest lists, track budgets, and collaborate seamlessly. WedSpace makes wedding planning intuitive and joyful.',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-text-primary text-center mb-12 md:mb-16">
          Why <Logo as="span" className="text-3xl md:text-4xl" />?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} icon={feature.icon} title={feature.title} description={feature.description} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
