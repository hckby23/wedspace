/**
 * Type declarations for AI SDK
 * This file provides TypeScript stubs for the AI SDK modules that are not available
 */

declare module 'ai/react' {
  export interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
  }

  export interface UseChatOptions {
    api?: string;
    initialMessages?: Message[];
    initialInput?: string;
    onResponse?: (response: Response) => void;
    onFinish?: (message: Message) => void;
    onError?: (error: Error) => void;
  }

  export interface UseChatHelpers {
    messages: Message[];
    input: string;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    isLoading: boolean;
    error: Error | null;
    append: (message: Message) => void;
    reload: () => void;
    stop: () => void;
    setInput: (input: string) => void;
  }

  export function useChat(options?: UseChatOptions): UseChatHelpers;
}
