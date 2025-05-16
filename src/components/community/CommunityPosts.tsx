
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageSquare, Share, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

// Mock data for different types of community posts
const MOCK_POSTS = {
  discussions: [
    {
      id: 'd1',
      title: 'How to accommodate dietary restrictions at our reception?',
      content: 'We have guests with various dietary needs including vegan, gluten-free, and several allergies. Looking for advice on how to handle this without creating a logistical nightmare for our caterers.',
      author: {
        name: 'Emily Chen',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      },
      date: new Date('2025-03-15T10:30:00'),
      likes: 24,
      comments: 18,
      tags: ['Catering', 'Planning', 'Guest Experience'],
    },
    {
      id: 'd2',
      title: 'First look photos: Yes or no?',
      content: "We're torn between having a first look before the ceremony or waiting for that traditional moment. Would love to hear experiences from both perspectives!",
      author: {
        name: 'Michael Roberts',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
      },
      date: new Date('2025-03-12T15:45:00'),
      likes: 32,
      comments: 27,
      tags: ['Photography', 'Traditions', 'Ceremony'],
    },
    {
      id: 'd3',
      title: 'How to politely decline having bridesmaids/groomsmen?',
      content: "We've decided to keep our wedding party small, but we're struggling with how to tell our friends without hurting feelings. Has anyone navigated this successfully?",
      author: {
        name: 'Sophia Williams',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
      },
      date: new Date('2025-03-10T09:15:00'),
      likes: 45,
      comments: 38,
      tags: ['Wedding Party', 'Etiquette', 'Relationships'],
    },
  ],
  blogs: [
    {
      id: 'b1',
      title: '10 Unexpected Ways to Personalize Your Wedding Day',
      content: 'Beyond monograms and custom cocktails, discover truly unique ways to make your celebration reflect your story. From interactive guest experiences to meaningful cultural elements...',
      author: {
        name: 'Wedding Collective',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
        verified: true,
      },
      date: new Date('2025-03-14T12:00:00'),
      likes: 126,
      comments: 42,
      tags: ['Inspiration', 'Planning', 'Personalization'],
    },
    {
      id: 'b2',
      title: 'How We Planned Our Sustainable Wedding Without Compromising Style',
      content: 'Our journey to creating an eco-conscious celebration that still felt luxurious and special. From farm-to-table catering to ethical fashion choices...',
      author: {
        name: 'Green Weddings',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956',
        verified: true,
      },
      date: new Date('2025-03-08T14:30:00'),
      likes: 98,
      comments: 31,
      tags: ['Sustainability', 'Real Wedding', 'Tips'],
    },
    {
      id: 'b3',
      title: 'Budgeting for 2025: Where to Splurge vs. Where to Save',
      content: 'A comprehensive breakdown of which wedding elements make the biggest impact and which ones your guests might not even notice. Financial advice from planners and recent couples...',
      author: {
        name: 'Wedding Finance',
        avatar: 'https://images.unsplash.com/photo-1531123414780-f74242c2b052',
        verified: true,
      },
      date: new Date('2025-03-05T10:00:00'),
      likes: 154,
      comments: 47,
      tags: ['Budget', 'Planning', 'Advice'],
    },
  ],
  questions: [
    {
      id: 'q1',
      title: "What's the average cost of wedding flowers in 2025?",
      content: "I'm trying to budget for our September wedding and getting quotes all over the place. Would love to know what others are paying for bouquets, centerpieces, etc.",
      author: {
        name: 'Jessica Moore',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
      },
      date: new Date('2025-03-15T16:20:00'),
      likes: 8,
      comments: 12,
      tags: ['Flowers', 'Budget', 'Question'],
    },
    {
      id: 'q2',
      title: 'Has anyone used digital RSVPs instead of paper?',
      content: 'Considering using a wedding website for RSVPs rather than traditional cards. Concerned about older guests - has anyone done this successfully?',
      author: {
        name: 'Taylor Johnson',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9',
      },
      date: new Date('2025-03-14T11:45:00'),
      likes: 15,
      comments: 23,
      tags: ['Invitations', 'Technology', 'Question'],
    },
    {
      id: 'q3',
      title: 'Recommendations for inclusive ceremony wording?',
      content: "Looking for suggestions on modern, inclusive ceremony scripts that aren't tied to specific religious traditions but still feel meaningful.",
      author: {
        name: 'Jordan Evans',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
      },
      date: new Date('2025-03-13T09:30:00'),
      likes: 22,
      comments: 19,
      tags: ['Ceremony', 'Inclusive', 'Question'],
    },
  ],
};

interface CommunityPostsProps {
  type: 'discussions' | 'blogs' | 'questions';
}

const CommunityPosts: React.FC<CommunityPostsProps> = ({ type }) => {
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  
  const posts = MOCK_POSTS[type];
  
  const handleLike = (id: string) => {
    setLikedPosts(prev => 
      prev.includes(id) 
        ? prev.filter(postId => postId !== id) 
        : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Card key={post.id} className="transition-all duration-300 hover:shadow-md">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={post.author.avatar} />
                  <AvatarFallback>{post.author.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center">
                    <p className="font-medium text-sm">{post.author.name}</p>
                    {'verified' in post.author && post.author.verified && (
                      <Badge className="ml-2 bg-blue-500" variant="secondary">
                        <Star className="h-3 w-3 mr-1 fill-white" />
                        <span>Pro</span>
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(post.date, { addSuffix: true })}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-1">
                {post.tags.map((tag, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <h3 className="font-playfair font-semibold text-lg mt-3">{post.title}</h3>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-sm line-clamp-3">{post.content}</p>
          </CardContent>
          <CardFooter className="flex justify-between pt-2">
            <div className="flex gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn(
                  "gap-1 p-1",
                  likedPosts.includes(post.id) && "text-red-500"
                )}
                onClick={() => handleLike(post.id)}
              >
                <Heart className={cn(
                  "w-4 h-4",
                  likedPosts.includes(post.id) && "fill-red-500"
                )} />
                <span>{likedPosts.includes(post.id) ? post.likes + 1 : post.likes}</span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-1 p-1">
                <MessageSquare className="w-4 h-4" />
                <span>{post.comments}</span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-1 p-1">
                <Share className="w-4 h-4" />
              </Button>
            </div>
            <Button variant="outline" size="sm">
              Read {type === 'discussions' ? 'Discussion' : 
                    type === 'blogs' ? 'Article' : 'Question'}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default CommunityPosts;
