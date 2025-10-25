"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import EnhancedPageHero from '@/components/layout/EnhancedPageHero';
import PageContainer from '@/components/layout/PageContainer';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  User, 
  Bot,
  Heart,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Mic,
  Image,
  Paperclip
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  recommendations?: any[];
}

interface UserContext {
  budget?: number;
  guest_count?: number;
  event_date?: string;
  location?: string;
  preferences?: string[];
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI wedding planning assistant. I'm here to help you plan your perfect wedding. Tell me about your vision - what kind of wedding are you dreaming of?",
      timestamp: new Date(),
      suggestions: [
        "I'm planning a traditional Indian wedding",
        "Looking for outdoor venue options",
        "Need help with budget planning",
        "Want modern minimalist style"
      ]
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userContext, setUserContext] = useState<UserContext>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message?: string) => {
    const messageToSend = message || inputMessage.trim();
    if (!messageToSend) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageToSend,
          context: userContext,
          conversation_id: 'web-chat'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        suggestions: data.suggestions,
        recommendations: data.recommendations
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { icon: MapPin, label: "Find Venues", message: "Show me venue options in my area" },
    { icon: Users, label: "Vendor Recommendations", message: "I need vendor recommendations" },
    { icon: DollarSign, label: "Budget Planning", message: "Help me plan my wedding budget" },
    { icon: Calendar, label: "Timeline", message: "Create a wedding planning timeline" }
  ];

  return (
    <main className="min-h-screen bg-background">
      <EnhancedPageHero
        badge={{ icon: MessageSquare, text: 'AI Assistant' }}
        title="AI Wedding"
        titleGradient="Assistant"
        description="Your personal wedding planning companion. Ask anything and get smart, contextual help."
      />

      <PageContainer className="py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Context Panel */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Wedding Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Budget</label>
                  <Input
                    type="number"
                    placeholder="₹ 5,00,000"
                    value={userContext.budget || ''}
                    onChange={(e) => setUserContext(prev => ({ ...prev, budget: Number(e.target.value) }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Guest Count</label>
                  <Input
                    type="number"
                    placeholder="200"
                    value={userContext.guest_count || ''}
                    onChange={(e) => setUserContext(prev => ({ ...prev, guest_count: Number(e.target.value) }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Event Date</label>
                  <Input
                    type="date"
                    value={userContext.event_date || ''}
                    onChange={(e) => setUserContext(prev => ({ ...prev, event_date: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                  <Input
                    placeholder="Mumbai, Delhi, Bangalore..."
                    value={userContext.location || ''}
                    onChange={(e) => setUserContext(prev => ({ ...prev, location: e.target.value }))}
                    className="mt-1"
                  />
                </div>

                {/* Quick Actions */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Quick Actions</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {quickActions.map((action, index) => {
                      const IconComponent = action.icon;
                      return (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleSendMessage(action.message)}
                          className="flex flex-col items-center p-3 h-auto"
                        >
                          <IconComponent className="h-4 w-4 mb-1" />
                          <span className="text-xs">{action.label}</span>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="h-[calc(100vh-200px)] flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      {/* Avatar */}
                      <div className={`flex-shrink-0 ${message.role === 'user' ? 'ml-3' : 'mr-3'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          message.role === 'user' 
                            ? 'bg-red-600 text-white' 
                            : 'bg-gradient-to-br from-red-100 to-amber-100 dark:from-red-900 dark:to-amber-900'
                        }`}>
                          {message.role === 'user' ? (
                            <User className="h-4 w-4" />
                          ) : (
                            <Bot className="h-4 w-4 text-red-600 dark:text-red-400" />
                          )}
                        </div>
                      </div>

                      {/* Message Content */}
                      <div className={`rounded-lg p-4 ${
                        message.role === 'user'
                          ? 'bg-red-600 text-white'
                          : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                      }`}>
                        <p className={`text-sm ${message.role === 'user' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                          {message.content}
                        </p>
                        
                        {/* Suggestions */}
                        {message.suggestions && message.suggestions.length > 0 && (
                          <div className="mt-3 space-y-2">
                            <p className="text-xs text-gray-600 dark:text-gray-400">Suggestions:</p>
                            <div className="flex flex-wrap gap-2">
                              {message.suggestions.map((suggestion, index) => (
                                <Button
                                  key={index}
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSendMessage(suggestion)}
                                  className="text-xs h-7"
                                >
                                  {suggestion}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Recommendations */}
                        {message.recommendations && message.recommendations.length > 0 && (
                          <div className="mt-3">
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Recommendations:</p>
                            <div className="space-y-2">
                              {message.recommendations.map((rec, index) => (
                                <div key={index} className="p-2 bg-gray-50 dark:bg-gray-700 rounded text-xs">
                                  <div className="font-medium">{rec.title}</div>
                                  <div className="text-gray-600 dark:text-gray-400">{rec.description}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-red-200' : 'text-gray-500 dark:text-gray-400'}`}>
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex mr-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-100 to-amber-100 dark:from-red-900 dark:to-amber-900 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-red-600 dark:text-red-400" />
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                <div className="flex space-x-2">
                  <div className="flex-1 relative">
                    <Textarea
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything about your wedding planning..."
                      className="min-h-[44px] max-h-32 resize-none pr-24"
                      disabled={isLoading}
                    />
                    <div className="absolute right-2 bottom-2 flex space-x-1">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Image className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Mic className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Button 
                    onClick={() => handleSendMessage()}
                    disabled={!inputMessage.trim() || isLoading}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </PageContainer>
    </main>
  );
}
