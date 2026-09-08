import { useContext } from "react";
import { EmployeeContext } from "../context/EmployeeContext";

export function useEmployee() {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error("useEmployee must be used inside EmployeeProvider.");
  }
  return context;
}
