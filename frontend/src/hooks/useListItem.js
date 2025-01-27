import { useState } from "react";

const useListItem = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const listItem = async (formData) => {
    setIsSubmitting(true);

    try {
      const base64Images = await Promise.all(
        formData.images.map(async (image) => await convertToBase64(image))
      );

      const itemData = {
        type: formData.type,
        title: formData.title,
        category: formData.category,
        location: formData.location,
        description: formData.description,
        images: base64Images,
      };

      const response = await fetch("/api/items/list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itemData),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to create listing");
      }

      const data = await response.json();
      return data.data.item;
    } catch (error) {
      console.error("Error listing item:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { listItem, isSubmitting };
};

export default useListItem;
