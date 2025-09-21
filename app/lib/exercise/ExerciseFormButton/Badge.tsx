import type { PropsWithChildren } from 'react';

export default function Badge({ children }: PropsWithChildren) {
	return (
		<span className="inline-flex items-center gap-x-0.5 rounded-md dark:bg-blue-400/10 bg-blue-50 px-2 py-1 text-xs font-medium dark:text-blue-400 text-blue-700 ring-1 ring-blue-700/10 dark:ring-blue-400/30 ring-inset">
			{children}
		</span>
	);
}
