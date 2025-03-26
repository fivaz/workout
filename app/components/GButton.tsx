import type { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import { RotateCw } from 'lucide-react';

interface GButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: ReactNode;
	isLoading?: boolean;
	disabled?: boolean;
	className?: string;
	color?: 'white' | 'blue' | 'none';
	size?: string;
}

export default function GButton({
	children,
	isLoading = false,
	disabled = false,
	color = 'blue',
	className,
	size = 'px-3 py-1.5',
	...buttonProps
}: GButtonProps) {
	const colorMap = {
		none: '',
		blue: 'bg-blue-600 text-white hover:bg-blue-500 focus-visible:outline-blue-600',
		white:
			'bg-white border dark:border-gray-600 border-gray-300 dark:bg-gray-800 text-gray-700 dark:bg-gray-300 hover:bg-gray-100 dark:bg-gray-700 focus-visible:outline-blue-600',
	};

	return (
		<button
			className={clsx(
				'flex gap-2 cursor-pointer justify-center items-center rounded-md  text-sm/6 font-semibold shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 ',
				{
					'opacity-70': isLoading || disabled,
				},
				colorMap[color],
				className,
				size,
			)}
			disabled={isLoading || disabled}
			{...buttonProps}
		>
			{isLoading && <RotateCw className="size-5 animate-spin" />}
			{children}
		</button>
	);
}
