import React, { createContext, useContext, useState, useEffect } from "react";
import { ConfigProvider } from "antd";
import { colorPalette, themeVariants } from "../../utlis/theme";

// Create theme context
const ThemeContext = createContext();

// Custom hook to use theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState("light");
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load theme preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setCurrentTheme(savedTheme);
    setIsDarkMode(savedTheme === "dark");
  }, []);

  // Save theme preference to localStorage
  const toggleTheme = () => {
    const newTheme = currentTheme === "light" ? "dark" : "light";
    setCurrentTheme(newTheme);
    setIsDarkMode(newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  // Get current theme configuration
  const themeConfig = themeVariants[currentTheme];

  // Context value
  const contextValue = {
    currentTheme,
    isDarkMode,
    toggleTheme,
    colorPalette,
    themeConfig,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <ConfigProvider theme={themeConfig}>{children}</ConfigProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
