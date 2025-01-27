import React from "react";
import { Link } from "react-router-dom";

const ItemCard = ({
  item,
  isMyListing = false,
  onEditClick,
  onDeleteClick,
}) => {
  const CardWrapper = isMyListing ? "div" : Link;
  const wrapperProps = isMyListing ? {} : { to: `/item/${item._id}` };

  const handleEditClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onEditClick(item);
  };

  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDeleteClick(e, item);
  };

  return (
    <CardWrapper
      {...wrapperProps}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-[400px] w-full max-w-[300px] mx-auto"
    >
      <div className="h-[70%] w-full relative bg-gray-100 dark:bg-gray-700 rounded-t-lg overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={item.images?.[0] || `./src/assets/not_available.jpg`}
            alt={item.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `./src/assets/not_available.jpg`;
            }}
          />
        </div>
      </div>

      <div className="flex flex-col flex-1 p-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {isMyListing
              ? item.date
              : new Date(item.createdAt).toLocaleDateString()}
          </span>
          <span
            className={`px-2.5 py-1 text-xs font-medium rounded-full ${
              item.type === "lost"
                ? "bg-red-100 text-red-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {item.type.toUpperCase()}
          </span>
        </div>

        <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-1 line-clamp-1">
          {item.title}
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 flex-1 line-clamp-1">
          {item.description}
        </p>

        <div className="mt-auto pt-2 border-t dark:border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center truncate max-w-[130px]">
              <svg
                className="w-3 h-3 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {item.location}
            </span>
            {isMyListing ? (
              <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={handleEditClick}
                  className="px-2.5 py-1 text-xs bg-[#2f256e] text-white rounded-md hover:bg-[#241c58] transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={handleDeleteClick}
                  className="px-2.5 py-1 text-xs bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            ) : (
              <span className="px-2.5 py-1 text-xs bg-[#2f256e] text-white rounded-md hover:bg-[#241c58] transition-colors">
                View Details →
              </span>
            )}
          </div>
        </div>
      </div>
    </CardWrapper>
  );
};

export default ItemCard;
