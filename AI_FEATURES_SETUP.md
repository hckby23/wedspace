# WedSpace AI Features Setup Guide

## Overview
WedSpace includes comprehensive AI-powered features for wedding planning and search, powered by OpenRouter API with function calling capabilities.

## Features Implemented

### 1. AI Assistant with Tool Calling
- **Location**: `/api/ai/chat`
- **Capabilities**:
  - Natural language conversation
  - Function calling to modify planning data (checklist, budget, timeline, guests)
  - Context-aware recommendations
  - User preference tracking

### 2. AI-Powered Search
- **Location**: `/api/ai/search`
- **Features**:
  - Natural language queries ("luxury palace venues in Jaipur under ₹10L")
  - Smart filter extraction
  - Semantic relevance ranking
  - Insight generation

### 3. Image-Based Discovery
- **Location**: `/api/ai/multimodal-search`
- **Features**:
  - Upload reference images
  - Find similar venues by style
  - Visual pattern matching

## Setup Instructions

### 1. Get OpenRouter API Key
1. Visit [OpenRouter.ai](https://openrouter.ai/)
2. Sign up for an account
3. Generate an API key from your dashboard
4. Copy the key (starts with `sk-or-v1-...`)

### 2. Configure Environment
Add to your `.env.local`:
```bash
OPENROUTER_API_KEY=sk-or-v1-your-actual-key-here
```

### 3. Verify Integration
Test the AI chat endpoint:
```bash
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Find me venues in Delhi",
    "context": {
      "userId": "user-id-here"
    }
  }'
```

## AI Tool Definitions

The assistant can call the following tools:

### Checklist Tools
- `add_checklist_task` - Add wedding planning tasks
- `complete_checklist_task` - Mark tasks complete
- `remove_checklist_task` - Delete tasks
- `get_checklist_tasks` - Retrieve tasks with filters

### Budget Tools
- `add_budget_item` - Add expense items
- `update_budget_item` - Modify budget entries
- `get_budget_summary` - Get spending overview
- `set_total_budget` - Update total budget

### Search Tools
- `search_venues` - Find venues with criteria
- `search_vendors` - Find vendors by category
- `get_recommendations` - AI-powered suggestions

### Preference Tools
- `update_preferences` - Modify user preferences for better personalization

## Architecture

```
┌─────────────────┐
│   User Chat UI  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ /api/ai/chat    │ ◄── Orchestrates conversation
└────────┬────────┘
         │
         ├──► OpenRouterService    (API calls)
         ├──► AIToolDefinitions    (Available functions)
         ├──► AIToolExecutor       (Executes tool calls)
         └──► EnhancedAIAssistant  (Agent loop)
```

## Usage in UI

### Basic Chat Integration
```tsx
import { useState } from 'react';

function ChatComponent({ userId }) {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');

  const sendMessage = async () => {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        context: { userId }
      })
    });
    const data = await res.json();
    setResponse(data.response);
  };

  return (
    <div>
      <input value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
      <p>{response}</p>
    </div>
  );
}
```

### With Tool Confirmation
Add confirmation modals for destructive actions:
```tsx
if (toolsUsed.includes('add_budget_item')) {
  const confirmed = await confirmModal({
    title: 'Add Budget Item?',
    message: `Add ₹${amount} for ${itemName}?`
  });
  if (!confirmed) return;
}
```

## Safety & Best Practices

### 1. User Confirmation
Always confirm before:
- Adding/deleting items
- Modifying budget
- Changing availability

### 2. Rate Limiting
- Implement per-user rate limits
- Cache frequent queries
- Monitor token usage

### 3. Error Handling
```typescript
try {
  const response = await assistant.chat(message, context);
  // Handle success
} catch (error) {
  // Graceful degradation
  return fallbackResponse;
}
```

### 4. Privacy
- Never send PII not required for the query
- Log interactions for analytics (anonymized)
- Respect user opt-out preferences

## Cost Management

### OpenRouter Pricing
- Varies by model
- Recommended: `anthropic/claude-3.5-sonnet` or `openai/gpt-4-turbo`
- Monitor usage via OpenRouter dashboard

### Optimization Tips
1. Use shorter system prompts
2. Limit conversation history to last 20 messages
3. Cache common responses
4. Use cheaper models for simple queries

## Troubleshooting

### "OPENROUTER_API_KEY not set"
- Verify `.env.local` has the key
- Restart Next.js dev server
- Check key format starts with `sk-or-v1-`

### Tool calls not executing
- Check `/api/planning/*` routes exist
- Verify Supabase tables (`checklist_tasks`, `budget_items`, etc.)
- Check RLS policies allow user access

### Poor recommendations
- Adjust system prompt in `OpenRouterService.createSystemPrompt()`
- Add more context (preferences, budget, event details)
- Fine-tune tool descriptions in `AIToolDefinitions.ts`

## Next Steps

1. **Wire Chat UI**: Connect `UnifiedAIChat.tsx` to `/api/ai/chat`
2. **Add Confirmations**: Implement modals for tool actions
3. **Analytics**: Track tool usage, token costs, user satisfaction
4. **Semantic Search**: Add pgvector for better venue/vendor matching
5. **Multi-turn**: Maintain conversation context for follow-ups

## Support

For issues or questions:
- Check [OpenRouter Docs](https://openrouter.ai/docs)
- Review `src/services/EnhancedAIAssistant.ts`
- Test with `curl` commands above

---
**Last Updated**: 2025-01-22
