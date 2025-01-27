import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ItemCard from "../components/ItemCard";
import ItemForm from "../components/ItemForm";
import useItemForm from "../hooks/useItemForm";
import UseDeleteItem from "../hooks/UseDeleteItem.jsx";
import toast from "react-hot-toast";
import AddItemButton from "../components/AddItemButton";

const MyListingsPage = () => {
  const [myListings, setMyListings] = useState([]);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filteredListings, setFilteredListings] = useState([]);
  const navigate = useNavigate();
  const { isDeleting, confirmDelete } = UseDeleteItem();

  const handleFormSuccess = (item, isEdit) => {
    if (isEdit) {
      setMyListings((prevListings) =>
        prevListings.map((listing) =>
          listing._id === item._id ? item : listing
        )
      );
      setIsEditFormOpen(false);
    } else {
      setMyListings((prevListings) => [item, ...prevListings]);
      setIsCreateFormOpen(false);
    }
  };

  const {
    formData,
    isSubmitting,
    handleInputChange,
    handleImageUpload,
    removeImage,
    handleSubmit,
    resetForm,
    setInitialData,
  } = useItemForm(handleFormSuccess);

  // Fetch user's listings
  useEffect(() => {
    const fetchUserListings = async () => {
      try {
        const response = await fetch("/api/items/my-items");

        if (!response.ok) {
          throw new Error("Failed to fetch listings");
        }

        const data = await response.json();
        setMyListings(data.data.items);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserListings();
  }, []);

  useEffect(() => {
    if (!myListings.length) {
      setFilteredListings([]);
      return;
    }

    let sorted = [...myListings];

    // Apply sorting
    if (sortBy === "newest") {
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "oldest") {
      sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    // Apply filtering
    if (filterType) {
      sorted = sorted.filter((item) => item.type.toLowerCase() === filterType);
    }

    setFilteredListings(sorted);
  }, [myListings, sortBy, filterType]);

  const handleEditClick = (e, item) => {
    setInitialData({
      id: item._id,
      type: item.type,
      title: item.title,
      category: item.category.toLowerCase(),
      location: item.location,
      description: item.description,
      images: item.images || [],
    });
    setIsEditFormOpen(true);
  };

  const handleDeleteClick = async (e, item) => {
    e.stopPropagation(); // Prevent item click event
    confirmDelete(item._id, () => {
      setMyListings((prevListings) =>
        prevListings.filter((listing) => listing._id !== item._id)
      );
    });
  };

  const handleItemClick = (itemId) => {
    navigate(`/item/${itemId}`);
  };

  const handleSort = (e) => {
    setSortBy(e.target.value);
  };

  const handleFilter = (e) => {
    setFilterType(e.target.value);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2f256e] mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading your listings...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center text-red-600 dark:text-red-400">
          <p>Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-[#2f256e] text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#111826] dark:to-[#111826]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Enhanced Header Section */}
        <div className="mb-6 sm:mb-10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2 font-heading">
                Your Listed Items
              </h1>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
                Manage all your lost and found items in one place
              </p>
            </div>
            <div className="flex items-center">
              <div className="bg-white dark:bg-gray-800 rounded-lg px-4 py-3 shadow-sm w-full sm:w-auto">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Total Items
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {myListings.length}
                </p>
              </div>
            </div>
          </div>

          {/* Filter and Sort Controls */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <select
                  value={sortBy}
                  className="w-full sm:w-[180px] bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-[#2f256e] focus:border-[#2f256e] p-2.5"
                  onChange={handleSort}
                >
                  <option value="">Sort by</option>
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
                <select
                  value={filterType}
                  className="w-full sm:w-[180px] bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-[#2f256e] focus:border-[#2f256e] p-2.5"
                  onChange={handleFilter}
                >
                  <option value="">All Types</option>
                  <option value="lost">Lost Items</option>
                  <option value="found">Found Items</option>
                </select>
              </div>
            </div>
            <button
              onClick={() => setIsCreateFormOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-[#2f256e] text-white rounded-lg hover:bg-[#241c58] transition-colors shadow-md hover:shadow-lg"
            >
              <svg
                className="w-5 h-5 mr-2"
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
              Create New Listing
            </button>
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredListings.map((item) => (
            <div
              key={item._id}
              onClick={() => handleItemClick(item._id)}
              className="cursor-pointer"
            >
              <ItemCard
                item={item}
                isMyListing={true}
                onEditClick={(e) => handleEditClick(e, item)}
                onDeleteClick={(e) => handleDeleteClick(e, item)}
              />
            </div>
          ))}
        </div>

        {/* Enhanced Empty State */}
        {filteredListings.length === 0 && (
          <div className="text-center py-12 sm:py-16 px-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="max-w-md mx-auto">
              {myListings.length > 0 ? (
                <>
                  <svg
                    className="mx-auto h-12 sm:h-16 w-12 sm:w-16 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 48 48"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h32M8 24h32M8 36h16"
                    />
                  </svg>
                  <h3 className="mt-4 text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                    No Matching Items
                  </h3>
                  <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                    Try adjusting your filters to see more items
                  </p>
                  <button
                    onClick={() => {
                      setSortBy("");
                      setFilterType("");
                    }}
                    className="mt-6 w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-[#2f256e] text-white rounded-lg hover:bg-[#241c58] transition-colors shadow-md hover:shadow-lg"
                  >
                    Clear Filters
                  </button>
                </>
              ) : (
                <>
                  <svg
                    className="mx-auto h-12 sm:h-16 w-12 sm:w-16 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 48 48"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h32M8 24h32M8 36h16"
                    />
                  </svg>
                  <h3 className="mt-4 text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                    No Listings Yet
                  </h3>
                  <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                    Get started by creating your first listing. It only takes a
                    few minutes!
                  </p>
                  <button
                    onClick={() => setIsCreateFormOpen(true)}
                    className="mt-6 w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-[#2f256e] text-white rounded-lg hover:bg-[#241c58] transition-colors shadow-md hover:shadow-lg"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
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
                    Create Your First Listing
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Create Form Modal */}
        {isCreateFormOpen && (
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
              setIsCreateFormOpen(false);
              resetForm();
            }}
            isSubmitting={isSubmitting}
            title="Create New Listing"
            submitButtonText="Create Listing"
          />
        )}

        {/* Edit Form Modal */}
        {isEditFormOpen && (
          <ItemForm
            formData={formData}
            onInputChange={handleInputChange}
            onImageUpload={handleImageUpload}
            removeImage={removeImage}
            onSubmit={(e) => {
              handleSubmit(e, true, formData.id).then((success) => {
                if (success) {
                  resetForm();
                }
              });
            }}
            onClose={() => {
              setIsEditFormOpen(false);
              resetForm();
            }}
            isSubmitting={isSubmitting}
            title="Edit Item"
            submitButtonText="Save Changes"
          />
        )}

        {/* Enhanced Floating Action Button */}
        {myListings.length > 0 && (
          <AddItemButton
            onClick={() => setIsCreateFormOpen(true)}
            isFormOpen={isCreateFormOpen || isEditFormOpen}
          />
        )}
      </div>
    </div>
  );
};

export default MyListingsPage;
