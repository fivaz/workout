import GText from '@/components/GText';
import NoStats from '@/routes/auth/Stats/NoStats';

export default function Stats() {
	return (
		<div className="flex flex-col gap-2">
			<GText>Stats</GText>
			<NoStats />
		</div>
	);
}
