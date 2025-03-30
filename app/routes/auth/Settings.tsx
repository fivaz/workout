import DarkModeSwitch from '@/components/DarkMode/DarkModeSwitch';
import GText from '@/components/GText';
import GButton from '@/components/GButton';
import { useAuth } from '@/lib/auth/authContext';
import GImage from '@/components/GImage';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase.client';
import { toast } from 'react-toastify';
import { ROUTES } from '@/lib/consts';
import { useNavigate } from 'react-router';

export default function Stats() {
	const commitHash = `${import.meta.env.VITE_COMMIT_HASH}`;
	const { user } = useAuth();
	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			await signOut(auth);
			navigate(ROUTES.LOGIN);
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Failed to logout';
			toast.error(message);
			console.error(message);
		}
	};

	return (
		<div className="">
			<GText tag="h1" className="text-2xl">
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
				<li className="py-5 flex gap-2 justify-between items-center">
					<div className="flex gap-3 items-center">
						<GImage src={user?.photoURL} size="size-12" />
						<div>
							<GText className="font-semibold">{user?.displayName}</GText>
							<GText className="truncate text-xs/5 text-gray-500">{user?.email}</GText>
						</div>
					</div>
					<GButton color="white" onClick={handleLogout}>
						logout
					</GButton>
				</li>
			</ul>
		</div>
	);
}
