import GButton, { type GButtonProps } from '@/components/GButton';
import { type ChangeEvent, type FormEvent, type PropsWithChildren, useState } from 'react';
import { DialogActions, DialogBody, DialogTitle, GDialog } from '@/components/GDialog';
import GInput from '@/components/GInput';
import type { Program } from '@/lib/program/program.model';
import { usePrograms } from '@/lib/program/programContext';
import { cloneDeep } from 'lodash-es';
import SelectPrograms from '@/lib/exercise/ExerciseFormButton/SelectPrograms';
import SelectMuscles from '@/lib/exercise/ExerciseFormButton/SelectMuscles';
import { XIcon } from 'lucide-react';
import { usePrompt } from '@/lib/prompt/prompt-context';

type ProgramFormButtonProps = PropsWithChildren<{ program: Program } & GButtonProps>;

export function ProgramFormButton({
	children,
	program,
	color,
	className,
	size,
}: ProgramFormButtonProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [inProgram, setInProgram] = useState<Program>(program);
	const { createPrompt } = usePrompt();

	const { createProgram, updateProgram, deleteProgram } = usePrograms();

	function handleOpen() {
		setInProgram(cloneDeep(program));
		setIsOpen(true);
	}

	function handleClose() {
		setIsOpen(false);
	}

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		try {
			if (inProgram.id) {
				void updateProgram(inProgram);
			} else {
				void createProgram(inProgram);
			}
			setIsOpen(false);
		} catch (error) {
			console.error('Error saving program:', error);
			// You might want to add toast notifications here
		}
	}

	async function handleDelete() {
		try {
			if (
				await createPrompt({
					title: 'Delete program',
					message: 'Are you sure you want to delete this program?',
				})
			) {
				void deleteProgram(inProgram);
				setIsOpen(false);
			}
		} catch (error) {
			console.error('Error deleting program:', error);
		}
	}

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;
		setInProgram((prev) => ({ ...prev, [name]: value }));
	}

	function handleMusclesChange(muscles: string[]) {
		setInProgram((prev) => ({ ...prev, muscles }));
	}

	return (
		<>
			<GButton color={color} className={className} size={size} type="button" onClick={handleOpen}>
				{children}
			</GButton>

			<GDialog open={isOpen} onClose={handleClose}>
				<form onSubmit={handleSubmit}>
					<DialogTitle>{inProgram.id ? 'Edit Program' : 'Create New Program'}</DialogTitle>

					<GButton
						type="button"
						color="white"
						size="p-1 absolute top-0 right-0 mt-5 mr-5"
						onClick={handleClose}
					>
						<XIcon className="size-5" />
					</GButton>

					<DialogBody className="flex flex-col gap-4">
						<GInput
							name="name"
							label="Program Name"
							value={inProgram.name}
							onChange={handleChange}
							required
						/>

						<SelectMuscles muscles={inProgram.muscles} setMuscles={handleMusclesChange} />
					</DialogBody>

					<DialogActions className="flex justify-between">
						{inProgram.id && (
							<GButton type="button" color="red" onClick={handleDelete}>
								Delete
							</GButton>
						)}
						<GButton type="submit">{inProgram.id ? 'Save Changes' : 'Create Program'}</GButton>
					</DialogActions>
				</form>
			</GDialog>
		</>
	);
}
