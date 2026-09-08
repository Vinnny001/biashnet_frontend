// src/services/employee.service.js

import { api } from "./api";

export const employeeService = {
  /*
  |--------------------------------------------------------------------------
  | MY EMPLOYEE PROFILE
  |--------------------------------------------------------------------------
  */

  me() {
    return api.get("/employees/me");
  },

  /*
  |--------------------------------------------------------------------------
  | LIST — HR/Admin/CEO
  |--------------------------------------------------------------------------
  */

  list() {
    return api.get("/employees");
  },

  /*
  |--------------------------------------------------------------------------
  | CREATE — link an existing user as an employee
  |--------------------------------------------------------------------------
  */

  create(payload) {
    return api.post("/employees", payload);
  },

  /*
  |--------------------------------------------------------------------------
  | STATUS / POSITION — direct, no approval needed
  |--------------------------------------------------------------------------
  */

  updateStatus(employeeId, employmentStatus) {
    return api.patch(`/employees/${employeeId}/status`, { employmentStatus });
  },

  updatePosition(employeeId, positionId) {
    return api.patch(`/employees/${employeeId}/position`, { positionId });
  },

  /*
  |--------------------------------------------------------------------------
  | ROLE CHANGE — creates a CEO approval request
  |--------------------------------------------------------------------------
  */

  requestRoleChange(employeeId, roles) {
    return api.patch(`/employees/${employeeId}/roles`, { roles });
  },
};
