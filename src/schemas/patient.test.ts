import { describe, it, expect } from "@jest/globals";
import { patientFormSchema, emptyPatientForm } from "./patient";

describe("patientFormSchema", () => {
  describe("patientFormSchema", () => {
    it("ควร fail เมื่อฟอร์มว่างเปล่าทั ้ งหมด", () => {
      const result = patientFormSchema.safeParse(emptyPatientForm);
      expect(result.success).toBe(false);
    });
    it("ควร pass เมื่อกรอกครบทุกฟิลด์ required ถูกต้อง", () => {
      const result = patientFormSchema.safeParse({
        ...emptyPatientForm,
        firstName: "สมชาย",
        lastName: "ใจดี",
        dateOfBirth: "1990-01-01",
        gender: "male",
        phone: "0812345678",
        email: "somchai@example.com",
        address: "123 ถนนสุขุมวิท",
        preferredLanguage: "ไทย",
        nationality: "ไทย",
      });
      expect(result.success).toBe(true);
    });
    it("ควร fail เมื่ออีเมลผิดรูปแบบ", () => {
      const result = patientFormSchema.safeParse({
        ...emptyPatientForm,
        email: "not-an-email",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        // .flatten().fieldErrors ดึง error message แยกเป็นรายฟิลด์ อ่านง่ายกว่า issues[] ดิบๆ
        expect(result.error.flatten().fieldErrors.email?.[0]).toBe(
          "รูปแบบอีเมลไม่ถูกต้อง",
        );
      }
    });
    it("ควร fail เมื่อเบอร์โทรมีตัวอักษรปนหรือสั ้ นเกินไป", () => {
      expect(
        patientFormSchema.safeParse({ ...emptyPatientForm, phone: "abc" })
          .success,
      ).toBe(false);
      expect(
        patientFormSchema.safeParse({ ...emptyPatientForm, phone: "12" })
          .success,
      ).toBe(false);
    });
    it("ฟิลด์ optional ว่างได้โดยไม่ error", () => {
      const result = patientFormSchema.safeParse({
        ...emptyPatientForm,
        firstName: "A",
        lastName: "B",
        dateOfBirth: "1990-01-01",
        gender: "male",
        phone: "0812345678",
        email: "a@b.com",
        address: "ที่อยู่",
        preferredLanguage: "ไทย",
        nationality: "ไทย",
        middleName: "",
        religion: "",
      });
      expect(result.success).toBe(true);
    });
  });
});
