import type { Patient } from "@/types/patient";
import { StatusBadge } from "./StatusBudge";

interface PatientCardProps {
  patient: Patient;
}

function InfoRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex justify-between gap-2 border-b border-slate-100 py-1.5 text-sm last:border-0">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-800">{value || "-"}</span>
    </div>
  );
}

export function PatientCard({ patient }: PatientCardProps) {
  const fullName = [patient.firstName, patient.middleName, patient.lastName]
    .filter(Boolean)
    .join(" ");

    return (
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg font-semibold text-slate-800">
                    {fullName || "ยังไม่กรอกชื่อ"}
                </h2>
                <StatusBadge status={patient.status}/>
            </div>
            <div>
                <InfoRow label="วันเกิด" value={patient.dateOfBirth}/>
                <InfoRow label="เพศ" value={patient.gender}/>
                <InfoRow label="เบอร์โทร" value={patient.phone}/>
                <InfoRow label="อีเมล" value={patient.email}/>
                <InfoRow label="ที่อยู่" value={patient.address}/>
                <InfoRow label="สัญชาติ" value={patient.nationality}/>
                <InfoRow label="ภาษาที่สะดวก" value={patient.preferredLanguage}/>
                <InfoRow label="ศาสนา" value={patient.religion}/>
                <InfoRow label="ผู้ติดต่อฉุกเฉิน" value={patient.emergencyContactName}/>
                <InfoRow label="ความสัมพันธ์" value={patient.emergencyContactRelationship}/>
            </div>
        </div>
    )
}
