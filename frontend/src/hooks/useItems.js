import { useState, useEffect } from "react";

const useItems = (
  activeTab,
  selectedCategory,
  searchQuery,
  dateRange,
  locationFilter
) => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Only send non-empty search queries
        const searchTerm = searchQuery.trim() || undefined;

        const response = await fetch("/api/items/all-items", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: activeTab,
            category: selectedCategory,
            search: searchTerm,
            dateRange: dateRange !== "all" ? dateRange : undefined,
            location: locationFilter.trim() || undefined,
          }),
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch items");
        }

        const data = await response.json();
        if (data.status === "success") {
          setItems(data.data.items);
        } else {
          throw new Error(data.message || "Failed to fetch items");
        }
      } catch (err) {
        console.error("Error fetching items:", err);
        setError("Failed to load items. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchItems();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [activeTab, selectedCategory, searchQuery, dateRange, locationFilter]);

  return { items, setItems, isLoading, error };
};

export default useItems;
