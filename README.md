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

## Design (การออกแบบ UI/UX ในแต่ละขนาดหน้าจอ)

- **Mobile-first**: จัดเลย์เอาต์แบบ 1 คอลัมน์เป็นค่าเริ่มต้นก่อน แล้วค่อยขยายเป็นหลายคอลัมน์ที่จอใหญ่ขึ้น ด้วย Tailwind breakpoint `sm:`/`md:` เช่น ฟิลด์ในฟอร์มผู้ป่วยเป็น `grid-cols-1` บนมือถือ และเปลี่ยนเป็น `md:grid-cols-2` บนจอ tablet ขึ้นไป
- **ปุ่ม**: ปุ่มเลือกหน้า (Patient Form / Staff View) ที่หน้าแรกเรียงเป็นแนวตั้ง (`flex-col`) บนมือถือ เพื่อให้กดง่ายด้วยนิ้วโป้ง แล้วเปลี่ยนเป็นแนวนอน (`sm:flex-row`) บนจอกว้าง
- **ความกว้างของ container**: ใช้ `max-w-xl` / `max-w-2xl` จำกัดความกว้างของฟอร์มและการ์ดผู้ป่วยบนจอใหญ่ ไม่ให้ข้อความยืดยาวเกินไปจนอ่านยาก พร้อม `mx-auto` จัดกึ่งกลาง
- **Feedback ทันที**: error message จาก Zod validation แสดงใต้ฟิลด์ทันทีที่ submit ไม่ถูกต้อง และ input ที่ error จะมีขอบสีแดง (`border-red-400`) ให้สังเกตง่าย
- **สถานะแบบ real-time**: ใช้ status badge สีต่างกัน 4 สถานะ (เทา/เหลือง/ส้ม/เขียว) ให้เจ้าหน้าที่กวาดตาดูสถานะผู้ป่วยได้เร็วโดยไม่ต้องอ่านข้อความ

## Component Architecture

| Component | หน้าที่ |
|---|---|
| `PatientForm` | ฟอร์มหลักฝั่งผู้ป่วย ใช้ React Hook Form + Zod resolver คุม validation, `watch()` ทุกฟิลด์แล้วส่งขึ้น socket แบบ real-time ผ่าน `usePatientSocket`, แสดงหน้าจอยืนยันเมื่อ submit สำเร็จ |
| `StaffDashboard` | หน้าหลักฝั่งเจ้าหน้าที่ ดึงข้อมูลผู้ป่วยปัจจุบันผ่าน `usePatientSocket` (mode `read`) แล้วส่งต่อให้ `PatientCard` แสดงผล |
| `PatientCard` | แสดงข้อมูลผู้ป่วยทั้งหมดเป็นรายการ พร้อม `StatusBadge` บอกสถานะปัจจุบัน |
| `StatusBadge` | ปุ่ม badge แสดงสถานะ 1 ใน 4 (idle / filling / inactive / submitted) พร้อมสีและข้อความที่ map ไว้ล่วงหน้า |
| `FormField` | wrapper ใช้ซ้ำสำหรับทุกฟิลด์ในฟอร์ม จัดการ label, เครื่องหมาย required, และข้อความ error ให้หน้าตาฟอร์มสม่ำเสมอ |
| `usePatientSocket` (hook) | ศูนย์กลาง logic การเชื่อมต่อ socket ทั้งฝั่งเขียน (`write` สำหรับผู้ป่วย) และฝั่งอ่าน (`read` สำหรับเจ้าหน้าที่) รวมถึงคำนวณสถานะ `inactive` เมื่อผู้ป่วยหยุดพิมพ์เกิน 5 วินาที |
| `lib/socket.ts` | สร้างและเก็บ instance ของ `socket.io-client` แบบ singleton ตัวเดียวต่อ session ป้องกันการเปิด connection ซ้ำซ้อนเวลา component re-render |

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
