// define data structure
// create validation with zod
// infer typescript type automatically
import { z } from "zod";

// regex checking tel.
const PHONE_REGEX = /^\+?\d{9,10}$/;

export const patientFormSchema = z.object({
  firstName: z.string().min(1, "กรุณากรอกชื่อจริง"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "กรุณากรอกนามสกุล"),
  dateOfBirth: z.string().min(1, "กรุณาเลือกวันเกิด"),
  gender: z.string().min(1, "กรุณาเลือกเพศ"),
  phone: z.string().min(PHONE_REGEX, "เบอร์โทรต้องเป็นตัวเลข 9-10 หลัก"),
  email: z.string().email("รูปแบบอีเมลไม่ถูกต้อง"),
  address: z.string().min(1, "กรุณากรอกที่อยู่"),
  preferredLanguage: z.string().min(1, "กรุณาเลือกภาษาที่สะดวก"),
  nationality: z.string().min(1, "กรุณากรอกสัญชาติ"),
  emergencyContactName: z.string().optional(),
  emergencyContactRelationship: z.string().optional(),
  religion: z.string().optional(),
});

// then use z.infer<typeof schema> for typescript interface type
export type PatientFormValues = z.infer<typeof patientFormSchema>;

// default everyfield in form with PatientFormValues
export const emptyPatientForm: PatientFormValues = {
  firstName: "",
  middleName: "",
  lastName: "",
  dateOfBirth: "",
  gender: "",
  phone: "",
  email: "",
  address: "",
  preferredLanguage: "",
  nationality: "",
  emergencyContactName: "",
  emergencyContactRelationship: "",
  religion: "",
};
