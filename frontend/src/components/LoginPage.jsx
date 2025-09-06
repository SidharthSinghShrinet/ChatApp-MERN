import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { data, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {toast} from 'react-hot-toast';
import { axiosInstance } from "../routes/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "../redux/userSlice";

const LoginPage = () => {
    const [user,setUser] = useState({
        username:"",
        password:""
    })
    const dispatch = useDispatch();
    const navigate = useNavigate();
    let requiredValue = useSelector((state)=>state.user.authUser);
    // console.log(requiredValue);
    function handleChange(e){
        let {name,value} = e.target;
        setUser({...user,[name]:value});
    }

    async function handleSubmit(e){
        e.preventDefault();
        // console.log(user);
        try {
            let response = await axiosInstance.post("/users/login",user);
            // console.log(response.data.data);
            if(response.data.success){
              dispatch(setAuthUser(response.data.data));
                toast.success(response.data.message);
                navigate("/");
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }
  return (
    <div className="">
      <form className="flex flex-col gap-2 p-5 px-10 backdrop-blur-sm border-1 border-gray-400 rounded-2xl shadow-2xl shadow-gray-800">
        <h1 className="text-3xl font-bold text-gray-300 text-center mb-5">
          Login
        </h1>
        <TextField
          id="username-input"
          label="Username"
          variant="outlined"
          name="username"
          value={user.username}
          onChange={handleChange}
          InputProps={{
            sx: { color: "yellow" }, // Tailwind class for input text
          }}
          InputLabelProps={{
            sx: { color: "black" }, // Tailwind class for label
          }}
        />
        <TextField
          id="password-input"
          label="Password"
          variant="outlined"
          name="password"
          value={user.password}
          onChange={handleChange}
          InputProps={{
            sx: { color: "white" },
          }}
          InputLabelProps={{
            sx: { color: "black" },
          }}
        />
        <Button onClick={handleSubmit} variant="contained">
          Login
        </Button>
        <p className="mt-3 text-gray-300">
          Don't have an Account? <Link to="/signup">Signup</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
