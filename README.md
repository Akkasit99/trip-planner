# Thai Trip App 🇹🇭

Mini App จัดทริปท่องเที่ยวในประเทศไทย แยกตามจังหวัด

Demo link web
https://trip-planner-five-pink.vercel.app/

## ฟีเจอร์หลัก

- 🗺️ **เลือกจังหวัด** - เลือกจังหวัดที่ต้องการเที่ยวจาก dropdown หรือแผนที่
- 🏛️ **สถานที่ท่องเที่ยว** - ดูสถานที่แนะนำ เช่น วัด น้ำตก ตลาด landmark
- 🍜 **อาหารท้องถิ่น** - ค้นหาอาหารและของกินขึ้นชื่อของแต่ละจังหวัด
- 🎯 **กิจกรรมยอดฮิต** - กิจกรรมแนะนำ เช่น ดำน้ำ ขึ้นดอย ล่องแพ
- 📝 **My Trip** - สร้างแผนการเดินทางส่วนตัว เพิ่มสถานที่เข้า Itinerary
- 📅 **จัดตารางอัตโนมัติ** - กำหนดวันเวลา ระบบจัดตารางเที่ยวเป็น Day 1, Day 2
- 🔗 **แชร์ทริป** - แชร์แผนเที่ยวเป็นลิงก์/QR Code ให้เพื่อน

## เทคโนโลยีที่ใช้

- **Frontend**: React Native + TypeScript
- **Backend/Database**: Supabase
- **Navigation**: React Navigation
- **UI Components**: React Native Vector Icons
- **Maps**: React Native Maps (สำหรับแสดงแผนที่)
- **QR Code**: React Native QR Code SVG
- **Date Picker**: React Native Date Picker
- **Share**: React Native Share

## การติดตั้ง

### ข้อกำหนดเบื้องต้น

- Node.js (>= 16)
- React Native CLI
- Android Studio (สำหรับ Android)
- Xcode (สำหรับ iOS)

### ขั้นตอนการติดตั้ง

1. **Clone โปรเจค**
   ```bash
   git clone <repository-url>
   cd trip-app
   ```

2. **ติดตั้ง Dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```
   
   หรือถ้ามี yarn:
   ```bash
   yarn install
   ```

3. **ตั้งค่า Supabase**
   - สร้างโปรเจค Supabase ใหม่
   - อัปเดต URL และ API Key ในไฟล์ `src/services/supabase.ts`
   - สร้าง tables ตามโครงสร้างที่กำหนด

4. **รันแอป**
   
   สำหรับ Android:
   ```bash
   npx react-native run-android
   ```
   
   สำหรับ iOS:
   ```bash
   npx react-native run-ios
   ```

## โครงสร้างโปรเจค

```
src/
├── components/          # React components ที่ใช้ร่วมกัน
├── screens/            # หน้าจอต่างๆ ของแอป
│   ├── HomeScreen.tsx
│   ├── ProvinceSelectionScreen.tsx
│   ├── ProvinceDetailScreen.tsx
│   ├── MyTripsScreen.tsx
│   ├── CreateTripScreen.tsx
│   ├── TripDetailScreen.tsx
│   └── SharedTripScreen.tsx
├── services/           # Services สำหรับเชื่อมต่อ API
│   └── supabase.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
└── data/               # ข้อมูลตัวอย่าง
```

## Database Schema (Supabase)

### Tables ที่ต้องสร้าง:

1. **provinces** - ข้อมูลจังหวัด
2. **attractions** - สถานที่ท่องเที่ยว
3. **foods** - อาหารท้องถิ่น
4. **activities** - กิจกรรม
5. **trips** - ทริปของผู้ใช้
6. **trip_items** - รายการในแต่ละทริป
7. **users** - ข้อมูลผู้ใช้

## การใช้งาน

1. **เลือกจังหวัด** - เริ่มต้นด้วยการเลือกจังหวัดที่ต้องการเที่ยว
2. **ดูข้อมูล** - ดูสถานที่ท่องเที่ยว อาหาร และกิจกรรมในจังหวัดนั้น
3. **สร้างทริป** - เลือกสิ่งที่สนใจเพื่อสร้างทริปส่วนตัว
4. **กำหนดวันที่** - เลือกวันที่เริ่มต้นและสิ้นสุดการเดินทาง
5. **ดูแผนทริป** - ระบบจะจัดตารางเที่ยวอัตโนมัติตามจำนวนวัน
6. **แชร์ทริป** - แชร์ทริปให้เพื่อนผ่านรหัสแชร์

## ฟีเจอร์ที่จะเพิ่มในอนาคต

- 💰 **คำนวณงบประมาณ** - คำนวณค่าใช้จ่ายคร่าวๆ
- 🗺️ **Google Maps Integration** - นำทางไปยังสถานที่ต่างๆ
- 🌤️ **ข้อมูลสภาพอากาศ** - แสดงสภาพอากาศของจังหวัดที่เลือก
- 📱 **Push Notifications** - แจ้งเตือนก่อนวันเดินทาง
- 👥 **ทริปกลุ่ม** - สร้างทริปร่วมกับเพื่อนๆ

## การพัฒนา

### การเพิ่มจังหวัดใหม่

1. เพิ่มข้อมูลจังหวัดในตาราง `provinces`
2. เพิ่มสถานที่ท่องเที่ยว อาหาร และกิจกรรมในตารางที่เกี่ยวข้อง
3. เพิ่มรูปภาพและข้อมูลที่จำเป็น

### การปรับแต่ง UI

- แก้ไขไฟล์ในโฟลเดอร์ `src/screens/`
- ใช้ StyleSheet ของ React Native
- ปฏิบัติตาม design system ที่กำหนด

## การแก้ไขปัญหา

### ปัญหาการติดตั้ง Dependencies

```bash
# ลบ node_modules และติดตั้งใหม่
rm -rf node_modules
npm install --legacy-peer-deps

# หรือใช้ yarn
yarn install
```

### ปัญหา Metro Bundler

```bash
# รีเซ็ต Metro cache
npx react-native start --reset-cache
```

## License

MIT License

## ผู้พัฒนา

พัฒนาโดย Trae AI สำหรับการจัดทริปท่องเที่ยวในประเทศไทย

---

**หมายเหตุ**: แอปนี้ใช้ข้อมูลตัวอย่าง (Mock Data) ในการพัฒนา กรุณาเชื่อมต่อกับ Supabase และเพิ่มข้อมูลจริงก่อนใช้งานจริง