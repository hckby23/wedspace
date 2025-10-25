import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface Testimonial {
  quote: string;
  author: string;
  location: string;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "wedspace made planning our destination wedding so much easier. We found our venue and all our vendors through the platform, saving us countless hours.",
    author: "Sarah & Michael",
    location: "Married in Maui, HI",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552"
  },
  {
    quote: "The budget tracker was a lifesaver! It helped us stay on track financially and the checklist made sure we didn't forget any important details.",
    author: "Jessica & David",
    location: "Married in Chicago, IL",
    image: "https://images.unsplash.com/photo-1529636798458-92914bcb2b1e"
  },
  {
    quote: "As someone who was overwhelmed by the planning process, wedspace simplified everything. Their vendor recommendations were spot on for our style and budget.",
    author: "Emma & James",
    location: "Married in Austin, TX",
    image: "https://images.unsplash.com/photo-1511285560929-80b456363681"
  }
];

const Testimonials: React.FC = () => {
  return (
    <div className="py-16 bg-gradient-wedding">
      <div className="container-custom">
        <div className="mb-10 text-center">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-3">
            Love Stories from <span className="text-wed">Happy</span> Couples
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            See how wedspace has helped couples create their perfect wedding day
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-[var(--bg-card)] backdrop-blur border-none shadow-md overflow-hidden text-[var(--text)]">
              <CardContent className="p-6">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.author} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <blockquote className="text-center mb-4">
                  <p className="italic text-[var(--text-muted)]">"{testimonial.quote}"</p>
                </blockquote>
                <div className="text-center">
                  <p className="font-playfair font-semibold">{testimonial.author}</p>
                  <p className="text-[var(--text-muted)] text-sm">{testimonial.location}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
