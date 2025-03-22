import type { InputHTMLAttributes } from 'react';

export default function GInput({
	label,
	...inputProps
}: { label?: string } & InputHTMLAttributes<HTMLInputElement>) {
	// Generate a unique name if label is not provided
	const generatedName = `input-${Math.random().toString(36).substring(2, 9)}`;
	const name = label || generatedName;

	return (
		<>
			<div className="flex flex-col gap-2">
				{label && (
					<label
						htmlFor={label}
						className="block text-sm/6 font-medium text-gray-900 dark:text-white"
					>
						{label}
					</label>
				)}
				<input
					id={name}
					name={name}
					type="email"
					required
					autoComplete="email"
					className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500 sm:text-sm/6"
					{...inputProps}
				/>
			</div>
		</>
	);
}
