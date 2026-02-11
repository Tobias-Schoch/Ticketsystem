import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        // Warm, inviting palette - Terracotta, Cream, Sage accents
        sage: {
          // Warmer neutral gray-brown (for text and subtle UI)
          50: '#faf9f7',
          100: '#f0eeea',
          200: '#e0dcd5',
          300: '#c9c3b8',
          400: '#a89f91',
          500: '#8a7f6f',
          600: '#6f6456',
          700: '#5a5146',
          800: '#4a433a',
          900: '#3d3731',
        },
        sand: {
          // Cream/warm backgrounds
          50: '#fefdfb',
          100: '#fcf9f4',
          200: '#f7f1e7',
          300: '#efe5d5',
          400: '#e2d3bc',
          500: '#d1bb9c',
          600: '#bca07a',
          700: '#9d8362',
          800: '#826c52',
          900: '#6b5945',
        },
        warmth: {
          // Terracotta - PRIMARY accent color
          50: '#fef6f3',
          100: '#fee9e2',
          200: '#fdd5c8',
          300: '#fab6a0',
          400: '#f48c6a',
          500: '#e86d42',
          600: '#d45530',
          700: '#b14426',
          800: '#923a24',
          900: '#783323',
        },
        calm: {
          // Dusty rose/blush - soft secondary accent
          50: '#fdf8f7',
          100: '#faeeed',
          200: '#f5dbd8',
          300: '#ecc0ba',
          400: '#df9d94',
          500: '#cc7a70',
          600: '#b55f55',
          700: '#974d44',
          800: '#7d423b',
          900: '#693b35',
        },
        priority: {
          critical: '#d45530',  // Terracotta
          high: '#e8a066',      // Warm amber
          medium: '#d1bb9c',    // Sand
          low: '#a89f91',       // Warm gray
        },
        status: {
          open: '#e86d42',       // Terracotta
          'in-progress': '#e8a066', // Amber
          review: '#cc7a70',     // Dusty rose
          done: '#8a9a7c',       // Muted sage green
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.04), 0 10px 20px -2px rgba(0, 0, 0, 0.02)',
        'soft-lg': '0 10px 40px -10px rgba(0, 0, 0, 0.08)',
        'glow': '0 0 40px rgba(232, 109, 66, 0.15)',
        'glow-warm': '0 0 30px rgba(232, 109, 66, 0.2)',
      },
      animation: {
        // Entry animations
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'pop': 'pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'slide-in-right': 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in-left': 'slideInLeft 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        // Exit animations
        'fade-out': 'fadeOut 0.2s ease-in forwards',
        'slide-down': 'slideDown 0.2s ease-in forwards',
        'scale-out': 'scaleOut 0.2s ease-in forwards',
        // Feedback animations
        'bounce': 'bounce 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'wiggle': 'wiggle 0.5s ease-in-out',
        'shake': 'shake 0.4s ease-in-out',
        // Ambient animations
        'float': 'float 6s ease-in-out infinite',
        'breathe': 'breathe 4s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s ease-in-out infinite',
        // Progress animation
        'progress': 'progress linear forwards',
      },
      keyframes: {
        // Entry keyframes
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pop: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        // Exit keyframes
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideDown: {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(10px)' },
        },
        scaleOut: {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(0.95)' },
        },
        // Feedback keyframes
        bounce: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.95)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-3deg)' },
          '75%': { transform: 'rotate(3deg)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '75%': { transform: 'translateX(4px)' },
        },
        // Ambient keyframes
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.05)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        // Progress keyframe
        progress: {
          '0%': { width: '100%' },
          '100%': { width: '0%' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
