import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  showSuccessToast,
  showErrorToast,
  showConfirmationDialog,
} from "../components/CustomToast";

const UseDeleteItem = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const deleteItem = async (itemId, onSuccess) => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/items/delete-item/${itemId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete item");
      }

      showSuccessToast("Item deleted successfully");

      // If onSuccess callback is provided, call it
      if (onSuccess) {
        onSuccess();
      } else {
        // Default behavior: navigate back
        navigate(-1);
      }
    } catch (err) {
      console.error("Error deleting item:", err);
      showErrorToast("Failed to delete item. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmDelete = (itemId, onSuccess) => {
    showConfirmationDialog({
      message: "Are you sure you want to delete this item?",
      onConfirm: () => deleteItem(itemId, onSuccess),
      duration: 1500,
    });
  };

  return {
    isDeleting,
    confirmDelete,
  };
};

export default UseDeleteItem;
