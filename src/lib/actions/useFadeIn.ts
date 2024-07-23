import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function fadeIn(node: HTMLElement) {
  // Create the scroll trigger
  const scrollTrigger = ScrollTrigger.create({
    trigger: node,
    start: 'top 80%',
    toggleActions: 'play none none none',
    onEnter: () => {
      gsap.fromTo(node, { opacity: 0 }, { opacity: 1, duration: 1, ease: 'power2.out' });
    },
  });

  return {
    destroy() {
      // Properly clean up the scroll trigger
      scrollTrigger.kill();
    },
  };
}
