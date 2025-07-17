import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useNavigate } from "react-router";
const Register = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    username: "",
    email: "",
    password: "",
  });
  function handleChange(e) {
    const name = e.target.name;
    // console.log(name)
    const value = e.target.value;
    // console.log(value)
    setLoginData({ ...loginData, [name]: value });
  }

  async function handleForm(e){
    e.preventDefault()
    console.log(loginData)
    const resp=await fetch('http://localhost:8000/api/v1/users/login',{
      method:"POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    })
    const data=await resp.json();
    console.log(data)
    if(data.success){
      localStorage.setItem("token", data.data.refreshToken);
      alert(data.message)
      console.log(data.data.refreshToken)
      navigate('/')
    }else{
      alert("Wrong userName/email or Password")
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
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-base text-black/60">
          Don&apos;t have any account?&nbsp;
          <Link
            to="/register"
            className="font-medium text-primary transition-all duration-200 hover:underline"
          >
            Sign Up
          </Link>
        </p>
        {/* {error && <p className="text-red-600 mt-8 text-center">{error}</p>} */}
        <form className="mt-8" onSubmit={handleForm}>
          <div className="space-y-5">
            <div className="w-full">
              <label className="inline-block mb-1 pl-1">Username:</label>
              <input
                type="text"
                name="username"
                className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full `}
                value={loginData.username}
                onChange={handleChange}
              />
            </div>
            <div style={{ fontSize: "15px", textAlign: "center" }}>or</div>
            <div className="w-full">
              <label className="inline-block mb-1 pl-1">Email:</label>

              <input
                type="text"
                name="email"
                className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full `}
                value={loginData.email}
                onChange={handleChange}
              />
            </div>
            <div className="w-full">
              <label className="inline-block mb-1 pl-1">Password:</label>

              <input
                type="password"
                name="password"
                className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full `}
                value={loginData.password}
                onChange={handleChange}
              />
            </div>
            <button
              className={`px-4 py-2 rounded-lg w-full bg-blue-600 text-white`}
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;

{
  /* <Input
                label="Email: "
                placeholder="Enter your email"
                type="email"
                // {...register("email", {
                //     required: true,
                //     validate: {
                //         matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                //         "Email address must be a valid address",
                //     }
                // })}
                /> */
}
{
  /* <Input
                label="Password: "
                type="password"
                placeholder="Enter your password"
                // {...register("password", {
                //     required: true,
                // })}
                /> */
}
{
  /* <Button
                type="submit"
                className="w-full"
                >Sign in</Button> */
}
