import React, { useState, useRef, useEffect } from "react";
import { FiSearch, FiFilter, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import ItemCard from "../components/ItemCard";
import ItemForm from "../components/ItemForm";
import useListItem from "../hooks/useListItem";
import useItems from "../hooks/useItems";
import useItemForm from "../hooks/useItemForm";
import AddItemButton from "../components/AddItemButton";

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);
  const [dateRange, setDateRange] = useState("all");
  const [locationFilter, setLocationFilter] = useState("");

  const { listItem, isSubmitting } = useListItem();
  const { items, setItems, isLoading, error } = useItems(
    activeTab === "all" ? null : activeTab,
    selectedCategory,
    searchQuery,
    dateRange,
    locationFilter
  );

  const {
    formData,
    isSubmitting: formIsSubmitting,
    handleInputChange,
    handleImageUpload,
    removeImage,
    handleSubmit,
    resetForm,
  } = useItemForm((newItem) => {
    // Determine if we should add the item based on current tab and item status
    const shouldAddItem =
      activeTab === "all" || // Add to all items tab
      (activeTab === "lost" && newItem.type === "lost") || // Add to lost tab if item is lost
      (activeTab === "found" && newItem.type === "found"); // Add to found tab if item is found

    if (shouldAddItem) {
      setItems((currentItems) => {
        // Filter based on current category if it's not "all"
        if (
          selectedCategory !== "all" &&
          newItem.category !== selectedCategory
        ) {
          return currentItems;
        }
        return [newItem, ...currentItems];
      });
    }
    setIsFormOpen(false);
    resetForm();
  });

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "electronics", label: "Electronics" },
    { value: "accessories", label: "Accessories" },
    { value: "documents", label: "Documents" },
    { value: "others", label: "Others" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const CustomDropdown = () => (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none dark:bg-gray-700 dark:text-white w-full text-left flex justify-between items-center"
      >
        <span>
          {categories.find((cat) => cat.value === selectedCategory)?.label}
        </span>
        <svg
          className="w-4 h-4 ml-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isDropdownOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
          {categories.map((category, i) => (
            <div
              key={i}
              onClick={() => {
                setSelectedCategory(category.value);
                setIsDropdownOpen(false);
              }}
              className={`px-4 py-2 cursor-pointer ${
                i === 0
                  ? "rounded-t-md"
                  : i === categories.length - 1
                  ? "rounded-b-md"
                  : ""
              } hover:bg-[#2f256e] hover:text-white transition-colors
                ${
                  selectedCategory === category.value
                    ? "bg-[#2f256e] text-white"
                    : "text-gray-700 dark:text-gray-200"
                }
              `}
            >
              {category.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const handleDateRangeChange = (e) => {
    setDateRange(e.target.value);
  };

  const handleLocationChange = (e) => {
    setLocationFilter(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 md:py-6">
          <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:items-center ">
            {/* Navigation Links */}
            <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
              <div className="flex items-center justify-between md:justify-start w-full min-w-[280px] md:w-auto md:space-x-7">
                <Link
                  to="/listings"
                  className="text-sm md:text-base text-gray-700 dark:text-gray-200 hover:text-[#2f256e] dark:hover:text-[#361d7a] font-medium whitespace-nowrap py-1.5"
                >
                  My Listings
                </Link>
                <Link
                  to="/responses"
                  className="text-sm md:text-base text-gray-700 dark:text-gray-200 hover:text-[#2f256e] dark:hover:text-[#361d7a] font-medium whitespace-nowrap py-1.5"
                >
                  Responses & Claims
                </Link>
              </div>
            </div>

            {/* Search and Filters Container */}
            <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:items-center flex-1 gap-3 md:gap-4">
              {/* Search Bar */}
              <div className="relative flex-1 min-w-0 md:max-w-md md:mx-auto">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f256e] focus:border-[#2f256e] dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Category and Filter Buttons Container */}
              <div className="flex items-center gap-3 md:gap-4 md:ml-auto">
                {/* Category Dropdown */}
                <div className="flex-1 md:flex-none md:w-[160px]">
                  <CustomDropdown />
                </div>

                {/* Filter Button */}
                <div className="relative shrink-0" ref={filterRef}>
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="flex items-center justify-center gap-2 h-[38px] px-3 md:px-4 bg-[#2f256e] text-white text-sm rounded-lg hover:bg-[#241c58] transition-colors"
                  >
                    <FiFilter className="w-4 h-4" />
                    <span className="hidden sm:inline">Filters</span>
                  </button>

                  {isFilterOpen && (
                    <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                      <div className="p-4">
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                          Filter Options
                        </h3>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1.5">
                              Date Range
                            </label>
                            <select
                              value={dateRange}
                              onChange={handleDateRangeChange}
                              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f256e] dark:bg-gray-700 dark:text-white"
                            >
                              <option value="all">All Time</option>
                              <option value="today">Today</option>
                              <option value="week">Past Week</option>
                              <option value="month">Past Month</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1.5">
                              Location
                            </label>
                            <input
                              type="text"
                              value={locationFilter}
                              onChange={handleLocationChange}
                              placeholder="Enter location..."
                              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f256e] dark:bg-gray-700 dark:text-white"
                            />
                          </div>
                        </div>

                        <div className="mt-5 flex justify-end space-x-3">
                          <button
                            onClick={() => {
                              setDateRange("all");
                              setLocationFilter("");
                              setIsFilterOpen(false);
                            }}
                            className="px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
                          >
                            Reset
                          </button>
                          <button
                            onClick={() => setIsFilterOpen(false)}
                            className="px-4 py-2 text-sm bg-[#2f256e] text-white rounded-lg hover:bg-[#241c58] transition-colors"
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
        <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto scrollbar-hide mb-6">
          <div className="flex min-w-[280px] w-full justify-between md:justify-start md:gap-2">
            {[
              { id: "all", label: "All Items" },
              { id: "lost", label: "Lost Items" },
              { id: "found", label: "Found Items" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 sm:px-4 py-2.5 text-sm font-medium transition-colors relative whitespace-nowrap
                  ${
                    activeTab === tab.id
                      ? "text-[#2f256e] dark:text-white"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }
                `}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2f256e] dark:bg-white"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2f256e]"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : items.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            No items found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {items.map((item) => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>
        )}

        <AddItemButton
          onClick={() => setIsFormOpen(true)}
          isFormOpen={isFormOpen}
        />

        {isFormOpen && (
          <ItemForm
            formData={formData}
            onInputChange={handleInputChange}
            onImageUpload={handleImageUpload}
            removeImage={removeImage}
            onSubmit={(e) => {
              handleSubmit(e, false).then((success) => {
                if (success) {
                  resetForm();
                }
              });
            }}
            onClose={() => {
              setIsFormOpen(false);
              resetForm();
            }}
            isSubmitting={formIsSubmitting}
            title="Create New Listing"
            submitButtonText="Create Listing"
          />
        )}
      </div>
    </div>
  );
};

export default HomePage;
