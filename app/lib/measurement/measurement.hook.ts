import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/auth.hook';
import { toast } from 'react-toastify';
import type { Measurement } from './measurement.model';
import {
	createMeasurement,
	deleteMeasurement,
	getMeasurements,
	updateMeasurement,
} from '@/lib/measurement/measurement.repository';
import { compareDesc } from 'date-fns';

export interface MeasurementsContextType {
	measurements: Measurement[];
	latestMeasurement: Measurement | null;
	createMeasurement: (measurement: Omit<Measurement, 'id' | 'date'>) => Promise<void>;
	updateMeasurement: (measurement: Measurement) => Promise<void>;
	deleteMeasurement: (measurementId: string) => void;
}

export function useCRUDMeasurements(): MeasurementsContextType {
	const { user } = useAuth();
	const [measurements, setMeasurements] = useState<Measurement[]>([]);
	const [latestMeasurement, setLatestMeasurement] = useState<Measurement | null>(null);

	// Subscribe to real-time measurement updates
	useEffect(() => {
		if (!user) {
			setMeasurements([]);
			setLatestMeasurement(null);
			return;
		}

		return getMeasurements(
			user.uid,
			(measurementsData) => {
				// Sort by date descending using date-fns
				const sortedMeasurements = measurementsData.sort((a, b) =>
					compareDesc(new Date(a.date), new Date(b.date)),
				);
				setMeasurements(sortedMeasurements);
				setLatestMeasurement(sortedMeasurements[0] || null);
			},
			(error) => toast.error(error, { toastId: 'measurements-error' }),
		);
	}, [user]);

	// Create new measurement
	async function handleCreateMeasurement(
		measurement: Omit<Measurement, 'id' | 'date'>,
	): Promise<void> {
		if (!user) {
			toast.error('User must be authenticated');
			return;
		}

		try {
			await createMeasurement(user.uid, measurement);
			toast.success('Measurement recorded successfully');
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Failed to create measurement';
			toast.error(message);
			console.error(err);
		}
	}

	// Update existing measurement
	async function handleUpdateMeasurement(measurement: Measurement): Promise<void> {
		if (!user) {
			toast.error('User must be authenticated');
			return;
		}

		try {
			await updateMeasurement(user.uid, measurement);
			toast.success('Measurement updated successfully');
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Failed to update measurement';
			toast.error(message);
			console.error(err);
		}
	}

	// Delete measurement
	function handleDeleteMeasurement(measurementId: string): void {
		if (!user) {
			toast.error('User must be authenticated');
			return;
		}

		try {
			deleteMeasurement(user.uid, measurementId);
			toast.success('Measurement deleted successfully');
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Failed to delete measurement';
			toast.error(message);
			console.error(err);
		}
	}

	return {
		measurements,
		latestMeasurement,
		createMeasurement: handleCreateMeasurement,
		updateMeasurement: handleUpdateMeasurement,
		deleteMeasurement: handleDeleteMeasurement,
	};
}
