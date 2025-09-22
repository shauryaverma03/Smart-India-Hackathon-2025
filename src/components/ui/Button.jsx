// src/components/ui/Button.jsx
import React from "react";

export const Button = ({ children, className = "", ...props }) => {
  return (
    <button
      className={`bg-primary text-white px-6 py-3 rounded-lg hover:shadow-lg transition-transform hover:scale-105 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
