/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './screens/**/*.{js,jsx,ts,tsx}', // Add any directories where your components are located
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  presets: [require("nativewind/preset")], // Add NativeWind preset here
};
