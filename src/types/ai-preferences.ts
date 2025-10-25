/**
 * AI Assistant Preferences Types
 * Defines user preferences for AI-powered features and personalization
 */

export type CommunicationStyle = 'casual' | 'formal' | 'friendly' | 'concise' | 'detailed';
export type BudgetPriority = 'value' | 'quality' | 'balanced' | 'luxury';
export type PlanningStyle = 'traditional' | 'modern' | 'fusion' | 'minimalist' | 'grand';
export type DecisionStyle = 'quick' | 'thorough' | 'collaborative' | 'independent';

export interface AIPreferences {
  id: string;
  user_id: string;
  
  // Communication Preferences
  communication_style: CommunicationStyle;
  language_preference: string; // e.g., 'en', 'hi', 'mixed'
  formality_level: number; // 1-5 scale
  response_length: 'brief' | 'moderate' | 'detailed';
  
  // Wedding Planning Preferences
  wedding_style: PlanningStyle[];
  budget_priority: BudgetPriority;
  event_type: string[]; // ['wedding', 'reception', 'sangeet', etc.]
  preferred_vendors: string[]; // vendor categories
  
  // Cultural & Regional Preferences
  cultural_traditions: string[];
  regional_preferences: string[];
  religious_requirements: string[];
  dietary_restrictions: string[];
  
  // AI Behavior Preferences
  proactive_suggestions: boolean;
  auto_save_preferences: boolean;
  learning_enabled: boolean;
  share_with_partner: boolean;
  
  // Personalization Settings
  color_preferences: string[];
  theme_preferences: string[];
  music_preferences: string[];
  cuisine_preferences: string[];
  
  // Notification Preferences
  ai_reminder_frequency: 'none' | 'minimal' | 'moderate' | 'frequent';
  suggestion_timing: 'immediate' | 'batched' | 'scheduled';
  
  // Privacy Settings
  data_collection_consent: boolean;
  analytics_enabled: boolean;
  third_party_sharing: boolean;
  
  // Metadata
  created_at: string;
  updated_at: string;
  last_interaction_at?: string;
  preference_version: number;
}

export interface AIInteractionHistory {
  id: string;
  user_id: string;
  session_id: string;
  interaction_type: 'query' | 'suggestion' | 'action' | 'feedback';
  user_input?: string;
  ai_response?: string;
  feedback_score?: number; // -1 to 1
  preferences_snapshot?: Partial<AIPreferences>;
  context_data?: Record<string, any>;
  created_at: string;
}

export interface AILearningData {
  id: string;
  user_id: string;
  category: string;
  learned_preference: string;
  confidence_score: number; // 0-1
  sample_count: number;
  last_reinforced_at: string;
  created_at: string;
}

export interface PreferenceUpdate {
  category: keyof AIPreferences;
  value: any;
  source: 'manual' | 'learned' | 'suggested' | 'imported';
  confidence?: number;
}

export interface AIContext {
  user_preferences: AIPreferences;
  recent_interactions: AIInteractionHistory[];
  learned_patterns: AILearningData[];
  current_planning_stage?: string;
  budget_info?: {
    total: number;
    spent: number;
    remaining: number;
  };
  event_details?: {
    date?: string;
    guest_count?: number;
    location?: string;
  };
}

export const DEFAULT_AI_PREFERENCES: Omit<AIPreferences, 'id' | 'user_id' | 'created_at' | 'updated_at'> = {
  communication_style: 'friendly',
  language_preference: 'en',
  formality_level: 3,
  response_length: 'moderate',
  
  wedding_style: ['modern'],
  budget_priority: 'balanced',
  event_type: ['wedding'],
  preferred_vendors: [],
  
  cultural_traditions: [],
  regional_preferences: [],
  religious_requirements: [],
  dietary_restrictions: [],
  
  proactive_suggestions: true,
  auto_save_preferences: true,
  learning_enabled: true,
  share_with_partner: false,
  
  color_preferences: [],
  theme_preferences: [],
  music_preferences: [],
  cuisine_preferences: [],
  
  ai_reminder_frequency: 'moderate',
  suggestion_timing: 'immediate',
  
  data_collection_consent: true,
  analytics_enabled: true,
  third_party_sharing: false,
  
  preference_version: 1
};
