
import React, { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface VendorFiltersProps {
  onFilterChange: (filters: any) => void;
}

const VendorFilters: React.FC<VendorFiltersProps> = ({ onFilterChange }) => {
  const [location, setLocation] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const vendorCategories = [
    'Photography',
    'Videography',
    'Florist',
    'Catering',
    'Music & DJs',
    'Wedding Planners',
    'Cakes & Desserts',
    'Hair & Makeup',
    'Transportation',
    'Officiants',
    'Decor & Rentals'
  ];

  const handleCategoryChange = (category: string, isChecked: boolean) => {
    setSelectedCategories(prev => {
      if (isChecked) {
        return [...prev, category];
      } else {
        return prev.filter(cat => cat !== category);
      }
    });
  };

  const handleApplyFilters = () => {
    onFilterChange({
      categories: selectedCategories.length > 0 ? selectedCategories : null,
      location: location ? location : null
    });
  };

  const handleResetFilters = () => {
    setLocation('');
    setSelectedCategories([]);
    onFilterChange({});
  };

  return (
    <div className="bg-white rounded-lg border p-5 sticky top-24">
      <h3 className="font-playfair font-semibold text-xl mb-6">Filters</h3>

      <Accordion type="multiple" defaultValue={['location', 'category']} className="space-y-4">
        <AccordionItem value="location" className="border-b-0">
          <AccordionTrigger className="py-2 hover:no-underline">
            <span className="font-medium">Location</span>
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <Input 
              placeholder="City, State or Zip Code"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-2"
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="category" className="border-b-0">
          <AccordionTrigger className="py-2 hover:no-underline">
            <span className="font-medium">Vendor Category</span>
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="flex flex-col gap-2 mt-2">
              {vendorCategories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`category-${category}`}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={(checked) => 
                      handleCategoryChange(category, checked === true)
                    }
                  />
                  <Label 
                    htmlFor={`category-${category}`}
                    className="text-sm cursor-pointer"
                  >
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="pt-6 flex flex-col gap-3">
        <Button 
          onClick={handleApplyFilters} 
          className="w-full bg-space hover:bg-space/90"
        >
          Apply Filters
        </Button>
        <Button
          onClick={handleResetFilters}
          variant="outline"
          className="w-full"
        >
          Reset Filters
        </Button>
      </div>
    </div>
  );
};

export default VendorFilters;
