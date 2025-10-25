"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Send, 
  Sparkles, 
  X, 
  Minimize2, 
  Maximize2,
  Bot,
  User,
  MapPin,
  IndianRupee,
  Users,
  Calendar,
  Lightbulb
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  venues?: Array<{
    id: string;
    name: string;
    location: string;
    price: number;
    image: string;
  }>;
}

interface AIAssistantProps {
  context?: {
    page?: 'venues' | 'vendors' | 'planning';
    userPreferences?: {
      budget?: number;
      location?: string;
      guestCount?: number;
      eventDate?: string;
    };
  };
  onVenueSelect?: (venueId: string) => void;
  onVendorSelect?: (vendorId: string) => void;
  className?: string;
}

const AIAssistant: React.FC<AIAssistantProps> = ({
  context,
  onVenueSelect,
  onVendorSelect,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add welcome message when first opened
      const welcomeMessage: AIMessage = {
        id: '1',
        type: 'assistant',
        content: getWelcomeMessage(),
        timestamp: new Date(),
        suggestions: getInitialSuggestions()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, context]);

  const getWelcomeMessage = () => {
    const { page, userPreferences } = context || {};
    
    if (page === 'venues') {
      return `Hi! I'm your AI wedding assistant. I can help you find the perfect venue for your special day. ${
        userPreferences?.budget 
          ? `I see you have a budget of ₹${userPreferences.budget.toLocaleString('en-IN')}. ` 
          : ''
      }What kind of venue are you looking for?`;
    }
    
    return "Hi! I'm your AI wedding assistant. I'm here to help you plan your perfect wedding. What can I help you with today?";
  };

  const getInitialSuggestions = () => {
    const { page } = context || {};
    
    if (page === 'venues') {
      return [
        "Find outdoor venues under ₹2 lakhs",
        "Show me banquet halls in Mumbai",
        "I need a venue for 200 guests",
        "Suggest venues with good catering"
      ];
    }
    
    return [
      "Help me plan my wedding timeline",
      "What's my budget breakdown?",
      "Find venues in my area",
      "Suggest wedding themes"
    ];
  };

  const handleSendMessage = async (message?: string) => {
    const messageText = message || inputValue.trim();
    if (!messageText || isLoading) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Simulate AI response - in real app, this would call your AI service
      const response = await simulateAIResponse(messageText, context);
      
      const assistantMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.content,
        timestamp: new Date(),
        suggestions: response.suggestions,
        venues: response.venues
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "I'm sorry, I'm having trouble processing your request right now. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const simulateAIResponse = async (
    message: string, 
    context?: AIAssistantProps['context']
  ): Promise<{
    content: string;
    suggestions?: string[];
    venues?: AIMessage['venues'];
  }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const lowerMessage = message.toLowerCase();

    // Venue-related responses
    if (lowerMessage.includes('venue') || lowerMessage.includes('hall') || lowerMessage.includes('outdoor')) {
      return {
        content: "I found some great venues that match your criteria! Here are my top recommendations based on your preferences:",
        suggestions: [
          "Tell me more about the first venue",
          "Show me venues with better ratings",
          "Find cheaper alternatives",
          "What about outdoor venues?"
        ],
        venues: [
          {
            id: '1',
            name: 'Royal Gardens Banquet',
            location: 'Andheri, Mumbai',
            price: 150000,
            image: '/api/placeholder/300/200'
          },
          {
            id: '2',
            name: 'Sunset Lawn',
            location: 'Juhu, Mumbai',
            price: 200000,
            image: '/api/placeholder/300/200'
          },
          {
            id: '3',
            name: 'Grand Palace Hotel',
            location: 'Bandra, Mumbai',
            price: 300000,
            image: '/api/placeholder/300/200'
          }
        ]
      };
    }

    // Budget-related responses
    if (lowerMessage.includes('budget') || lowerMessage.includes('cost') || lowerMessage.includes('price')) {
      return {
        content: "Let me help you with budget planning! Based on typical Indian weddings, here's a rough breakdown:\n\n• Venue: 30-40% of total budget\n• Catering: 25-35%\n• Photography: 10-15%\n• Decorations: 10-15%\n• Clothing & Jewelry: 10-15%\n• Miscellaneous: 5-10%\n\nWhat's your total wedding budget?",
        suggestions: [
          "My budget is ₹5 lakhs",
          "I have ₹10 lakhs to spend",
          "Show me budget-friendly venues",
          "Help me save money"
        ]
      };
    }

    // Location-based responses
    if (lowerMessage.includes('mumbai') || lowerMessage.includes('delhi') || lowerMessage.includes('bangalore')) {
      const city = lowerMessage.includes('mumbai') ? 'Mumbai' : 
                   lowerMessage.includes('delhi') ? 'Delhi' : 'Bangalore';
      
      return {
        content: `Great choice! ${city} has amazing wedding venues. I can help you find the perfect spot based on your guest count, budget, and style preferences. What type of venue are you looking for?`,
        suggestions: [
          `Show me banquet halls in ${city}`,
          `Find outdoor venues in ${city}`,
          `Budget-friendly options in ${city}`,
          `Luxury venues in ${city}`
        ]
      };
    }

    // Guest count responses
    if (lowerMessage.includes('guest') || lowerMessage.includes('people') || /\d+/.test(lowerMessage)) {
      return {
        content: "Perfect! Knowing your guest count helps me suggest venues with the right capacity. For the number of guests you mentioned, I'd recommend looking at venues that can comfortably accommodate 20% more people than your expected count. Would you like me to show you some options?",
        suggestions: [
          "Show me suitable venues",
          "What about catering options?",
          "Help me plan seating arrangements",
          "Suggest decoration ideas"
        ]
      };
    }

    // Default response
    return {
      content: "I'd be happy to help you with that! I can assist with venue selection, budget planning, vendor recommendations, and timeline creation. What specific aspect of your wedding planning would you like to focus on?",
      suggestions: [
        "Find venues in my area",
        "Help with budget planning",
        "Suggest wedding themes",
        "Create a timeline"
      ]
    };
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50",
          "bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700",
          className
        )}
      >
        <Sparkles className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <Card className={cn(
      "fixed bottom-6 right-6 w-96 h-[500px] shadow-xl z-50 flex flex-col",
      isMinimized && "h-16",
      className
    )}>
      <CardHeader className="flex-shrink-0 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-600 to-amber-600 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            AI Assistant
            <Badge variant="secondary" className="text-xs">
              <Sparkles className="w-3 h-3 mr-1" />
              Smart
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-8 w-8 p-0"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {!isMinimized && (
        <>
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="space-y-3">
                <div className={cn(
                  "flex gap-3",
                  message.type === 'user' ? "justify-end" : "justify-start"
                )}>
                  {message.type === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-600 to-amber-600 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className={cn(
                    "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                    message.type === 'user' 
                      ? "bg-red-600 text-white ml-auto" 
                      : "bg-muted"
                  )}>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                  {message.type === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>

                {/* Venue recommendations */}
                {message.venues && (
                  <div className="ml-11 space-y-2">
                    {message.venues.map((venue) => (
                      <Card key={venue.id} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-3">
                          <div className="flex gap-3">
                            <img
                              src={venue.image}
                              alt={venue.name}
                              className="w-16 h-16 rounded object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm truncate">{venue.name}</h4>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                <MapPin className="w-3 h-3" />
                                {venue.location}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                                <IndianRupee className="w-3 h-3" />
                                ₹{venue.price.toLocaleString('en-IN')}
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onVenueSelect?.(venue.id)}
                              className="text-xs"
                            >
                              View
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Suggestions */}
                {message.suggestions && (
                  <div className="ml-11 flex flex-wrap gap-2">
                    {message.suggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleSendMessage(suggestion)}
                        className="text-xs h-7"
                      >
                        <Lightbulb className="w-3 h-3 mr-1" />
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-600 to-amber-600 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-muted rounded-lg px-3 py-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </CardContent>

          <div className="flex-shrink-0 p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything about your wedding..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={isLoading}
                className="text-sm"
              />
              <Button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isLoading}
                size="sm"
                className="px-3"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </Card>
  );
};

export default AIAssistant;
