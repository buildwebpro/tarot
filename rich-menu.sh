#!/bin/bash
# สร้าง Rich Menu 2 ปุ่ม แล้วตั้งเป็น default
# ใช้: LINE_TOKEN=xxx ./rich-menu.sh  (ต้องมี richmenu.png ขนาด 2500x843 ในโฟลเดอร์เดียวกัน)
set -e
: "${LINE_TOKEN:?ต้องตั้ง LINE_TOKEN}"
H="Authorization: Bearer $LINE_TOKEN"

ID=$(curl -s -X POST https://api.line.me/v2/bot/richmenu -H "$H" -H 'Content-Type: application/json' -d '{
  "size": {"width": 2500, "height": 843},
  "selected": true,
  "name": "horoscope-main",
  "chatBarText": "เมนู",
  "areas": [
    {"bounds": {"x": 0, "y": 0, "width": 1250, "height": 843},
     "action": {"type": "message", "text": "ดูดวงวันนี้"}},
    {"bounds": {"x": 1250, "y": 0, "width": 1250, "height": 843},
     "action": {"type": "message", "text": "เปลี่ยนราศี"}}
  ]
}' | python3 -c 'import sys,json;print(json.load(sys.stdin)["richMenuId"])')
echo "richMenuId=$ID"

curl -s -X POST "https://api-data.line.me/v2/bot/richmenu/$ID/content" -H "$H" \
  -H 'Content-Type: image/png' --data-binary @richmenu.png && echo " (image uploaded)"
curl -s -X POST "https://api.line.me/v2/bot/user/all/richmenu/$ID" -H "$H" && echo " (set default)"
