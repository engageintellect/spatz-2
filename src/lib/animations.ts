// Lightweight CSS-based animation helper
export const animateMainStagger = () => {
	const items = document.querySelectorAll('.animate-item');
	items.forEach((item, index) => {
		const element = item as HTMLElement;
		element.style.opacity = '0';
		element.style.transform = 'translateY(20px)';
		element.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
		element.style.transitionDelay = `${index * 0.1}s`;
		
		// Trigger animation
		setTimeout(() => {
			element.style.opacity = '1';
			element.style.transform = 'translateY(0)';
		}, 50);
	});
};
