/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        kesari: {
          DEFAULT: 'var(--color-kesari)',
          hover: 'var(--color-kesari-hover)',
          light: 'var(--color-kesari-light)',
        },
        haldi: {
          DEFAULT: 'var(--color-haldi)',
          light: 'var(--color-haldi-light)',
        },
        kumkum: {
          DEFAULT: 'var(--color-kumkum)',
          light: 'var(--color-kumkum-light)',
        },
        neel: {
          DEFAULT: 'var(--color-neel)',
          deep: 'var(--color-neel-deep)',
          surface: 'var(--color-neel-surface)',
        },
        godavari: {
          DEFAULT: 'var(--color-godavari)',
          light: 'var(--color-godavari-light)',
          tint: 'var(--color-godavari-tint)',
        },
        tulsi: {
          DEFAULT: 'var(--color-tulsi)',
          light: 'var(--color-tulsi-light)',
        },
        chandan: {
          DEFAULT: 'var(--color-chandan)',
          card: 'var(--color-chandan-card)',
          border: 'var(--color-chandan-border)',
        },
        mitti: {
          DEFAULT: 'var(--color-mitti)',
          light: 'var(--color-mitti-light)',
        },
        ink: {
          DEFAULT: 'var(--color-ink)',
          muted: 'var(--color-ink-muted)',
          subtle: 'var(--color-ink-subtle)',
        },
      },
      fontFamily: {
        serif: ['"Tiro Telugu"', '"Tiro Devanagari Hindi"', 'Georgia', 'serif'],
        sans: ['"Noto Sans Telugu"', '"Noto Sans Devanagari"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'kalamkari': '12px',
      },
      boxShadow: {
        'sutra': '0 2px 8px rgba(31, 42, 92, 0.08)',
        'sutra-lg': '0 8px 24px rgba(31, 42, 92, 0.12)',
        'urgent': '0 4px 16px rgba(163, 38, 30, 0.2)',
      }
    },
  },
  plugins: [],
}
