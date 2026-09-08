// src/services/employee.service.js

import { paymentApi } from "./api";

export const employeeService = {
  /*
  |--------------------------------------------------------------------------
  | MY EMPLOYEE PROFILE
  |--------------------------------------------------------------------------
  */

  me() {
    return paymentApi.get("/employees/me");
  },

  /*
  |--------------------------------------------------------------------------
  | LIST — HR/Admin/CEO
  |--------------------------------------------------------------------------
  */

  list() {
    return paymentApi.get("/employees");
  },

  /*
  |--------------------------------------------------------------------------
  | CREATE — link an existing user as an employee
  |--------------------------------------------------------------------------
  */

  create(payload) {
    return paymentApi.post("/employees", payload);
  },

  /*
  |--------------------------------------------------------------------------
  | STATUS / POSITION — direct, no approval needed
  |--------------------------------------------------------------------------
  */

  updateStatus(employeeId, employmentStatus) {
    return paymentApi.patch(`/employees/${employeeId}/status`, { employmentStatus });
  },

  updatePosition(employeeId, positionId) {
    return paymentApi.patch(`/employees/${employeeId}/position`, { positionId });
  },

  /*
  |--------------------------------------------------------------------------
  | ROLE CHANGE — creates a CEO approval request
  |--------------------------------------------------------------------------
  */

  requestRoleChange(employeeId, roles) {
    return paymentApi.patch(`/employees/${employeeId}/roles`, { roles });
  },
};
