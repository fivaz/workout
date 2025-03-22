import type { JSX } from 'react';
import { type ReactNode } from 'react';

interface GTextProps {
	className?: string;
	children: ReactNode;
	level?: 'dark' | 'darker' | 'middle';
	tag?: 'p' | 'span' | 'h1' | 'h2';
}

export default function GText({ className = '', children, level = 'dark', tag = 'p' }: GTextProps) {
	const colorMap: Record<string, string> = {
		dark: 'text-gray-700 dark:text-gray-100',
		darker: 'text-gray-900 dark:text-white',
		middle: 'text-gray-500 dark:text-gray-400',
	};

	const Tag = tag as keyof JSX.IntrinsicElements;

	return <Tag className={`${className} ${colorMap[level]}`}>{children}</Tag>;
}
