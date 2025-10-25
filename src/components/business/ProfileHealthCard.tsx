"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import type { ProfileHealth } from '@/types/business';

interface ProfileHealthCardProps {
  health: ProfileHealth;
  onActionClick?: (action: string) => void;
}

export default function ProfileHealthCard({ health, onActionClick }: ProfileHealthCardProps) {
  const getHealthColor = (completeness: number) => {
    if (completeness >= 80) return 'text-green-600 dark:text-green-400';
    if (completeness >= 50) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getHealthBadge = (completeness: number) => {
    if (completeness >= 80) return { text: 'Excellent', variant: 'default' as const };
    if (completeness >= 50) return { text: 'Good', variant: 'secondary' as const };
    return { text: 'Needs Work', variant: 'destructive' as const };
  };

  const getVerificationBadge = () => {
    switch (health.verification_status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">✓ Verified</Badge>;
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400">⏳ Pending</Badge>;
      default:
        return <Badge variant="outline">Not Verified</Badge>;
    }
  };

  const badge = getHealthBadge(health.completeness);

  return (
    <Card className="border-l-4 border-l-red-600">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              Profile Health
              <Badge variant={badge.variant}>{badge.text}</Badge>
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Complete your profile to improve visibility and ranking
            </p>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold ${getHealthColor(health.completeness)}`}>
              {health.completeness}%
            </div>
            {getVerificationBadge()}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2 text-sm">
            <span className="text-gray-600 dark:text-gray-400">Profile Completeness</span>
            <span className="font-medium">{health.completeness}%</span>
          </div>
          <Progress value={health.completeness} className="h-3" />
        </div>

        {health.missing_items.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              Action Items ({health.missing_items.length})
            </h4>
            <div className="space-y-2">
              {health.missing_items.slice(0, 3).map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-200 dark:border-amber-800"
                >
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white">{item}</p>
                  </div>
                  {onActionClick && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onActionClick(item)}
                      className="flex-shrink-0"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            {health.missing_items.length > 3 && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                +{health.missing_items.length - 3} more items
              </p>
            )}
          </div>
        )}

        {health.suggestions.length > 0 && (
          <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Quick Wins
            </h4>
            <ul className="space-y-1">
              {health.suggestions.map((suggestion, index) => (
                <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                  <span className="text-green-500">•</span>
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}

        {health.completeness < 100 && (
          <Button className="w-full bg-red-600 hover:bg-red-700" onClick={() => onActionClick?.('complete-profile')}>
            Complete Your Profile
          </Button>
        )}

        <p className="text-xs text-gray-500 dark:text-gray-400">
          Last updated: {new Date(health.last_updated).toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  );
}
