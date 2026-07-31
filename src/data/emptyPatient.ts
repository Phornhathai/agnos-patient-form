import type { Patient } from "../types/patient";
import { emptyPatientForm } from "../schemas/patient";

// all default fields of form (from schema) bind to default fields of system
export const emptyPatient: Patient = {
  ...emptyPatientForm,
  status: "idle",
  updateAt: 0,
};
