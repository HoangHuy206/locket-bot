# Locket Gold Telegram Bot

Bot Telegram giúp kích hoạt Locket Gold bằng link đăng nhập (Magic Link).

## Chức năng
- [x] Giao diện menu tiếng Việt.
- [x] Hướng dẫn lấy link chi tiết.
- [x] Xử lý link đăng nhập tự động.
- [x] Giả lập/Thực hiện logic kích hoạt Gold.

## Cài đặt

1. **Cài đặt NodeJS**: Tải và cài đặt tại [nodejs.org](https://nodejs.org/).
2. **Tải mã nguồn**: Giải nén folder này.
3. **Cài đặt thư viện**:
   ```bash
   npm install
   ```
4. **Cấu hình Bot**:
   - Mở file `.env`.
   - Thay `YOUR_TELEGRAM_BOT_TOKEN_HERE` bằng token lấy từ @BotFather.

## Cách chạy
```bash
node bot.js
```

## Lưu ý về Logic Kích Hoạt
Phần logic kích hoạt trong `bot.js` hiện đang là giả lập (luôn trả về thành công). Để thực hiện kích hoạt thật, bạn cần:
1. Có mã `REVENUECAT_API_KEY`.
2. Có một `Apple Receipt` đã mua gói Gold hợp lệ (Base64).
3. Sử dụng Firebase Admin SDK để xác thực từ login link.

**Khuyến cáo**: Việc sử dụng các phương pháp can thiệp vào hệ thống thanh toán có thể vi phạm điều khoản của ứng dụng.
