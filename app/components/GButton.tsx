import type { ButtonHTMLAttributes } from 'react';

interface GButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode;
}

export default function GButton({ children, ...buttonProps }: GButtonProps) {
	return (
		<button
			className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
			{...buttonProps}
		>
			{children}
		</button>
	);
}
