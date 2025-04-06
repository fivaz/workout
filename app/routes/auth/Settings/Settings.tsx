import DarkModeSwitch from '@/components/DarkMode/DarkModeSwitch';
import GText from '@/components/GText';
import Profile from '@/routes/auth/Settings/Profile';
import Measurements from '@/routes/auth/Settings/Measurements';

export default function Stats() {
	const commitHash = `${import.meta.env.VITE_COMMIT_HASH}`;

	return (
		<div className="flex flex-col">
			<GText tag="h1" className="text-lg">
				Settings
			</GText>
			<ul role="list" className="divide-y divide-gray-200">
				<li className="py-5 flex gap-2 justify-between items-center">
					<Measurements />
				</li>
				<li className="py-5 flex gap-2 justify-between items-center">
					<GText>Dark mode:</GText>
					<DarkModeSwitch label />
				</li>
				<li className="py-5 flex gap-2 justify-between items-center">
					<GText>Current version:</GText>
					<GText>{commitHash}</GText>
				</li>
				<li className="py-5">
					<Profile />
				</li>
			</ul>
		</div>
	);
}
