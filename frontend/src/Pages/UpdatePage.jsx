import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { userAtom } from "../atoms/userAtom";
import { useNavigate } from "react-router-dom";
import { showSuccessToast, showErrorToast } from "../components/CustomToast";

const UpdatePage = () => {
  const [user, setUser] = useRecoilState(userAtom);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    username: user?.username || "",
    email: user?.email || "",
    phoneNo: user?.phoneNo || "",
    password: "",
    profilePic: null,
  });

  // Keep track of initial data to compare for changes
  const [initialData] = useState({
    name: user?.name || "",
    username: user?.username || "",
    email: user?.email || "",
    phoneNo: user?.phoneNo || "",
    password: "",
    profilePic: null,
  });

  // Check for changes whenever formData updates
  useEffect(() => {
    const hasFormChanges = Object.keys(formData).some((key) => {
      // Special handling for profilePic since it's initially null
      if (key === "profilePic") {
        return formData[key] !== null;
      }
      // For password, any non-empty value is considered a change
      if (key === "password") {
        return formData[key] !== "";
      }
      return formData[key] !== initialData[key];
    });

    setHasChanges(hasFormChanges);
  }, [formData, initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePic: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hasChanges) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/users/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setUser(data);
      // Update the initialData and formData to match the new user data
      const updatedData = {
        name: data.name || "",
        username: data.username || "",
        email: data.email || "",
        phoneNo: data.phoneNo || "",
        password: "",
        profilePic: null,
      };
      setFormData(updatedData);
      // This will cause the useEffect to re-run and set hasChanges to false
      showSuccessToast("Profile updated successfully!");
    } catch (error) {
      showErrorToast(error.message || "Error updating profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 flex flex-col items-center ">
      <div className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mt-8 border border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-white">
          Update Profile
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="relative">
              <img
                src={formData.profilePic || user?.profilePic}
                alt="profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-primary-light dark:border-[#361d7a] shadow-md"
              />
              <label
                htmlFor="profilePic"
                className="absolute bottom-0 right-0 bg-primary-light dark:bg-[#361d7a] p-2 rounded-full cursor-pointer shadow-lg hover:opacity-90 transition-opacity"
                title="Change profile picture"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                <input
                  type="file"
                  id="profilePic"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="name"
                className="font-medium text-gray-700 dark:text-gray-200"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-[#361d7a]"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="username"
                className="font-medium text-gray-700 dark:text-gray-200"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-[#361d7a]"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="font-medium text-gray-700 dark:text-gray-200"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-[#361d7a]"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="phoneNo"
                className="font-medium text-gray-700 dark:text-gray-200"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNo"
                name="phoneNo"
                value={formData.phoneNo}
                onChange={handleChange}
                className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-[#361d7a]"
              />
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <label
                htmlFor="password"
                className="font-medium text-gray-700 dark:text-gray-200"
              >
                New Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Leave empty to keep current password"
                className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-[#361d7a]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!hasChanges || isLoading}
            className={`w-full mt-8 bg-primary-light dark:bg-[#361d7a] text-white py-3 rounded-lg font-medium 
              ${
                !hasChanges || isLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:opacity-90 transition-opacity"
              } 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light dark:focus:ring-[#361d7a]`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Updating...
              </div>
            ) : (
              "Update Profile"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePage;
