import GText from '@/components/GText';
import { BarChartIcon } from 'lucide-react'; // Using a chart icon to represent stats

export default function NoStats() {
	return (
		<div className="p-12 relative block w-full rounded-lg border-2 border-dashed border-gray-300 text-center hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-hidden">
			<BarChartIcon className="mx-auto size-12 text-gray-400" />
			<GText tag="h2" className="mt-2 text-sm font-semibold text-gray-900">
				No stats yet
			</GText>
			<GText className="mt-1 text-sm text-gray-500">
				Start a workout to collect data for your stats.
			</GText>
		</div>
	);
}
