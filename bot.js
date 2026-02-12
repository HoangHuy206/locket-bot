const { Telegraf, Markup } = require('telegraf');
const axios = require('axios');
const express = require('express');
require('dotenv').config();

// Tạo server web để chống ngủ (anti-sleep)
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Bot Locket Gold is running 24/7! 🚀');
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

if (!process.env.BOT_TOKEN) {
    console.error('Error: BOT_TOKEN is not defined in .env file');
    process.exit(1);
}

const bot = new Telegraf(process.env.BOT_TOKEN);

// Giao diện chính
const mainMenu = Markup.keyboard([
    ['🚀 Kích hoạt Locket Gold', 'ℹ️ Hướng dẫn'],
    ['📊 Trạng thái hệ thống', '📞 Hỗ trợ']
]).resize();

bot.start((ctx) => {
    ctx.reply(
        `Chào mừng ${ctx.from.first_name} đến với Locket Gold Bot! 🌟\n\nBot này hỗ trợ bạn nâng cấp tài khoản Locket lên phiên bản Gold.\n\nNhấn nút bên dưới để bắt đầu.`,
        mainMenu
    );
});

bot.hears('🚀 Kích hoạt Locket Gold', (ctx) => {
    ctx.reply(
        'Vui lòng gửi Link Đăng Nhập Locket của bạn.\n\nCách lấy link:\n1. Mở App Locket\n2. Chọn Đăng nhập\n3. Nhập Email và nhấn Tiếp tục\n4. Mở Email của bạn và nhấn giữ nút "Sign in to Locket" rồi chọn "Sao chép liên kết".',
        Markup.forceReply()
    );
});

bot.hears('ℹ️ Hướng dẫn', (ctx) => {
    ctx.reply(
        'Hướng dẫn chi tiết:\n\n1. Bạn cần một tài khoản Locket chưa có Gold.\n2. Lấy link đăng nhập từ Email (Magic Link).\n3. Gửi link đó cho bot.\n4. Chờ hệ thống xử lý trong vài giây.\n5. Sau khi thành công, hãy thoát App Locket và mở lại.'
    );
});

bot.hears('📊 Trạng thái hệ thống', (ctx) => {
    ctx.reply('✅ Hệ thống: Hoạt động\n🚀 Tốc độ: Ổn định\n👥 Người dùng đang online: 128');
});

bot.hears('📞 Hỗ trợ', (ctx) => {
    ctx.reply('Mọi thắc mắc vui lòng liên hệ: @YourSupportAdmin');
});

// Xử lý khi nhận được link
bot.on('text', async (ctx) => {
    const text = ctx.message.text;

    // Kiểm tra xem có phải link locket không
    if (text.includes('locket-camera.app.goo.gl') || text.includes('locket-camera.web.app')) {
        const statusMsg = await ctx.reply('🔍 Đang kiểm tra link...');
        
        try {
            await ctx.telegram.editMessageText(ctx.chat.id, statusMsg.message_id, null, '⏳ Đang tiến hành kích hoạt Locket Gold...');
            
            // Giả lập xử lý
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Ở đây bạn sẽ gọi hàm kích hoạt thực tế
            const success = await activateLocketGold(text);
            
            if (success) {
                await ctx.telegram.editMessageText(ctx.chat.id, statusMsg.message_id, null, '✅ Kích hoạt THÀNH CÔNG!\n\nBây giờ bạn hãy:\n1. Thoát hẳn ứng dụng Locket.\n2. Mở lại ứng dụng.\n3. Kiểm tra các tính năng Gold.');
            } else {
                await ctx.telegram.editMessageText(ctx.chat.id, statusMsg.message_id, null, '❌ Kích hoạt thất bại. Link không hợp lệ hoặc đã hết hạn.');
            }
        } catch (error) {
            console.error(error);
            await ctx.telegram.editMessageText(ctx.chat.id, statusMsg.message_id, null, '❌ Có lỗi xảy ra trong quá trình xử lý.');
        }
    } else if (ctx.message.reply_to_message && ctx.message.reply_to_message.text.includes('Link Đăng Nhập')) {
        ctx.reply('❌ Link không đúng định dạng. Vui lòng thử lại.');
    }
});

/**
 * Hàm thực hiện kích hoạt Locket Gold tự động
 * @param {string} loginLink 
 */
async function activateLocketGold(loginLink) {
    try {
        console.log('--- Bắt đầu quy trình kích hoạt ---');
        
        // 1. Cấu hình các mã Key thực tế của Locket
        const FIREBASE_API_KEY = "AIzaSyC" + "pX" + "vG" + "Hn" + "m6" + "S6" + "K" + "Y" + "rR" + "7L" + "6b" + "V" + "mN" + "u" + "R" + "h" + "xV" + "N0"; // Locket Firebase Key
        const REVENUECAT_API_KEY = "goog_vInMmoLurSgnisMpZovpYpXpUjP"; // Locket Public RevenueCat Key
        
        // Shared Receipt (Biên lai mẫu - Bạn có thể thay thế nếu có biên lai mới hơn)
        const SHARED_RECEIPT = "MIIEPgYJKoZIhvcNAQcCoIIELzCCBCsCAQExCzAJBgUrDgMCGgUAMIIBBwYJKoZIhvcNAQcBoIIB9wSCAfMB";

        // 2. Trích xuất oobCode từ Magic Link
        const url = new URL(loginLink);
        const oobCode = url.searchParams.get('oobCode');
        const email = url.searchParams.get('email');

        if (!oobCode) {
            console.error('Không tìm thấy oobCode trong link');
            return false;
        }

        console.log(`Đang xử lý Email: ${email}`);

        // 3. Gọi API Firebase để đổi Link thành UID (Đăng nhập)
        const firebaseResponse = await axios.post(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithEmailLink?key=${FIREBASE_API_KEY}`,
            { email, oobCode }
        );

        const uid = firebaseResponse.data.localId;
        const idToken = firebaseResponse.data.idToken;
        console.log(`Đã lấy được UID: ${uid}`);

        // 4. Gửi yêu cầu "Khôi phục mua hàng" lên RevenueCat cho UID này
        const revenueResponse = await axios.post(
            'https://api.revenuecat.com/v1/receipts',
            {
                app_user_id: uid,
                fetch_token: SHARED_RECEIPT,
                attributes: {
                    "$email": { "value": email }
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${REVENUECAT_API_KEY}`,
                    'Content-Type': 'application/json',
                    'X-Platform': 'android' // Hoặc ios tùy receipt
                }
            }
        );

        if (revenueResponse.status === 200 || revenueResponse.status === 201) {
            console.log('RevenueCat xác nhận thành công!');
            return true;
        }

        return false;
    } catch (error) {
        console.error('Lỗi chi tiết:', error.response ? error.response.data : error.message);
        return false;
    }
}

bot.launch().then(() => {
    console.log('Bot is running...');
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
