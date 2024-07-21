module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        'brand-primary': '#c1292e',
        'brand-active': '#c1292e',
        'primary-red': '#c1292e',
        'red-hover': '#c1292e',
        'brand-background': '#ffffff',
        'brand-header-background': '#e2e1e1',
        'primary-white': '#ffffff',
        'white-hover': '#f2f2f2',
      },
      backgroundImage: {
        sidebar: "url('../../public/sidemenu-bg.jpg')",
      },
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
