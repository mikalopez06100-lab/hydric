import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bone: {
          DEFAULT: "#F4F1EA",
          deep: "#ECE7DC",
        },
        paper: "#FBF9F4",
        rule: "#E2DCCF",
        sage: {
          DEFAULT: "#8B9D87",
          deep: "#5C6E58",
          darker: "#3F4D3D",
          pale: "#DBE2D6",
          mist: "#EDF1EA",
        },
        ink: {
          DEFAULT: "#1A1F1B",
          mid: "#4A524C",
          soft: "#8A918B",
          faint: "#BDC0BB",
        },
        clay: {
          DEFAULT: "#C26B4A",
          deep: "#A04F32",
          pale: "#F0DCD0",
        },
        water: {
          DEFAULT: "#6E8FA0",
          pale: "#D6E2E8",
          mist: "#E8EFF3",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        hydric: "2px",
      },
      maxWidth: {
        phone: "430px",
      },
    },
  },
  plugins: [],
};

export default config;
