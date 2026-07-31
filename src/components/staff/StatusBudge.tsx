import type { PatientStatus } from "@/types/patient";

interface StatusBadgeProps {
  status: PatientStatus;
}

const STATUS_CONFIG: Record<PatientStatus, { label: string; className: string }> = {
  idle: { label: "ยังไม่เริ่มกรอก", className: "bg-slate-100 text-slate-500" },
  filling: { label: "กำลังกรอกข้อมูล", className: "bg-amber-100 text-amber-700" },
  inactive: { label: "หยุดพิมพ์ชั่วคราว", className: "bg-orange-100 text-orange-700" },
  submitted: { label: "ส่งข้อมูลแล้ว", className: "bg-emerald-100 text-emerald-700" },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex item-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${config.className}`}
    >
      <span className="h-1.5 w.1.5 rounded-full bg-current" />
      {config.label}
    </span>
  );
}
