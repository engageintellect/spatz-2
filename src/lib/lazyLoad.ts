// src/lib/actions/lazyLoad.ts
import { gsap } from 'gsap';

export function lazyLoad(node: HTMLElement) {
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					node.classList.add('visible');
					node.classList.remove('invisible');

					// Log to check if GSAP animation is being triggered
					console.log('Animating:', node);

					// Apply the GSAP animation
					gsap.fromTo(
						node,
						{ opacity: 0, y: 50 }, // Start state
						{ opacity: 1, scale: 1, y: 0, duration: 1, ease: 'power4.out' } // End state
					);

					observer.unobserve(node);
				}
			});
		},
		{
			threshold: 0.1
		}
	);

	observer.observe(node);

	return {
		destroy() {
			observer.unobserve(node);
		}
	};
}
