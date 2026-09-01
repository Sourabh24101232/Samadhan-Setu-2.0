// ==========================================
// FRONTEND - TAILWIND CSS CONFIGURATION BLUEPRINT
// File: Frontend/tailwind.config.js
// ==========================================

// /*
//   PURPOSE:
//   - Configures styling themes, colors, and content directories for Tailwind CSS.

//   CUSTOM COLORS TO CONFIGURE LATER:
//   - Content paths: ['./src/**/*.{js,ts,jsx,tsx,mdx}']
//   - Primary theme colors:
//     * jharkhandGreen: '#138808' / '#0b6623'
//     * jharkhandGold: '#FF9933' / '#E67E22'
//     * trustBlue: '#1E3A8A' / '#2563EB'
// */

// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
//     './src/components/**/*.{js,ts,jsx,tsx,mdx}',
//     './src/app/**/*.{js,ts,jsx,tsx,mdx}',
//   ],
//   theme: {
//     extend: {
//       colors: {
//         jharkhand: {
//           green: '#138808',
//           darkGreen: '#0b6623',
//           lightGreen: '#e8f5e9',
//           gold: '#FF9933',
//           darkGold: '#e67e22',
//           lightGold: '#fff3e0',
//           blue: '#1E3A8A',
//           lightBlue: '#eff6ff'
//         }
//       }
//     },
//   },
//   plugins: [],
// };



/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        jharkhand: {
          green: '#138808',
          darkGreen: '#0b6623',
          lightGreen: '#e8f5e9',
          gold: '#FF9933',
          darkGold: '#e67e22',
          lightGold: '#fff3e0',
          blue: '#1E3A8A',
          lightBlue: '#eff6ff',
        },
      },
    },
  },
  plugins: [],
};