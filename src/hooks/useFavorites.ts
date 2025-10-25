"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface FavoriteItem {
  id: string;
  user_id: string;
  listing_id: string;
  listing_type: 'venue' | 'vendor';
  created_at: string;
  listing: {
    id: string;
    name: string;
    image: string;
    location: string;
    price: number;
    rating: number;
    type: string;
  };
}

export interface FavoritesList {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  items_count: number;
  items?: FavoriteItem[];
}

// Get user's favorites
export const useFavorites = (type?: 'venue' | 'vendor', page = 1, limit = 12) => {
  return useQuery({
    queryKey: ['favorites', type, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });
      if (type) params.append('type', type);

      const response = await fetch(`/api/favorites?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch favorites');
      }
      return response.json();
    }
  });
};

// Get user's favorite lists
export const useFavoriteLists = () => {
  return useQuery({
    queryKey: ['favorite-lists'],
    queryFn: async () => {
      const response = await fetch('/api/favorites/lists');
      if (!response.ok) {
        throw new Error('Failed to fetch favorite lists');
      }
      return response.json();
    }
  });
};

// Get specific favorite list
export const useFavoriteList = (listId: string) => {
  return useQuery({
    queryKey: ['favorite-list', listId],
    queryFn: async () => {
      const response = await fetch(`/api/favorites/lists/${listId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch favorite list');
      }
      return response.json();
    },
    enabled: !!listId
  });
};

// Toggle favorite status
export const useToggleFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      listingId, 
      listingType, 
      isFavorite,
      listId 
    }: { 
      listingId: string; 
      listingType: 'venue' | 'vendor'; 
      isFavorite: boolean;
      listId?: string;
    }) => {
      const response = await fetch('/api/favorites', {
        method: isFavorite ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listing_id: listingId,
          listing_type: listingType,
          list_id: listId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle favorite');
      }

      return { listingId, listingType, isFavorite: !isFavorite };
    },
    onSuccess: (data) => {
      // Invalidate favorites queries
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['favorite-lists'] });
      
      // Update listings cache to reflect favorite status
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      
      // Update specific venue/vendor cache
      if (data.listingType === 'venue') {
        queryClient.setQueryData(['venue', data.listingId], (old: any) => {
          if (old) {
            return { ...old, isFavorite: data.isFavorite };
          }
          return old;
        });
      } else {
        queryClient.setQueryData(['vendor', data.listingId], (old: any) => {
          if (old) {
            return { ...old, isFavorite: data.isFavorite };
          }
          return old;
        });
      }
    },
  });
};

// Create favorite list
export const useCreateFavoriteList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listData: {
      name: string;
      description?: string;
      is_public?: boolean;
    }) => {
      const response = await fetch('/api/favorites/lists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(listData),
      });

      if (!response.ok) {
        throw new Error('Failed to create favorite list');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorite-lists'] });
    },
  });
};

// Update favorite list
export const useUpdateFavoriteList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      listId, 
      updates 
    }: { 
      listId: string; 
      updates: Partial<Pick<FavoritesList, 'name' | 'description' | 'is_public'>>
    }) => {
      const response = await fetch(`/api/favorites/lists/${listId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update favorite list');
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['favorite-lists'] });
      queryClient.invalidateQueries({ queryKey: ['favorite-list', data.id] });
    },
  });
};

// Delete favorite list
export const useDeleteFavoriteList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listId: string) => {
      const response = await fetch(`/api/favorites/lists/${listId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete favorite list');
      }

      return listId;
    },
    onSuccess: (listId) => {
      queryClient.invalidateQueries({ queryKey: ['favorite-lists'] });
      queryClient.removeQueries({ queryKey: ['favorite-list', listId] });
    },
  });
};

// Add item to favorite list
export const useAddToFavoriteList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      listId,
      listingId,
      listingType
    }: {
      listId: string;
      listingId: string;
      listingType: 'venue' | 'vendor';
    }) => {
      const response = await fetch(`/api/favorites/lists/${listId}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listing_id: listingId,
          listing_type: listingType
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add item to favorite list');
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['favorite-list', variables.listId] });
      queryClient.invalidateQueries({ queryKey: ['favorite-lists'] });
    },
  });
};

// Remove item from favorite list
export const useRemoveFromFavoriteList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      listId,
      itemId
    }: {
      listId: string;
      itemId: string;
    }) => {
      const response = await fetch(`/api/favorites/lists/${listId}/items/${itemId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove item from favorite list');
      }

      return { listId, itemId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['favorite-list', data.listId] });
      queryClient.invalidateQueries({ queryKey: ['favorite-lists'] });
    },
  });
};

// Share favorite list
export const useShareFavoriteList = () => {
  return useMutation({
    mutationFn: async (listId: string) => {
      const response = await fetch(`/api/favorites/lists/${listId}/share`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to generate share link');
      }

      return response.json();
    },
  });
};

// Get public favorite list (for shared links)
export const usePublicFavoriteList = (shareToken: string) => {
  return useQuery({
    queryKey: ['public-favorite-list', shareToken],
    queryFn: async () => {
      const response = await fetch(`/api/favorites/shared/${shareToken}`);
      if (!response.ok) {
        throw new Error('Failed to fetch shared favorite list');
      }
      return response.json();
    },
    enabled: !!shareToken
  });
};

// Check if item is favorited
export const useIsFavorite = (listingId: string, listingType: 'venue' | 'vendor') => {
  return useQuery({
    queryKey: ['is-favorite', listingId, listingType],
    queryFn: async () => {
      const response = await fetch(`/api/favorites/check?listing_id=${listingId}&listing_type=${listingType}`);
      if (!response.ok) {
        throw new Error('Failed to check favorite status');
      }
      const data = await response.json();
      return data.isFavorite;
    },
    enabled: !!listingId && !!listingType
  });
};
