"use client";

import React, { useState, useEffect } from 'react';
import { useScope } from '@/hooks/useScope';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  User,
  Users,
  ChevronDown,
  Heart,
  Plus,
  Settings
} from 'lucide-react';
import type { Wedding } from '@/types/wedding';

interface ContextSwitcherProps {
  className?: string;
  compact?: boolean;
}

export default function ContextSwitcher({ className = '', compact = false }: ContextSwitcherProps) {
  const { scope, weddingId, weddingTitle, setPersonalScope, setWeddingScope } = useScope();
  const [weddings, setWeddings] = useState<Wedding[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeddings();
  }, []);

  const fetchWeddings = async () => {
    try {
      const response = await fetch('/api/weddings');
      if (response.ok) {
        const data = await response.json();
        setWeddings(data.weddings || []);
      }
    } catch (error) {
      console.error('Failed to fetch weddings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScopeChange = (newScope: 'personal' | 'wedding', wId?: string, wTitle?: string) => {
    if (newScope === 'personal') {
      setPersonalScope();
    } else if (wId && wTitle) {
      setWeddingScope(wId, wTitle);
    }
  };

  const currentLabel = scope === 'personal' 
    ? 'My Items' 
    : weddingTitle || 'Our Wedding';

  const currentIcon = scope === 'personal' ? User : Heart;
  const CurrentIcon = currentIcon;

  if (compact) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className={className}>
            <CurrentIcon className="w-4 h-4 mr-2" />
            {currentLabel}
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>Planning Context</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem
            onClick={() => handleScopeChange('personal')}
            className={scope === 'personal' ? 'bg-muted' : ''}
          >
            <User className="w-4 h-4 mr-2" />
            My Items
            {scope === 'personal' && (
              <Badge variant="secondary" className="ml-auto">Active</Badge>
            )}
          </DropdownMenuItem>

          {weddings.length > 0 && <DropdownMenuSeparator />}

          {weddings.map((wedding: any) => (
            <DropdownMenuItem
              key={wedding.id}
              onClick={() => handleScopeChange('wedding', wedding.id, wedding.title)}
              className={wedding.id === weddingId ? 'bg-muted' : ''}
            >
              <Heart className="w-4 h-4 mr-2" />
              <div className="flex-1">
                <div className="font-medium">{wedding.title}</div>
                {wedding.event_date && (
                  <div className="text-xs text-muted-foreground">
                    {new Date(wedding.event_date).toLocaleDateString()}
                  </div>
                )}
              </div>
              {wedding.id === weddingId && (
                <Badge variant="secondary" className="ml-2">Active</Badge>
              )}
            </DropdownMenuItem>
          ))}

          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => window.location.href = '/weddings/new'}>
            <Plus className="w-4 h-4 mr-2" />
            Create Wedding
          </DropdownMenuItem>
          
          {weddings.length > 0 && (
            <DropdownMenuItem onClick={() => window.location.href = '/weddings'}>
              <Settings className="w-4 h-4 mr-2" />
              Manage Weddings
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Card className={`${className} p-4`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Planning Context</h3>
          <div className="flex items-center gap-2">
            <CurrentIcon className="w-5 h-5 text-primary" />
            <span className="font-semibold text-lg">{currentLabel}</span>
            {scope === 'wedding' && weddings.find((w: any) => w.id === weddingId)?.event_date && (
              <Badge variant="outline">
                {new Date(weddings.find((w: any) => w.id === weddingId)!.event_date!).toLocaleDateString()}
              </Badge>
            )}
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Switch Context
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>Select Context</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuItem
              onClick={() => handleScopeChange('personal')}
              className={scope === 'personal' ? 'bg-muted' : ''}
            >
              <User className="w-4 h-4 mr-2" />
              My Personal Items
              {scope === 'personal' && (
                <Badge variant="secondary" className="ml-auto">Active</Badge>
              )}
            </DropdownMenuItem>

            {weddings.length > 0 && <DropdownMenuSeparator />}

            {weddings.map((wedding: any) => (
              <DropdownMenuItem
                key={wedding.id}
                onClick={() => handleScopeChange('wedding', wedding.id, wedding.title)}
                className={wedding.id === weddingId ? 'bg-muted' : ''}
              >
                <Heart className="w-4 h-4 mr-2" />
                <div className="flex-1">
                  <div className="font-medium">{wedding.title}</div>
                  {wedding.event_date && (
                    <div className="text-xs text-muted-foreground">
                      {new Date(wedding.event_date).toLocaleDateString()}
                    </div>
                  )}
                </div>
                {wedding.id === weddingId && (
                  <Badge variant="secondary" className="ml-2">Active</Badge>
                )}
              </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={() => window.location.href = '/weddings/new'}>
              <Plus className="w-4 h-4 mr-2" />
              Create New Wedding
            </DropdownMenuItem>
            
            {weddings.length > 0 && (
              <DropdownMenuItem onClick={() => window.location.href = '/weddings'}>
                <Settings className="w-4 h-4 mr-2" />
                Manage Weddings
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {scope === 'wedding' && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>Planning with {weddings.find((w: any) => w.id === weddingId)?.members?.filter((m: any) => m.status === 'active').length || 0} member(s)</span>
          </div>
        </div>
      )}
    </Card>
  );
}
