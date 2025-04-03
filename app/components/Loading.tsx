import { LoaderCircleIcon } from 'lucide-react';

export default function Loading() {
	return (
		<div className="flex items-center justify-center">
			<LoaderCircleIcon className="animate-spin text-blue-500" />
		</div>
	);
}
