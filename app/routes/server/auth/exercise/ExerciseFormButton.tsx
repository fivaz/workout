import GButton from '@/components/GButton';
import { type PropsWithChildren, useState } from 'react';
import { DialogActions, DialogBody, DialogTitle, GDialog } from '@/components/GDialog';
import GInput from '@/components/GInput';
import { useFetcher } from 'react-router';

export function ExerciseFormButton({ children }: PropsWithChildren) {
	const [isOpen, setIsOpen] = useState(false);
	const fetcher = useFetcher();
	const isSubmitting = fetcher.state === 'submitting' || fetcher.state === 'loading';

	return (
		<>
			<GButton type="button" onClick={() => setIsOpen(true)}>
				{children}
			</GButton>
			<GDialog open={isOpen} onClose={setIsOpen}>
				<fetcher.Form method="post">
					<DialogTitle>Add exercise</DialogTitle>
					<DialogBody>
						<GInput label="name" />
					</DialogBody>
					<DialogActions>
						<GButton isLoading={isSubmitting} onClick={() => setIsOpen(false)}>
							Cancel
						</GButton>
						<GButton isLoading={isSubmitting} type="submit">
							Save
						</GButton>
					</DialogActions>
				</fetcher.Form>
			</GDialog>
		</>
	);
}
