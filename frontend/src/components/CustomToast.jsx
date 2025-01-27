import React from "react";
import toast from "react-hot-toast";

export const showSuccessToast = (message, duration = 1500) => {
  toast.success(message, {
    duration,
    className: "dark:bg-gray-800 dark:text-white",
    position: "top-center",
  });
};

export const showErrorToast = (message) => {
  toast.error(message, {
    duration: 3000,
    className: "dark:bg-gray-800 dark:text-white",
    position: "top-center",
  });
};

export const showConfirmationDialog = ({
  message,
  onConfirm,
  confirmButtonText = "Yes, Delete",
  confirmButtonClass = "bg-red-600 hover:bg-red-700",
  duration = Infinity,
}) => {
  toast.custom(
    (t) => (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-md">
        <p className="text-gray-800 dark:text-gray-200 mb-4">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => {
              toast.remove(t.id);
            }}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              toast.remove(t.id);
              onConfirm();
            }}
            className={`px-3 py-1.5 text-sm text-white rounded-md ${confirmButtonClass}`}
          >
            {confirmButtonText}
          </button>
        </div>
      </div>
    ),
    {
      duration,
      position: "top-center",
    }
  );
};
