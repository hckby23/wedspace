
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Topic {
  name: string;
  count: number;
  popular?: boolean;
}

const TOPICS: Topic[] = [
  { name: 'Wedding Planning', count: 245, popular: true },
  { name: 'Budget Tips', count: 183, popular: true },
  { name: 'DIY Projects', count: 147 },
  { name: 'Destination Weddings', count: 132 },
  { name: 'Wedding Dresses', count: 124, popular: true },
  { name: 'Photography', count: 118 },
  { name: 'First Dance', count: 95 },
  { name: 'Wedding Traditions', count: 89 },
  { name: 'Honeymoon Ideas', count: 76 },
  { name: 'Guest List Drama', count: 68, popular: true },
];

const CommunityTopics: React.FC = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Popular Topics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {TOPICS.map((topic, i) => (
            <div 
              key={i}
              className={cn(
                "px-3 py-1 rounded-full text-sm cursor-pointer transition-all",
                "border border-gray-200 hover:border-space/70",
                topic.popular 
                  ? "bg-gradient-to-r from-wed/20 to-space/20 text-gray-800 hover:shadow-sm" 
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              )}
            >
              {topic.name}
              <span className="ml-1 text-xs text-gray-500">({topic.count})</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunityTopics;
