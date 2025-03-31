import { DialogActions, DialogBody, DialogTitle, GDialog } from '@/components/GDialog';
import { useEffect } from 'react';
import GButton from '@/components/GButton';
import { AlertTriangleIcon } from 'lucide-react';

type PromptProps = {
	isOpen: boolean;
	title: string;
	message?: string;
	confirmText?: string;
	cancelText?: string;
	resolve?: (value: boolean | null) => void;
	closePrompt: () => void;
};

export default function Prompt({
	isOpen,
	title,
	message,
	confirmText = 'Confirm',
	cancelText = 'Cancel',
	resolve,
	closePrompt,
}: PromptProps) {
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (isOpen && e.key === 'Enter') {
				resolve?.(true);
				closePrompt();
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [isOpen, resolve, closePrompt]);

	if (!isOpen) return null;

	return (
		<>
			<GDialog open={isOpen} onClose={() => resolve?.(false) || closePrompt()}>
				<DialogTitle>{title}</DialogTitle>
				<DialogBody>
					<div className="flex items-center gap-4">
						<div className="shrink-0 flex size-12 items-center justify-center rounded-full bg-red-100">
							<AlertTriangleIcon className="size-6 text-red-600" />
						</div>
						<div>{message && <p className="text-sm text-gray-500">{message}</p>}</div>
					</div>
				</DialogBody>
				<DialogActions>
					<GButton color="white" onClick={() => resolve?.(false) || closePrompt()}>
						{cancelText}
					</GButton>
					<GButton color="red" onClick={() => resolve?.(true) || closePrompt()}>
						{confirmText}
					</GButton>
				</DialogActions>
			</GDialog>
		</>
	);
}
