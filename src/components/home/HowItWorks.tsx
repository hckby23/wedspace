
import React from 'react';
import { Check } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Find Your Perfect Venue',
    description: 'Browse hundreds of stunning venues filtered by style, location, and budget.',
    features: ['Compare multiple venues at once', 'View high-quality photos', 'Check real-time availability'],
    iconBg: 'bg-soft-pink'
  },
  {
    number: '02',
    title: 'Book Top-Rated Vendors',
    description: 'Discover photographers, caterers, florists, and more for your special day.',
    features: ['Read verified reviews', 'Message vendors directly', 'Compare quotes and services'],
    iconBg: 'bg-soft-peach'
  },
  {
    number: '03',
    title: 'Plan With Ease',
    description: 'Stay organized with our suite of intuitive planning tools.',
    features: ['Track your budget', 'Manage your guest list', 'Follow a personalized checklist'],
    iconBg: 'bg-soft-gray'
  }
];

const HowItWorks: React.FC = () => {
  return (
    <div className="py-16">
      <div className="container-custom">
        <div className="mb-12 text-center">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-3">
            How <span className="text-wed">wed</span><span className="text-space">space</span> Works
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Planning your wedding has never been easier with our seamless process
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6 relative">
              <div className={`${step.iconBg} w-12 h-12 rounded-full flex items-center justify-center mb-6`}>
                <span className="font-playfair font-bold text-lg">{step.number}</span>
              </div>
              <h3 className="font-playfair text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-gray-600 mb-5">{step.description}</p>
              <ul className="space-y-2">
                {step.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <Check className="text-wed mr-2 flex-shrink-0" size={18} />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
