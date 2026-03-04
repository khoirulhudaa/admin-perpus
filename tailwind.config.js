/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        }
      },
      animation: {
        marquee: 'marquee 25s linear infinite',
      },
      fontFamily: {
        nunito: ["Nunito", "sans-serif"],
      },
      backgroundColor: {
        darkMode: "#0A1739",
      },
      colors: {
        "theme-color-white": {
          DEFAULT: "hsl(var(--theme-color-white))",
          foreground: "hsl(var(--theme-color-white))",
        },
        "theme-color-black": {
          DEFAULT: "hsl(var(--theme-color-black))",
          foreground: "hsl(var(--theme-color-black))",
        },
        "theme-color-primary": {
          DEFAULT: "hsl(var(--theme-color-primary))",
          foreground: "hsl(var(--theme-color-primary))",
        },
        "theme-color-secondary": {
          DEFAULT: "hsl(var(--theme-color-secondary))",
          foreground: "hsl(var(--theme-color-secondary))",
        },
        "theme-color-secondary2": {
          DEFAULT: "hsl(var(--theme-color-secondary2))",
          foreground: "hsl(var(--theme-color-secondary2))",
        },
        "theme-color-secondary3": {
          DEFAULT: "hsl(var(--theme-color-secondary3))",
          foreground: "hsl(var(--theme-color-secondary3))",
        },
        "theme-color-danger": {
          DEFAULT: "hsl(var(--theme-color-danger))",
          foreground: "hsl(var(--theme-color-danger))",
        },
        "theme-color-success": {
          DEFAULT: "hsl(var(--theme-color-success))",
          foreground: "hsl(var(--theme-color-success))",
        },
        "theme-color-info": {
          DEFAULT: "hsl(var(--theme-color-info))",
          foreground: "hsl(var(--theme-color-info))",
        },
        "theme-color-warning": {
          DEFAULT: "hsl(var(--theme-color-warning))",
          foreground: "hsl(var(--theme-color-warning))",
        },
        "theme-color-gray": {
          DEFAULT: "hsl(var(--theme-color-gray))",
          foreground: "hsl(var(--theme-color-gray))",
        },
        "theme-color-border": {
          DEFAULT: "hsl(var(--theme-color-border))",
          foreground: "hsl(var(--theme-color-border))",
        },
        "theme-color-light": {
          DEFAULT: "hsl(var(--theme-color-light))",
          foreground: "hsl(var(--theme-color-light))",
        },
        "theme-color-dark": {
          DEFAULT: "hsl(var(--theme-color-dark))",
          foreground: "hsl(var(--theme-color-dark))",
        },
        primary: {
          10: "rgba(var(--theme-color-primary), 0.1)",
          20: "rgba(var(--theme-color-primary), 0.2)",
          30: "rgba(var(--theme-color-primary), 0.3)",
          40: "rgba(var(--theme-color-primary), 0.4)",
          50: "rgba(var(--theme-color-primary), 0.5)",
          60: "rgba(var(--theme-color-primary), 0.6)",
          70: "rgba(var(--theme-color-primary), 0.7)",
          80: "rgba(var(--theme-color-primary), 0.8)",
          90: "rgba(var(--theme-color-primary), 0.9)",
          100: "rgba(var(--theme-color-primary), 1)",
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          10: "rgba(var(--theme-color-secondary), 0.1)",
          20: "rgba(var(--theme-color-secondary), 0.2)",
          30: "rgba(var(--theme-color-secondary), 0.3)",
          40: "rgba(var(--theme-color-secondary), 0.4)",
          50: "rgba(var(--theme-color-secondary), 0.5)",
          60: "rgba(var(--theme-color-secondary), 0.6)",
          70: "rgba(var(--theme-color-secondary), 0.7)",
          80: "rgba(var(--theme-color-secondary), 0.8)",
          90: "rgba(var(--theme-color-secondary), 0.9)",
          100: "rgba(var(--theme-color-secondary), 1)",
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        light: {
          10: "rgba(var(--theme-color-light), 0.1)",
          20: "rgba(var(--theme-color-light), 0.2)",
          30: "rgba(var(--theme-color-light), 0.3)",
          40: "rgba(var(--theme-color-light), 0.4)",
          50: "rgba(var(--theme-color-light), 0.5)",
          60: "rgba(var(--theme-color-light), 0.6)",
          70: "rgba(var(--theme-color-light), 0.7)",
          80: "rgba(var(--theme-color-light), 0.8)",
          90: "rgba(var(--theme-color-light), 0.9)",
          100: "rgba(var(--theme-color-light), 1)",
        },
        success: {
          10: "rgba(var(--theme-color-success), 0.1)",
          20: "rgba(var(--theme-color-success), 0.2)",
          30: "rgba(var(--theme-color-success), 0.3)",
          40: "rgba(var(--theme-color-success), 0.4)",
          50: "rgba(var(--theme-color-success), 0.5)",
          60: "rgba(var(--theme-color-success), 0.6)",
          70: "rgba(var(--theme-color-success), 0.7)",
          80: "rgba(var(--theme-color-success), 0.8)",
          90: "rgba(var(--theme-color-success), 0.9)",
          100: "rgba(var(--theme-color-success), 1)",
        },
        warning: {
          10: "rgba(var(--theme-color-warning), 0.1)",
          20: "rgba(var(--theme-color-warning), 0.2)",
          30: "rgba(var(--theme-color-warning), 0.3)",
          40: "rgba(var(--theme-color-warning), 0.4)",
          50: "rgba(var(--theme-color-warning), 0.5)",
          60: "rgba(var(--theme-color-warning), 0.6)",
          70: "rgba(var(--theme-color-warning), 0.7)",
          80: "rgba(var(--theme-color-warning), 0.8)",
          90: "rgba(var(--theme-color-warning), 0.9)",
          100: "rgba(var(--theme-color-warning), 1)",
        },
        info: {
          10: "rgba(var(--theme-color-info), 0.1)",
          20: "rgba(var(--theme-color-info), 0.2)",
          30: "rgba(var(--theme-color-info), 0.3)",
          40: "rgba(var(--theme-color-info), 0.4)",
          50: "rgba(var(--theme-color-info), 0.5)",
          60: "rgba(var(--theme-color-info), 0.6)",
          70: "rgba(var(--theme-color-info), 0.7)",
          80: "rgba(var(--theme-color-info), 0.8)",
          90: "rgba(var(--theme-color-info), 0.9)",
          100: "rgba(var(--theme-color-info), 1)",
        },
        danger: {
          10: "rgba(var(--theme-color-danger), 0.1)",
          20: "rgba(var(--theme-color-danger), 0.2)",
          30: "rgba(var(--theme-color-danger), 0.3)",
          40: "rgba(var(--theme-color-danger), 0.4)",
          50: "rgba(var(--theme-color-danger), 0.5)",
          60: "rgba(var(--theme-color-danger), 0.6)",
          70: "rgba(var(--theme-color-danger), 0.7)",
          80: "rgba(var(--theme-color-danger), 0.8)",
          90: "rgba(var(--theme-color-danger), 0.9)",
          100: "rgba(var(--theme-color-danger), 1)",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
  experimental: {
    // optimizeUniversalDefaults: true,
  },
  
};
