import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';

export const getImageURL = (
	collectionId: unknown,
	recordId: unknown,
	fileName: unknown,
	size = '0x0'
) => {
	return `${PUBLIC_POCKETBASE_URL}/api/files/${collectionId}/${recordId}/${fileName}?thumb=${size}`;
};

export const validateData = async (formData: any, schema: any) => {
	const body = Object.fromEntries(formData);

	try {
		const data = schema.parse(body);
		return {
			formData: data,
			errors: null
		};
	} catch (err: any) {
		console.log('Error: ', err);
		const errors = err.flatten();
		return {
			formData: body,
			errors
		};
	}
};

export function formatFriendlyDate(dateString: string): string {
	if (!dateString || typeof dateString !== 'string') {
		console.error(`Invalid date input: ${dateString}`);
		return 'Invalid Date';
	}

	// Ensure ISO-8601 compliance (replace space with 'T' if needed)
	let standardizedDate = dateString.trim().replace(' ', 'T');

	// Ensure it ends in 'Z' if it includes time (to force UTC parsing)
	if (
		standardizedDate.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/) &&
		!standardizedDate.endsWith('Z')
	) {
		standardizedDate += 'Z';
	}

	// Create Date object
	const date = new Date(standardizedDate);

	// Validate the date
	if (isNaN(date.getTime())) {
		console.error(`Invalid date: ${dateString}`);
		return 'Invalid Date';
	}

	// Return as full ISO string
	return date.toISOString(); // Example: "2024-08-08T00:00:00.000Z"
}

export function formatFloatToPrice(amount: number): string {
	const formattedAmount = amount.toLocaleString('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0
	});

	return formattedAmount;
}

export function timeSince(dateString: string): string {
	console.log(`Parsing date: ${dateString}`);

	const date = new Date(dateString);
	const now = new Date();

	// Handle invalid date cases
	if (isNaN(date.getTime())) {
		console.error(`Invalid date in timeSince: ${dateString}`);
		return 'Invalid Date';
	}

	const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

	const intervals: { [key: string]: number } = {
		year: 31536000,
		month: 2592000,
		week: 604800,
		day: 86400,
		hour: 3600,
		minute: 60
	};

	if (seconds < intervals.minute) {
		return 'just now';
	} else if (seconds < intervals.hour) {
		const minutes = Math.floor(seconds / intervals.minute);
		return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
	} else if (seconds < intervals.day) {
		const hours = Math.floor(seconds / intervals.hour);
		return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
	} else if (seconds < intervals.week) {
		const days = Math.floor(seconds / intervals.day);
		return `${days} day${days !== 1 ? 's' : ''} ago`;
	} else if (seconds < intervals.month) {
		const weeks = Math.floor(seconds / intervals.week);
		return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
	} else if (seconds < intervals.year) {
		const months = Math.floor(seconds / intervals.month);
		return `${months} month${months !== 1 ? 's' : ''} ago`;
	} else {
		const years = Math.floor(seconds / intervals.year);
		return `${years} year${years !== 1 ? 's' : ''} ago`;
	}
}

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

type FlyAndScaleParams = {
	y?: number;
	x?: number;
	start?: number;
	duration?: number;
};

export const flyAndScale = (
	node: Element,
	params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 }
): TransitionConfig => {
	const style = getComputedStyle(node);
	const transform = style.transform === 'none' ? '' : style.transform;

	const scaleConversion = (valueA: number, scaleA: [number, number], scaleB: [number, number]) => {
		const [minA, maxA] = scaleA;
		const [minB, maxB] = scaleB;

		const percentage = (valueA - minA) / (maxA - minA);
		const valueB = percentage * (maxB - minB) + minB;

		return valueB;
	};

	const styleToString = (style: Record<string, number | string | undefined>): string => {
		return Object.keys(style).reduce((str, key) => {
			if (style[key] === undefined) return str;
			return str + `${key}:${style[key]};`;
		}, '');
	};

	return {
		duration: params.duration ?? 200,
		delay: 0,
		css: (t) => {
			const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
			const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
			const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

			return styleToString({
				transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
				opacity: t
			});
		},
		easing: cubicOut
	};
};

export const goBack = () => {
	history.back();
};
