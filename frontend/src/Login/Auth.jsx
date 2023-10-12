import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Login } from './Login';
import { Register } from './Register'

const Auth = () => {
  const navigate = useNavigate;
  const [currentForm, setCurrentForm] = useState('login');

  const toggleForm = (formName) => {
    setCurrentForm(formName);
  }

  const handleSuccessfulLogin = () => {
    navigate('/Homepage')
  }


  return (
    <>
      {/* Makes our swap from Login to Register button work! As well as login toggle to Homepage */}
      {currentForm === "login" ? <Login onFormSwitch={toggleForm} onSuccessfulLogin={handleSuccessfulLogin}/> : <Register onFormSwitch={toggleForm}/>}
    </>
  );
};

export default Auth;