<script lang="ts">
	import { onMount, tick } from 'svelte';

	interface Props {
		className?: string;
		quantity?: number;
		staticity?: number;
		ease?: number;
		size?: number;
		refresh?: boolean;
		color?: string;
		vx?: number;
		vy?: number;
	}

	let {
		className = '',
		quantity = 100,
		staticity = 50,
		ease = 50,
		size = 0.4,
		refresh = true,
		color = '#fff',
		vx = 0,
		vy = 0
	}: Props = $props();

	let canvasRef: any = $state();
	let canvasContainerRef: any = $state();
	let context: CanvasRenderingContext2D | null = null;
	let circles: any[] = [];
	let mouse = { x: 0, y: 0 };
	let canvasSize = { w: 0, h: 0 };
	const dpr = typeof window !== 'undefined' ? window.devicePixelRatio : 1;
	const maxDistance = 150; // Maximum distance for connecting particles with a line

	function hexToRgb(hex: string): number[] {
		hex = hex.replace('#', '');

		if (hex.length === 3) {
			hex = hex
				.split('')
				.map((char) => char + char)
				.join('');
		}

		const hexInt = parseInt(hex, 16);
		const red = (hexInt >> 16) & 255;
		const green = (hexInt >> 8) & 255;
		const blue = hexInt & 255;
		return [red, green, blue];
	}

	let rgb = hexToRgb(color);

	function updateColor() {
		rgb = hexToRgb(color);
	}

	function circleParams() {
		const x = Math.floor(Math.random() * canvasSize.w);
		const y = Math.floor(Math.random() * canvasSize.h);
		const translateX = 0;
		const translateY = 0;
		const pSize = Math.floor(Math.random() * 2) + size;
		const alpha = 0;
		const targetAlpha = parseFloat((Math.random() * 0.6 + 0.1).toFixed(1));
		const dx = (Math.random() - 0.5) * 0.1;
		const dy = (Math.random() - 0.5) * 0.1;
		const magnetism = 0.1 + Math.random() * 4;
		return {
			x,
			y,
			translateX,
			translateY,
			size: pSize,
			alpha,
			targetAlpha,
			dx,
			dy,
			magnetism
		};
	}

	function resizeCanvas() {
		if (canvasContainerRef && canvasRef && context) {
			circles.length = 0;
			canvasSize.w = canvasContainerRef.offsetWidth;
			canvasSize.h = canvasContainerRef.offsetHeight;
			canvasRef.width = canvasSize.w * dpr;
			canvasRef.height = canvasSize.h * dpr;
			canvasRef.style.width = `${canvasSize.w}px`;
			canvasRef.style.height = `${canvasSize.h}px`;
			context.scale(dpr, dpr);
		}
	}

	function clearContext() {
		if (context) {
			context.clearRect(0, 0, canvasSize.w, canvasSize.h);
		}
	}

	function drawCircle(circle: any, update = false) {
		if (context) {
			const { x, y, translateX, translateY, size, alpha } = circle;
			context.translate(translateX, translateY);
			context.beginPath();
			context.arc(x, y, size, 0, 2 * Math.PI);
			context.fillStyle = `rgba(${rgb.join(', ')}, ${alpha})`;
			context.fill();
			context.setTransform(dpr, 0, 0, dpr, 0, 0);

			if (!update) {
				circles.push(circle);
			}
		}
	}

	function drawParticles() {
		clearContext();
		for (let i = 0; i < quantity; i++) {
			const circle = circleParams();
			drawCircle(circle);
		}
	}

	function remapValue(value: any, start1: any, end1: any, start2: any, end2: any) {
		let remapped = ((value - start1) * (end2 - start2)) / (end1 - start1) + start2;
		return remapped > 0 ? remapped : 0;
	}

	function drawLine(circle1: any, circle2: any) {
		if (context) {
			context.beginPath();
			context.moveTo(circle1.x + circle1.translateX, circle1.y + circle1.translateY);
			context.lineTo(circle2.x + circle2.translateX, circle2.y + circle2.translateY);
			context.strokeStyle = `rgba(${rgb.join(', ')}, 0.5)`;
			context.stroke();
		}
	}

	function animate() {
		clearContext();
		circles.forEach((circle, i) => {
			const edge = [
				circle.x + circle.translateX - circle.size,
				canvasSize.w - circle.x - circle.translateX - circle.size,
				circle.y + circle.translateY - circle.size,
				canvasSize.h - circle.y - circle.translateY - circle.size
			];
			const closestEdge = edge.reduce((a, b) => Math.min(a, b));
			const remapClosestEdge = parseFloat(remapValue(closestEdge, 0, 20, 0, 1).toFixed(2));
			if (remapClosestEdge > 1) {
				circle.alpha += 0.02;
				if (circle.alpha > circle.targetAlpha) {
					circle.alpha = circle.targetAlpha;
				}
			} else {
				circle.alpha = circle.targetAlpha * remapClosestEdge;
			}

			// Update circle position
			circle.x += circle.dx + vx;
			circle.y += circle.dy + vy;
			circle.translateX += (mouse.x / (staticity / circle.magnetism) - circle.translateX) / ease;
			circle.translateY += (mouse.y / (staticity / circle.magnetism) - circle.translateY) / ease;

			drawCircle(circle, true);

			// Handle boundary crossing
			if (
				circle.x < -circle.size ||
				circle.x > canvasSize.w + circle.size ||
				circle.y < -circle.size ||
				circle.y > canvasSize.h + circle.size
			) {
				circles.splice(i, 1);
				const newCircle = circleParams();
				drawCircle(newCircle);
			}
		});

		// Draw lines between particles after their positions are updated
		for (let i = 0; i < circles.length; i++) {
			for (let j = i + 1; j < circles.length; j++) {
				const circle1 = circles[i];
				const circle2 = circles[j];
				const distance = Math.hypot(circle1.x - circle2.x, circle1.y - circle2.y);
				if (distance < maxDistance) {
					drawLine(circle1, circle2);
				}
			}
		}

		window.requestAnimationFrame(animate);
	}

	function onMouseMove(event: MouseEvent) {
		if (canvasRef) {
			let rect = canvasRef.getBoundingClientRect();
			let { w, h } = canvasSize;
			let x = event.clientX - rect.left - w / 2;
			let y = event.clientY - rect.top - h / 2;
			let inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2;
			if (inside) {
				mouse.x = x;
				mouse.y = y;
			}
		}
	}

	onMount(() => {
		if (canvasRef) {
			context = canvasRef.getContext('2d');
			resizeCanvas();
			animate();
			window.addEventListener('resize', resizeCanvas);
			window.addEventListener('mousemove', onMouseMove);
		}

		return () => {
			window.removeEventListener('resize', resizeCanvas);
			window.removeEventListener('mousemove', onMouseMove);
		};
	});

	tick();

	updateColor();

	$effect(() => {
		if (canvasRef) {
			drawParticles();
		}
	});
</script>

<div class={className} bind:this={canvasContainerRef} aria-hidden="true">
	<canvas bind:this={canvasRef} class="size-full"></canvas>
</div>

<style>
	.size-full {
		width: 100%;
		height: 100%;
	}
</style>
