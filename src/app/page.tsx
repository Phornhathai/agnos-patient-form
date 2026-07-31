// first page with url "/"
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-50 p-6">
      <h1 className="text-center text-2xl font-bold text-slate-800 sm:text-3xl">
        Agnos Patient Form &amp; Staff View
      </h1>

      <p className="max-w-md text-center text-sm text-slate-500">
        เลือกหน้าที่ต้องการเข้าใช้งาน ระบบจะ sync ข้อมูลแบบ real time ระหว่างสองหน้านี้
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/patient"
          className="rounded-md bg-sky-600 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-sky-700"
        >
          เข้าสู่หน้าผู้ป่วย (Patient Form)
        </Link>
        <Link
          href="/staff"
          className="rounded-md border border-slate-300 bg-sky-600 px-6 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-sky-700"
        >
          เข้าสู่หน้าเจ้าหน้าที่ (Staff View)
        </Link>
      </div>
    </main>
  );
}
