import scrollbarHide from "tailwind-scrollbar-hide";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        white: "#ffffff",
        black: "#000000",
        brandlightgray: "#ededed",
        brandsoftgray: "#979292",
        brandsuccess: "#78bb7b",
        brandalert: "#c64141",
        brandsoftlavender: "#d2d7ee",
        brandiceblue: "#e6ecf9",
        brandmistblue: "#d5dceb",
        brandbabyblue: "#c6d8f5",
        brandmediumblue: "#8aa8f1",
        brandprimary: "#013cc6",
        brandsteel: "#727d9f",
        branddeepblue: "#1e396d",
      },
    },
  },
  plugins: [scrollbarHide],
};
