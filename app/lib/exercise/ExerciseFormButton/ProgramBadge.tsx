import type { Program } from '@/lib/program/program.model';

export default function ProgramBadge({ program }: { program: Program }) {
	return (
		<span className="inline-flex items-center gap-x-0.5 rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset">
			{program.name}
			<button
				type="button"
				className="group relative -mr-1 size-3.5 rounded-xs hover:bg-blue-600/20"
			>
				<span className="sr-only">Remove</span>
				<svg
					viewBox="0 0 14 14"
					className="size-3.5 stroke-blue-700/50 group-hover:stroke-blue-700/75"
				>
					<path d="M4 4l6 6m0-6l-6 6" />
				</svg>
				<span className="absolute -inset-1" />
			</button>
		</span>
	);
}
