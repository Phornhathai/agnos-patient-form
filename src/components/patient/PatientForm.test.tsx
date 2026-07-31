import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PatientForm } from "./PatientForm";

jest.mock("@/lib/socket");

describe("PatientForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("ควรแสดงข้อความ error ของ Zod เมื่อกด submit เมื่อฟอร์มยังว่างอยู่", async () => {
    const user = userEvent.setup();
    render(<PatientForm />);
    await user.click(screen.getByRole("button", { name: "ส่งข้อมูล" }));
    expect(await screen.findByText("กรุณากรอกชื่อจริง")).toBeInTheDocument();
    expect(screen.getByText("กรุณากรอกนามสกุล")).toBeInTheDocument();
  });
  it("ควรแสดงข้อความขอบคุณเมื่อกรอกข้อมูลครบและ submit ผ่าน validation", async () => {
    const user = userEvent.setup();
    render(<PatientForm />);
    await user.type(screen.getByLabelText(/ชื่อจริง/), "สมชาย");
    await user.type(screen.getByLabelText(/นามสกุล/), "ใจดี");
    await user.type(screen.getByLabelText(/วันเกิด/), "1990-01-01");
    await user.selectOptions(screen.getByLabelText(/เพศ/), "male");
    await user.type(screen.getByLabelText(/เบอร์โทรศัพท์/), "0812345678");
    await user.type(screen.getByLabelText(/อีเมล/), "somchai@example.com");
    await user.type(screen.getByLabelText(/ที่อยู่/), "123 ถนนสุขุมวิท");
    await user.type(screen.getByLabelText(/สัญชาติ/), "ไทย");
    await user.type(screen.getByLabelText(/ภาษาที่สะดวก/), "ไทย");
    await user.click(screen.getByRole("button", { name: "ส่งข้อมูล" }));
    expect(await screen.findByText("ส่งข้อมูลเรียบร้อยแล้ว ✅")).toBeInTheDocument();
  });
});
