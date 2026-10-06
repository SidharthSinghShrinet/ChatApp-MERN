import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../routes/axiosInstance";
import { toast } from 'react-hot-toast';
import {
  IoPersonOutline,
  IoLockClosedOutline,
  IoEyeOutline,
  IoEyeOffOutline,
  IoChatbubbleEllipsesSharp,
  IoAtOutline,
  IoFemaleOutline,
  IoMaleOutline
} from "react-icons/io5";
import ThemeToggle from "./ThemeToggle";

const SignupPage = () => {
  const [user, setUser] = useState({
    username: "",
    fullname: "",
    password: "",
    gender: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  function handleChange(e) {
    let { name, value } = e.target;
    setUser({ ...user, [name]: value });
  }

  function handleGenderSelect(gender) {
    setUser({ ...user, gender });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user.fullname.trim() || !user.username.trim() || !user.password.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (!user.gender) {
      toast.error("Please select a gender");
      return;
    }

    setLoading(true);
    try {
      let response = await axiosInstance.post("/users/register", user);
      if (response?.data?.success) {
        toast.success(response.data.message || "Account created successfully!");
        navigate("/login");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-[440px] mx-auto z-10 relative px-4 sm:px-0 my-auto py-6 sm:py-8">
      <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 md:p-10 border border-[var(--card-border-elevated)] shadow-2xl relative overflow-hidden transition-colors duration-300">
        {/* Subtle top glow bar */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[2px] bg-gradient-to-r from-transparent via-indigo-400 to-transparent" />

        {/* Header bar with Theme Toggle */}
        <div className="flex justify-end -mt-1 -mr-1 mb-2">
          <ThemeToggle />
        </div>

        {/* Brand Header */}
        <div className="flex flex-col items-center mb-5 sm:mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-3 border border-white/20">
            <IoChatbubbleEllipsesSharp className="text-white text-2xl" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text-heading)]">
            Create Account
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1 text-center font-medium">
            Join PulseChat for real-time secure messaging
          </p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          {/* Full Name */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-subtle)]" htmlFor="fullname">
              Full Name
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-[var(--text-subtle)] text-lg pointer-events-none">
                <IoPersonOutline />
              </span>
              <input
                id="fullname-input"
                type="text"
                name="fullname"
                value={user.fullname}
                onChange={handleChange}
                placeholder="e.g. Alex Rivera"
                autoComplete="name"
                className="glass-input w-full pl-11 pr-4 py-2.5 rounded-xl text-[16px] sm:text-sm font-medium"
              />
            </div>
          </div>

          {/* Username */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-subtle)]" htmlFor="username">
              Username
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-[var(--text-subtle)] text-lg pointer-events-none">
                <IoAtOutline />
              </span>
              <input
                id="username-input"
                type="text"
                name="username"
                value={user.username}
                onChange={handleChange}
                placeholder="e.g. alex_rivera"
                autoComplete="username"
                className="glass-input w-full pl-11 pr-4 py-2.5 rounded-xl text-[16px] sm:text-sm font-medium"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-subtle)]" htmlFor="password">
              Password
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-[var(--text-subtle)] text-lg pointer-events-none">
                <IoLockClosedOutline />
              </span>
              <input
                id="password-input"
                type={showPassword ? "text" : "password"}
                name="password"
                value={user.password}
                onChange={handleChange}
                placeholder="••••••••••••"
                autoComplete="new-password"
                className="glass-input w-full pl-11 pr-11 py-2.5 rounded-xl text-[16px] sm:text-sm font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-[var(--text-subtle)] hover:text-[var(--text-heading)] transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <IoEyeOffOutline className="text-lg" /> : <IoEyeOutline className="text-lg" />}
              </button>
            </div>
          </div>

          {/* Gender Selection */}
          <div className="flex flex-col gap-1.5 mt-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-subtle)]">
              Gender
            </label>
            <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Select gender">
              <button
                type="button"
                role="radio"
                aria-checked={user.gender === "male"}
                onClick={() => handleGenderSelect("male")}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all border ${user.gender === "male"
                  ? "bg-indigo-50 dark:bg-indigo-600/30 border-indigo-500 dark:border-cyan-400 text-indigo-700 dark:text-cyan-300 shadow-sm"
                  : "glass-input text-[var(--text-muted)] hover:text-[var(--text-heading)]"
                  }`}
              >
                <IoMaleOutline className="text-base" />
                <span>Male</span>
              </button>

              <button
                type="button"
                role="radio"
                aria-checked={user.gender === "female"}
                onClick={() => handleGenderSelect("female")}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all border ${user.gender === "female"
                  ? "bg-indigo-50 dark:bg-indigo-600/30 border-indigo-500 dark:border-cyan-400 text-indigo-700 dark:text-cyan-300 shadow-sm"
                  : "glass-input text-[var(--text-muted)] hover:text-[var(--text-heading)]"
                  }`}
              >
                <IoFemaleOutline className="text-base" />
                <span>Female</span>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="gradient-btn mt-3 w-full py-3.5 px-4 rounded-xl text-white font-semibold text-sm tracking-wide cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : null}
            {loading ? "Creating Account..." : "Signup"}
          </button>

          {/* Navigation to Login */}
          <p className="mt-3 text-center text-xs sm:text-sm text-[var(--text-muted)]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-600 dark:text-cyan-400 hover:text-indigo-500 dark:hover:text-cyan-300 font-semibold transition-colors"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
