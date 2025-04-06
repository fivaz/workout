import { collection, deleteDoc, doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase.client';
import { DB, gFormatDate } from '@/lib/consts';
import type { Measurement } from '@/lib/measurement/measurement.model';

export const getMeasurementsPath = (userId: string) => `${DB.USERS}/${userId}/${DB.MEASUREMENTS}`;

// Get real-time measurements updates
export function getMeasurements(
	userId: string,
	callback: (measurements: Measurement[]) => void,
	onError: (error: string) => void,
) {
	const measurementsRef = collection(db, getMeasurementsPath(userId));
	return onSnapshot(
		measurementsRef,
		(snapshot) => {
			const measurementsData = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			})) as Measurement[];
			callback(measurementsData);
		},
		(err) => onError(err.message),
	);
}

// Create new measurement
export async function createMeasurement(
	userId: string,
	measurement: Omit<Measurement, 'id' | 'date'>,
): Promise<Measurement> {
	const measurementsRef = collection(db, getMeasurementsPath(userId));
	const newDocRef = doc(measurementsRef);

	const newMeasurement: Measurement = {
		...measurement,
		id: newDocRef.id,
		date: new Date().toISOString(),
	};

	await setDoc(newDocRef, newMeasurement);
	return newMeasurement;
}

// Update existing measurement
export async function updateMeasurement(userId: string, measurement: Measurement): Promise<void> {
	const measurementRef = doc(db, getMeasurementsPath(userId), measurement.id!);
	await updateDoc(measurementRef, measurement);
}

// Delete measurement
export function deleteMeasurement(userId: string, measurementId: string): void {
	const measurementRef = doc(db, getMeasurementsPath(userId), measurementId);
	void deleteDoc(measurementRef);
}
