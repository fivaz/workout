import GInput from '@/components/GInput';
import GText from '@/components/GText';
import GButton from '@/components/GButton';
import { PencilIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCRUDMeasurements } from '@/lib/measurement/measurement.hook';

export default function Measurements() {
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState<{
		weight: number | '';
		bodyFat: number | '';
		muscleFat: number | '';
	}>({
		weight: '',
		bodyFat: '',
		muscleFat: '',
	});

	const { latestMeasurement, createMeasurement } = useCRUDMeasurements();

	// Update form data when latest measurement changes
	useEffect(() => {
		if (latestMeasurement) {
			setFormData({
				weight: latestMeasurement.weight,
				bodyFat: latestMeasurement.bodyFat,
				muscleFat: latestMeasurement.muscleFat,
			});
		} else {
			// Reset form when there's no measurements
			setFormData({
				weight: '',
				bodyFat: '',
				muscleFat: '',
			});
		}
	}, [latestMeasurement]);

	const handleEdit = () => {
		setIsEditing(true);
	};

	const handleCancel = () => {
		setIsEditing(false);
		// Reset form to latest measurement values or 0 if none exist
		if (latestMeasurement) {
			setFormData({
				weight: latestMeasurement.weight,
				bodyFat: latestMeasurement.bodyFat,
				muscleFat: latestMeasurement.muscleFat,
			});
		} else {
			setFormData({
				weight: 0,
				bodyFat: 0,
				muscleFat: 0,
			});
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Convert empty strings to 0 for submission
		const weight = formData.weight === '' ? 0 : formData.weight;
		const bodyFat = formData.bodyFat === '' ? 0 : formData.bodyFat;
		const muscleFat = formData.muscleFat === '' ? 0 : formData.muscleFat;

		try {
			await createMeasurement({
				weight,
				bodyFat,
				muscleFat,
			});
			setIsEditing(false);
		} catch (error) {
			console.error('Error submitting measurement:', error);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value === '' ? '' : Number(e.target.value);
		setFormData({
			...formData,
			[e.target.name]: value,
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
				type="number"
				disabled={!isEditing}
				value={formData.weight}
				name="weight"
				onChange={handleChange}
			/>
			<GInput
				label="Body fat %"
				type="number"
				disabled={!isEditing}
				value={formData.bodyFat}
				name="bodyFat"
				onChange={handleChange}
			/>
			<GInput
				label="Muscle %"
				type="number"
				disabled={!isEditing}
				value={formData.muscleFat}
				name="muscleFat"
				onChange={handleChange}
			/>
		</form>
	);
}
