import type { ReactNode } from 'react';
import { useDroppable } from '@dnd-kit/react';
import { CollisionPriority } from '@dnd-kit/abstract';
import GText from '@/components/GText';
import DropProgramHere from '@/routes/auth/Programs/ProgramRow/ProgramPage/ExerciseList/DropProgramHere';

export function Group({ title, id, children }: { title: string; id: string; children: ReactNode }) {
	const { isDropTarget, ref } = useDroppable({
		id,
		type: 'column',
		accept: 'item',
		collisionPriority: CollisionPriority.Low,
	});

	const style = isDropTarget ? { background: '#00000030' } : undefined;

	return (
		<>
			<GText tag="h2" className="text-sm">
				{title}
			</GText>
			<ul style={style} className="flex flex-col gap-3" ref={ref}>
				{children}
				<li>
					<DropProgramHere />
				</li>
			</ul>
		</>
	);
}
