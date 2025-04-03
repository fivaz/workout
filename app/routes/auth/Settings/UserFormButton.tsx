import GButton from '@/components/GButton';
import { type FormEvent, type PropsWithChildren, useState } from 'react';
import { DialogActions, DialogBody, DialogTitle, GDialog } from '@/components/GDialog';
import GInput from '@/components/GInput';
import { cloneDeep } from 'lodash-es';
import { XIcon } from 'lucide-react';
import type { UserModel } from '@/lib/auth/user.model';

export function UserFormButton({ user, children }: PropsWithChildren<{ user: UserModel }>) {
	const [isOpen, setIsOpen] = useState(false);
	const [inUser, setInUser] = useState<UserModel>(user);

	function handleOpen() {
		setInUser(cloneDeep(user));
		setIsOpen(true);
	}

	function handleClose() {
		setIsOpen(false);
	}

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		try {
			//
			setIsOpen(false);
		} catch (error) {
			console.error('Error saving user:', error);
		}
	}

	return (
		<>
			<GButton
				className="hover:bg-gray-100 hover:underline cursor-pointer w-1/2"
				type="button"
				color="none"
				onClick={handleOpen}
			>
				{children}
			</GButton>

			<GDialog open={isOpen} onClose={handleClose}>
				<form onSubmit={handleSubmit}>
					<DialogTitle>Edit User</DialogTitle>

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
							name="displayName"
							label="name"
							defaultValue={inUser.displayName || ''}
							required
						/>

						<GInput name="email" label="email" defaultValue={inUser.email || ''} required />
					</DialogBody>

					<DialogActions className="flex justify-between">
						<GButton type="submit">Save Changes</GButton>
					</DialogActions>
				</form>
			</GDialog>
		</>
	);
}
