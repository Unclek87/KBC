/**
 * Korkollie Business Center — Tailwind configuration
 *
 * The brand palette and type scale live here. Run `npm run build:css`
 * after changing anything in this file or in index.html so that
 * assets/css/styles.css (the file the browser actually downloads)
 * is regenerated.
 */
module.exports = {
  content: ['./index.html', './assets/js/**/*.js'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0B2A6B',
          900: '#071B45',
          800: '#0B2A6B',
          700: '#103583',
        },
        royal: {
          DEFAULT: '#1656C4',
          600: '#1656C4',
          500: '#2C6BDA',
        },
        gold: {
          DEFAULT: '#F5B301',
          600: '#D89C00',
          200: '#FDE9AE',
        },
        flag: {
          red: '#D62027',
          green: '#1E7A3C',
        },
      },
      fontFamily: {
        // Heavy condensed display face for headings.
        display: ['Anton', 'Arial Narrow', 'Impact', 'system-ui', 'sans-serif'],
        // Clean, highly legible face for body copy.
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 4px -1px rgb(11 42 107 / 0.08), 0 12px 28px -8px rgb(11 42 107 / 0.16)',
        lift: '0 8px 16px -4px rgb(11 42 107 / 0.14), 0 24px 44px -12px rgb(11 42 107 / 0.22)',
        gold: '0 8px 22px -8px rgb(245 179 1 / 0.55)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      maxWidth: {
        content: '76rem',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
      },
    },
  },
  plugins: [],
};
