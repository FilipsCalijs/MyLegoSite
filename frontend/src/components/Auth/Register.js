import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import Validation from '../RegistrarValidation';
import axios from 'axios'; 

const Register = () => {

  const [values, setValues] = useState({
    name: '',
    email: '',
    password: ''
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState([])
  const handleInput = (event) => {
    setValues(prev => ({
      ...prev,
      [event.target.name]: event.target.value
    }));
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors = Validation(values);
    setErrors(validationErrors);
  
    if (
      validationErrors.name === "" &&
      validationErrors.email === "" &&
      validationErrors.password === ""
    ) {
      console.log("Sending:", values);  // ← обязательно, чтобы видеть в консоли
  
      axios.post('http://localhost:8081/signup', values)
        .then(res => {
          console.log("Response:", res.data);  // ← для отладки
          navigate('/');
        })
        .catch(err => {
          console.log("AXIOS ERROR:", err);  // ← покажет ошибку, если сервер не отвечает
        });
    }
  }  
  return (
    <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>
      <div className='bg-white p-3 rounded w-25'>
        <h2>Register</h2>
        
        <form action="" onSubmit={handleSubmit}>
        <div className='mb-3'>
            <label htmlFor="email">
              <strong>name</strong>
            </label>
            <input
              type="name"
              placeholder="Enter name"
              className="form-control rounded-0"
              onChange={handleInput}
              name='name'
            />
            {errors.name && <span className='text-danger'>{errors.name}</span>}
            </div>
          <div className='mb-3'>
            <label htmlFor="email">
              <strong>Email</strong>
            </label>
            <input
              type="email"
              placeholder="Enter Email"
              name='email'
              onChange={handleInput}
              className="form-control rounded-0"
            />
            {errors.email && <span className='text-danger'>{errors.email}</span>}
          </div>
          <div className='mb-3'>
            <label htmlFor="password">
              <strong>Password</strong>
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              name='password'
              onChange={handleInput}
              className="form-control rounded-0"
            />
            {errors.password && <span className='text-danger'>{errors.password}</span>}
          </div>
          
          <button type='submit' className='btn btn-success w-100'>Log in</button>
          <p>You agree to our terms and policies</p>
          <Link to="/login"className='btn btn-default border w-100 bg-light'>login</Link>
        </form>
      </div>
    </div>
  );
};

export default Register;
