/** @type {import('twind').Configuration} */
export default {
  theme: {
    extend: {
      screens: {
        standalone: { raw: '(display-mode:standalone)' },
      },
      colors: {
        // 아래의 주소에서 컬러 팔레트 만들 수 있음
        // https://www.tailwindshades.com/
        primary: {
          DEFAULT: '#5E7196',
          50: '#F7F8FA',
          100: '#E6E9EF',
          200: '#C3CBDA',
          300: '#A1ACC4',
          400: '#7E8EAE',
          500: '#5E7196',
          600: '#485774',
          700: '#333D51',
          800: '#1D232F',
          900: '#08090C',
        },
        accent: {
          DEFAULT: '#4C67F4',
          50: '#F9FAFF',
          100: '#E6EAFD',
          200: '#BFC9FB',
          300: '#99A8F9',
          400: '#7288F6',
          500: '#4C67F4',
          600: '#173AF1',
          700: '#0C2AC4',
          800: '#091E8F',
          900: '#06135A',
        },
      },
    },
  },
};
