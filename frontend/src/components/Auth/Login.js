import React, { useState, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Validation from '../LoginValidation';
import { UserContext } from '../../UserContext';

function Login() {
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState([]);
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  const { login } = useContext(UserContext); // 👈 обязательно подключаем login

  const handleInput = (event) => {
    setValues(prev => ({
      ...prev,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = Validation(values);
    setErrors(validationErrors);

    if (validationErrors.email === "" && validationErrors.password === "") {
      axios.post('http://localhost:8081/login', values)
        .then(res => {
          console.log("Login OK:", res.data);
          login(res.data.name, res.data.id); // 👈 сохраняем имя и ID пользователя
          navigate('/my-products');          // 👈 переходим на страницу товаров
        })
        .catch(err => {
          console.log("Login error:", err);
          setServerError("Incorrect email or password");
        });
    }
  };

  return (
    <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>
      <div className='bg-white p-3 rounded w-25'>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label htmlFor="email"><strong>Email</strong></label>
            <input
              type="email"
              placeholder="Enter Email"
              className="form-control rounded-0"
              onChange={handleInput}
              name='email'
            />
            {errors.email && <span className='text-danger'>{errors.email}</span>}
          </div>

          <div className='mb-3'>
            <label htmlFor="password"><strong>Password</strong></label>
            <input
              type="password"
              placeholder="Enter Password"
              className="form-control rounded-0"
              onChange={handleInput}
              name='password'
            />
            {errors.password && <span className='text-danger'>{errors.password}</span>}
          </div>

          {serverError && <div className='text-danger mb-2'>{serverError}</div>}

          <button type='submit' className='btn btn-success w-100'>Log in</button>
          <p>You agree to our terms and policies</p>
          <Link to="/register" className='btn btn-default border w-100 bg-light'>Create Account</Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
