import type { ImgHTMLAttributes } from 'react';
import clsx from 'clsx';

type ImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
	src?: string | null;
	size?: string;
};

export default function GImage({ src, size = 'size-14', ...props }: ImageProps) {
	// Check if src is empty, null, or undefined
	const baseClass = 'shrink-0 rounded bg-linear-to-r/srgb from-indigo-500 to-teal-400';

	if (!src || src.trim() === '') {
		return <div className={clsx(baseClass, size)} aria-label={props.alt || 'image placeholder'} />;
	}

	return (
		<div className={clsx(baseClass, size)}>
			<img
				loading="lazy"
				src={src}
				sizes="56px"
				className="size-full rounded object-cover"
				onError={(e) => (e.currentTarget.style.display = 'none')}
				{...props} // Spread all additional img props
			/>
		</div>
	);
}
