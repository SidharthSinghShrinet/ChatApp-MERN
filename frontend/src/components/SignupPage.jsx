import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { axiosInstance } from "../routes/axiosInstance";
import {toast} from 'react-hot-toast'
const SignupPage = () => {
  const [user, setUser] = useState({
    username: "",
    fullname: "",
    password: "",
    gender: "",
  });

  // console.log(useNavigate());
  const navigate = useNavigate();
  function handleChange(e) {
    // console.log(e);
    let { name, value } = e.target;
    // console.log(name,value);
    setUser({ ...user, [name]: value });
  }

  function handleCheckbox(gender) {
    setUser({ ...user, gender });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      let response = await axiosInstance.post("/users/register",user);
      // console.log(response);
      if(response.data.success){
        toast.success(response.data.message);
        navigate("/login");
      }
    } catch (error) {
      console.log(error.response.data.message);
      toast.error(error.response.data.message);
    }
    // setUser({
    //   username: "",
    //   fullname: "",
    //   password: "",
    //   gender: "",
    // });
  }
  return (
    <div className="">
      <form className="flex flex-col gap-2 p-5 px-10 backdrop-blur-sm border-1 border-gray-400 rounded-2xl shadow-2xl shadow-gray-800">
        <h1 className="text-3xl font-bold text-gray-300 text-center mb-5">
          Signup
        </h1>
        <TextField
          id="outlined-basic"
          label="Full Name"
          variant="outlined"
          name="fullname"
          value={user.fullname}
          onChange={handleChange}
          InputProps={{
            sx:{color:"yellow",} // Tailwind class for input text
          }}
          InputLabelProps={{
            sx:{color:"black"}, // Tailwind class for label
          }}
        />
        <TextField
          id="outlined-basic"
          label="Username"
          variant="outlined"
          name="username"
          value={user.username}
          onChange={handleChange}
          InputProps={{
            sx:{color:"yellow",} // Tailwind class for input text
          }}
          InputLabelProps={{
            sx:{color:"black"}, // Tailwind class for label
          }}
        />
        <TextField
          id="outlined-basic"
          label="Password"
          variant="outlined"
          name="password"
          value={user.password}
          onChange={handleChange}
          InputProps={{
            sx:{color:"white"}
          }}
          InputLabelProps={{
            sx:{color:"black"}
          }}
        />
        <FormControl>
          <FormLabel id="demo-radio-buttons-group-label">
            <span className="text-white">Gender</span>
          </FormLabel>
          <RadioGroup
            row
            name="gender"
            value={user.gender}
            onChange={handleChange}
          >
            <FormControlLabel
              value="female"
              control={<Radio />}
              label="Female"
            />
            <FormControlLabel value="male" control={<Radio />} label="Male" />
          </RadioGroup>
        </FormControl>
        <Button onClick={handleSubmit} variant="contained">
          Signup
        </Button>
        <p className="mt-3 text-gray-300">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;
