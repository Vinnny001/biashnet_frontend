// src/services/payroll.service.js

import { paymentApi } from "./api";

export const payrollService = {
  run(employeeId) {
    return paymentApi.post("/payroll/run", { employeeId });
  },

  history(employeeId) {
    return paymentApi.get(`/payroll/history/${employeeId}`);
  },
};
