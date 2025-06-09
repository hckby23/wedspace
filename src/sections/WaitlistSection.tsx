import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import Logo from '@/components/Logo';

const WaitlistSection: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email) {
      console.log('Waitlist email submitted:', email);
      // Here you would typically send the email to your backend or a service like Mailchimp
      alert(`Thank you! We'll notify ${email} when wedspace launches.`);
      setEmail(''); // Clear the input after submission
    } else {
      alert('Please enter a valid email address.');
    }
  };

  return (
    <section id="waitlist-section" className="py-16 md:py-24 bg-gradient-to-br from-accent/30 via-background to-background">
      <div className="container mx-auto px-4 text-center">
        <Mail className="h-12 w-12 text-primary mx-auto mb-6" />
        <h2 className="text-3xl md:text-4xl font-display font-bold text-text-primary mb-4">
          Don't Miss Out! <span className="text-primary">Join Our Waitlist</span>
        </h2>
        <p className="text-text-secondary md:text-lg max-w-2xl mx-auto mb-8">
          Be the first to experience wedspace and get exclusive early access perks when we launch. We're working hard to bring you the future of wedding planning!
        </p>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-4 items-center">
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-grow text-base"
            required
          />
          <Button type="submit" size="lg" className="w-full sm:w-auto">
            Notify Me
          </Button>
        </form>
      </div>
    </section>
  );
};

export default WaitlistSection;
