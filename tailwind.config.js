/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // NCBA Official Color Palette - Complete with variants
        'ncb': {
          // Primary Blue
          'blue': '#3AB3E5',
          'blue-light': '#6BC5ED',
          'blue-dark': '#2A8CB5',
          'blue-50': '#EBF7FD',
          'blue-100': '#D6EFF9',
          'blue-200': '#ADDEF4',
          'blue-300': '#85CEEE',
          'blue-400': '#5CBDE9',
          'blue-500': '#3AB3E5',
          'blue-600': '#2E8FB7',
          'blue-700': '#236B8A',
          'blue-800': '#17485C',
          'blue-900': '#0C242E',
          
          // Headings
          'heading': '#392030',
          'heading-light': '#5A3A4E',
          'heading-dark': '#1C1018',
          
          // Body Text
          'text': '#7F7F7F',
          'text-light': '#A0A0A0',
          'text-dark': '#5C5C5C',
          
          // Status/Brown
          'status': '#40322E',
          'status-light': '#6B5851',
          'status-dark': '#2B221F',
          'status-50': '#F5F3F2',
          'status-100': '#EBE6E4',
          'status-200': '#D6CDC9',
          'status-300': '#C2B4AE',
          'status-400': '#AD9B93',
          'status-500': '#40322E',
          'status-600': '#332825',
          'status-700': '#261E1C',
          'status-800': '#1A1412',
          'status-900': '#0D0A09',
          
          // Neutrals
          'white': '#FFFFFF',
          'lightbg': '#F8F9FA',
          'divider': '#E8E8E8',
        },
        
        // Functional colors
        'success': '#10B981',
        'success-light': '#34D399',
        'success-dark': '#059669',
        'warning': '#F59E0B',
        'warning-light': '#FBBF24',
        'warning-dark': '#D97706',
        'error': '#EF4444',
        'error-light': '#F87171',
        'error-dark': '#DC2626',
        'info': '#3AB3E5',
        
        // Neutral grays
        'gray': {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
      },
      
      fontSize: {
        'xxs': ['0.625rem', { lineHeight: '0.875rem' }],    // 10px
        'xs': ['0.75rem', { lineHeight: '1rem' }],          // 12px
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],      // 14px
        'base': ['1rem', { lineHeight: '1.5rem' }],         // 16px
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],      // 18px
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],       // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem' }],          // 24px
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],     // 30px
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],       // 36px
        '5xl': ['3rem', { lineHeight: '1.2' }],             // 48px
      },
      
      fontFamily: {
        'sans': ['Century Gothic', 'CenturyGothic', 'AppleGothic', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      
      // Fixed animation keyframes
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'spin-slow': 'spin 2s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
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
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      
      // Enhanced shadows
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
        'dropdown': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05)',
        'modal': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'elevated': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      
      borderWidth: {
        '3': '3px',
      },
      
      // Fixed backdrop blur configuration
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
      },
      
      // Add gradient backgrounds
      backgroundImage: {
        'gradient-blue': 'linear-gradient(135deg, #3AB3E5 0%, #2A8CB5 100%)',
        'gradient-heading': 'linear-gradient(135deg, #392030 0%, #1C1018 100%)',
        'gradient-success': 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      },
      
      // Add transition timing
      transitionTimingFunction: {
        'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
      },
      
      // Add z-index layers
      zIndex: {
        '1': '1',
        '2': '2',
        '3': '3',
        '4': '4',
        '5': '5',
      },
    },
  },
  plugins: [
    // Add custom plugin for form styles
    function({ addUtilities, addComponents, theme }) {
      // Custom utilities
      addUtilities({
        '.text-shadow-sm': {
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
        },
        '.text-shadow-none': {
          textShadow: 'none',
        },
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      });
      
      // Custom component classes for NCBA design system
      addComponents({
        '.btn-primary': {
          display: 'inline-flex',
          alignItems: 'center',
          gap: theme('spacing.1.5'),
          padding: `${theme('spacing.1.5')} ${theme('spacing.3')}`,
          fontSize: theme('fontSize.xs')[0],
          fontWeight: theme('fontWeight.semibold'),
          color: theme('colors.ncb.white'),
          backgroundColor: theme('colors.ncb.blue'),
          borderRadius: theme('borderRadius.md'),
          transition: 'all 200ms',
          '&:hover': {
            backgroundColor: theme('colors.ncb.blue-dark'),
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
          '&:focus': {
            outline: 'none',
            ring: `2px solid ${theme('colors.ncb.blue')}`,
          },
        },
        '.btn-secondary': {
          display: 'inline-flex',
          alignItems: 'center',
          gap: theme('spacing.1.5'),
          padding: `${theme('spacing.1.5')} ${theme('spacing.3')}`,
          fontSize: theme('fontSize.xs')[0],
          fontWeight: theme('fontWeight.semibold'),
          color: theme('colors.ncb.text'),
          backgroundColor: theme('colors.ncb.white'),
          borderWidth: '1px',
          borderColor: theme('colors.ncb.divider'),
          borderRadius: theme('borderRadius.md'),
          transition: 'all 200ms',
          '&:hover': {
            backgroundColor: theme('colors.gray.50'),
            borderColor: theme('colors.ncb.blue'),
            color: theme('colors.ncb.blue'),
          },
        },
        '.card': {
          backgroundColor: theme('colors.ncb.white'),
          borderRadius: theme('borderRadius.lg'),
          borderWidth: '1px',
          borderColor: theme('colors.ncb.divider'),
          boxShadow: theme('boxShadow.card'),
          transition: 'all 200ms',
          '&:hover': {
            boxShadow: theme('boxShadow.card-hover'),
            transform: 'translateY(-2px)',
          },
        },
        '.stat-card': {
          backgroundColor: theme('colors.ncb.white'),
          borderRadius: theme('borderRadius.lg'),
          borderWidth: '1px',
          borderColor: theme('colors.ncb.divider'),
          boxShadow: theme('boxShadow.card'),
          padding: theme('spacing.3'),
        },
      });
    },
  ],
};