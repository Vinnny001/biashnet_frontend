export function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function validateLogin(values) {
  const errors = {};
  if (!isEmail(values.email || "")) errors.email = "Enter a valid email.";
  if (!values.password) errors.password = "Password is required.";
  return errors;
}

export function validateSignup(values) {
  const errors = validateLogin(values);
  if (!values.name) errors.name = "Name is required.";
  if ((values.password || "").length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }
  return errors;
}
