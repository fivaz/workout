import GText from '@/components/GText';
import NoStats from '@/routes/auth/Stats/NoStats';

export default function Stats() {
	return (
		<div className="flex flex-col gap-3">
			<GText tag="h1" className="text-lg">
				Stats
			</GText>
			<NoStats />
		</div>
	);
}
