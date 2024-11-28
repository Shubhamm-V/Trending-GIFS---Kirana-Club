import React, { useState } from "react";
import Home from "./Home";
import ThemeContext from "@/context/ThemeContext";

const ThemeProviderComponent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default () => (
  <ThemeProviderComponent>
    <Home />
  </ThemeProviderComponent>
);
