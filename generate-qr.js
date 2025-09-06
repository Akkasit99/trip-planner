const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

// URL ของแอป - ใช้ IP address สำหรับมือถือ
const appUrl = 'http://172.20.10.3:3000';

// ฟังก์ชันสร้าง QR Code
async function generateQRCode() {
  try {
    console.log('🔄 กำลังสร้าง QR Code สำหรับ Thai Trip App...');
    console.log(`📱 URL: ${appUrl}`);
    
    // สร้าง QR Code เป็นไฟล์ PNG
    const qrPath = path.join(__dirname, 'thai-trip-app-qr.png');
    await QRCode.toFile(qrPath, appUrl, {
      color: {
        dark: '#000000',  // สีดำ
        light: '#FFFFFF'  // สีขาว
      },
      width: 300,
      margin: 2
    });
    
    console.log('✅ สร้าง QR Code สำเร็จ!');
    console.log(`📁 ไฟล์: ${qrPath}`);
    console.log('');
    console.log('📱 วิธีใช้งาน:');
    console.log('1. เปิดกล้องมือถือ');
    console.log('2. สแกน QR Code');
    console.log('3. เปิดลิงก์ในเบราว์เซอร์');
    console.log('4. ใช้งานแอป Thai Trip App บนมือถือ');
    console.log('');
    
    // สร้าง QR Code แบบ ASCII ใน terminal
    console.log('🖥️  QR Code ใน Terminal:');
    console.log('━'.repeat(50));
    const qrString = await QRCode.toString(appUrl, { type: 'terminal', small: true });
    console.log(qrString);
    console.log('━'.repeat(50));
    
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error.message);
  }
}

// รันฟังก์ชัน
generateQRCode();