"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Sparkles, 
  User, 
  Bot, 
  MapPin, 
  Users, 
  DollarSign, 
  Calendar,
  Heart,
  Star,
  Camera,
  Utensils,
  Music,
  Palette,
  Car,
  Search,
  Mic,
  Image as ImageIcon,
  FileText,
  Zap,
  TrendingUp,
  Clock,
  CheckCircle,
  ArrowRight,
  X,
  Minimize2,
  Maximize2,
  Filter,
  MessageCircle
} from 'lucide-react';
import VenueCard from '@/components/venues/VenueCard';
import VendorCard from '@/components/vendors/VendorCard';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  results?: any[];
  context?: any;
}

interface UnifiedAIChatProps {
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  className?: string;
  variant?: 'compact' | 'full';
  initialMode?: 'search' | 'plan';
}

function UnifiedAIChat({ isExpanded = false, onToggleExpand, className, variant = 'full', initialMode = 'search' }: UnifiedAIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: variant === 'compact'
        ? "Hi! I can search venues/vendors and help with planning. What would you like to do?"
        : "Hi! I'm your AI wedding planning assistant. I can help you find venues, vendors, create budgets, plan timelines, and answer any wedding-related questions. What would you like to explore today?",
      timestamp: new Date(),
      suggestions: variant === 'compact'
        ? [
            "Find venues in my city",
            "Show top photographers",
            "Plan my wedding timeline",
          ]
        : [
            "Find luxury venues in Mumbai under ₹10 lakhs",
            "Show me photographers for a traditional wedding",
            "Create a budget for 300 guests",
            "Plan my 12-month wedding timeline"
          ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasInteractedRef = useRef(false);

  const scrollToBottom = (smooth: boolean) => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto',
      });
    } else {
      messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'nearest' });
    }
  };

  useEffect(() => {
    // Do not smooth-scroll on initial render to avoid window scroll jump
    scrollToBottom(hasInteractedRef.current);
  }, [messages]);

  const generateAIResponse = (userMessage: string): Message => {
    const lowercaseMessage = userMessage.toLowerCase();
    
    // Enhanced mock data with rich context
    const mockVenues = [
      {
        id: 1,
        name: "The Grand Palace",
        location: "Mumbai, Maharashtra",
        price: "₹8,50,000",
        rating: 4.8,
        reviews: 245,
        capacity: "200-500 guests",
        image: "/api/placeholder/300/200",
        availability: "Available",
        gallery: ["/api/placeholder/300/200", "/api/placeholder/300/200", "/api/placeholder/300/200"],
        virtualTour: "https://example.com/tour",
        floorPlan: "/api/placeholder/400/300",
        coordinates: { lat: 19.0760, lng: 72.8777 }
      }
    ];

    const mockVendors = [
      {
        id: 1,
        name: "Artistic Moments Photography",
        category: "Photography",
        rating: 4.9,
        reviews: 156,
        price: "₹75,000 - ₹1,50,000",
        image: "/api/placeholder/300/200",
        verified: true,
        portfolio: ["Traditional", "Candid", "Pre-wedding", "Destination"],
        equipment: ["DSLR", "Drone", "Studio Lights", "4K Video"],
        responseTime: "2 hours",
        completedProjects: 200
      }
    ];

    if (lowercaseMessage.includes('venue') || lowercaseMessage.includes('hall')) {
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: "I found some amazing venues that match your criteria! Here are the top recommendations with detailed information:",
        timestamp: new Date(),
        context: {
          venues: mockVenues,
          mapView: {
            markers: mockVenues.length,
            center: { lat: 19.0760, lng: 72.8777 }
          },
          searchFilters: {
            location: ["Mumbai", "Delhi", "Bangalore", "Pune"],
            budget: ["₹5-10L", "₹10-15L", "₹15-25L"],
            capacity: ["100-200", "200-500", "500+"]
          }
        },
        suggestions: [
          "Show me more venues in this area",
          "Compare these venues side by side",
          "Check availability for my wedding date",
          "Get contact details for these venues"
        ]
      };
    }

    if (lowercaseMessage.includes('photographer') || lowercaseMessage.includes('photo')) {
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: "Here are the top-rated photographers in your area with their portfolios and specializations:",
        timestamp: new Date(),
        context: {
          results: mockVendors
        },
        suggestions: [
          "Show me their portfolio samples",
          "Compare photography packages",
          "Check photographer availability",
          "Get quotes from multiple photographers"
        ]
      };
    }

    if (lowercaseMessage.includes('budget')) {
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: "I've created a comprehensive budget breakdown for your wedding. Here's how to optimize your spending:",
        timestamp: new Date(),
        context: {
          budgetBreakdown: {
            venue: { amount: 400000, percentage: 40, color: 'bg-red-500' },
            catering: { amount: 250000, percentage: 25, color: 'bg-orange-500' },
            photography: { amount: 100000, percentage: 10, color: 'bg-yellow-500' },
            decoration: { amount: 80000, percentage: 8, color: 'bg-green-500' },
            music: { amount: 50000, percentage: 5, color: 'bg-blue-500' },
            miscellaneous: { amount: 120000, percentage: 12, color: 'bg-gray-500' }
          },
          totalBudget: 1000000,
          recommendations: [
            "Consider off-season dates to save 15-20% on venue costs",
            "Book photographers 6+ months in advance for better rates",
            "Combine decoration with catering vendor for package deals"
          ]
        },
        suggestions: [
          "Optimize my budget further",
          "Find cost-effective alternatives",
          "Track my actual expenses",
          "Get vendor quotes within budget"
        ]
      };
    }

    if (lowercaseMessage.includes('timeline') || lowercaseMessage.includes('plan')) {
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: "Here's your personalized wedding planning timeline with AI-powered insights and recommendations:",
        timestamp: new Date(),
        context: {
          timeline: [
            {
              task: "Book venue and send save-the-dates",
              timeframe: "12 months before",
              status: "completed",
              priority: "high",
              category: "venue"
            },
            {
              task: "Finalize guest list and book caterer",
              timeframe: "8-10 months before",
              status: "in-progress",
              priority: "high",
              category: "catering"
            },
            {
              task: "Book photographer and videographer",
              timeframe: "6-8 months before",
              status: "pending",
              priority: "medium",
              category: "photography"
            },
            {
              task: "Order wedding invitations",
              timeframe: "4-6 months before",
              status: "pending",
              priority: "medium",
              category: "stationery"
            }
          ],
          insights: [
            "You're ahead of schedule! Consider booking your photographer now for better availability",
            "Peak wedding season is approaching - finalize vendors soon",
            "Your venue choice affects decoration and catering options significantly"
          ]
        },
        suggestions: [
          "Add custom tasks to timeline",
          "Set reminders for upcoming deadlines",
          "Share timeline with family",
          "Find vendors for pending tasks"
        ]
      };
    }

    return {
      id: Date.now().toString(),
      type: 'ai',
      content: "I'd be happy to help you with that! I can assist with venue searches, vendor recommendations, budget planning, timeline creation, and much more. What specific aspect of wedding planning would you like to explore?",
      timestamp: new Date(),
      suggestions: [
        "Find venues in my city",
        "Create a wedding budget",
        "Plan my wedding timeline",
        "Search for photographers"
      ]
    };
  };

  const handleSendMessage = async (messageText?: string) => {
    hasInteractedRef.current = true;
    const text = messageText || inputValue.trim();
    if (!text) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Call actual AI API
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          context: {
            userId: 'demo-user-id' // TODO: Get from auth context
          }
        })
      });

      if (!response.ok) {
        throw new Error('AI request failed');
      }

      const data = await response.json();
      
      const aiResponse: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: data.response || 'Sorry, I encountered an error.',
        timestamp: new Date(),
        suggestions: data.suggestions || [],
        context: data.recommendations ? { venues: data.recommendations } : undefined
      };

      // If tools were used, show confirmation message
      if (data.toolsUsed && data.toolsUsed.length > 0) {
        aiResponse.content += `\n\n✓ Actions taken: ${data.toolsUsed.join(', ')}`;
      }

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('AI chat error:', error);
      // Fallback to mock response
      const aiResponse = generateAIResponse(text);
      setMessages(prev => [...prev, aiResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    hasInteractedRef.current = true;
    handleSendMessage(suggestion);
  };

  const renderMessageContent = (message: Message) => {
    if (message.type === 'user') {
      return <p className="text-white">{message.content}</p>;
    }

    return (
      <div className="space-y-4">
        <p className="text-gray-800 dark:text-gray-200">{message.content}</p>

        {/* Enhanced Venue Results */}
        {message.context?.venues && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-900 dark:text-white flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Recommended Venues ({message.context.venues.length})
              </h4>
              <div className="flex items-center space-x-2">
                <button className="flex items-center text-xs bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 rounded-full px-3 py-1 transition-colors">
                  <Filter className="h-3 w-3 mr-1" />
                  Filter
                </button>
                <button className="flex items-center text-xs bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 rounded-full px-3 py-1 transition-colors">
                  <MapPin className="h-3 w-3 mr-1" />
                  Map View
                </button>
              </div>
            </div>
            
            <div className="grid gap-3">
              {message.context.venues.map((venue: any) => (
                <div key={venue.id} className="relative group">
                  <VenueCard venue={venue} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Vendor Results */}
        {message.context?.results && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-900 dark:text-white flex items-center">
                <Camera className="h-4 w-4 mr-2" />
                Top Photographers ({message.context.results.length})
              </h4>
            </div>
            
            <div className="grid gap-3">
              {message.context.results.map((vendor: any) => (
                <VendorCard key={vendor.id} vendor={vendor} />
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Budget Breakdown */}
        {message.context?.budgetBreakdown && (
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 dark:text-white flex items-center">
              <DollarSign className="h-4 w-4 mr-2" />
              Budget Breakdown
            </h4>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
              {Object.entries(message.context.budgetBreakdown).map(([category, data]: [string, any]) => (
                <div key={category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">{category}</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">₹{data.amount.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${data.color}`}
                      style={{ width: `${data.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Timeline */}
        {message.context?.timeline && (
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 dark:text-white flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Wedding Timeline
            </h4>
            <div className="space-y-2">
              {message.context.timeline.map((task: any, index: number) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className={`w-3 h-3 rounded-full ${
                    task.status === 'completed' ? 'bg-green-500' :
                    task.status === 'in-progress' ? 'bg-yellow-500' : 'bg-gray-300'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{task.task}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{task.timeframe}</p>
                  </div>
                  <Badge variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}>
                    {task.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className={`${className} ${isExpanded ? 'fixed inset-4 z-50' : variant === 'compact' ? 'h-[360px]' : 'h-96'} flex flex-col bg-white dark:bg-gray-900 shadow-xl`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-red-100 to-amber-100 dark:from-red-900 dark:to-amber-900 rounded-lg">
            <Sparkles className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">AI Wedding Assistant</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Always here to help plan your perfect day</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {onToggleExpand && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleExpand}
              className="h-8 w-8 p-0"
            >
              {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
              <div className={`flex items-start space-x-2 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`p-2 rounded-full ${message.type === 'user' ? 'bg-red-100 dark:bg-red-900' : 'bg-blue-100 dark:bg-blue-900'}`}>
                  {message.type === 'user' ? (
                    <User className="h-4 w-4 text-red-600 dark:text-red-400" />
                  ) : (
                    <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  )}
                </div>
                <div className={`rounded-lg p-3 ${
                  message.type === 'user' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-100 dark:bg-gray-800'
                }`}>
                  {renderMessageContent(message)}
                  
                  {/* Suggestions */}
                  {message.suggestions && variant === 'full' && (
                    <div className="mt-3 space-y-2">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Try asking:</p>
                      <div className="flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="text-xs bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full px-3 py-1 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className={`text-xs text-gray-500 mt-1 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2">
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
                <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={variant === 'compact' ? 'Search venues, vendors, or ask for planning help...' : 'Ask me anything about your wedding planning...'}
              className="pr-20"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
              {variant === 'full' && (
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Mic className="h-4 w-4" />
              </Button>
              )}
              {variant === 'full' && (
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <ImageIcon className="h-4 w-4" />
              </Button>
              )}
            </div>
          </div>
          <Button 
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isTyping}
            className="bg-red-600 hover:bg-red-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Quick Actions */}
        {variant === 'full' && (
        <div className="space-y-3 mt-3">
          <div className="flex flex-wrap gap-2">
            {[
              { icon: Search, label: "Search venues", action: "Find venues near me", color: "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300" },
              { icon: DollarSign, label: "Budget help", action: "Help me create a budget", color: "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-300" },
              { icon: Calendar, label: "Plan timeline", action: "Create my wedding timeline", color: "bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-300" },
              { icon: Camera, label: "Find photographers", action: "Show me photographers", color: "bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-orange-900 dark:text-orange-300" }
            ].map((item, index) => (
              <button
                key={index}
                onClick={() => handleSendMessage(item.action)}
                className={`flex items-center space-x-1 text-xs ${item.color} rounded-full px-3 py-2 transition-colors font-medium`}
              >
                <item.icon className="h-3 w-3" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
          
          {/* Popular Searches */}
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Popular searches:</p>
            <div className="flex flex-wrap gap-1">
              {[
                "Banquet halls in Delhi",
                "Beach wedding venues",
                "Traditional photographers",
                "Mehendi decorators",
                "Destination wedding packages"
              ].map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(search)}
                  className="text-xs bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full px-2 py-1 transition-colors"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        </div>
        )}
      </div>
    </Card>
  );
}

export default UnifiedAIChat;
