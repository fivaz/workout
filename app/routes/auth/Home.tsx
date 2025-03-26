import { useAuth } from '@/lib/auth/authContext';
import GText from '@/components/GText';

export default function Home() {
	const { user } = useAuth();
	return <GText>Home, {user?.displayName}</GText>;
}
