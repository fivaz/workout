import GText from '@/components/GText';
import { ClipboardListIcon, TextSelectIcon } from 'lucide-react';

export default function DropProgramHere() {
	return (
		<div className="p-4 relative block w-full rounded-lg border-2 border-dashed border-gray-300 text-center hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-hidden">
			<GText tag="h2" className="text-sm font-semibold text-gray-900">
				Drop a program here.
			</GText>
		</div>
	);
}
