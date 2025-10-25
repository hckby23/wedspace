/**
 * AI Tool Executor
 * Executes function calls from the AI assistant
 */

import type { Database } from '@/types/db';

type ChecklistTask = {
  id: string;
  title: string;
  done: boolean;
  category: string;
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
  createdAt: string;
};

type BudgetItem = {
  id: string;
  name: string;
  amount: number;
  category: string;
  priority: 'high' | 'medium' | 'low';
  status: 'planned' | 'booked' | 'paid';
  vendor?: string;
  notes?: string;
  actualAmount?: number;
  createdAt: string;
};

type Guest = {
  id: string;
  name: string;
  category: string;
  side: 'Bride' | 'Groom' | 'Both';
  email?: string;
  phone?: string;
  rsvpStatus: 'pending' | 'confirmed' | 'declined';
  plusOne: boolean;
  dietaryRestrictions?: string[];
  createdAt: string;
};

export interface ToolExecutionResult {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
}

export class AIToolExecutor {
  private userId: string;
  private weddingId?: string;

  constructor(userId: string, weddingId?: string) {
    this.userId = userId;
    this.weddingId = weddingId;
  }

  /**
   * Execute a tool function by name
   */
  async execute(toolName: string, args: any): Promise<ToolExecutionResult> {
    try {
      switch (toolName) {
        // CHECKLIST TOOLS
        case 'add_checklist_task':
          return await this.addChecklistTask(args);
        case 'complete_checklist_task':
          return await this.completeChecklistTask(args);
        case 'remove_checklist_task':
          return await this.removeChecklistTask(args);
        case 'get_checklist_tasks':
          return await this.getChecklistTasks(args);

        // BUDGET TOOLS
        case 'add_budget_item':
          return await this.addBudgetItem(args);
        case 'update_budget_item':
          return await this.updateBudgetItem(args);
        case 'get_budget_summary':
          return await this.getBudgetSummary(args);
        case 'set_total_budget':
          return await this.setTotalBudget(args);

        // TIMELINE TOOLS
        case 'add_timeline_milestone':
          return await this.addTimelineMilestone(args);
        case 'generate_timeline':
          return await this.generateTimeline(args);

        // GUEST TOOLS
        case 'add_guest':
          return await this.addGuest(args);
        case 'update_rsvp_status':
          return await this.updateRsvpStatus(args);
        case 'get_guest_count':
          return await this.getGuestCount(args);

        // SEARCH TOOLS
        case 'search_venues':
          return await this.searchVenues(args);
        case 'search_vendors':
          return await this.searchVendors(args);
        case 'get_recommendations':
          return await this.getRecommendations(args);

        // PREFERENCES
        case 'update_preferences':
          return await this.updatePreferences(args);

        // EXPORT
        case 'export_planning_data':
          return await this.exportPlanningData(args);

        default:
          return {
            success: false,
            error: `Unknown tool: ${toolName}`
          };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // ==================== CHECKLIST IMPLEMENTATIONS ====================
  
  private async addChecklistTask(args: {
    title: string;
    category: string;
    priority: 'high' | 'medium' | 'low';
    dueDate?: string;
  }): Promise<ToolExecutionResult> {
    const response = await fetch('/api/planning/checklist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: this.userId,
        weddingId: this.weddingId,
        task: {
          title: args.title,
          category: args.category,
          priority: args.priority,
          dueDate: args.dueDate,
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message };
    }

    const data = await response.json();
    return {
      success: true,
      data: data.task,
      message: `Added task: "${args.title}" to ${args.category}`
    };
  }

  private async completeChecklistTask(args: { taskId: string }): Promise<ToolExecutionResult> {
    const response = await fetch(`/api/planning/checklist/${args.taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: this.userId,
        done: true
      })
    });

    if (!response.ok) {
      return { success: false, error: 'Failed to complete task' };
    }

    return {
      success: true,
      message: 'Task marked as complete'
    };
  }

  private async removeChecklistTask(args: { taskId: string }): Promise<ToolExecutionResult> {
    const response = await fetch(`/api/planning/checklist/${args.taskId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: this.userId })
    });

    if (!response.ok) {
      return { success: false, error: 'Failed to remove task' };
    }

    return {
      success: true,
      message: 'Task removed from checklist'
    };
  }

  private async getChecklistTasks(args: {
    category?: string;
    completed?: boolean;
  }): Promise<ToolExecutionResult> {
    const params = new URLSearchParams({
      userId: this.userId,
      ...(args.category && { category: args.category }),
      ...(args.completed !== undefined && { completed: String(args.completed) })
    });

    const response = await fetch(`/api/planning/checklist?${params}`);
    
    if (!response.ok) {
      return { success: false, error: 'Failed to fetch tasks' };
    }

    const data = await response.json();
    return {
      success: true,
      data: data.tasks
    };
  }

  // ==================== BUDGET IMPLEMENTATIONS ====================

  private async addBudgetItem(args: {
    name: string;
    amount: number;
    category: string;
    priority: 'high' | 'medium' | 'low';
    vendor?: string;
    notes?: string;
    status: 'planned' | 'booked' | 'paid';
  }): Promise<ToolExecutionResult> {
    const response = await fetch('/api/planning/budget', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: this.userId,
        item: args
      })
    });

    if (!response.ok) {
      return { success: false, error: 'Failed to add budget item' };
    }

    const data = await response.json();
    return {
      success: true,
      data: data.item,
      message: `Added ₹${args.amount.toLocaleString('en-IN')} for ${args.name}`
    };
  }

  private async updateBudgetItem(args: {
    itemId: string;
    amount?: number;
    actualAmount?: number;
    status?: 'planned' | 'booked' | 'paid';
    vendor?: string;
    notes?: string;
  }): Promise<ToolExecutionResult> {
    const response = await fetch(`/api/planning/budget/${args.itemId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: this.userId,
        updates: args
      })
    });

    if (!response.ok) {
      return { success: false, error: 'Failed to update budget item' };
    }

    return {
      success: true,
      message: 'Budget item updated successfully'
    };
  }

  private async getBudgetSummary(args: {
    includePredictions?: boolean;
  }): Promise<ToolExecutionResult> {
    const params = new URLSearchParams({
      userId: this.userId,
      ...(args.includePredictions && { predictions: 'true' })
    });

    const response = await fetch(`/api/planning/budget/summary?${params}`);
    
    if (!response.ok) {
      return { success: false, error: 'Failed to fetch budget summary' };
    }

    const data = await response.json();
    return {
      success: true,
      data: data.summary
    };
  }

  private async setTotalBudget(args: {
    totalBudget: number;
  }): Promise<ToolExecutionResult> {
    const response = await fetch('/api/planning/budget/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: this.userId,
        totalBudget: args.totalBudget
      })
    });

    if (!response.ok) {
      return { success: false, error: 'Failed to set total budget' };
    }

    return {
      success: true,
      message: `Total budget set to ₹${args.totalBudget.toLocaleString('en-IN')}`
    };
  }

  // ==================== TIMELINE IMPLEMENTATIONS ====================

  private async addTimelineMilestone(args: {
    title: string;
    date: string;
    description?: string;
    category?: string;
  }): Promise<ToolExecutionResult> {
    const response = await fetch('/api/planning/timeline', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: this.userId,
        milestone: args
      })
    });

    if (!response.ok) {
      return { success: false, error: 'Failed to add milestone' };
    }

    const data = await response.json();
    return {
      success: true,
      data: data.milestone,
      message: `Added milestone: ${args.title} on ${args.date}`
    };
  }

  private async generateTimeline(args: {
    eventDate: string;
    eventType?: string;
    numberOfEvents?: number;
  }): Promise<ToolExecutionResult> {
    const response = await fetch('/api/planning/timeline/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: this.userId,
        ...args
      })
    });

    if (!response.ok) {
      return { success: false, error: 'Failed to generate timeline' };
    }

    const data = await response.json();
    return {
      success: true,
      data: data.timeline,
      message: 'Generated wedding planning timeline'
    };
  }

  // ==================== GUEST IMPLEMENTATIONS ====================

  private async addGuest(args: {
    name: string;
    category: string;
    side: 'Bride' | 'Groom' | 'Both';
    email?: string;
    phone?: string;
    plusOne?: boolean;
    dietaryRestrictions?: string[];
  }): Promise<ToolExecutionResult> {
    const response = await fetch('/api/planning/guests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: this.userId,
        guest: args
      })
    });

    if (!response.ok) {
      return { success: false, error: 'Failed to add guest' };
    }

    const data = await response.json();
    return {
      success: true,
      data: data.guest,
      message: `Added ${args.name} to guest list`
    };
  }

  private async updateRsvpStatus(args: {
    guestId: string;
    status: 'pending' | 'confirmed' | 'declined';
  }): Promise<ToolExecutionResult> {
    const response = await fetch(`/api/planning/guests/${args.guestId}/rsvp`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: this.userId,
        status: args.status
      })
    });

    if (!response.ok) {
      return { success: false, error: 'Failed to update RSVP' };
    }

    return {
      success: true,
      message: `RSVP status updated to ${args.status}`
    };
  }

  private async getGuestCount(args: {
    includeBreakdown?: boolean;
  }): Promise<ToolExecutionResult> {
    const params = new URLSearchParams({
      userId: this.userId,
      ...(args.includeBreakdown && { breakdown: 'true' })
    });

    const response = await fetch(`/api/planning/guests/count?${params}`);
    
    if (!response.ok) {
      return { success: false, error: 'Failed to fetch guest count' };
    }

    const data = await response.json();
    return {
      success: true,
      data: data
    };
  }

  // ==================== SEARCH IMPLEMENTATIONS ====================

  private async searchVenues(args: any): Promise<ToolExecutionResult> {
    const response = await fetch('/api/venues', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filters: args })
    });

    if (!response.ok) {
      return { success: false, error: 'Failed to search venues' };
    }

    const data = await response.json();
    return {
      success: true,
      data: data.venues
    };
  }

  private async searchVendors(args: any): Promise<ToolExecutionResult> {
    const response = await fetch('/api/vendors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filters: args })
    });

    if (!response.ok) {
      return { success: false, error: 'Failed to search vendors' };
    }

    const data = await response.json();
    return {
      success: true,
      data: data.vendors
    };
  }

  private async getRecommendations(args: {
    type: 'venue' | 'vendor' | 'budget_optimization' | 'timeline_optimization';
    limit?: number;
  }): Promise<ToolExecutionResult> {
    const response = await fetch('/api/ai/recommendations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: this.userId,
        ...args
      })
    });

    if (!response.ok) {
      return { success: false, error: 'Failed to get recommendations' };
    }

    const data = await response.json();
    return {
      success: true,
      data: data.recommendations
    };
  }

  // ==================== PREFERENCES ====================

  private async updatePreferences(args: any): Promise<ToolExecutionResult> {
    const response = await fetch('/api/preferences', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: this.userId,
        preferences: args
      })
    });

    if (!response.ok) {
      return { success: false, error: 'Failed to update preferences' };
    }

    return {
      success: true,
      message: 'Preferences updated successfully'
    };
  }

  // ==================== EXPORT ====================

  private async exportPlanningData(args: {
    format: 'json' | 'csv' | 'pdf';
    sections?: string[];
  }): Promise<ToolExecutionResult> {
    const response = await fetch('/api/planning/export', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: this.userId,
        ...args
      })
    });

    if (!response.ok) {
      return { success: false, error: 'Failed to export data' };
    }

    const data = await response.json();
    return {
      success: true,
      data: data.exportUrl,
      message: `Data exported as ${args.format}`
    };
  }
}
