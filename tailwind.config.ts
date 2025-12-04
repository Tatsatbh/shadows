import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
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
  			// Shadows.sh Design Tokens
  			void: {
  				page: '#09090b',      // Zinc 950 - Page background
  				card: '#121214',      // Custom - Card surface
  				elevated: '#18181b',  // Zinc 900 - Modals/dropdowns
  			},
  			edge: {
  				subtle: '#27272a',    // Zinc 800 - Subtle borders
  				active: '#3f3f46',    // Zinc 700 - Active borders
  			},
  			light: {
  				primary: '#fafafa',   // Zinc 50 - Primary text
  				muted: '#a1a1aa',     // Zinc 400 - Muted text
  				brand: '#ffffff',     // Pure white - Brand accent
  			},
  			indicator: {
  				danger: '#f43f5e',    // Rose 500 - Live/Danger
  				success: '#10b981',   // Emerald 500 - Success/Terminal
  				voice: '#6366f1',     // Indigo 500 - Voice/Active
  			},
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		boxShadow: {
  			'glow': '0 0 0 1px rgba(255, 255, 255, 0.1), 0 4px 12px rgba(0, 0, 0, 0.5)',
  			'glow-sm': '0 0 0 1px rgba(255, 255, 255, 0.08), 0 2px 8px rgba(0, 0, 0, 0.4)',
  			'glow-lg': '0 0 0 1px rgba(255, 255, 255, 0.12), 0 8px 24px rgba(0, 0, 0, 0.6)',
  			'glow-danger': '0 0 0 1px rgba(244, 63, 94, 0.3), 0 4px 12px rgba(244, 63, 94, 0.2)',
  			'glow-success': '0 0 0 1px rgba(16, 185, 129, 0.3), 0 4px 12px rgba(16, 185, 129, 0.2)',
  			'glow-voice': '0 0 0 1px rgba(99, 102, 241, 0.3), 0 4px 12px rgba(99, 102, 241, 0.2)',
  		},
  	}
  },
  plugins: [require("tailwindcss-animate"), require('@tailwindcss/typography')],
} satisfies Config;
