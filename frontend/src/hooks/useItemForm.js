import { useState } from "react";
import { showSuccessToast, showErrorToast } from "../components/CustomToast";

const useItemForm = (onSuccess) => {
  const [formData, setFormData] = useState({
    type: "lost",
    title: "",
    category: "electronics",
    location: "",
    description: "",
    images: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (!formData.images) {
      setFormData((prev) => ({ ...prev, images: [] }));
    }

    if (formData.images?.length + imageFiles.length > 3) {
      showErrorToast("You can only upload up to 3 images");
      return;
    }

    // Convert images to base64
    try {
      const base64Promises = imageFiles.map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });

      const base64Results = await Promise.all(base64Promises);

      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...base64Results].slice(0, 3),
      }));
    } catch (error) {
      console.error("Error processing images:", error);
      showErrorToast("Error processing images. Please try again.");
    }
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e, isEdit = false, itemId = null) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = isEdit
        ? `/api/items/update-item/${itemId}`
        : "/api/items/list";

      const response = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(
          isEdit ? "Failed to update item" : "Failed to create item"
        );
      }

      const result = await response.json();
      onSuccess(result.data.item, isEdit);

      // Show success toast
      showSuccessToast(
        isEdit ? "Item updated successfully!" : "Item created successfully!"
      );

      return true;
    } catch (err) {
      console.error(
        isEdit ? "Error updating item:" : "Error creating item:",
        err
      );

      // Show error toast
      showErrorToast(
        isEdit
          ? "Failed to update item. Please try again."
          : "Failed to create item. Please try again."
      );

      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      type: "lost",
      title: "",
      category: "electronics",
      location: "",
      description: "",
      images: [],
    });
  };

  const setInitialData = (data) => {
    setFormData(data);
  };

  return {
    formData,
    isSubmitting,
    handleInputChange,
    handleImageUpload,
    removeImage,
    handleSubmit,
    resetForm,
    setInitialData,
  };
};

export default useItemForm;
