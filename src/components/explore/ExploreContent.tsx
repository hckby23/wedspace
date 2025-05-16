
import React, { useState } from 'react';
import { Heart, Star, MessageSquare, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

// Mock data for explore content
const MOCK_CONTENT = [
  {
    id: '1',
    type: 'venue',
    title: 'Cliffside Ocean View Resort',
    location: 'Malibu, CA',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552',
    user: {
      name: 'Jessica T.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    },
    likes: 245,
    comments: 42,
    description: 'Stunning ocean views make this venue perfect for sunset ceremonies. The architecture blends seamlessly with the natural surroundings.',
    tags: ['Ocean', 'Sunset', 'Luxury'],
  },
  {
    id: '2',
    type: 'inspiration',
    title: 'Modern Minimalist Decor',
    location: 'New York, NY',
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed',
    user: {
      name: 'Design Studio',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    },
    likes: 512,
    comments: 96,
    description: 'Clean lines and a monochromatic color palette create an elegant atmosphere that lets architectural details stand out.',
    tags: ['Modern', 'Minimalist', 'Elegant'],
  },
  {
    id: '3',
    type: 'vendor',
    title: 'Artisan Floral Design',
    location: 'Portland, OR',
    image: 'https://images.unsplash.com/photo-1561128618-5b272a373018',
    user: {
      name: 'Bloom & Petal',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
    },
    likes: 183,
    comments: 27,
    description: 'Sustainable flower arrangements using locally-sourced seasonal blooms. Each creation tells a unique story.',
    tags: ['Flowers', 'Sustainable', 'Artisan'],
  },
  {
    id: '4',
    type: 'inspiration',
    title: 'Vintage Garden Reception',
    location: 'Charleston, SC',
    image: 'https://images.unsplash.com/photo-1502635385003-ee1e6a1a742d',
    user: {
      name: 'Historic Weddings',
      avatar: 'https://images.unsplash.com/photo-1531123414780-f74242c2b052',
    },
    likes: 347,
    comments: 53,
    description: 'Classic southern charm with vintage furniture and abundant floral arrangements creates an intimate garden atmosphere.',
    tags: ['Garden', 'Vintage', 'Southern'],
  },
  {
    id: '5',
    type: 'venue',
    title: 'Urban Industrial Loft',
    location: 'Chicago, IL',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3',
    user: {
      name: 'City Venues',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    },
    likes: 278,
    comments: 39,
    description: 'Converted warehouse space with exposed brick, high ceilings and panoramic city views that come alive at night.',
    tags: ['Industrial', 'Urban', 'Modern'],
  },
  {
    id: '6',
    type: 'vendor',
    title: 'Bespoke Cake Design',
    location: 'Austin, TX',
    image: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636',
    user: {
      name: 'Sweet Artistry',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956',
    },
    likes: 421,
    comments: 67,
    description: 'Handcrafted wedding cakes that combine traditional techniques with modern design elements. Each cake is a work of art.',
    tags: ['Cake', 'Artisan', 'Custom'],
  },
];

interface ExploreContentProps {
  type: 'trending' | 'following' | 'new';
  location?: string;
}

const ExploreContent: React.FC<ExploreContentProps> = ({ type, location }) => {
  const [likedItems, setLikedItems] = useState<string[]>([]);
  
  // Filter content based on type and location
  const filteredContent = MOCK_CONTENT.filter(item => {
    if (location && location !== 'all' && !item.location.includes(location)) {
      return false;
    }
    return true;
  });
  
  const toggleLike = (id: string) => {
    setLikedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id) 
        : [...prev, id]
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {filteredContent.map((item) => (
        <Card key={item.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
          <div className="relative">
            <img 
              src={item.image} 
              alt={item.title} 
              className="w-full h-60 object-cover"
            />
            <Badge 
              className={cn(
                "absolute top-3 left-3",
                item.type === 'venue' ? "bg-wed/90 hover:bg-wed" : 
                item.type === 'vendor' ? "bg-space/90 hover:bg-space" : 
                "bg-purple-500/90 hover:bg-purple-500"
              )}
            >
              {item.type === 'venue' ? 'Venue' : 
               item.type === 'vendor' ? 'Vendor' : 'Inspiration'}
            </Badge>
          </div>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <img 
                src={item.user.avatar} 
                alt={item.user.name} 
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <h4 className="font-medium text-sm">{item.user.name}</h4>
                <p className="text-xs text-gray-500">{item.location}</p>
              </div>
            </div>
            
            <h3 className="font-playfair font-semibold text-lg mb-2">{item.title}</h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
            
            <div className="flex flex-wrap gap-1 mb-3">
              {item.tags.map((tag, i) => (
                <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
              ))}
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <div className="flex gap-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={cn(
                    "gap-1 p-1",
                    likedItems.includes(item.id) && "text-red-500"
                  )}
                  onClick={() => toggleLike(item.id)}
                >
                  <Heart className={cn(
                    "w-4 h-4",
                    likedItems.includes(item.id) && "fill-red-500"
                  )} />
                  <span>{likedItems.includes(item.id) ? item.likes + 1 : item.likes}</span>
                </Button>
                <Button variant="ghost" size="sm" className="gap-1 p-1">
                  <MessageSquare className="w-4 h-4" />
                  <span>{item.comments}</span>
                </Button>
                <Button variant="ghost" size="sm" className="gap-1 p-1">
                  <Share className="w-4 h-4" />
                </Button>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs"
                onClick={() => window.location.href = `/${item.type}s/${item.id}`}
              >
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ExploreContent;
