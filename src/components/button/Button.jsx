import React from 'react';
import './Button.css'
const Button = ({ text = '', onClick }) => {
  return (
   <button
   style={{ backgroundColor: "#0D5C63", borderColor: "#0D5C63" }}
  className="btn mx-2  text-white flex items-center justify-center sm:justify-end gap-2 px-4 py-2 text-sm sm:text-base fw-bold"
  onClick={onClick}
>
  {/* <i className="bi bi-plus-circle"></i> */}
  <span className="hidden sm:inline">{text}</span>
</button>

  );
};

export default Button;

