// src/services/payroll.service.js

import { api } from "./api";

export const payrollService = {
  run(employeeId) {
    return api.post("/payroll/run", { employeeId });
  },

  history(employeeId) {
    return api.get(`/payroll/history/${employeeId}`);
  },
};
