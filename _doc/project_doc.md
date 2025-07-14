IoT Farm Monitoring & Control System
Project Documentation

1. Project Overview
   ชื่อโปรเจกต์: IoT Farm Monitoring & Control

วัตถุประสงค์:
พัฒนา Web Application สำหรับควบคุมและติดตามสถานะฟาร์มอัจฉริยะ (Smart Farm)

แสดงข้อมูลจาก sensor (เช่น temp, pH, DO ฯลฯ) แบบ real-time และย้อนหลัง

ควบคุม actuator (เช่น ปั๊มน้ำ, พัดลม, ฯลฯ) จาก webapp ได้

ส่งแจ้งเตือน/alert อัตโนมัติเมื่อเกิดเหตุผิดปกติ

รองรับการขยาย node/hub/sensor/actuator แบบ modular

Tech Stack:

Frontend/Backend: Next.js (React, API Routes)

Deploy: Vercel

Database: Neon (PostgreSQL serverless)

ORM: Prisma

Auth: NextAuth.js (หรือ custom JWT)

Notification: Line Notify, Email, หรือ Webhook

2. System Architecture
   2.1. Component Overview
   IoT Device Layer:
   Node Box (LoRa/4G) → Hub (Sim 4G/LoRa) → Cloud API

Backend:
Next.js API Route (รับ/บันทึก sensor, actuator, log, notification) → Neon DB (Prisma ORM)

Frontend:
Next.js (React) Dashboard, Chart, Control Panel, Notification Center

2.2. High-level Flow
Sensor/Actuator ในฟาร์มเชื่อมต่อกับ Node Box (LoRa/4G)

Node Box ส่งข้อมูลไป Hub (Sim 4G/LoRa)

Hub ส่ง batch JSON ขึ้น Cloud (Next.js API)

Backend API validate, บันทึกลง DB (Neon)

Frontend (WebApp) dashboard แสดงสถานะ sensor/actuator แบบ real-time

User กดควบคุม actuator ผ่าน webapp → API → Hub → Node → Actuator

ถ้าค่า sensor ผิดปกติ Backend จะสร้าง Notification alert

3. Feature List
   3.1. User Features
   Login/Logout (JWT/Session)

Dashboard สรุปสถานะ sensor/actuator ทุก node/hub

Graph/Chart historical sensor data

Control actuator (เปิด/ปิด/ตั้งเวลา)

Notification/Alert (ดู log, แจ้งเตือน)

Manage (Hub/Node/Sensor/Actuator)

User/role management (Owner, Technician, Viewer)

3.2. Admin/Owner Features
สร้าง/ลบ/แก้ไข hub, node, sensor, actuator

กำหนด/เปลี่ยน role ของ user

ตั้งค่าความผิดปกติ (threshold) สำหรับ sensor

ตรวจสอบ log ทุก event (sensor, actuator, alert)

4. System Design
   4.1. Database Schema (Prisma)
   prisma
   คัดลอก
   แก้ไข
   model User {
   id String @id @default(uuid())
   email String @unique
   password String
   userHubs UserHub[]
   }

model UserHub {
id String @id @default(uuid())
user User @relation(fields: [userId], references: [id])
userId String
hub Hub @relation(fields: [hubId], references: [id])
hubId String
role String // owner, viewer, technician, etc.
}

model Hub {
id String @id @default(uuid())
name String
serial String @unique
apiKey String @unique
userHubs UserHub[]
nodes Node[]
notifications Notification[]
}

model Node {
id String @id @default(uuid())
name String
hub Hub @relation(fields: [hubId], references: [id])
hubId String
sensors Sensor[]
actuators Actuator[]
}

model Sensor {
id String @id @default(uuid())
node Node @relation(fields: [nodeId], references: [id])
nodeId String
type String
unit String
sensorData SensorData[]
}

model SensorData {
id String @id @default(uuid())
sensor Sensor @relation(fields: [sensorId], references: [id])
sensorId String
value Float
status String?
timestamp DateTime @default(now())
}

model Actuator {
id String @id @default(uuid())
node Node @relation(fields: [nodeId], references: [id])
nodeId String
type String
actuatorLog ActuatorLog[]
}

model ActuatorLog {
id String @id @default(uuid())
actuator Actuator @relation(fields: [actuatorId], references: [id])
actuatorId String
command String
status String?
timestamp DateTime @default(now())
}

