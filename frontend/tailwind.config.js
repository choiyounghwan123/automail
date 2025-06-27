/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        bounceIn: {
          "0%": { transform: "scale(0.5)", opacity: "0" },
          "50%": { transform: "scale(1.2)", opacity: "1" },
          "100%": { transform: "scale(1)" },
        },
        pulseCircle: {
          "0%": { transform: "scale(1)", opacity: "0.7" },
          "50%": { transform: "scale(1.1)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "0.7" },
        },
      },
      animation: {
        "bounce-in": "bounceIn 0.6s ease-out forwards",
        "pulse-circle": "pulseCircle 1.5s infinite ease-in-out",
      },
    },
  },
  plugins: [],
};