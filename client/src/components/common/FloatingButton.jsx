import React from "react";
import { IoMdAdd } from "react-icons/io";

const FloatingButton = ({ onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-6 right-6 z-50 
        bg-blue-500 text-white 
        rounded-full 
        w-14 h-14 
        flex items-center justify-center 
        shadow-lg 
        border-0
        ${className}`}
    >
      <IoMdAdd className="text-3xl" />
    </button>
  );
};

export default FloatingButton;
