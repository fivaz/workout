import DarkModeSwitch from '@/components/DarkMode/DarkModeSwitch';
import GText from '@/components/GText';
import GButton from '@/components/GButton';
import { useAuth } from '@/lib/auth/auth.hook';
import GImage from '@/components/GImage';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase.client';
import { toast } from 'react-toastify';
import { ROUTES } from '@/lib/consts';
import { useNavigate } from 'react-router';
import Profile from '@/routes/auth/Settings/Profile';

export default function Stats() {
	const commitHash = `${import.meta.env.VITE_COMMIT_HASH}`;

	return (
		<div className="flex flex-col">
			<GText tag="h1" className="text-lg">
				Settings
			</GText>
			<ul role="list" className="divide-y divide-gray-200">
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
