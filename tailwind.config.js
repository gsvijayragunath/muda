/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      colors: {
        customBlue: "#1D4ED8",
        customGreen: "#10B981",
        customText: "#363D47",
      },
      fontFamily: {
        sans: ["Roboto", "sans-serif"],
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
      },
      animation: {
        'pulse-slow': 'pulse 2s ease-in-out infinite',
        'bounce-slow': 'bounce 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
