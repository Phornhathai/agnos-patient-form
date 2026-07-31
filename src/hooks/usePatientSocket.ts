"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { getSocket } from "@/lib/socket";
import { emptyPatient } from "@/data/emptyPatient";
import type { Patient } from "@/types/patient";
import type { PatientFormValues } from "@/schemas/patient";

// set condition of inactive
const INACTIVE_THRESHOLD_MS = 5000;

// mode write to use in patient page, mode read to use in staff view page
export function usePatientSocket(mode: "write" | "read") {
  const [patient, setPatient] = useState<Patient>(emptyPatient);
  // store socket in ref to prevent creating connection repeat when re-render
  const socketRef = useRef(getSocket());

  // set listener to listern from server with 2 modes, should know the latest value
  useEffect(() => {
    const socket = socketRef.current;

    function handleInitialData(data: Patient) {
      setPatient(data);
    }

    function handleUpdate(data: Patient) {
      setPatient(data);
    }

    socket.on("patient:data", handleInitialData);
    socket.on("patient:update", handleUpdate);

    // cleanup listern when component unmount to prevent memory leak or duplicated listener
    return () => {
      socket.off("patient:data", handleInitialData);
      socket.off("patient:update", handleUpdate);
    };
  }, []);

  // check every 1 milisecond that patient stop typing with threshold or not (only staff side)
  useEffect(() => {
    if (mode !== "read") return;
    const interValId = window.setInterval(() => {
      setPatient((prev) => {
        if (prev.status === "submitted" || prev.status === "idle") return prev;
        const elapsed = Date.now() - prev.updateAt;
        if (elapsed > INACTIVE_THRESHOLD_MS && prev.status !== "inactive") {
          return { ...prev, status: "inactive" };
        }
        return prev;
      });
    }, 1000);
    return () => window.clearInterval(interValId);
  }, [mode]);

  const updatePatient = useCallback((values: PatientFormValues) => {
    setPatient((prev) => {
      const next: Patient = { ...prev, ...values, status: "filling", updateAt: Date.now() };
      socketRef.current.emit("patient:update", next); // send update value to server and broadcast immediately
      return next;
    });
  }, []);

  const submitPatient = useCallback((values: PatientFormValues) => {
    setPatient((prev) => {
      const next: Patient = { ...prev, ...values, status: "submitted", updateAt: Date.now() };
      socketRef.current.emit("patient:update", next);
      return next;
    });
  }, []);

  return { patient, updatePatient, submitPatient };
}
