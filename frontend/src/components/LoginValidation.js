function Validation(values) {
  const errors = {};

  const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (values.email === "") {
    errors.email = "Email should not be empty";
  } else if (!email_pattern.test(values.email)) {
    errors.email = "Email is invalid";
  } else {
    errors.email = "";
  }

  if (values.password === "") {
    errors.password = "Password should not be empty";
  } else {
    errors.password = "";
  }

  return errors;
}

export default Validation;
 