model Notification {
id String @id @default(uuid())
hub Hub @relation(fields: [hubId], references: [id])
hubId String
type String
message String
createdAt DateTime @default(now())
}
4.2. API Design (REST Example)
Auth
POST /api/auth/login - Login (return JWT/session)

POST /api/auth/logout

User/Hub/Node
GET /api/hub - List user’s hubs

POST /api/hub - Create new hub

GET /api/node?hub_id=...

POST /api/node

Sensor/Sensor Data
GET /api/sensor?node_id=...

POST /api/sensordata - Add sensor data batch (from node)

GET /api/sensordata?sensor_id=...&from=...&to=...

Actuator/Command
GET /api/actuator?node_id=...

POST /api/actuator/command

json
คัดลอก
แก้ไข
{
"node_id": "node_001",
"actuator_id": "pump_001",
"command": "on",
"duration_sec": 300
}
GET /api/actuatorlog?actuator_id=...

Notification
GET /api/notification?hub_id=...

POST /api/notification/test

Dashboard
GET /api/dashboard?hub_id=...
(Return latest sensor, actuator, notification)

4.3. Frontend Structure
Pages

/login

/dashboard

/hub/[hubId] (hub overview)

/node/[nodeId] (node detail)

/sensor/[sensorId] (sensor graph/history)

/actuator/[actuatorId] (control + log)

/notification

/settings

Component

SensorChart, NodeList, ActuatorControl, AlertPanel, UserMenu, etc.

State/Data Fetch

React Query/SWR (client polling every 30s/1min)

API fetch แบบ async (useSWR/useQuery)

Auth

NextAuth.js (session, role)

5. Deployment & Scaling
   Vercel

Build & deploy Auto จาก GitHub

รองรับ Preview/Production deploy แยก environment

Neon

Serverless PostgreSQL, ประหยัด, scale อัตโนมัติ

มี connection pooling

Scaling

เหมาะกับ user 1-1,000+ ต่อวัน

ถ้า device/data เยอะ ให้ optimize polling frequency, batch write, archive เก่า

File Storage

ถ้ามีรูป/วิดีโอ → ใช้ Vercel Blob, S3, หรือ Cloudflare R2

6. Security
   Auth:

JWT/Session, password hash (bcrypt), OAuth2 ได้

RBAC (role-based access) ทุก API

API Key สำหรับ Device/Hub:

ส่งข้อมูล sensor ต้องแนบ apiKey (validate ทุกครั้ง)

Rate-limit:

ป้องกัน device spam API

Data validation:

ตรวจสอบทุก input (zod/yup/prisma)

7. Monitoring & Maintenance
   Logging:

Error, request, actuation log

Alert:

แจ้งเตือนผ่าน Line Notify, Email, Webhook

Backup:

Neon มี automatic backup + point-in-time recovery

Update:

Dev → PR → CI/CD → Deploy (ผ่าน Vercel Preview ก่อน Production)

8. Future Roadmap
   เพิ่ม Mobile App (Flutter/React Native) — ใช้ API เดิม

Integrate MQTT, Pusher, หรือ WebSocket สำหรับ real-time push

เพิ่ม support image/video sensor (CCTV/AI Vision)

Analytics/ML model (เช่นทำนายโรค, optimize ปริมาณน้ำ, ฯลฯ)

Multi-tenant SaaS (ให้ฟาร์มอื่นสมัครใช้บริการเอง)

9. Appendix: ตัวอย่าง Payload
   SensorData POST
   json
   คัดลอก
   แก้ไข
   {
   "node_id": "node_001",
   "timestamp": "2025-07-14T10:00:00Z",
   "sensors": [
   {
   "sensor_id": "sensor_temp_1",
   "type": "temp",
   "unit": "C",
   "value": 29.4,
   "status": "normal",
   "timestamp": "2025-07-14T10:00:00Z"
   }
   ]
   }
   Actuator Command POST
   json
   คัดลอก
   แก้ไข
   {
   "node_id": "node_001",
   "actuator_id": "pump_001",
   "command": "on",
   "duration_sec": 300
   }
   Notification Example
   json
   คัดลอก
   แก้ไข
   {
   "hub_id": "hub_001",
   "type": "alert",
   "message": "อุณหภูมิสูงผิดปกติ 36C",
   "createdAt": "2025-07-14T10:05:00Z"
   }
