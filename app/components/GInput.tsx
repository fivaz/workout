import type { InputHTMLAttributes, Ref } from 'react';
import { forwardRef } from 'react';
import clsx from 'clsx';

interface GInputProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	name?: string;
	className?: string;
}

const GInput = forwardRef<HTMLInputElement, GInputProps>(
	({ label, name, className, ...inputProps }, ref) => {
		// Generate a unique name if label is not provided
		const generatedName = `input-${Math.random().toString(36).substring(2, 9)}`;
		const usedName = name || label || generatedName;
		const baseClassName =
			'rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-blue-500 sm:text-sm/6';

		return label ? (
			<div className="flex flex-col gap-2 capitalize">
				<label htmlFor={usedName} className="text-sm/6 font-medium text-gray-900 dark:text-white">
					{label}
				</label>
				<input
					ref={ref}
					id={usedName}
					name={usedName}
					className={clsx(baseClassName, className)}
					{...inputProps}
				/>
			</div>
		) : (
			<input
				ref={ref}
				id={usedName}
				name={usedName}
				className={clsx(baseClassName, className)}
				{...inputProps}
			/>
		);
	},
);

GInput.displayName = 'GInput';

export default GInput;
