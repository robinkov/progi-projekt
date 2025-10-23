/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: '#ffffff',
        foreground: '#262626',
        card: {
          DEFAULT: '#ffffff',
          foreground: '#262626',
        },
        popover: {
          DEFAULT: '#ffffff',
          foreground: '#262626',
        },
        primary: {
          DEFAULT: '#333333',
          foreground: '#fafafa',
        },
        secondary: {
          DEFAULT: '#f7f7f7',
          foreground: '#333333',
        },
        muted: {
          DEFAULT: '#f7f7f7',
          foreground: '#8e8e8e',
        },
        accent: {
          DEFAULT: '#f7f7f7',
          foreground: '#333333',
        },
        destructive: '#d13415',
        border: '#ebebeb',
        input: '#ebebeb',
        ring: '#b4b4b4',
        chart: {
          '1': '#e1701a',
          '2': '#00a6a6',
          '3': '#005780',
          '4': '#4caf50',
          '5': '#2b8c3e',
        },
        sidebar: {
          DEFAULT: '#fafafa',
          foreground: '#262626',
          primary: {
            DEFAULT: '#333333',
            foreground: '#fafafa',
          },
          accent: {
            DEFAULT: '#f7f7f7',
            foreground: '#333333',
          },
          border: '#ebebeb',
          ring: '#b4b4b4',
        },
      },
      borderRadius: {
        DEFAULT: '0.625rem',
      },
    },
  },
  plugins: [],
}