
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

// Mock trending discussions
const TRENDING_DISCUSSIONS = [
  {
    id: 'td1',
    title: 'Post-pandemic wedding etiquette: Are COVID precautions still needed?',
    replies: 47,
    author: {
      name: 'Wedding Planners Association',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2',
    }
  },
  {
    id: 'td2',
    title: 'Dealing with family expectations when planning a non-traditional wedding',
    replies: 36,
    author: {
      name: 'Modern Couples',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61',
    }
  },
  {
    id: 'td3',
    title: 'Best way to handle honeymoon travel with the current global situation',
    replies: 29,
    author: {
      name: 'Travel & Weddings',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956',
    }
  }
];

// Mock upcoming events
const UPCOMING_EVENTS = [
  {
    id: 'e1',
    title: 'Virtual Wedding Fair',
    date: 'April 25-26, 2025',
    attendees: 312
  },
  {
    id: 'e2',
    title: 'Wedding Budget Workshop',
    date: 'May 10, 2025',
    attendees: 145
  },
  {
    id: 'e3',
    title: 'Q&A with Top Wedding Planners',
    date: 'May 18, 2025',
    attendees: 218
  }
];

const CommunitySidebar: React.FC = () => {
  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Trending Discussions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {TRENDING_DISCUSSIONS.map((discussion) => (
            <div key={discussion.id} className="space-y-1">
              <div className="flex items-center space-x-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={discussion.author.avatar} />
                  <AvatarFallback>{discussion.author.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <p className="text-xs text-muted-foreground">{discussion.author.name}</p>
              </div>
              <p className="text-sm font-medium hover:text-space cursor-pointer">
                {discussion.title}
              </p>
              <p className="text-xs text-muted-foreground">{discussion.replies} replies</p>
            </div>
          ))}
          <Button variant="link" className="p-0 h-auto text-space">See all discussions</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Upcoming Community Events</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {UPCOMING_EVENTS.map((event) => (
            <div key={event.id} className="space-y-1">
              <p className="text-sm font-medium hover:text-space cursor-pointer">{event.title}</p>
              <p className="text-xs">{event.date}</p>
              <p className="text-xs text-muted-foreground">{event.attendees} attending</p>
            </div>
          ))}
          <Button variant="link" className="p-0 h-auto text-space">See all events</Button>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-wed/10 to-space/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Join Our Community</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-4">
            Create an account to join discussions, save your favorite venues and connect with other couples and vendors.
          </p>
          <div className="space-y-2">
            <Button className="w-full bg-wed hover:bg-wed/90">Sign Up</Button>
            <Button variant="outline" className="w-full">Login</Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default CommunitySidebar;
