import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { UserContext } from '../UserContext';

export const Register = (props) => {
  const navigate = useNavigate(); 

  const { userData, setUserData } = useContext(UserContext);
  const [username, setUserName] = useState("");
  const [pass, setPass] = useState("");
  const [fullname, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      username: username,
      password: pass,
      fullname: fullname,
      email: email,
      id: null,
    };

    try {
      console.log(JSON.stringify(userData));
      const response = await fetch("http://18.189.150.72:8000/user/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      }
      );

      if (response.ok) {
        const userDataFromResponse = await response.json();
        console.log("UserData from API:", userDataFromResponse);
        setUserData(userDataFromResponse);
        props.onFormSwitch("login");
        navigate("/Login", { state: { message: `Thanks for registering ${username}` } });
      } else {
        console.error("Registration failed");
      }
    } catch (error) {
      console.error("There was a problem with the registration request", error);
    }
  };
  return (
    <>
      <div className='justify-center items-center flex min-h-screen text-center bg-h-14 bg-gradient-to-r from-purple-200 to-purple-900'>
        <form
          className='flex flex-col p-20 border border-white rounded-md'
          onSubmit={handleSubmit}
        >
          <h2 className='justify-center items-center flex text-center text-white font-bold text-2xl m-2'>
            Register
          </h2>

          <label className='text-left text-white p-1 rounded-sm'>
            Username:
          </label>
          <input
            className='m-1 rounded-md'
            value={username}
            onChange={(e) => setUserName(e.target.value)}
            name='username'
            id='username'
            placeholder=' User Name'
          ></input>

          <label className='text-left text-white p-1 rounded-sm'>
            Full Name:
          </label>
          <input
            className='m-1 rounded-md'
            value={fullname}
            onChange={(e) => setFullName(e.target.value)}
            name='fullname'
            id='fullname'
            placeholder=' Full Name'
          ></input>
          <label
            className='text-left text-white p-1 rounded-sm'
            htmlFor='email'
          >
            Email:
          </label>
          <input
            className='m-1 rounded-md'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type='email'
            placeholder=' youremail@gmail.com'
            id='email'
            name='email'
          ></input>
          <label
            className='text-left text-white p-1 rounded-sm'
            htmlFor='password'
          >
            Password:
          </label>
          <input
            className='m-1 rounded-md'
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            type='password'
            placeholder=' **********'
            id='password'
            name='password'
          ></input>
          <button
            className='text-white border p-1 m-1 rounded-md cursor-pointer hover:opacity-80'
            type='submit'
            onClick={handleSubmit}
          >
            Register
          </button>
          <button
            className='text-white underline cursor-pointer'
            onClick={() => props.onFormSwitch("login")}
          >
            If you already have an account? Log in Here!
          </button>
        </form>
      </div>
    </>
  );
};
