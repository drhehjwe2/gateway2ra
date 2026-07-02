/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: "#0a0a0f",
          card: "rgba(22, 22, 31, 0.6)",
          cyan: "#00d4ff",
          purple: "#b300ff",
          green: "#39ff14",
          red: "#ff0044",
          gold: "#ffd700",
          textMain: "#ffffff",
          textSecondary: "rgba(255,255,255,0.7)",
          textMuted: "rgba(255,255,255,0.4)",
        }
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        space: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        vazir: ['Vazirmatn', 'sans-serif'],
      },
      animation: {
        'scanline': 'scanline 8s linear infinite',
        'glitch': 'glitch 5s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        scanline: {
          '0%': { top: '-100%' },
          '100%': { top: '100%' },
        },
        glitch: {
          '0%, 90%, 100%': { transform: 'none' },
          '92%': { transform: 'translateX(-2px) skewX(2deg)' },
          '94%': { transform: 'translateX(2px) skewX(-2deg)' },
          '96%': { transform: 'translateX(-1px) skewX(1deg)' },
          '98%': { transform: 'translateX(1px) skewX(-1deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
}
