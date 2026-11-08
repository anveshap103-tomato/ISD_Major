/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Ryth Core — Premium Editorial & Modern Networking Palette
        canvas: {
          DEFAULT: '#F7F5EF', // Primary warm ivory background
          card: '#FFFFFF',    // Surface card
          muted: '#EFECE3',   // Muted surface tint
        },
        ink: {
          DEFAULT: '#192521', // Primary deep ink text
          muted: '#5A6561',   // Secondary / muted grey
          faint: '#8B9591',   // Tertiary / subtle labels
        },
        accent: {
          DEFAULT: '#28634F', // Primary forest green
          hover: '#1E4D3D',
          subtle: '#DCE8E0',  // Soft sage
          light: '#EBF3EE',
          secondary: '#D9A66C', // Warm ochre / amber secondary accent
          'secondary-light': '#FDF5EC',
        },
        sage: {
          DEFAULT: '#DCE8E0',
          dark: '#28634F',
          light: '#EDF5F0',
        },
        line: {
          DEFAULT: '#E5E3DC', // Soft neutral grey border
          subtle: '#EDEBE4',
          strong: '#D1CEC4',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
        serif: [
          '"Newsreader"',
          'Charter',
          'Georgia',
          'serif',
        ],
      },
      borderRadius: {
        none: '0px',
        sm: '4px',
        DEFAULT: '8px',
        md: '10px',
        lg: '14px',
        xl: '18px',
        '2xl': '22px',
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(25, 37, 33, 0.04), 0 1px 2px -1px rgba(25, 37, 33, 0.04)',
        card: '0 2px 6px -1px rgba(25, 37, 33, 0.05), 0 1px 4px -2px rgba(25, 37, 33, 0.04)',
        hover: '0 6px 16px -2px rgba(25, 37, 33, 0.08), 0 2px 6px -2px rgba(25, 37, 33, 0.04)',
      },
    },
  },
  plugins: [],
};
