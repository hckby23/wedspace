import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import { Mail, Instagram, ArrowLeft, Phone } from 'lucide-react';

const ContactPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="absolute top-8 left-8">
        <Logo className="text-4xl" />
      </div>
      <div className="bg-card p-8 md:p-12 rounded-lg shadow-xl max-w-lg w-full text-center">
        <h1 className="text-4xl font-display font-bold text-text-primary mb-8">
          Contact Us
        </h1>
        <p className="text-text-secondary md:text-lg mb-8">
          We'd love to hear from you! For any inquiries, partnership opportunities, or just to say hello, please reach out to us through the following channels:
        </p>
        
        <div className="space-y-6 mb-10">
          <a 
            href="mailto:wedspaceindia@gmail.com" 
            className="flex items-center justify-center p-4 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors duration-300 text-lg"
          >
            <Mail className="h-6 w-6 mr-3" />
            <span>wedspaceindia@gmail.com</span>
          </a>
          <a 
            href="https://www.instagram.com/wedspace.in" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center justify-center p-4 bg-secondary/10 text-secondary rounded-lg hover:bg-secondary/20 transition-colors duration-300 text-lg"
          >
            <Instagram className="h-6 w-6 mr-3" />
            <span>@wedspace.in on Instagram</span>
          </a>
          <a 
            href="tel:+919305594735" 
            className="flex items-center justify-center p-4 bg-green-500/10 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-500/20 transition-colors duration-300 text-lg"
          >
            <Phone className="h-6 w-6 mr-3" />
            <span>+91 93055 94735</span>
          </a>
        </div>

        <Button asChild variant="outline" size="lg">
          <Link to="/">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
        </Button>
      </div>
      <p className="text-text-secondary text-sm mt-12">
        &copy; {new Date().getFullYear()} WedSpace. All rights reserved.
      </p>
    </div>
  );
};

export default ContactPage;
