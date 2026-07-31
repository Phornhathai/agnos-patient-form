"use client";

import { usePatientSocket } from "@/hooks/usePatientSocket";
import { emptyPatientForm, patientFormSchema, PatientFormValues } from "@/schemas/patient";
import { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormField, cx } from "../ui/FormField";

const baseInputClass =
  "w-full rounded-md border border-slate-300 px-3 py-2 text-sm " +
  "focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500";

export function PatientForm() {
  // get current patient
  const { patient, updatePatient, submitPatient } = usePatientSocket("write");
  const [submitted, setSubmitted] = useState(false);
  // use ref to prevent reset() work many times (it should work once when get data from server)
  const didInitRef = useRef(false);

  // resolver: zodResolver(schema) it tell RHF to use validation of zod schema
  const {
    register,
    handleSubmit,
    watch, // read current all fields real-time
    reset, // reset when get old value from server
    formState: { errors }, // to show message form zod validation
  } = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: emptyPatientForm,
  });

  useEffect(() => {
    if (!didInitRef.current && patient.updateAt > 0) {
      reset(patient);
      didInitRef.current = true;
    }
  }, [patient, reset]);

  const watchValues = watch(); // use watch() with no arg it will return current of all fields

  // everytime watchedValues changes it will send last value to socket
  useEffect(() => {
    // skip for first initial form
    // check that watchValue has value or not
    const hasAnyValue = Object.values(watchValues).some(
      (v): v is string => typeof v === "string" && v.trim() !== "",
    );
    if (hasAnyValue) {
      updatePatient(watchValues);
    }
  }, [JSON.stringify(watchValues)]);

  function onValidSubmit(values: PatientFormValues) {
    submitPatient(values);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl rounded-lg border border-emerald-200 bg-emerald-50 p-6 text-center">
        <p className="text-lg font-semibold text-emerald-700">ส่งข้อมูลเรียบร้อยแล้ว</p>
        <p className="mt-1 text-sm text-emerald-600">
          เจ้าหน้าที่ได้รับข้อมูลของคุณเรียบร้อยแล้ว กรุณารอเรียกตามคิว
        </p>
      </div>
    );
  }

  return (
    // handleSubmit จาก RHF will validate with zod if it's not correct or completed, then will show message error from zod
    <form onSubmit={handleSubmit(onValidSubmit)} className="mx-auto max-w-2xl space-y-6 p-4 sm:p-6">
      <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">แบบฟอร์มข้อมูลผู้ป่วย</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField label="ชื่อจริง" htmlFor="firstName" error={errors.firstName?.message} required>
          <input
            id="firstName"
            className={cx(baseInputClass, errors.firstName && "border-red-400")}
            {...register("firstName")}
          />
        </FormField>
        <FormField label="ชื่อกลาง (ถ้ามี)" htmlFor="middleName">
          <input id="middleName" className={baseInputClass} {...register("middleName")} />
        </FormField>
        <FormField label="นามสกุล" htmlFor="lastName" error={errors.lastName?.message} required>
          <input
            id="lastName"
            className={cx(baseInputClass, errors.lastName && "border-red-400")}
            {...register("lastName")}
          />
        </FormField>
        <FormField
          label="วันเกิด"
          htmlFor="dateOfBirth"
          error={errors.dateOfBirth?.message}
          required
        >
          <input
            type="date"
            id="dateOfBirth"
            className={cx(baseInputClass, errors.dateOfBirth && "border-red-400")}
            {...register("dateOfBirth")}
          />
        </FormField>
        <FormField label="เพศ" htmlFor="gender" error={errors.gender?.message} required>
          <select
            id="gender"
            className={cx(baseInputClass, errors.gender && "border-red-400")}
            {...register("gender")}
          >
            <option value="">-- เลือกเพศ --</option>
            <option value="male">เพศชาย</option>
            <option value="femail">เพศหญิง</option>
            <option value="other">อื่นๆ</option>
          </select>
        </FormField>
        <FormField label="เบอร์โทรศัพท์" htmlFor="phone" error={errors.phone?.message} required>
          <input
            type="tel"
            className={cx(baseInputClass, errors.phone && "border-red-400")}
            id="phone"
            {...register("phone")}
          />
        </FormField>
        <FormField label="อีเมล" htmlFor="email" error={errors.email?.message} required>
          <input
            type="email"
            className={cx(baseInputClass, errors.email && "border-red-400")}
            id="email"
            {...register("email")}
          />
        </FormField>
        <FormField
          label="สัญชาติ"
          htmlFor="nationality"
          error={errors.nationality?.message}
          required
        >
          <input
            type="nationality"
            className={cx(baseInputClass, errors.nationality && "border-red-400")}
            id="nationality"
            {...register("nationality")}
          />
        </FormField>
        <FormField
          label="ภาษาที่สะดวก"
          htmlFor="preferredLanguage"
          error={errors.preferredLanguage?.message}
          required
        >
          <input
            type="preferredLanguage"
            className={cx(baseInputClass, errors.preferredLanguage && "border-red-400")}
            id="preferredLanguage"
            {...register("preferredLanguage")}
          />
        </FormField>
        <FormField
          label="ศาสนา (ถ้ามี)"
          htmlFor="religion"
          error={errors.religion?.message}
          required
        >
          <input
            type="religion"
            className={baseInputClass}
            id="religion"
            {...register("religion")}
          />
        </FormField>

        <div className="md:col-span-2">
          <FormField label="ที่อยู่" htmlFor="address" error={errors.address?.message} required>
            <input
              className={cx(baseInputClass, errors.address && "border-red-400")}
              id="address"
              {...register("address")}
            />
          </FormField>
          <FormField
            label="ชื่อผู้ติดต่อฉุกเฉิน (ถ้ามี)"
            htmlFor="emergencyContactName"
            error={errors.emergencyContactName?.message}
            required
          >
            <input
              id="emergencyContactName"
              className={baseInputClass}
              {...register("emergencyContactName")}
            />
          </FormField>
          <FormField
            label="ความสัมพันธ์"
            htmlFor="emergencyContactRelationship"
            error={errors.emergencyContactRelationship?.message}
            required
          >
            <input
              id="emergencyContactRelationship"
              className={baseInputClass}
              {...register("emergencyContactRelationship")}
            />
          </FormField>

          <button
            id="submit"
            className="w-full rounded-md bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 active:bg-sky-800 sm:w-auto"
          >
            ส่งข้อมูล
          </button>
        </div>
      </div>
    </form>
  );
}
