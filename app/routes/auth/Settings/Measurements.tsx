import GInput from '@/components/GInput';
import GText from '@/components/GText';
import GButton from '@/components/GButton';
import { PencilIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { isSameDay } from 'date-fns';
import { useCRUDMeasurements } from '@/lib/measurement/measurement.hook';
import type { Measurement } from '@/lib/measurement/measurement.model';

export default function Measurements() {
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState<{
		weight: number | '';
		bodyFat: number | '';
		muscle: number | '';
	}>({
		weight: '',
		bodyFat: '',
		muscle: '',
	});
	const { latestMeasurement, createMeasurement, updateMeasurement } = useCRUDMeasurements();

	// Update form data when latest measurement changes
	useEffect(() => {
		if (latestMeasurement) {
			setLatestMeasurement(latestMeasurement);
		} else {
			reset();
		}
	}, [latestMeasurement]);

	const handleEdit = () => {
		setIsEditing(true);
	};

	const reset = () => {
		setFormData({
			weight: '',
			bodyFat: '',
			muscle: '',
		});
	};

	const setLatestMeasurement = (measurement: Measurement) => {
		setFormData({
			weight: measurement.weight,
			bodyFat: measurement.bodyFat,
			muscle: measurement.muscle,
		});
	};

	const handleCancel = () => {
		setIsEditing(false);
		if (latestMeasurement) {
			setLatestMeasurement(latestMeasurement);
		} else {
			reset();
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const weight = Number(formData.weight);
		const bodyFat = Number(formData.bodyFat);
		const muscle = Number(formData.muscle);
		const currentDate = new Date().toISOString();

		try {
			if (latestMeasurement && isSameDay(new Date(latestMeasurement.date), new Date())) {
				// Update existing measurement if it's from today
				await updateMeasurement({
					...latestMeasurement,
					weight,
					bodyFat,
					muscle,
					date: currentDate,
				});
			} else {
				// Create new measurement
				await createMeasurement({
					weight,
					bodyFat,
					muscle,
				});
			}
			setIsEditing(false);
		} catch (error) {
			console.error('Error submitting measurement:', error);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value;

		// Allow empty string, digits, or a single dot with optional digits
		if (/^\d*\.?\d*$/.test(newValue)) {
			setFormData({
				...formData,
				[e.target.name]: newValue,
			});
		}
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
				type="number"
				step="0.1"
				disabled={!isEditing}
				value={formData.weight}
				name="weight"
				onChange={handleChange}
			/>
			<GInput
				label="Body fat %"
				type="number"
				step="0.1"
				disabled={!isEditing}
				value={formData.bodyFat}
				name="bodyFat"
				onChange={handleChange}
			/>
			<GInput
				label="Muscle %"
				type="number"
				disabled={!isEditing}
				value={formData.muscle}
				name="muscle"
				onChange={handleChange}
			/>
		</form>
	);
}
