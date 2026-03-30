# การตั้งค่า Admin

## วิธีที่ 1: ใช้ Firebase Console (แนะนำ)

1. ไปที่ https://console.firebase.google.com/
2. เลือก Project ของคุณ
3. ไปที่ Firestore Database > Data
4. คลิก "Start collection" ตั้งชื่อ `users`
5. คลิก "Add document" เพิ่ม:

```
Document ID: NILwQBNIIcQN6nKwdb2LIkdNXF52

Fields:
- uid: string = "NILwQBNIIcQN6nKwdb2LIkdNXF52"
- email: string = "rujskiddao@gmail.com"
- displayName: string = "Admin"
- isPremium: boolean = true
- isAdmin: boolean = true
- credits: number = 999
- freeReadingsCount: number = 0
- createdAt: string = "2024-01-01T00:00:00.000Z"
- lastLoginAt: string = "2024-01-01T00:00:00.000Z"
```

## วิธีที่ 2: ใช้ Script

```bash
npm install firebase dotenv
node scripts/init-admin.js
```

## วิธีที่ 3: Deploy Rules

```bash
firebase deploy --only firestore:rules
```
