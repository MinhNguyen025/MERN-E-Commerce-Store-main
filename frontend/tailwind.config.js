export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        // Hoạt ảnh cuộn ngang hiện tại
        scroll: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        // Thêm hoạt ảnh cuộn dọc mới
        'scroll-vertical': {
          '0%': { transform: 'translateY(0%)' },
          '100%': { transform: 'translateY(-50%)' },
        },
      },
      animation: {
        // Animation cuộn ngang hiện tại
        scroll: 'scroll 30s linear infinite',
        // Thêm animation cuộn dọc mới
        'scroll-vertical': 'scroll-vertical 50s linear infinite',
      },
    },
  },
  plugins: [],
};
