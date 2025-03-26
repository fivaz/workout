import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import type { QuerySnapshot, DocumentData } from 'firebase/firestore';
import { collection, onSnapshot } from 'firebase/firestore';
import { useAuth } from '@/lib/auth/authContext';
import type { Exercise } from './exercise.model';
import { db } from '@/lib/firebase.client';
import { ExerciseContext } from '@/lib/exercise/exerciseContext';

// Props type for ExerciseProvider
interface ExerciseProviderProps {
	children: ReactNode;
}

// Base path generator
const getExerciseCollectionPath = (userId: string) => `users/${userId}/exercises`;

export function ExerciseProvider({ children }: ExerciseProviderProps) {
	const { user } = useAuth();
	const [exercises, setExercises] = useState<Exercise[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!user) {
			setExercises([]);
			setLoading(false);
			return;
		}

		setLoading(true);
		const exercisesRef = collection(db, getExerciseCollectionPath(user.uid));

		// Real-time listener
		const unsubscribe = onSnapshot(
			exercisesRef,
			(snapshot: QuerySnapshot) => {
				const exercisesData = snapshot.docs.map(
					(doc) =>
						({
							id: doc.id,
							...doc.data(),
						}) as Exercise,
				);
				setExercises(exercisesData);
				setLoading(false);
			},
			(err) => {
				setError(err.message);
				setLoading(false);
			},
		);

		// Cleanup subscription
		return () => unsubscribe();
	}, [user]);

	const value = {
		exercises,
		loading,
		error,
	};

	return <ExerciseContext.Provider value={value}>{children}</ExerciseContext.Provider>;
}
