import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
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
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				warning: {
					DEFAULT: 'hsl(var(--warning))',
					foreground: 'hsl(var(--warning-foreground))'
				},
				'panthers-blue': {
					'950': 'hsl(var(--panthers-blue-950))',
					'900': 'hsl(var(--panthers-blue-900))',
					'800': 'hsl(var(--panthers-blue-800))',
					'700': 'hsl(var(--panthers-blue-700))',
					'600': 'hsl(var(--panthers-blue-600))',
					'500': 'hsl(var(--panthers-blue-500))',
					'400': 'hsl(var(--panthers-blue-400))',
					'300': 'hsl(var(--panthers-blue-300))',
					'200': 'hsl(var(--panthers-blue-200))',
					'100': 'hsl(var(--panthers-blue-100))',
					'50': 'hsl(195 40% 98%)'
				},
				'platinum': {
					'900': 'hsl(var(--platinum-900))',
					'800': 'hsl(var(--platinum-800))',
					'700': 'hsl(var(--platinum-700))',
					'600': 'hsl(var(--platinum-600))',
					'500': 'hsl(var(--platinum-500))',
					'400': 'hsl(var(--platinum-400))',
					'300': 'hsl(var(--platinum-300))',
					'200': 'hsl(var(--platinum-200))',
					'100': 'hsl(var(--platinum-100))'
				},
				amber: {
					'600': 'hsl(var(--amber-600))',
					'500': 'hsl(var(--amber-500))',
					'400': 'hsl(var(--amber-400))',
					'300': 'hsl(var(--amber-300))',
					'200': 'hsl(var(--amber-200))'
				},
				header: {
					DEFAULT: 'hsl(var(--header-background))',
					foreground: 'hsl(var(--header-foreground))'
				},
				section: {
					DEFAULT: 'hsl(var(--section-background))',
					secondary: 'hsl(var(--section-secondary))'
				},
				overlay: {
					dark: 'hsl(var(--overlay-dark))',
					darker: 'hsl(var(--overlay-darker))'
				}
			},
			backgroundImage: {
				'gradient-hero': 'var(--gradient-hero)',
				'gradient-panthers': 'var(--gradient-panthers)',
				'gradient-platinum': 'var(--gradient-platinum)',
				'gradient-electric': 'var(--gradient-electric)'
			},
			boxShadow: {
				'panthers': 'var(--shadow-panthers)',
				'platinum': 'var(--shadow-platinum)',
				'electric': 'var(--shadow-electric)'
			},
			transitionTimingFunction: {
				'smooth': 'var(--transition-smooth)'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'scale-in': {
					'0%': {
						transform: 'scale(0.95)',
						opacity: '0'
					},
					'100%': {
						transform: 'scale(1)',
						opacity: '1'
					}
				},
				'slide-in-right': {
					'0%': { transform: 'translateX(100%)' },
					'100%': { transform: 'translateX(0)' }
				},
				'slide-in-left': {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(0)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'scale-in': 'scale-in 0.2s ease-out',
				'slide-in-right': 'slide-in-right 0.3s ease-out',
				'slide-in-left': 'slide-in-left 0.3s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
