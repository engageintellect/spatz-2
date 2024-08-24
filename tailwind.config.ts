import { fontFamily } from 'tailwindcss/defaultTheme';
import type { Config } from 'tailwindcss';

const config: Config = {
	darkMode: ['class'],
	content: ['./src/**/*.{html,js,svelte,ts}'],
	safelist: ['dark'],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border) / <alpha-value>)',
				input: 'hsl(var(--input) / <alpha-value>)',
				ring: 'hsl(var(--ring) / <alpha-value>)',
				background: 'hsl(var(--background) / <alpha-value>)',
				foreground: 'hsl(var(--foreground) / <alpha-value>)',
				primary: {
					DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
					foreground: 'hsl(var(--primary-foreground) / <alpha-value>)'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
					foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
					foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
					foreground: 'hsl(var(--muted-foreground) / <alpha-value>)'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
					foreground: 'hsl(var(--accent-foreground) / <alpha-value>)'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
					foreground: 'hsl(var(--popover-foreground) / <alpha-value>)'
				},
				card: {
					DEFAULT: 'hsl(var(--card) / <alpha-value>)',
					foreground: 'hsl(var(--card-foreground) / <alpha-value>)'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				sans: [...fontFamily.sans]
			},
			backgroundImage: {
				'fade-up': `linear-gradient(to top, rgba(255, 255, 255, 0), hsl(var(--background)))`,
				'fade-down': `linear-gradient(to bottom, rgba(255, 255, 255, 0), hsl(var(--background)))`,
				'fade-left': `linear-gradient(to left, rgba(255, 255, 255, 0), hsl(var(--background)))`,
				'fade-right': `linear-gradient(to right, rgba(255, 255, 255, 0), hsl(var(--background)))`
			},

			keyframes: {
				meteor: {
					'0%': { transform: 'rotate(318deg) translateY(220px)', opacity: '1' },
					'70%': { opacity: '1' },
					'100%': {
						transform: 'rotate(300deg) translateX(-10000px)',
						opacity: '0'
					}
				},

				scaleInAndOut: {
					'0%, 100%': { transform: 'scale(0.75)' },
					'50%': { transform: 'scale(1)' }
				},

				customBounce: {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' } // Adjust height here
				},

				slowBounce: {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-40px)' } // Adjust height here
				},

				orbit: {
					'0%': {
						transform: 'rotate(0deg) translateY(calc(var(--radius) * 1px)) rotate(0deg)'
					},
					'100%': {
						transform: 'rotate(360deg) translateY(calc(var(--radius) * 1px)) rotate(-360deg)'
					}
				},

				marquee: {
					from: { transform: 'translateX(0)' },
					to: { transform: 'translateX(calc(-100% - var(--gap)))' }
				},
				'marquee-vertical': {
					from: { transform: 'translateY(0)' },
					to: { transform: 'translateY(calc(-100% - var(--gap)))' }
				},

				randomScale: {
					'0%, 100%': { transform: 'scale(0.5)' },
					'50%': { transform: 'scale(1)' }
				},
				randomUpDown: {
					'0%, 100%': { transform: 'translateY(0)' },
					'25%': { transform: 'translateY(-10px)' },
					'50%': { transform: 'translateY(20px)' },
					'75%': { transform: 'translateY(-15px)' }
				},
				randomLeftRight: {
					'0%, 100%': { transform: 'translateX(0)' },
					'25%': { transform: 'translateX(-10px)' },
					'50%': { transform: 'translateX(20px)' },
					'75%': { transform: 'translateX(-15px)' }
				},

				likePost: {
					'0%': { transform: 'scale(1)', opacity: '1' },
					'50%': { transform: 'scale(1.25)', opacity: '0.8' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},

				deletePost: {
					'0%': { transform: 'scale(1)', opacity: '1' },
					'50%': { transform: 'scale(1.25)', opacity: '1' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},

				pulse: {
					'0%, 100%': { boxShadow: '0 0 0 0 var(--pulse-color)' },
					'50%': { boxShadow: '0 0 0 6px var(--pulse-color)' }
				},

				'shine-pulse': {
					'0%': {
						'background-position': '0% 0%'
					},
					'50%': {
						'background-position': '100% 100%'
					},
					to: {
						'background-position': '0% 0%'
					}
				}
			},
			animation: {
				pulse: 'pulse 2s ease-out infinite',

				customBounce: 'customBounce 10s ease-in-out infinite', // Adjust duration here
				slowBounce: 'customBounce 3s ease-in-out infinite', // Adjust duration here
				likePost: 'likePost 0.3s ease-in-out forwards',
				deletePost: 'likePost 0.25s ease-in-out forwards',

				scaleInAndOut: 'scaleInAndOut 3s ease-in-out infinite',
				scaleAndMove:
					'randomScale 3s ease-in-out infinite, randomUpDown 4s ease-in-out infinite, randomLeftRight 5s ease-in-out infinite',

				orbit: 'orbit calc(var(--duration)*1s) linear infinite',
				meteor: 'meteor 2s linear infinite',
				marquee: 'marquee var(--duration) linear infinite',
				'marquee-vertical': 'marquee-vertical var(--duration) linear infinite'
			}
		}
	}
};

export default config;
