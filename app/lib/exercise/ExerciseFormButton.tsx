import GButton from '@/components/GButton';
import { type PropsWithChildren, useState } from 'react';
import { DialogActions, DialogBody, DialogTitle, GDialog } from '@/components/GDialog';
import GInput from '@/components/GInput';

export function ExerciseFormButton({ children }: PropsWithChildren) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<GButton type="button" onClick={() => setIsOpen(true)}>
				{children}
			</GButton>
			<GDialog open={isOpen} onClose={setIsOpen}>
				<form method="post">
					<DialogTitle>Add exercise</DialogTitle>
					<DialogBody>
						<GInput label="name" />
					</DialogBody>
					<DialogActions>
						<GButton onClick={() => setIsOpen(false)}>Cancel</GButton>
						<GButton type="submit">Save</GButton>
					</DialogActions>
				</form>
			</GDialog>
		</>
	);
}
