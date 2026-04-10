/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#00AEEF",
        "primary-dark": "#007EA7",
        "primary-light": "#E0F7FF",
        accent: "#00C2D1",
        "accent-light": "#E0F7FF",
        background: "#0F172A",
        surface: "#FFFFFF",
        "surface-alt": "#F9FAFB",
        "neutral-light": "#F3F4F6",
        border: "#E5E7EB",
        "text-primary": "#111827",
        "text-secondary": "#6B7280",
        success: "#10B981",
        "success-light": "#D1FAE5",
        error: "#EF4444",
        "error-light": "#FEE2E2",
        warning: "#F59E0B",
        "warning-light": "#FEF3C7",
        neutral: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        },
      },
      fontFamily: {
        sans: ['"Segoe UI"', '"Roboto"', '"Helvetica Neue"', 'sans-serif'],
        heading: ['"Goliath Century"', '"Segoe UI"', '"Roboto"', 'sans-serif'],
      },
      fontSize: {
        xs: ['12px', { lineHeight: '16px' }],
        sm: ['14px', { lineHeight: '20px' }],
        base: ['16px', { lineHeight: '24px' }],
        lg: ['18px', { lineHeight: '28px' }],
        xl: ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['30px', { lineHeight: '36px' }],
        '4xl': ['36px', { lineHeight: '44px' }],
      },
      fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
      spacing: {
        0: '0px',
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        5: '20px',
        6: '24px',
        8: '32px',
        10: '40px',
        12: '48px',
        16: '64px',
        20: '80px',
      },
      borderRadius: {
        none: '0px',
        sm: '4px',
        base: '6px',
        lg: '8px',
        xl: '12px',
        '2xl': '16px',
        '3xl': '20px',
        full: '9999px',
      },
      boxShadow: {
        none: 'none',
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        focus: '0 0 0 3px rgba(0, 174, 239, 0.1), 0 0 0 1px rgba(0, 174, 239, 1)',
      },
      transition: {
        fast: '150ms ease-in-out',
        base: '200ms ease-in-out',
        slow: '300ms ease-in-out',
      },
      animation: {
        spin: 'spin 1s linear infinite',
        fadeIn: 'fadeIn 0.3s ease-in-out',
        slideUp: 'slideUp 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        '.btn-primary': {
          '@apply': 'inline-flex items-center justify-center px-4 py-3 font-semibold rounded-lg bg-primary text-white transition-all duration-200 hover:bg-primary-dark active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg',
        },
        '.btn-secondary': {
          '@apply': 'inline-flex items-center justify-center px-4 py-3 font-semibold rounded-lg border-2 border-primary text-white bg-primary transition-all duration-200 hover:bg-primary-dark active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg',
        },
        '.btn-tertiary': {
          '@apply': 'inline-flex items-center justify-center px-4 py-3 font-semibold rounded-lg bg-transparent text-primary transition-all duration-200 hover:bg-primary-light active:scale-95 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed',
        },
        '.btn-sm': {
          '@apply': 'px-3 py-2 text-sm font-medium rounded-md',
        },
        '.btn-lg': {
          '@apply': 'px-6 py-4 text-lg font-semibold rounded-lg',
        },
        '.input-field': {
          '@apply': 'w-full px-4 py-3 border-2 border-border rounded-lg text-base text-text-primary placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 disabled:bg-surface-alt disabled:cursor-not-allowed',
        },
        '.input-error': {
          '@apply': 'border-error focus:border-error focus:ring-error',
        },
        '.card': {
          '@apply': 'bg-white rounded-xl shadow-md border border-border p-6 transition-all duration-200 hover:shadow-lg',
        },
        '.card-alt': {
          '@apply': 'bg-surface-alt rounded-xl shadow-sm border border-border p-6',
        },
        '.container-centered': {
          '@apply': 'w-full max-w-md mx-auto px-4',
        },
        '.heading-1': {
          '@apply': 'text-4xl font-bold text-text-primary leading-tight',
        },
        '.heading-2': {
          '@apply': 'text-3xl font-bold text-text-primary leading-tight',
        },
        '.heading-3': {
          '@apply': 'text-2xl font-semibold text-text-primary',
        },
        '.heading-4': {
          '@apply': 'text-xl font-semibold text-text-primary',
        },
        '.body-text': {
          '@apply': 'text-base font-normal text-text-primary',
        },
        '.body-secondary': {
          '@apply': 'text-base font-normal text-text-secondary',
        },
        '.text-helper': {
          '@apply': 'text-xs font-normal text-gray-500',
        },
      });
    },
  ],
}
