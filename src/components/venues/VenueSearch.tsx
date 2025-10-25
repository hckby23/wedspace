"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

// Form validation schema
const searchSchema = z.object({
  location: z.string().min(2, 'Please enter a valid location'),
  date: z.string().optional(),
  guests: z.string().transform(val => (val ? parseInt(val, 10) : undefined)).optional(),
});

type SearchFormData = z.infer<typeof searchSchema>;

interface VenueSearchProps {
  className?: string;
  variant?: 'hero' | 'compact';
}

const VenueSearch: React.FC<VenueSearchProps> = ({ 
  className = '', 
  variant = 'hero' 
}) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      location: '',
      date: '',
      guests: undefined,
    },
  });
  
  const onSubmit = (data: SearchFormData) => {
    setIsSubmitting(true);
    
    // Build query params
    const params = new URLSearchParams();
    if (data.location) params.append('location', data.location);
    if (data.date) params.append('date', data.date);
    if (data.guests) params.append('guests', data.guests.toString());
    
    // Navigate to venues list with search params
    router.push(`/venues?${params.toString()}`);
    
    setIsSubmitting(false);
  };
  
  // Styles based on variant
  const containerClass = variant === 'hero' 
    ? 'bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 md:p-8'
    : 'bg-white rounded-md shadow p-4';
    
  const headingClass = variant === 'hero'
    ? 'text-2xl font-bold mb-4 text-center'
    : 'text-lg font-semibold mb-3';
    
  const inputClass = variant === 'hero'
    ? 'w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
    : 'w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500';
    
  const buttonClass = variant === 'hero'
    ? 'w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
    : 'w-full bg-indigo-600 text-white py-2 px-3 text-sm rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  return (
    <div className={`${containerClass} ${className}`}>
      {variant === 'hero' && (
        <h2 className={headingClass}>Find Your Perfect Wedding Venue</h2>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              id="location"
              type="text"
              {...register('location')}
              className={inputClass}
              placeholder="City, State"
            />
            {errors.location && (
              <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Wedding Date
            </label>
            <input
              id="date"
              type="date"
              {...register('date')}
              className={inputClass}
            />
          </div>
          
          <div>
            <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">
              Number of Guests
            </label>
            <input
              id="guests"
              type="number"
              min="1"
              {...register('guests')}
              className={inputClass}
              placeholder="Estimated guest count"
            />
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className={buttonClass}
        >
          {isSubmitting ? 'Searching...' : 'Search Venues'}
        </button>
      </form>
    </div>
  );
};

export default VenueSearch;
