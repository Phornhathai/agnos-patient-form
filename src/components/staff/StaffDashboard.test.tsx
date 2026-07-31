import { describe, it, expect, jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import { StaffDashBoard } from "./StaffDashboard";

jest.mock("@/lib/socket");

describe("StaffDashBoard", () => {
  it("ควรแสดง 'ยังไม่กรอกชื่อ' เมื่อยังไม่มีข้อมูลผู้ป ่ วยส่งเข้ามา", () => {
    render(<StaffDashBoard />);
    expect(screen.getByText("ยังไม่กรอกชื่อ")).toBeInTheDocument();
    expect(screen.getByText("ยังไม่เริ่มกรอก")).toBeInTheDocument();
  });
});
