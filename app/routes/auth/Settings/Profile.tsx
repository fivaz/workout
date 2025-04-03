import GText from '@/components/GText';
import GButton from '@/components/GButton';
import { useAuth } from '@/lib/auth/auth.hook';
import GImage from '@/components/GImage';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase.client';
import { ROUTES } from '@/lib/consts';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { LogOutIcon } from 'lucide-react';
import { UserFormButton } from '@/routes/auth/Settings/UserFormButton';
import Loading from '@/components/Loading';

export default function Profile() {
	const { user } = useAuth();

	const navigate = useNavigate();

	async function handleLogout() {
		try {
			await signOut(auth);
			navigate(ROUTES.LOGIN);
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Failed to logout';
			toast.error(message);
			console.error(message);
		}
	}

	return user ? (
		<div className="flex gap-2 justify-between items-center">
			<UserFormButton user={user}>
				<div className="flex gap-3 items-center">
					<GImage src={user?.photoURL} size="size-12" />
					<div className="flex flex-col items-start">
						<GText className="font-semibold">{user?.displayName}</GText>
						<GText className="truncate text-xs/5 text-gray-500">{user?.email}</GText>
					</div>
				</div>
			</UserFormButton>
			<GButton size="p-1.5" color="white" onClick={handleLogout}>
				<LogOutIcon className="size-5" />
			</GButton>
		</div>
	) : (
		<Loading />
	);
}
