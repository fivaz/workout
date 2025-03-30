import type { ImgHTMLAttributes } from 'react';

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
	src: string; // Required prop for the image URL
}

export default function GImage({ src, ...props }: ImageProps) {
	// Check if src is empty, null, or undefined
	const baseClass = 'shrink-0 size-14 rounded bg-linear-to-r/srgb from-indigo-500 to-teal-400';

	if (!src || src.trim() === '') {
		return <div className={baseClass} aria-label={props.alt || 'image placeholder'} />;
	}

	return (
		<div className={baseClass}>
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
