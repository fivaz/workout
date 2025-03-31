import { useContext } from 'react';
import PromptContext, { type PromptContextType } from '@/lib/prompt/promptContext';

export function usePrompt(): PromptContextType {
	const context = useContext(PromptContext);
	if (!context) {
		throw new Error('usePrompt must be used within a PromptProvider');
	}
	return context;
}
