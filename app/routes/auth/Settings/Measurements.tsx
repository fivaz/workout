import GInput from '@/components/GInput';
import GText from '@/components/GText';
import GButton from '@/components/GButton';
import { PencilIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { Measurement } from '@/lib/measurement/measurement.model';
import { useAuth } from '@/lib/auth/auth.hook';
import { createMeasurement, getMeasurements } from '@/lib/measurement/measurement.repository';

export default function Measurements() {
	const [isEditing, setIsEditing] = useState(false);
	const [latestMeasurement, setLatestMeasurement] = useState<Measurement | null>(null);
	const [formData, setFormData] = useState({
		weight: '',
		bodyFat: '',
		muscleFat: '',
	});
	const { user } = useAuth();

	useEffect(() => {
		if (!user?.uid) return;

		const unsubscribe = getMeasurements(
			user.uid,
			(measurements) => {
				// Sort by date and get the most recent measurement
				const sortedMeasurements = measurements.sort(
					(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
				);
				const latest = sortedMeasurements[0] || null;
				setLatestMeasurement(latest);
				if (latest) {
					setFormData({
						weight: latest.weight.toString(),
						bodyFat: latest.bodyFat.toString(),
						muscleFat: latest.muscleFat.toString(),
					});
				}
			},
			(error) => console.error('Error fetching measurements:', error),
		);

		return () => unsubscribe();
	}, [user?.uid]);

	const handleEdit = () => {
		setIsEditing(true);
	};

	const handleCancel = () => {
		setIsEditing(false);
		// Reset form to latest measurement values
		if (latestMeasurement) {
			setFormData({
				weight: latestMeasurement.weight.toString(),
				bodyFat: latestMeasurement.bodyFat.toString(),
				muscleFat: latestMeasurement.muscleFat.toString(),
			});
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!user?.uid) return;

		try {
			await createMeasurement(user.uid, {
				weight: Number(formData.weight),
				bodyFat: Number(formData.bodyFat),
				muscleFat: Number(formData.muscleFat),
			});
			setIsEditing(false);
		} catch (error) {
			console.error('Error submitting measurement:', error);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col gap-2 border rounded border-gray-300 dark:border-gray-700 p-3 w-full"
		>
			<div className="flex justify-between">
				<GText>Measurements</GText>
				{isEditing ? (
					<div className="flex gap-2">
						<GButton type="button" color="white" size="px-1.5 py-1" onClick={handleCancel}>
							Cancel
						</GButton>
						<GButton type="submit" size="px-1.5 py-1">
							Submit
						</GButton>
					</div>
				) : (
					<GButton type="button" color="white" size="px-1.5 py-1" onClick={handleEdit}>
						<PencilIcon className="size-5" />
					</GButton>
				)}
			</div>
			<GInput
				label="weight"
				disabled={!isEditing}
				value={formData.weight}
				name="weight"
				onChange={handleChange}
			/>
			<GInput
				label="Body fat %"
				disabled={!isEditing}
				value={formData.bodyFat}
				name="bodyFat"
				onChange={handleChange}
			/>
			<GInput
				label="Muscle %"
				disabled={!isEditing}
				value={formData.muscleFat}
				name="muscleFat"
				onChange={handleChange}
			/>
		</form>
	);
}
