import { createSlice } from "@reduxjs/toolkit";

const getInitialTheme = () => {
  try {
    const saved = localStorage.getItem("pulsechat_theme");
    if (saved === "light" || saved === "dark") {
      return saved;
    }
  } catch {
    // ignore storage access restrictions
  }
  return "dark";
};

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    mode: getInitialTheme(),
  },
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("pulsechat_theme", state.mode);
      } catch {
        // ignore storage write errors
      }
    },
    setTheme: (state, action) => {
      if (action.payload === "light" || action.payload === "dark") {
        state.mode = action.payload;
        try {
          localStorage.setItem("pulsechat_theme", state.mode);
        } catch {
          // ignore storage write errors
        }
      }
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
