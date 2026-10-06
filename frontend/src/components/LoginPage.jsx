import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';
import { axiosInstance } from "../routes/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "../redux/userSlice";
import { IoPersonOutline, IoLockClosedOutline, IoEyeOutline, IoEyeOffOutline, IoChatbubbleEllipsesSharp } from "react-icons/io5";
import ThemeToggle from "./ThemeToggle";

const LoginPage = () => {
  const [user, setUser] = useState({
    username: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const requiredValue = useSelector((state) => state.user.authUser);

  function handleChange(e) {
    let { name, value } = e.target;
    setUser({ ...user, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user.username.trim() || !user.password.trim()) {
      toast.error("Please enter your username and password");
      return;
    }
    setLoading(true);
    try {
      let response = await axiosInstance.post("/users/login", user);
      if (response?.data?.success) {
        const token = response?.data?.token || response?.data?.meta;
        if (token) {
          localStorage.setItem("token", token);
        }
        dispatch(setAuthUser(response.data.data));
        toast.success(response.data.message || "Logged in successfully!");
        navigate("/");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-[420px] mx-auto z-10 relative px-4 sm:px-0">
      <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 md:p-10 border border-[var(--card-border-elevated)] shadow-2xl relative overflow-hidden transition-colors duration-300">
        {/* Subtle top glow bar */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

        {/* Header bar with Theme Toggle */}
        <div className="flex justify-end -mt-1 -mr-1 mb-2">
          <ThemeToggle />
        </div>

        {/* Brand Header */}
        <div className="flex flex-col items-center mb-6 sm:mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-3 border border-white/20">
            <IoChatbubbleEllipsesSharp className="text-white text-2xl" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text-heading)]">
            PulseChat
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1 text-center font-medium">
            Sign in to reconnect with your conversations
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Username Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-subtle)]" htmlFor="username">
              Username
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-[var(--text-subtle)] text-lg pointer-events-none">
                <IoPersonOutline />
              </span>
              <input
                id="username-input"
                type="text"
                name="username"
                value={user.username}
                onChange={handleChange}
                placeholder="Enter your username"
                autoComplete="username"
                className="glass-input w-full pl-11 pr-4 py-3 rounded-xl text-[16px] sm:text-sm font-medium"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-1.5">
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
                autoComplete="current-password"
                className="glass-input w-full pl-11 pr-11 py-3 rounded-xl text-[16px] sm:text-sm font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-[var(--text-subtle)] hover:text-[var(--text-heading)] transition-colors p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <IoEyeOffOutline className="text-lg" /> : <IoEyeOutline className="text-lg" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="gradient-btn mt-2 w-full py-3.5 px-4 rounded-xl text-white font-semibold text-sm tracking-wide cursor-pointer flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : null}
            {loading ? "Signing in..." : "Login"}
          </button>

          {/* Navigation to Signup */}
          <p className="mt-4 text-center text-xs sm:text-sm text-[var(--text-muted)]">
            Don't have an Account?{" "}
            <Link
              to="/signup"
              className="text-indigo-600 dark:text-cyan-400 hover:text-indigo-500 dark:hover:text-cyan-300 font-semibold transition-colors"
            >
              Signup
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
