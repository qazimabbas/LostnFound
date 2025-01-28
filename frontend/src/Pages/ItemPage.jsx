import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiMapPin,
  FiCalendar,
  FiTag,
  FiChevronLeft,
  FiChevronRight,
  FiEdit2,
  FiMessageSquare,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import notAvailableImage from "/not_available.jpg";
import { useRecoilValue } from "recoil";
import { userAtom } from "../atoms/userAtom";
import ItemForm from "../components/ItemForm";
import useItemForm from "../hooks/useItemForm";
import useDeleteItem from "../hooks/UseDeleteItem";
import { showSuccessToast, showErrorToast } from "../components/CustomToast";
// import useDeleteItem from "../hooks/useDeleteItem";

const ItemPage = () => {
  const { id } = useParams();
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useRecoilValue(userAtom);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const navigate = useNavigate();
  const [responseMessage, setResponseMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const { isDeleting, confirmDelete } = useDeleteItem();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/items/item/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch item details");
        }

        const data = await response.json();
        if (!data || !data.data) {
          throw new Error("Invalid response format");
        }

        const item = data.data.item;
        setItem(item);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleFormSuccess = (updatedItem) => {
    setItem(updatedItem);
    setIsEditFormOpen(false);
  };

  const {
    formData,
    isSubmitting: itemFormIsSubmitting,
    handleInputChange,
    handleImageUpload,
    removeImage,
    handleSubmit,
    resetForm,
    setInitialData,
  } = useItemForm(handleFormSuccess);

  const handleEditClick = () => {
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

  const handleDeleteClick = () => {
    confirmDelete(item._id);
  };

  const handleSubmitResponse = async (e) => {
    e.preventDefault();

    if (!user) {
      showErrorToast("Please login to submit a response");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemId: id,
          message: responseMessage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.existingResponseId) {
          // Case: User has a rejected response
          showErrorToast(data.message || "Failed to submit response");
          return;
        }
        throw new Error(data.message || "Failed to submit response");
      }

      showSuccessToast("Response submitted successfully!");
      setShowResponseForm(false);
      setResponseMessage("");
    } catch (error) {
      showErrorToast(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewResponses = () => {
    if (item.type === "lost") {
      navigate("/responses", { state: { activeTab: "receivedResponses" } });
    } else {
      navigate("/responses", { state: { activeTab: "receivedClaims" } });
    }
  };

  useEffect(() => {
    if (showGalleryModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showGalleryModal]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#111826] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-light dark:border-[#361d7a]"></div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!item) {
    return <div>Loading...</div>;
  }

  const isOwner = user?._id === item?.user?._id;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-[#111826] dark:to-[#111826]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 sm:gap-6">
          {/* Image Box */}
          <div
            className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden
          border border-gray-200 dark:border-gray-700"
          >
            <div className="relative bg-gray-100 dark:bg-gray-700/30 h-[400px] sm:h-[450px] md:h-[500px]">
              <div className="absolute inset-0">
                <img
                  src={
                    item.images?.length > 0 && item.images[selectedImage]
                      ? item.images[selectedImage]
                      : notAvailableImage
                  }
                  alt={item.title}
                  className="w-full h-full object-contain bg-gray-100 dark:bg-gray-700/30 cursor-pointer"
                  onClick={() => setShowGalleryModal(true)}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = notAvailableImage;
                  }}
                />
              </div>

              {/* Image Navigation */}
              {item.images?.length > 1 && (
                <>
                  {/* Image Counter */}
                  <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-black/30 backdrop-blur-md px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
                    <p className="text-white text-xs sm:text-sm font-medium">
                      {selectedImage + 1} / {item.images.length}
                    </p>
                  </div>

                  {/* Navigation Arrows */}
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 sm:px-3">
                    <button
                      onClick={() =>
                        setSelectedImage((prev) =>
                          prev === 0 ? item.images.length - 1 : prev - 1
                        )
                      }
                      className="p-2 sm:p-1.5 rounded-full bg-black/30 backdrop-blur-md text-white hover:bg-black/50 transition-all transform hover:scale-110"
                    >
                      <FiChevronLeft size={20} />
                    </button>
                    <button
                      onClick={() =>
                        setSelectedImage((prev) =>
                          prev === item.images.length - 1 ? 0 : prev + 1
                        )
                      }
                      className="p-2 sm:p-1.5 rounded-full bg-black/30 backdrop-blur-md text-white hover:bg-black/50 transition-all transform hover:scale-110"
                    >
                      <FiChevronRight size={20} />
                    </button>
                  </div>

                  {/* Thumbnail Strip */}
                  <div className="hidden sm:block absolute bottom-3 inset-x-3">
                    <div className="bg-black/30 backdrop-blur-md p-2 rounded-xl">
                      <div className="flex gap-2 justify-center">
                        {item.images.map((image, index) => (
                          <button
                            key={index}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedImage(index);
                              setShowGalleryModal(true);
                            }}
                            className={`relative rounded-lg overflow-hidden w-10 sm:w-12 h-10 sm:h-12 transition-transform ${
                              selectedImage === index
                                ? "ring-2 ring-white transform scale-110"
                                : "opacity-70 hover:opacity-100"
                            }`}
                          >
                            <img
                              src={item.images[index] || notAvailableImage}
                              alt={`${item.title} - ${index + 1}`}
                              className="w-full h-full object-contain bg-gray-100 dark:bg-gray-700/30"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = notAvailableImage;
                              }}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Details Box */}
          <div className="lg:col-span-2">
            <div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-5 space-y-4 sm:space-y-5 
              lg:sticky lg:top-6 min-h-0 lg:min-h-[500px]
              border border-gray-200 dark:border-gray-700"
            >
              {/* Status Badge & Date */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span
                  className={`px-2.5 py-1 rounded-full text-xs sm:text-sm font-medium ${
                    item.type === "lost"
                      ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200"
                      : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200"
                  }`}
                >
                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)} Item
                </span>
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <FiCalendar className="mr-1.5" size={14} />
                  <span className="text-xs sm:text-sm">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {item.title}
              </h1>

              {/* Key Details */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <FiTag className="mr-2 flex-shrink-0" size={16} />
                  <span className="text-xs sm:text-sm truncate">
                    {item.category}
                  </span>
                </div>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <FiMapPin className="mr-2 flex-shrink-0" size={16} />
                <span className="text-xs sm:text-sm truncate">
                  {item.location}
                </span>
              </div>
              {/* Description */}
              <div>
                <h2 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-2">
                  Description
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Additional Details */}
              {item.additionalDetails &&
                Object.keys(item.additionalDetails).length > 0 && (
                  <div>
                    <h2 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
                      Item Specifications
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      {Object.entries(item.additionalDetails).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="bg-gray-50 dark:bg-gray-700/50 p-2 sm:p-3 rounded-lg"
                          >
                            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 capitalize mb-0.5 sm:mb-1">
                              {key.replace(/([A-Z])/g, " $1").trim()}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-900 dark:text-white">
                              {value}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* Owner Card */}
              <div className="border-t dark:border-gray-700 pt-4 sm:pt-5">
                <div className="flex flex-col gap-4">
                  {!isOwner ? (
                    <>
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            item.user?.profilePic ||
                            "https://via.placeholder.com/40"
                          }
                          alt={item.user?.name}
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full ring-2 ring-gray-200 dark:ring-gray-700"
                        />
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white text-xs sm:text-sm">
                            {item.user?.name}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Member since{" "}
                            {new Date(
                              item.user?.createdAt
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowResponseForm(true)}
                        className="w-full px-4 py-2 bg-[#2f256e] hover:bg-[#241c58]
                          text-white text-xs sm:text-sm rounded-lg font-medium 
                          shadow-md shadow-[#2f256e]/20 dark:shadow-[#241c58]/20 transition-colors"
                      >
                        {item.type === "lost"
                          ? "I Found This Item"
                          : "This is My Item"}
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                        Listing Actions
                      </h3>
                      <div className="grid grid-cols-1 gap-2">
                        <button
                          onClick={handleEditClick}
                          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600
                            text-gray-700 dark:text-gray-200 text-xs sm:text-sm rounded-lg font-medium 
                            hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors
                            flex items-center justify-center gap-2"
                        >
                          <FiEdit2 className="w-4 h-4" />
                          <span>Edit Listing</span>
                        </button>
                        <button
                          onClick={handleViewResponses}
                          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600
                            text-gray-700 dark:text-gray-200 text-xs sm:text-sm rounded-lg font-medium 
                            hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors
                            flex items-center justify-center gap-2"
                        >
                          <FiMessageSquare className="w-4 h-4" />
                          <span>View Responses</span>
                        </button>
                        <button
                          onClick={handleDeleteClick}
                          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600
                            text-red-600 dark:text-red-400 text-xs sm:text-sm rounded-lg font-medium 
                            hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors
                            flex items-center justify-center gap-2"
                        >
                          <FiTrash2 className="w-4 h-4" />
                          <span>Delete Listing</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Response Form Modal */}
      {showResponseForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl w-full max-w-lg mx-4 p-5 sm:p-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {item.type === "lost"
                ? "Submit Found Item Response"
                : "Submit Claim"}
            </h2>
            <form onSubmit={handleSubmitResponse} className="space-y-4">
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                  disabled={isSubmitting}
                  rows="4"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                    focus:ring-2 focus:ring-primary-light dark:focus:ring-[#361d7a] 
                    focus:border-transparent outline-none transition-all duration-200"
                  placeholder={
                    item.type === "lost"
                      ? "Provide details about how you found this item..."
                      : "Please provide identification marks or proof of ownership for this item..."
                  }
                  required
                ></textarea>
              </div>
              <div className="flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowResponseForm(false);
                  }}
                  className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm bg-primary-light dark:bg-[#361d7a] text-white rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add the Edit Form Modal */}
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
          isSubmitting={itemFormIsSubmitting}
          title="Edit Item"
          submitButtonText="Save Changes"
        />
      )}

      {/* Image Gallery Modal */}
      {showGalleryModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 overflow-y-auto">
          {/* Close button */}
          <button
            onClick={() => setShowGalleryModal(false)}
            className="fixed top-4 right-4 p-2 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-colors"
          >
            <FiX size={24} />
          </button>

          <div className="min-h-screen w-full p-4 sm:p-8 flex items-center justify-center">
            <div className="w-full max-w-6xl space-y-6">
              {/* Main selected image */}
              <div className="w-full flex items-center justify-center">
                <img
                  src={item.images?.[selectedImage] || notAvailableImage}
                  alt={`${item.title} - ${selectedImage + 1}`}
                  className="max-h-[70vh] w-auto object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = notAvailableImage;
                  }}
                />
              </div>

              {/* Thumbnail strip */}
              {item.images?.length > 1 && (
                <div className="flex justify-center gap-2 flex-wrap">
                  {item.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative rounded-lg overflow-hidden h-20 sm:h-24 transition-transform ${
                        selectedImage === index
                          ? "ring-2 ring-white transform scale-105"
                          : "opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={image || notAvailableImage}
                        alt={`${item.title} - ${index + 1}`}
                        className="h-full w-auto object-contain"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = notAvailableImage;
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemPage;
