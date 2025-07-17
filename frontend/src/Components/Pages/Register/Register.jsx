import { useState } from "react";
// import React {useState} from "react";
import { Link, NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate=useNavigate()
  const [formData, setFormData] = useState({
    fullName: "",
    username:"",
    email:"",
    password:"",
  });

  function handleChange(e) {
    const name = e.target.name;
    console.log(name)
    const value = e.target.value;
    console.log(value)
    setFormData({ ...formData, [name]: value });
  }

  async function handleForm(e){
    e.preventDefault()
    console.log(formData)
    const resp=await fetch('http://localhost:8000/api/v1/users/register',{
      method:"POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
    const data=await resp.json();
    console.log(data)
    if(data.success){
      // localStorage.setItem("token", data.data.refreshToken);
      alert(data.message)
      navigate('/')

    }else{
      alert("Not register")
    }
  }
  return (
    <div className="flex items-center justify-center w-full">
      <div
        className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}
      >
        <div className="mb-2 flex justify-center">
          {/* <span className="inline-block w-full max-w-[100px]">
                        <Logo width="100%" />
                    </span> */}
        </div>
        <h2 className="text-center text-2xl font-bold leading-tight">
          Sign up to your account
        </h2>
        <p className="mt-2 text-center text-base text-black/60">
          Have any account?&nbsp;
          <Link
            to="/login"
            className="font-medium text-primary transition-all duration-200 hover:underline"
          >
            Sign In
          </Link>
        </p>
        {/* {error && <p className="text-red-600 mt-8 text-center">{error}</p>} */}
        <form className="mt-8" onSubmit={handleForm}>
          <div className="space-y-5">
            <div className="w-full">
              <label className="inline-block mb-1 pl-1">Full Name:</label>
              <input
                type="text"
                className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full `}
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                
              />
            </div>
            <div className="w-full">
              <label className="inline-block mb-1 pl-1">UserName:</label>

              <input
                type="text"
                className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full `}
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div className="w-full">
              <label className="inline-block mb-1 pl-1">Email:</label>

              <input
                type="email"
                className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full `}
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="w-full">
              <label className="inline-block mb-1 pl-1">Password:</label>

              <input
                type="password"
                className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full `}
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <button
              className={`px-4 py-2 rounded-lg w-full bg-blue-600 text-white`}
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
