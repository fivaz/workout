import GText from '@/components/GText';
import { ClipboardListIcon } from 'lucide-react';

export default function NoProgramSelected() {
	return (
		<div className="p-12 relative block w-full rounded-lg border-2 border-dashed border-gray-300 text-center hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-hidden">
			<ClipboardListIcon className="mx-auto size-12 text-gray-400" />
			<GText tag="h2" className="mt-2 text-sm font-semibold text-gray-900">
				No program selected
			</GText>
			<GText className="mt-1 text-sm text-gray-500">
				Go to programs and select a program to start your workout.
			</GText>
		</div>
	);
}
