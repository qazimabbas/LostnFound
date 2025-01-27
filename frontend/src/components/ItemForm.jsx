import React from "react";
import { FiX } from "react-icons/fi";

const ItemForm = ({
  formData,
  onInputChange,
  onImageUpload,
  removeImage,
  onSubmit,
  onClose,
  isSubmitting,
  title,
  submitButtonText,
}) => {
  const categories = [
    { value: "electronics", label: "Electronics" },
    { value: "accessories", label: "Accessories" },
    { value: "documents", label: "Documents" },
    { value: "others", label: "Others" },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start md:items-center justify-center p-2 sm:p-4 z-50 overflow-scroll md:overflow-hidden">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl lg:max-w-4xl p-3 sm:p-4 lg:p-6 relative my-2 sm:my-4">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 lg:top-3 lg:right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <FiX className="w-5 h-5 lg:w-6 lg:h-6" />
        </button>

        <h2 className="text-lg sm:text-2xl lg:text-2xl font-semibold mb-3 sm:mb-4 lg:mb-4 text-gray-800 dark:text-white pr-8">
          {title}
        </h2>

        <form
          onSubmit={onSubmit}
          className="space-y-3 sm:space-y-4 lg:space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
            <div className="space-y-3 sm:space-y-4 lg:space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-1 gap-3 lg:gap-4">
                <div className="col-span-1 sm:col-span-1">
                  <label className="block text-sm lg:text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={onInputChange}
                    className="w-full px-3 py-2 lg:px-4 lg:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f256e] dark:bg-gray-700 dark:text-white text-sm lg:text-base"
                  >
                    <option value="lost">Lost</option>
                    <option value="found">Found</option>
                  </select>
                </div>

                <div className="col-span-1 sm:col-span-1">
                  <label className="block text-sm lg:text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={onInputChange}
                    className="w-full px-3 py-2 lg:px-4 lg:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f256e] dark:bg-gray-700 dark:text-white text-sm lg:text-base"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm lg:text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={onInputChange}
                  className="w-full px-3 py-2 lg:px-4 lg:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f256e] dark:bg-gray-700 dark:text-white text-sm lg:text-base"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm lg:text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={onInputChange}
                  className="w-full px-3 py-2 lg:px-4 lg:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f256e] dark:bg-gray-700 dark:text-white text-sm lg:text-base"
                  required
                />
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4 lg:space-y-6">
              <div>
                <label className="block text-sm lg:text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={onInputChange}
                  rows={window.innerWidth >= 768 ? "4" : "2"}
                  className="w-full px-3 py-2 lg:px-4 lg:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f256e] dark:bg-gray-700 dark:text-white text-sm lg:text-base resize-none md:min-h-[70px]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm lg:text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Images (Max 3)
                </label>
                <div className="mt-1 flex justify-center px-3 py-2 sm:px-6 lg:px-6 lg:py-4 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600 dark:text-gray-400 justify-center">
                      <label
                        htmlFor="images"
                        className="relative cursor-pointer bg-purple-50 dark:bg-gray-700 rounded-md font-medium text-[#2f256e] dark:text-[#5448a1] hover:text-[#241c58] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#2f256e] px-2 py-1 text-xs sm:text-sm"
                      >
                        <span>Upload images</span>
                        <input
                          id="images"
                          name="images"
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={onImageUpload}
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PNG, JPG, GIF up to 10MB ({3 - formData.images.length}{" "}
                      remaining)
                    </p>
                  </div>
                </div>
                {formData.images.length > 0 && (
                  <div className="mt-2 lg:mt-4 flex flex-wrap gap-2 lg:gap-3">
                    {Array.from(formData.images).map((file, index) => (
                      <div
                        key={index}
                        className="relative bg-gray-50 dark:bg-gray-700 p-1 rounded-lg"
                      >
                        <img
                          src={
                            typeof file === "string"
                              ? file
                              : URL.createObjectURL(file)
                          }
                          alt={`Preview ${index + 1}`}
                          className="h-10 w-10 sm:h-14 sm:w-14 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors"
                        >
                          <FiX className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 sm:mt-4 lg:mt-6 flex justify-end gap-2 sm:gap-3 lg:gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 lg:px-6 lg:py-2.5 text-xs sm:text-sm lg:text-base text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-3 py-1.5 lg:px-6 lg:py-2.5 text-xs sm:text-sm lg:text-base bg-[#2f256e] text-white rounded-lg transition-colors ${
                isSubmitting
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-[#241c58]"
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-3 w-3 sm:h-4 sm:w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {isSubmitting ? "Processing..." : submitButtonText}
                </div>
              ) : (
                submitButtonText
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemForm;
