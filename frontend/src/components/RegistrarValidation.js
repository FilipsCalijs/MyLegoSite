function Validation(values) {
    const errors = {};
  
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  
    // Проверка email
    if (values.name === "") {
        errors.name = "name should not be empty";
    }else {
        errors.name = "";
      }
    if (values.email === "") {
      errors.email = "Email should not be empty";
    } else if (!email_pattern.test(values.email)) {
      errors.email = "Email is invalid";
    } else {
      errors.email = "";
    }
  
  
    // Проверка пароля
    if (values.password === "") {
      errors.password = "Password should not be empty";
    } else if (!password_pattern.test(values.password)) {
      errors.password = "Passsssword must contain at least 8 characters, one uppercase, one lowercase, and one number";
    } else {
      errors.password = "";
    }
  
    return errors;
  } 
  
export default Validation;