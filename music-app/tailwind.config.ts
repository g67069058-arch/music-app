import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        ink: {
          950: '#060608',
          900: '#0d0d14',
          800: '#131320',
          700: '#1a1a2e',
          600: '#22223b',
          500: '#2d2d4a',
          400: '#3d3d60',
          300: '#5a5a80',
          200: '#8888aa',
          100: '#bbbbcc',
          50: '#e8e8f0',
        },
        neon: {
          green: '#1aff8c',
          purple: '#b44fff',
          pink: '#ff3cac',
          blue: '#3c8fff',
          orange: '#ff8c3c',
          cyan: '#3cffee',
        },
        accent: {
          primary: '#1aff8c',
          secondary: '#b44fff',
          tertiary: '#ff3cac',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'mesh-1': 'radial-gradient(at 40% 20%, hsla(160,100%,54%,0.12) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(270,100%,63%,0.12) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(330,100%,60%,0.08) 0px, transparent 50%)',
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'waveform': 'waveform 1.2s ease-in-out infinite',
        'equalizer1': 'equalizer 0.8s ease-in-out infinite',
        'equalizer2': 'equalizer 1.1s ease-in-out infinite 0.2s',
        'equalizer3': 'equalizer 0.9s ease-in-out infinite 0.4s',
        'equalizer4': 'equalizer 1.3s ease-in-out infinite 0.1s',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(26,255,140,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(26,255,140,0.6), 0 0 80px rgba(26,255,140,0.2)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        waveform: {
          '0%, 100%': { transform: 'scaleY(0.5)' },
          '50%': { transform: 'scaleY(1)' },
        },
        equalizer: {
          '0%, 100%': { transform: 'scaleY(0.3)' },
          '50%': { transform: 'scaleY(1)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow-green': '0 0 30px rgba(26,255,140,0.4)',
        'glow-purple': '0 0 30px rgba(180,79,255,0.4)',
        'glow-pink': '0 0 30px rgba(255,60,172,0.4)',
        'glass': '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
        'card': '0 4px 24px rgba(0,0,0,0.6)',
      },
    },
  },
  plugins: [],
}
export default config
