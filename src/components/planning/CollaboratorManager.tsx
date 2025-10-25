"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  UserPlus, 
  Trash2, 
  Mail, 
  Shield,
  Eye,
  Edit,
  Crown,
  Check,
  X
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sharedPlanningService } from '@/services/SharedPlanningService';

interface CollaboratorManagerProps {
  userId: string;
  className?: string;
}

export default function CollaboratorManager({ userId, className = '' }: CollaboratorManagerProps) {
  const [email, setEmail] = useState('');
  const [accessLevel, setAccessLevel] = useState<'view' | 'edit' | 'admin'>('view');
  const [showInviteForm, setShowInviteForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: collaborators = [], isLoading } = useQuery({
    queryKey: ['collaborators', userId],
    queryFn: () => sharedPlanningService.getCollaborators(userId)
  });

  const inviteMutation = useMutation({
    mutationFn: () => sharedPlanningService.inviteCollaborator({
      userId,
      email,
      accessLevel
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collaborators'] });
      setEmail('');
      setShowInviteForm(false);
    }
  });

  const removeMutation = useMutation({
    mutationFn: (accessId: string) => sharedPlanningService.removeCollaborator(accessId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collaborators'] });
    }
  });

  const getAccessIcon = (level: string) => {
    switch (level) {
      case 'view': return <Eye className="w-4 h-4" />;
      case 'edit': return <Edit className="w-4 h-4" />;
      case 'admin': return <Crown className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  const getAccessBadge = (level: string) => {
    const colors = {
      view: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      edit: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300'
    };
    return colors[level as keyof typeof colors] || colors.view;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Collaborators</CardTitle>
          <Button
            size="sm"
            onClick={() => setShowInviteForm(!showInviteForm)}
            className="bg-red-600 hover:bg-red-700"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Invite
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {showInviteForm && (
          <div className="border dark:border-gray-700 rounded-lg p-4 space-y-4 bg-gray-50 dark:bg-gray-800">
            <div>
              <Label>Email Address</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="colleague@example.com"
                className="mt-2"
              />
            </div>

            <div>
              <Label>Access Level</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {(['view', 'edit', 'admin'] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setAccessLevel(level)}
                    className={`p-3 border rounded-lg text-center transition-colors ${
                      accessLevel === level
                        ? 'border-red-600 bg-red-50 dark:bg-red-900/20'
                        : 'border-gray-300 dark:border-gray-700 hover:border-red-600'
                    }`}
                  >
                    {getAccessIcon(level)}
                    <div className="text-xs mt-1 font-medium capitalize">{level}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowInviteForm(false)}
                className="flex-1"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={() => inviteMutation.mutate()}
                disabled={!email || inviteMutation.isPending}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                <Check className="w-4 h-4 mr-2" />
                {inviteMutation.isPending ? 'Sending...' : 'Send Invite'}
              </Button>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Loading...
          </div>
        ) : collaborators.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <UserPlus className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No collaborators yet</p>
            <p className="text-sm">Invite family members to help plan together</p>
          </div>
        ) : (
          <div className="space-y-2">
            {collaborators.map((collab) => (
              <div
                key={collab.id}
                className="flex items-center justify-between p-3 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-amber-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {collab.shared_with_email.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{collab.shared_with_email}</div>
                    <Badge className={`text-xs ${getAccessBadge(collab.access_level)}`}>
                      {getAccessIcon(collab.access_level)}
                      <span className="ml-1 capitalize">{collab.access_level}</span>
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeMutation.mutate(collab.id)}
                  disabled={removeMutation.isPending}
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
