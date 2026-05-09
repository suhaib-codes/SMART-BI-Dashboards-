/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary:        '#0A2540',
        accent:         '#00B4D8',
        'accent-dark':  '#0077B6',
        'app-bg':       '#F0F4F8',
        success:        '#20C997',
        'app-text':     '#1D2B36',
        surface:        '#FFFFFF',
        'app-border':   '#D1DCE8',
        'sidebar-text': '#A8C0D6',
        danger:         '#E63946',
      },
      fontFamily: {
        sans:   ['Inter', 'system-ui', 'sans-serif'],
        arabic: ['Tajawal', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card:       '0 2px 12px rgba(10,37,64,0.08)',
        'card-hover': '0 8px 24px rgba(10,37,64,0.16)',
        sidebar:    '4px 0 16px rgba(10,37,64,0.12)',
      },
      transitionDuration: {
        250: '250ms',
      },
      minHeight: {
        'iframe': '400px',
      },
      animation: {
        'spin-slow': 'spin 2s linear infinite',
      },
    },
  },
  plugins: [],
};
