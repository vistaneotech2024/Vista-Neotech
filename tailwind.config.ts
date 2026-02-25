import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    'flex', 'flex-col', 'flex-1', 'min-h-screen', 'flex-wrap', 'items-center', 'justify-center', 'gap-4', 'relative', 'overflow-hidden', 'z-10',
  ],
  theme: {
    extend: {
      colors: {
        /* Semantic – use in components; they read from CSS vars in globals */
        brand: {
          orange: '#e65100',
          'orange-light': '#ff833a',
          cyan: '#0097a7',
          'cyan-light': '#4dd0e1',
          green: '#689f38',
          'green-light': '#9ccc65',
          amber: '#ff8f00',
          teal: '#00897b',
        },
        primary: {
          orange: '#e65100',
          'orange-light': '#ff833a',
          'orange-dark': '#bf360c',
        },
        neutral: {
          charcoal: '#1a1a1a',
          grey: '#737373',
          light: '#e5e5e5',
          lighter: '#f5f5f5',
          white: '#ffffff',
          black: '#0c0c0e',
        },
        accent: {
          cyan: '#0097a7',
          'cyan-light': '#4dd0e1',
          green: '#689f38',
          'green-light': '#9ccc65',
          amber: '#ff8f00',
          teal: '#00897b',
        },
      },
      fontFamily: {
        sans: ['var(--font-primary)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1.5' }],
        sm: ['0.875rem', { lineHeight: '1.5' }],
        base: ['1rem', { lineHeight: '1.6' }],
        lg: ['1.125rem', { lineHeight: '1.6' }],
        xl: ['1.25rem', { lineHeight: '1.2' }],
        '2xl': ['1.5rem', { lineHeight: '1.2' }],
        '3xl': ['1.875rem', { lineHeight: '1.2' }],
        '4xl': ['2.25rem', { lineHeight: '1.2' }],
        '5xl': ['3rem', { lineHeight: '1.2' }],
        '6xl': ['3.75rem', { lineHeight: '1.1' }],
        '7xl': ['4.5rem', { lineHeight: '1.05' }],
        '8xl': ['6rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'mesh-gradient': 'linear-gradient(135deg, #f5f5f5 0%, #e8f4f8 50%, #f0f5e8 100%)',
        'mesh-dark': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(255,127,0,0.15), transparent), radial-gradient(ellipse 60% 40% at 100% 50%, rgba(0,188,212,0.08), transparent), radial-gradient(ellipse 50% 30% at 0% 80%, rgba(139,195,74,0.06), transparent)',
      },
      boxShadow: {
        'glow-orange': '0 0 40px -10px rgba(230, 81, 0, 0.45)',
        'glow-cyan': '0 0 40px -10px rgba(0, 151, 167, 0.4)',
        'glow-green': '0 0 40px -10px rgba(104, 159, 56, 0.4)',
        'glow-teal': '0 0 40px -10px rgba(0, 137, 123, 0.4)',
        'glow-amber': '0 0 40px -10px rgba(255, 143, 0, 0.4)',
      },
    },
  },
  plugins: [],
};

export default config;
