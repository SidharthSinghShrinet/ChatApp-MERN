import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/themeSlice";
import { IoSunnyOutline, IoMoonOutline } from "react-icons/io5";

const ThemeToggle = ({ className = "" }) => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme?.mode) || "dark";
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => dispatch(toggleTheme())}
      className={`relative p-2 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-center ${
        isDark
          ? "bg-white/5 border-white/10 text-amber-300 hover:bg-white/10 hover:border-white/20 shadow-[0_0_10px_rgba(251,191,36,0.15)]"
          : "bg-white/80 border-slate-200/90 text-indigo-600 hover:bg-white hover:border-slate-300 shadow-sm shadow-slate-200/50"
      } ${className}`}
      title={`Switch to ${isDark ? "Light" : "Dark"} mode (Redux)`}
      aria-label={`Switch to ${isDark ? "Light" : "Dark"} mode`}
    >
      {isDark ? (
        <IoSunnyOutline className="text-lg transition-transform duration-300 rotate-0 hover:rotate-45" />
      ) : (
        <IoMoonOutline className="text-lg transition-transform duration-300 -rotate-12 hover:rotate-0" />
      )}
    </button>
  );
};

export default ThemeToggle;
