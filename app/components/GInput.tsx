import type { InputHTMLAttributes } from 'react';
import clsx from 'clsx';

export default function GInput({
	label,
	name,
	className,
	...inputProps
}: { name?: string; label?: string } & InputHTMLAttributes<HTMLInputElement>) {
	// Generate a unique name if label is not provided
	const generatedName = `input-${Math.random().toString(36).substring(2, 9)}`;
	const usedName = name || label || generatedName;

	return (
		<>
			<div className="flex flex-col gap-2">
				{label && (
					<label
						htmlFor={usedName}
						className="block text-sm/6 font-medium text-gray-900 dark:text-white"
					>
						{label}
					</label>
				)}
				<input
					id={usedName}
					name={usedName}
					className={clsx(
						'block rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-blue-500 sm:text-sm/6',
						className,
					)}
					{...inputProps}
				/>
			</div>
		</>
	);
}
