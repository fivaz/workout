import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase.client';

export default async function isAuth() {
	return new Promise((resolve) => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			unsubscribe();
			resolve(!!user);
		});
	});
}
