module.exports = {
  apps: [{
    name: "locket-gold-bot",
    script: "./bot.js",
    watch: true,
    env: {
      NODE_ENV: "production",
    },
    restart_delay: 5000, // Đợi 5 giây trước khi khởi động lại nếu lỗi
    max_memory_restart: "200M" // Khởi động lại nếu tốn quá 200MB RAM
  }]
}
