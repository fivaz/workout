import DarkModeSwitch from '@/components/DarkMode/DarkModeSwitch';
import GText from '@/components/GText';

export default function Stats() {
	const commitHash = `current commit: ${import.meta.env.VITE_COMMIT_HASH}`;

	return (
		<>
			<GText>Stats</GText>
			<DarkModeSwitch />
			<GText>{commitHash}</GText>
		</>
	);
}
