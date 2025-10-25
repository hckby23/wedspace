/**
 * AI Tool Definitions for Function Calling
 * Defines all available tools that the AI can use to interact with the planning system
 */

import type { OpenRouterFunction } from './OpenRouterService';

export const AI_TOOLS: OpenRouterFunction[] = [
  // ==================== CHECKLIST TOOLS ====================
  {
    name: 'add_checklist_task',
    description: 'Add a new task to the wedding planning checklist',
    parameters: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'The task title/description'
        },
        category: {
          type: 'string',
          enum: ['Venue', 'Catering', 'Photography', 'Invitations', 'Attire', 'Decor', 'Music', 'Transportation', 'Other'],
          description: 'The category this task belongs to'
        },
        priority: {
          type: 'string',
          enum: ['high', 'medium', 'low'],
          description: 'Task priority level'
        },
        dueDate: {
          type: 'string',
          description: 'Due date in ISO format (YYYY-MM-DD), optional'
        }
      },
      required: ['title', 'category', 'priority']
    }
  },
  {
    name: 'complete_checklist_task',
    description: 'Mark a task as completed in the checklist',
    parameters: {
      type: 'object',
      properties: {
        taskId: {
          type: 'string',
          description: 'The unique ID of the task to mark as complete'
        }
      },
      required: ['taskId']
    }
  },
  {
    name: 'remove_checklist_task',
    description: 'Remove a task from the checklist',
    parameters: {
      type: 'object',
      properties: {
        taskId: {
          type: 'string',
          description: 'The unique ID of the task to remove'
        }
      },
      required: ['taskId']
    }
  },
  {
    name: 'get_checklist_tasks',
    description: 'Retrieve all checklist tasks or filter by category/status',
    parameters: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Filter by category (optional)'
        },
        completed: {
          type: 'boolean',
          description: 'Filter by completion status (optional)'
        }
      }
    }
  },

  // ==================== BUDGET TOOLS ====================
  {
    name: 'add_budget_item',
    description: 'Add a new item to the wedding budget',
    parameters: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name of the budget item'
        },
        amount: {
          type: 'number',
          description: 'Planned/estimated amount in rupees'
        },
        category: {
          type: 'string',
          enum: ['Venue', 'Catering', 'Photography', 'Decor', 'Makeup & Styling', 'Music & Entertainment', 'Transport', 'Miscellaneous'],
          description: 'Budget category'
        },
        priority: {
          type: 'string',
          enum: ['high', 'medium', 'low'],
          description: 'Priority level for this expense'
        },
        vendor: {
          type: 'string',
          description: 'Vendor name (optional)'
        },
        notes: {
          type: 'string',
          description: 'Additional notes (optional)'
        },
        status: {
          type: 'string',
          enum: ['planned', 'booked', 'paid'],
          description: 'Payment status'
        }
      },
      required: ['name', 'amount', 'category', 'priority', 'status']
    }
  },
  {
    name: 'update_budget_item',
    description: 'Update an existing budget item',
    parameters: {
      type: 'object',
      properties: {
        itemId: {
          type: 'string',
          description: 'The unique ID of the budget item'
        },
        amount: {
          type: 'number',
          description: 'New amount (optional)'
        },
        actualAmount: {
          type: 'number',
          description: 'Actual spent amount (optional)'
        },
        status: {
          type: 'string',
          enum: ['planned', 'booked', 'paid'],
          description: 'Updated status (optional)'
        },
        vendor: {
          type: 'string',
          description: 'Vendor name (optional)'
        },
        notes: {
          type: 'string',
          description: 'Additional notes (optional)'
        }
      },
      required: ['itemId']
    }
  },
  {
    name: 'get_budget_summary',
    description: 'Get a summary of the wedding budget including totals and breakdown by category',
    parameters: {
      type: 'object',
      properties: {
        includePredictions: {
          type: 'boolean',
          description: 'Whether to include AI-powered budget predictions and recommendations'
        }
      }
    }
  },
  {
    name: 'set_total_budget',
    description: 'Set or update the total wedding budget',
    parameters: {
      type: 'object',
      properties: {
        totalBudget: {
          type: 'number',
          description: 'Total budget amount in rupees'
        }
      },
      required: ['totalBudget']
    }
  },

  // ==================== TIMELINE TOOLS ====================
  {
    name: 'add_timeline_milestone',
    description: 'Add a new milestone or deadline to the wedding timeline',
    parameters: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Milestone title'
        },
        date: {
          type: 'string',
          description: 'Date in ISO format (YYYY-MM-DD)'
        },
        description: {
          type: 'string',
          description: 'Detailed description of the milestone'
        },
        category: {
          type: 'string',
          description: 'Category (e.g., Booking, Planning, Ceremony)'
        }
      },
      required: ['title', 'date']
    }
  },
  {
    name: 'generate_timeline',
    description: 'Generate a recommended wedding planning timeline based on event date',
    parameters: {
      type: 'object',
      properties: {
        eventDate: {
          type: 'string',
          description: 'Wedding date in ISO format (YYYY-MM-DD)'
        },
        eventType: {
          type: 'string',
          description: 'Type of wedding (e.g., Hindu, Muslim, Christian, Sikh)'
        },
        numberOfEvents: {
          type: 'number',
          description: 'Number of events/ceremonies (e.g., 3 for mehendi, sangeet, wedding)'
        }
      },
      required: ['eventDate']
    }
  },

  // ==================== GUEST LIST TOOLS ====================
  {
    name: 'add_guest',
    description: 'Add a guest to the wedding guest list',
    parameters: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Guest full name'
        },
        category: {
          type: 'string',
          enum: ['Family', 'Friends', 'Colleagues', 'Relatives', 'VIP'],
          description: 'Guest category'
        },
        side: {
          type: 'string',
          enum: ['Bride', 'Groom', 'Both'],
          description: 'Which side the guest belongs to'
        },
        email: {
          type: 'string',
          description: 'Guest email address (optional)'
        },
        phone: {
          type: 'string',
          description: 'Guest phone number (optional)'
        },
        plusOne: {
          type: 'boolean',
          description: 'Whether guest can bring a plus one'
        },
        dietaryRestrictions: {
          type: 'array',
          items: { type: 'string' },
          description: 'Dietary restrictions/preferences'
        }
      },
      required: ['name', 'category', 'side']
    }
  },
  {
    name: 'update_rsvp_status',
    description: 'Update RSVP status for a guest',
    parameters: {
      type: 'object',
      properties: {
        guestId: {
          type: 'string',
          description: 'Unique guest ID'
        },
        status: {
          type: 'string',
          enum: ['pending', 'confirmed', 'declined'],
          description: 'RSVP status'
        }
      },
      required: ['guestId', 'status']
    }
  },
  {
    name: 'get_guest_count',
    description: 'Get current guest count and statistics',
    parameters: {
      type: 'object',
      properties: {
        includeBreakdown: {
          type: 'boolean',
          description: 'Include breakdown by category, side, and RSVP status'
        }
      }
    }
  },

  // ==================== SEARCH & RECOMMENDATIONS ====================
  {
    name: 'search_venues',
    description: 'Search for wedding venues based on criteria',
    parameters: {
      type: 'object',
      properties: {
        location: {
          type: 'string',
          description: 'City or area to search in'
        },
        minPrice: {
          type: 'number',
          description: 'Minimum price per event'
        },
        maxPrice: {
          type: 'number',
          description: 'Maximum price per event'
        },
        guestCount: {
          type: 'number',
          description: 'Expected number of guests'
        },
        venueType: {
          type: 'string',
          description: 'Type of venue (e.g., banquet hall, resort, garden)'
        },
        amenities: {
          type: 'array',
          items: { type: 'string' },
          description: 'Required amenities'
        },
        rating: {
          type: 'number',
          description: 'Minimum rating (1-5)'
        }
      }
    }
  },
  {
    name: 'search_vendors',
    description: 'Search for wedding vendors (photographers, decorators, caterers, etc.)',
    parameters: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Vendor category (e.g., Photography, Catering, Decoration, Makeup)'
        },
        location: {
          type: 'string',
          description: 'City or area'
        },
        minPrice: {
          type: 'number',
          description: 'Minimum price'
        },
        maxPrice: {
          type: 'number',
          description: 'Maximum price'
        },
        rating: {
          type: 'number',
          description: 'Minimum rating (1-5)'
        },
        style: {
          type: 'string',
          description: 'Preferred style (e.g., traditional, modern, candid for photography)'
        }
      },
      required: ['category']
    }
  },
  {
    name: 'get_recommendations',
    description: 'Get AI-powered recommendations based on user preferences and current planning state',
    parameters: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          enum: ['venue', 'vendor', 'budget_optimization', 'timeline_optimization'],
          description: 'Type of recommendations to get'
        },
        limit: {
          type: 'number',
          description: 'Maximum number of recommendations to return'
        }
      },
      required: ['type']
    }
  },

  // ==================== PREFERENCES & SETTINGS ====================
  {
    name: 'update_preferences',
    description: 'Update user preferences for better personalization',
    parameters: {
      type: 'object',
      properties: {
        weddingStyle: {
          type: 'array',
          items: { 
            type: 'string',
            enum: ['traditional', 'modern', 'fusion', 'minimalist', 'grand']
          },
          description: 'Preferred wedding styles'
        },
        colorPreferences: {
          type: 'array',
          items: { type: 'string' },
          description: 'Preferred color themes'
        },
        budgetPriority: {
          type: 'string',
          enum: ['value', 'quality', 'balanced', 'luxury'],
          description: 'Budget priority approach'
        },
        culturalTraditions: {
          type: 'array',
          items: { type: 'string' },
          description: 'Cultural traditions to include'
        }
      }
    }
  },

  // ==================== DATA EXPORT ====================
  {
    name: 'export_planning_data',
    description: 'Export all planning data (checklist, budget, timeline, guests) in specified format',
    parameters: {
      type: 'object',
      properties: {
        format: {
          type: 'string',
          enum: ['json', 'csv', 'pdf'],
          description: 'Export format'
        },
        sections: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['checklist', 'budget', 'timeline', 'guests', 'all']
          },
          description: 'Which sections to export'
        }
      },
      required: ['format']
    }
  }
];

// Tool categories for easier management
export const TOOL_CATEGORIES = {
  CHECKLIST: AI_TOOLS.filter(t => t.name.includes('checklist')),
  BUDGET: AI_TOOLS.filter(t => t.name.includes('budget')),
  TIMELINE: AI_TOOLS.filter(t => t.name.includes('timeline')),
  GUESTS: AI_TOOLS.filter(t => t.name.includes('guest') || t.name.includes('rsvp')),
  SEARCH: AI_TOOLS.filter(t => t.name.includes('search') || t.name.includes('recommendations')),
  PREFERENCES: AI_TOOLS.filter(t => t.name.includes('preferences')),
  EXPORT: AI_TOOLS.filter(t => t.name.includes('export'))
};
