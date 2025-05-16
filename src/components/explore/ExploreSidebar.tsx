
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

// Mock trending topics
const TRENDING_TOPICS = [
  "Sustainable Weddings",
  "Micro Weddings",
  "Destination Elopements",
  "Cultural Ceremonies",
  "Wedding Fashion 2025"
];

// Mock suggested accounts
const SUGGESTED_ACCOUNTS = [
  {
    id: '1',
    name: 'Elegant Venues',
    username: '@elegantvenues',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    type: 'Venue Curator'
  },
  {
    id: '2',
    name: 'Wedding Collective',
    username: '@weddingcollective',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9',
    type: 'Vendor Network'
  },
  {
    id: '3',
    name: "Sarah's Wedding Blog",
    username: '@sarahweddings',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    type: 'Blogger'
  },
];

const ExploreSidebar: React.FC = () => {
  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Trending Topics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {TRENDING_TOPICS.map((topic, index) => (
              <Badge key={index} variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                {topic}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Suggested Accounts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {SUGGESTED_ACCOUNTS.map((account) => (
            <div key={account.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={account.avatar} />
                  <AvatarFallback>{account.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{account.name}</p>
                  <p className="text-xs text-muted-foreground">{account.type}</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Follow</Button>
            </div>
          ))}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>New venue listings in your area</p>
          <p>5 vendors recently updated their portfolios</p>
          <p>Wedding trends report for Spring 2025</p>
          <Button variant="link" className="p-0 h-auto text-space">See all activity</Button>
        </CardContent>
      </Card>
    </>
  );
};

export default ExploreSidebar;
