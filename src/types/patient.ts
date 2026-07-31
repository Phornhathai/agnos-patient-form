// add field that will get from form directly to PatientFormValues

import type { PatientFormValues } from "../schemas/patient";

// status that staff view use to show indicator
export type PatientStatus = "idle" | "filling" | "inactive" | "submitted";

export interface Patient extends PatientFormValues {
  status: PatientStatus;
  updateAt: number; // timestamp (ms) that calculate to check inactive or not
}
