import React from 'react';
import type { JSX, ReactNode } from 'react';
import { CheckCircle, Info, TriangleAlert, XCircle, X } from 'lucide-react';

interface AlertProps {
	type: 'error' | 'info' | 'success' | 'warning';
	children: ReactNode;
	setError?: (error: string) => void;
	className?: string;
}

const typeElements = {
	error: {
		background: 'bg-red-50',
		button: 'bg-red-50 text-red-500 hover:bg-red-100 focus:ring-red-600 focus:ring-offset-red-50',
		icon: XCircle,
		iconColor: 'text-red-400',
		message: 'text-red-800',
	},
	info: {
		background: 'bg-blue-50',
		button:
			'bg-blue-50 text-blue-500 hover:bg-blue-100 focus:ring-blue-600 focus:ring-offset-blue-50',
		icon: Info,
		iconColor: 'text-blue-400',
		message: 'text-blue-800',
	},
	success: {
		background: 'bg-green-50',
		button:
			'bg-green-50 text-green-500 hover:bg-green-100 focus:ring-green-600 focus:ring-offset-green-50',
		icon: CheckCircle,
		iconColor: 'text-green-400',
		message: 'text-green-800',
	},
	warning: {
		background: 'bg-yellow-50',
		button:
			'bg-yellow-50 text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-600 focus:ring-offset-yellow-50',
		icon: TriangleAlert,
		iconColor: 'text-yellow-400',
		message: 'text-yellow-800',
	},
};

export default function Alert({
	className = '',
	type,
	children,
	setError,
}: AlertProps): JSX.Element | null {
	if (!children) return null;

	const IconComponent = typeElements[type].icon;

	return (
		<div className={`${typeElements[type].background} ${className} rounded-md p-4`}>
			<div className="flex">
				<div className="flex-shrink-0">
					<IconComponent className={`${typeElements[type].button} size-5`} aria-hidden="true" />
				</div>
				<div className="ml-3">
					<p className={`${typeElements[type].button} text-sm font-medium`}>{children}</p>
				</div>
				{setError && (
					<div className="ml-auto pl-3">
						<div className="-mx-1.5 -my-1.5">
							<button
								className={`${typeElements[type].button} inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2  focus:ring-offset-2 `}
								onClick={() => setError('')}
								type="button"
							>
								<span className="sr-only">Dismiss</span>
								<X className="size-5" aria-hidden="true" />
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
