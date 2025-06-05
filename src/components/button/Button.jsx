import React from 'react';
import './Button.css'
const Button = ({ text = '', onClick }) => {
  return (
   <button
  className="btn mx-2 bg-primary text-white custom-btn flex items-center justify-center sm:justify-end gap-2 px-4 py-2 text-sm sm:text-base fw-bold"
  onClick={onClick}
>
  {/* <i className="bi bi-plus-circle"></i> */}
  <span className="hidden sm:inline">{text}</span>
</button>

  );
};

export default Button;

