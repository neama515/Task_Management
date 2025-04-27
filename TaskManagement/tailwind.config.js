const flowbite = require("flowbite-react/tailwind");
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",

    flowbite.content(),
  ],
  theme: {
  
    screens: {
      'sm': '380px',  
      'md': '768px',  
      'lg': '1024px', 
      'xl': '1280px', 
    },
    extend: {},
  },
  plugins: [flowbite.plugin(),],
};
