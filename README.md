# Agnos Patient Form

ระบบแบบฟอร์มข้อมูลผู้ป่วยและหน้าจอเจ้าหน้าที่ที่ sync ข้อมูลแบบ real-time ทำเป็นงาน assignment สำหรับตำแหน่ง Front-end developer ของ Agnos

- **Patient Form**: หน้าให้ผู้ป่วยกรอกข้อมูลส่วนตัว
- **Staff View**: หน้าให้เจ้าหน้าที่ดูข้อมูลที่ผู้ป่วยกรอกแบบ real-time พร้อมสถานะบ่งชี้ (ยังไม่เริ่มกรอก / กำลังกรอกข้อมูล / หยุดพิมพ์ชั่วคราว / ส่งข้อมูลแล้ว)

## Live Demo

- หน้าแรก (เลือกเข้า Patient Form หรือ Staff View): https://agnos-patient-form-psi.vercel.app
- Patient Form: https://agnos-patient-form-psi.vercel.app/patient
- Staff View: https://agnos-patient-form-psi.vercel.app/staff
- Socket.io server: https://agnos-socket-server-q1bt.onrender.com

> Socket server ใช้ Render free tier ซึ่งจะ sleep เมื่อไม่มีการใช้งานเกิน ~15 นาที การเชื่อมต่อครั้งแรกหลังจากที่ server sleep อาจใช้เวลา 30-50 วินาทีในการ wake ขึ้นมา

## Tech Stack

- **Framework**: Next.js (App Router)
- **Styling**: TailwindCSS
- **Form & Validation**: React Hook Form + Zod
- **Real-Time Communication**: Socket.io

## โครงสร้างโปรเจกต์

```
src/
  app/            # routes: / , /patient , /staff
  components/     # PatientForm, StaffDashboard, PatientCard, StatusBadge, FormField
  hooks/          # usePatientSocket – จัดการ socket connection และ state ของผู้ป่วยร่วมกัน
  lib/socket.ts   # socket.io-client instance แบบ singleton
  schemas/        # Zod schema และ type ของฟอร์มผู้ป่วยที่ infer มาจาก schema
  types/          # type ของ Patient / PatientStatus
server/
  index.ts        # Socket.io server แยกต่างหาก (broadcast ข้อมูลผู้ป่วยที่อัปเดต)
```

## วิธีรันโปรเจกต์ในเครื่อง

โปรเจกต์นี้ต้องรัน **2 process พร้อมกัน** คือ Next.js app และ Socket.io server

### 1. ติดตั้ง dependencies

```bash
npm install
```

### 2. ตั้งค่า environment variables

สร้างไฟล์ `.env.local` ที่ root ของโปรเจกต์:

```
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
```

### 3. รัน Socket.io server (terminal ที่ 1)

```bash
npm run server
```

จะรัน real-time server ที่ `http://localhost:4000`

### 4. รัน Next.js app (terminal ที่ 2)

```bash
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000) แล้วเลือกเข้า **Patient Form** หรือ **Staff View**

## Real-Time Sync Flow

1. ผู้ป่วยพิมพ์ข้อมูลในฟอร์ม → `usePatientSocket` จะ emit event `patient:update` ทุกครั้งที่มีการเปลี่ยนแปลง (สถานะ: `filling`)
2. Socket.io server เก็บสถานะล่าสุดของผู้ป่วยไว้ใน memory และ broadcast event `patient:update` ไปยัง client อื่นที่เชื่อมต่ออยู่ (หน้า staff)
3. ถ้าผู้ป่วยหยุดพิมพ์นานเกิน 5 วินาที หน้า staff จะเปลี่ยนสถานะเป็น `inactive` เอง (คำนวณฝั่ง client)
4. เมื่อผู้ป่วยกด submit จะ emit `patient:update` พร้อมสถานะ `submitted` หน้า staff จะอัปเดตทันที และหน้าผู้ป่วยจะขึ้นหน้าจอยืนยันการส่งข้อมูล
5. เมื่อหน้า staff เชื่อมต่อ (หรือเชื่อมต่อใหม่) server จะส่งข้อมูลล่าสุดของผู้ป่วยผ่าน event `patient:data` ให้ทันที เพื่อไม่ให้พลาดข้อมูลกรณีที่ staff เปิดหน้าเข้ามาทีหลังจากที่ผู้ป่วยเริ่มกรอกไปแล้ว
