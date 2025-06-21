
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles } from 'lucide-react';
import Logo from '@/components/Logo';

const JoinFamilySection = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      alert('Please enter a valid email address.');
      return;
    }
    const { error } = await supabase.from('emails').insert([{ email }]);
    if (error) {
      alert('There was an error submitting your email.');
    } else {
      alert('Thank you for joining! You will be notified when we launch.');
      setEmail('');
    }
  };

  return (
    <div className="py-20 px-4 bg-gradient-to-br from-amber-50 via-rose-50 to-pink-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 hidden sm:block">
        <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-rose-400 to-pink-400 rounded-3xl rotate-12 animate-pulse"></div>
        <div className="absolute top-32 right-16 w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-400 rounded-2xl -rotate-12 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-32 w-24 h-24 bg-gradient-to-br from-pink-400 to-rose-400 rounded-full animate-pulse delay-2000"></div>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Decorative Elements */}
        <div className="flex justify-center space-x-8 mb-8 hidden sm:flex">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-200 to-pink-300 flex items-center justify-center hover:scale-110 transition-transform duration-300 cursor-pointer shadow-lg">
            <Sparkles className="w-8 h-8 text-rose-600 animate-pulse" />
          </div>
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-200 to-orange-300 flex items-center justify-center hover:scale-110 transition-transform duration-300 cursor-pointer shadow-lg">
            <Sparkles className="w-10 h-10 text-amber-600 animate-pulse delay-300" />
          </div>
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-200 to-rose-300 flex items-center justify-center hover:scale-110 transition-transform duration-300 cursor-pointer shadow-lg">
            <Sparkles className="w-8 h-8 text-pink-600 animate-pulse delay-700" />
          </div>
        </div>

        {/* Heading */}
        {/* Mobile: "Join wedspace"; Desktop: "Join the [Logo] Family" */}
        <h2 className="font-playfair font-bold mb-6 flex flex-col items-center justify-center gap-2 sm:gap-4">
          {/* Mobile only: Stack 'Join' above 'wedspace' */}
          <span className="block sm:hidden text-3xl leading-tight flex flex-col items-center">
            <span>Join</span>
            <span className="align-middle inline-block mt-1"><Logo size="md" className="inline-block align-middle" /></span>
          </span>
          {/* Desktop and up */}
          <span className="hidden sm:flex items-center gap-4 text-4xl md:text-5xl">
            <span className="text-gray-800">Join the</span>
            <Logo size="lg" />
            <span className="text-gray-800">Family</span>
          </span>
        </h2>

        {/* Description */}
        <p className="font-inter text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
          Be the first to experience the magic when we launch and get exclusive early access
        </p>

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-6">
          <div className="flex flex-col space-y-4">
            <div className="relative group">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 px-6 text-lg border-0 rounded-3xl bg-white/80 backdrop-blur-sm shadow-lg focus:shadow-xl transition-all duration-300 placeholder:text-gray-500 group-hover:bg-white/90"
                required
              />
              <Sparkles className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-500 group-hover:rotate-12 transition-transform duration-300" />
            </div>
            
            <Button 
              type="submit"
              className="h-14 text-lg font-semibold rounded-3xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:from-rose-600 hover:via-pink-600 hover:to-amber-600 text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-0"
            >
              ✨ Notify Me When We Launch ✨
            </Button>
          </div>
        </form>

        {/* Stats */}
        <p className="font-inter text-sm font-medium text-amber-700 flex items-center justify-center">
          <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
          Join 10,000+ couples already on our waitlist!
        </p>
      </div>
    </div>
  );
};

export default JoinFamilySection;
