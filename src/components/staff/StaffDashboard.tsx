"use client";

import { usePatientSocket } from "@/hooks/usePatientSocket";
import { PatientCard } from "./PatientCard";

export function StaffDashBoard() {
  const { patient } = usePatientSocket("read");

  return (
    <div className="mx-auto max-w-2xl p-4 sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
        </span>
        <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">
          หน้าจอเจ้าหน้าที่ (Real-time)
        </h1>
      </div>
      <PatientCard patient={patient} />
    </div>
  );
}
