/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        museum: {
          wood: {
            50: '#F5E6C8',
            100: '#E6D2A8',
            200: '#C9A873',
            300: '#A67C52',
            400: '#7A5230',
            500: '#5C3A1E',
            600: '#4A2E17',
            700: '#3E2723',
            800: '#2D1B16',
            900: '#1C0F0C',
          },
          brass: {
            100: '#F4E0A1',
            200: '#E9C67A',
            300: '#D4AF37',
            400: '#B8860B',
            500: '#8B6914',
            600: '#6B4F0E',
          },
          parchment: '#F5E6C8',
          parchmentDark: '#E4D2A8',
          ink: '#2C1810',
        },
        scan: {
          uv: '#9C27B0',
          uvGlow: '#E040FB',
          ir: '#E53935',
          irGlow: '#FF5252',
          solvent: '#4CAF50',
          solventGlow: '#69F0AE',
        },
      },
      fontFamily: {
        'cinzel': ['"Cinzel Decorative"', 'serif'],
        'cormorant': ['"Cormorant Garamond"', 'serif'],
        'handwriting': ['"Homemade Apple"', 'cursive'],
        'chinese-hand': ['"Ma Shan Zheng"', 'cursive'],
      },
      boxShadow: {
        'brass': '0 2px 4px rgba(139,105,20,0.5), inset 0 1px 2px rgba(244,224,161,0.3), inset 0 -2px 4px rgba(107,79,14,0.6)',
        'brass-active': '0 1px 2px rgba(139,105,20,0.5), inset 0 2px 6px rgba(107,79,14,0.6), inset 0 -1px 2px rgba(244,224,161,0.2)',
        'frame-inner': 'inset 0 0 60px rgba(0,0,0,0.4), inset 0 0 120px rgba(28,15,12,0.3)',
        'glow-uv': '0 0 30px rgba(224,64,251,0.8), 0 0 60px rgba(156,39,176,0.4)',
        'glow-ir': '0 0 30px rgba(255,82,82,0.8), 0 0 60px rgba(229,57,53,0.4)',
        'glow-solvent': '0 0 30px rgba(105,240,174,0.8), 0 0 60px rgba(76,175,80,0.4)',
      },
      backgroundImage: {
        'wood-grain': "repeating-linear-gradient(90deg, transparent 0, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 3px), linear-gradient(180deg, #5C3A1E 0%, #3E2723 50%, #2D1B16 100%)",
        'parchment-tex': "radial-gradient(ellipse at 30% 20%, rgba(139,105,20,0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(62,39,35,0.1) 0%, transparent 60%)",
      },
      animation: {
        'flicker': 'flicker 2s ease-in-out infinite',
        'scan-sweep': 'scanSweep 3s linear infinite',
        'dissolve': 'dissolve 0.5s ease-out forwards',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
        scanSweep: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        dissolve: {
          '0%': { opacity: '1', clipPath: 'circle(0%)' },
          '100%': { opacity: '0', clipPath: 'circle(100%)' },
        },
      },
    },
  },
  plugins: [],
};
