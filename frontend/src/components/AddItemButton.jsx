import React from "react";

const AddItemButton = ({ onClick, className = "", isFormOpen = false }) => {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 
        bg-[#2f256e] text-white 
        p-2.5 sm:p-3 md:p-4 
        rounded-full shadow-lg 
        hover:bg-[#241c58] transition-all hover:scale-110 
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2f256e]
        z-50
        ${isFormOpen ? "opacity-0 pointer-events-none" : "opacity-100"}
        transition-opacity duration-300
        ${className}`}
      title="Create New Listing"
    >
      <svg
        className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4v16m8-8H4"
        />
      </svg>
    </button>
  );
};

export default AddItemButton;
