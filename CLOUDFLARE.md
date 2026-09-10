# ย้าย ดูดวง.online ไป Cloudflare — Phase 1

Phase 1 = หน้าเว็บ + AI proxy + Swiss Ephemeris + LINE bot ทั้งหมดอยู่ใน Worker เดียว
(Firebase Auth/Firestore ยังใช้อยู่ชั่วคราว → Phase 2 ย้ายเป็น D1 + LINE Login)
เลิกใช้ได้ทันทีหลัง Phase 1: Firebase Functions, Firebase Hosting, เซิร์ฟเวอร์ astrology.buildweb.pro

## สิ่งที่เปลี่ยนในโค้ด
- `worker/index.js` — router: `/api/chart`, `/api/ai`, `/api/daily/:zodiac`, `/line/webhook`, cron 05:00
- `worker/chart.js` — Swiss Ephemeris (WASM, Moshier) คืน format เดิม + ดาวยูเรเนียน 8 ดวง
- `worker/auth-ai.js` — ตรวจ Firebase ID token + proxy DeepSeek / Groq / MiniMax
- `worker/line.js` — LINE bot ดวงรายวัน
- `src/utils/ai.ts` — เรียก `/api/ai` แทน Firebase Functions
- `src/utils/uranian.ts` — เรียก `/api/chart` แทน astrology.buildweb.pro
- `wrangler.toml`, `schema.sql`, `package.json` (เพิ่ม sweph-wasm, wrangler)

## ขั้นตอน (ทำตามลำดับ)

### 1. push โค้ด
```bash
git checkout -b cloudflare
# แตก zip วางทับโฟลเดอร์ repo แล้ว
npm install
git add -A && git commit -m "Move to Cloudflare Workers + D1" && git push -u origin cloudflare
```

### 2. สร้าง D1
Dashboard → Storage & databases → D1 → Create → ชื่อ `duduang`
→ คัดลอก **Database ID** ใส่ `wrangler.toml` บรรทัด `database_id` → commit + push
→ แท็บ Console ของ D1 → วางเนื้อหา `schema.sql` ทั้งหมด → Execute

### 3. สร้าง Worker จาก GitHub
Dashboard → Workers & Pages → Create → **Import a repository** → authorize GitHub → เลือก `buildwebpro/tarot`
- Branch: `cloudflare`
- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Project name: `duduang-online`
→ Deploy (รอบแรก fail ได้ถ้ายังไม่ใส่ตัวแปร ไม่เป็นไร)

### 4. ใส่ Variables
Worker → Settings → Variables and Secrets (ชนิด Secret):
`DEEPSEEK_API_KEY`, `GROQ_API_KEY`, `MINIMAX_API_KEY` (ค่าเดิมจาก Firebase Functions), `LINE_TOKEN`, `LINE_SECRET`

Worker → Settings → Build → Variables (ใช้ตอน build):
`VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`
(ค่าเดียวกับไฟล์ `.env` ในเครื่องคุณ)
→ Deployments → Retry

### 5. ทดสอบบน workers.dev
- `https://duduang-online.<account>.workers.dev/api/health`
- `.../api/chart?date=1990-05-20&time=08:30&lat=13.75&lon=100.5&tz=7`
- เปิดเว็บ → ล็อกอิน → ดูดวงรายวัน / ยูเรเนียน

### 6. Firebase Auth อนุญาตโดเมนใหม่
Firebase Console → Authentication → Settings → Authorized domains → เพิ่ม `duduang-online.<account>.workers.dev`

### 7. ชี้โดเมน (ผมทำให้เมื่อคุณบอกว่าเทสผ่าน)
Worker → Settings → Domains & Routes → Add custom domain `ดูดวง.online` + `www.ดูดวง.online`
Cloudflare จะแทน A/CNAME ของ Firebase ให้เอง

### 8. LINE (ทำเมื่อไหร่ก็ได้)
- LINE Developers → Messaging API channel → token + secret ใส่ข้อ 4
- Webhook URL: `https://ดูดวง.online/line/webhook` (หรือ workers.dev ระหว่างเทส)
- ปิด Auto-reply / Greeting ใน OA Manager
- `LINE_TOKEN=xxx ./rich-menu.sh`

## dev ในเครื่อง
```bash
cp .dev.vars.example .dev.vars   # ใส่ key
npm run db:local
npm run worker:dev               # Worker :8787
npm run dev                      # vite, proxy /api -> 8787
```
