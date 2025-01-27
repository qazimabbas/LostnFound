import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FiTrash2 } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import {
  showSuccessToast,
  showErrorToast,
  showConfirmationDialog,
} from "../components/CustomToast";

const getStatusBadge = (status) => {
  const statusStyles = {
    approved:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200",
    in_moderation:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200",
    rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200",
    pending: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200",
    disapproved: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200",
  };

  const statusText = {
    approved: "Approved",
    in_moderation: "In Moderation",
    rejected: "Rejected",
    pending: "Pending",
    disapproved: "Disapproved",
  };

  return (
    <span
      className={`px-2 py-1 text-xs rounded-full ${
        statusStyles[status] || statusStyles.pending
      }`}
    >
      {statusText[status] || "Pending"}
    </span>
  );
};

const getItemTypeBadge = (type) => {
  const typeStyles = {
    lost: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 ring-1 ring-red-200 dark:ring-red-800",
    found:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 ring-1 ring-green-200 dark:ring-green-800",
  };

  return (
    <span
      className={`px-2 py-0.5 text-xs font-medium rounded-full ${typeStyles[type]}`}
    >
      {type === "lost" ? "Lost Item" : "Found Item"}
    </span>
  );
};

const ContactInfoModal = ({ isOpen, onClose, contactInfo, type }) => {
  if (!isOpen) return null;

  const userInfo = type === "sent" ? contactInfo.receiver : contactInfo.sender;

  // Helper function to get the correct role text
  const getRoleText = () => {
    if (type === "sent") {
      return contactInfo.item?.type === "lost" ? "Item Owner" : "Item Finder";
    } else if (type === "claim") {
      return "Claimant";
    } else {
      return "Finder";
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative flex min-h-full items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-sm w-full transform transition-all relative">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Contact Information
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="px-6 py-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative">
                <img
                  src={
                    userInfo?.profilePic ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      userInfo?.name || "User"
                    )}`
                  }
                  alt={userInfo?.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 bg-green-500"></div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {userInfo?.name}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {getRoleText()}
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="group">
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                  Email Address
                </label>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg group-hover:bg-gray-100 dark:group-hover:bg-gray-700 transition-colors">
                  <div className="flex-1 text-sm text-gray-900 dark:text-white font-medium">
                    {userInfo?.email}
                  </div>
                  <button
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(userInfo?.email);
                        showSuccessToast("Email copied to clipboard!");
                      } catch (error) {
                        showErrorToast("Failed to copy email to clipboard");
                      }
                    }}
                    className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                  Phone Number
                </label>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg group-hover:bg-gray-100 dark:group-hover:bg-gray-700 transition-colors">
                  <div className="flex-1 text-sm text-gray-900 dark:text-white font-medium">
                    {userInfo?.phoneNo}
                  </div>
                  <button
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(userInfo?.phoneNo);
                        showSuccessToast("Phone number copied to clipboard!");
                      } catch (error) {
                        showErrorToast(
                          "Failed to copy phone number to clipboard"
                        );
                      }
                    }}
                    className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="w-full px-4 py-2.5 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ResponseCard = ({ data, type, onStatusUpdate, onDelete }) => {
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [processingAction, setProcessingAction] = useState(null);

  const handleViewDetails = () => {
    // Allow viewing details for responses to lost items and received claims without status check
    if (type === "sent" && data.status !== "approved") {
      toast.error(
        data.status === "rejected"
          ? "Cannot view details of rejected responses"
          : "Cannot view details until the response is approved"
      );
      return;
    }

    setShowContactInfo(true);
  };

  const handleStatusUpdate = async (status) => {
    if (processingAction) return;
    setProcessingAction(status === "approved" ? "approve" : "reject");
    try {
      await onStatusUpdate(data._id, status);
    } finally {
      setProcessingAction(null);
    }
  };

  return (
    <>
      <div className="group bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 transition-all duration-200 max-w-[95%] sm:max-w-none mx-auto overflow-hidden">
        <div className="p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:gap-5">
          {/* Image Container */}
          <div className="flex-shrink-0 w-full sm:w-auto flex justify-center sm:block">
            <div className="relative group-hover:scale-105 transition-transform duration-200">
              <img
                src={data.item?.images?.[0] || "./src/assets/not_available.jpg"}
                alt={data.item?.title || data.itemTitle}
                className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-lg bg-gray-100 dark:bg-gray-700 ring-1 ring-gray-200 dark:ring-gray-600"
              />
              {type === "sent" && data.item?.type && (
                <div className="absolute -top-1 -right-1">
                  {getItemTypeBadge(data.item.type)}
                </div>
              )}
            </div>
          </div>

          {/* Content Container */}
          <div className="flex-1 min-w-0 flex flex-col sm:py-0.5">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="text-center sm:text-left">
                <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white line-clamp-1 group-hover:text-[#2f256e] dark:group-hover:text-purple-400 transition-colors">
                    {data.item?.title || data.itemTitle}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span className="line-clamp-1">
                      {type === "sent"
                        ? `To: ${data.receiver?.name || data.owner}`
                        : type === "claim"
                        ? `From: ${data.sender?.name}`
                        : `From: ${data.sender?.name || data.responder}`}
                    </span>
                    <span className="hidden sm:block h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                    <span className="hidden sm:block text-gray-400 dark:text-gray-500">
                      {new Date(
                        data.createdAt || data.responseDate
                      ).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0 self-center">
                {getStatusBadge(data.status)}
              </div>
            </div>

            {/* Message Container */}
            <div className="mt-2 sm:mt-3">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2.5 max-h-20 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent backdrop-blur-sm border border-gray-100/80 dark:border-gray-600/20">
                <p className="text-xs text-gray-600 dark:text-gray-300 whitespace-pre-wrap break-words">
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {type === "sent"
                      ? "Your message: "
                      : type === "claim"
                      ? "Claim message: "
                      : "Response message: "}
                  </span>
                  {data.message}
                </p>
              </div>
            </div>

            {/* Actions Container */}
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/80 flex flex-wrap sm:flex-nowrap items-stretch sm:items-center justify-end gap-2">
              {data.status === "pending" && type !== "sent" && (
                <>
                  <button
                    onClick={() => handleStatusUpdate("approved")}
                    disabled={processingAction !== null}
                    className={`px-2.5 py-1 text-xs font-medium bg-green-600 text-white rounded hover:bg-green-700 transition-all duration-200 ${
                      processingAction !== null
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    } hover:shadow-sm hover:shadow-green-600/10`}
                  >
                    {processingAction === "approve"
                      ? "..."
                      : type === "claim"
                      ? "Approve"
                      : "Accept"}
                  </button>
                  <button
                    onClick={() => handleStatusUpdate("rejected")}
                    disabled={processingAction !== null}
                    className={`px-2.5 py-1 text-xs font-medium bg-red-600 text-white rounded hover:bg-red-700 transition-all duration-200 ${
                      processingAction !== null
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    } hover:shadow-sm hover:shadow-red-600/10`}
                  >
                    {processingAction === "reject"
                      ? "..."
                      : type === "claim"
                      ? "Reject"
                      : "Decline"}
                  </button>
                </>
              )}
              <button
                onClick={handleViewDetails}
                className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200
                    ${
                      type !== "sent" || data.status === "approved"
                        ? "bg-[#2f256e] text-white hover:bg-[#241c58] hover:shadow-sm hover:shadow-[#2f256e]/10"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
              >
                {showContactInfo
                  ? "Hide Contact"
                  : type === "sent"
                  ? data.item?.type === "lost"
                    ? "View Owner"
                    : "View Finder"
                  : type === "claim"
                  ? "View Claimant"
                  : "View Finder"}
              </button>
              <button
                onClick={() => onDelete(data._id)}
                disabled={isDeleting}
                className="flex-1 sm:flex-none px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-md transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                <FiTrash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info Modal */}
      <ContactInfoModal
        isOpen={showContactInfo}
        onClose={() => setShowContactInfo(false)}
        contactInfo={data}
        type={type}
      />
    </>
  );
};

const ResponsesPage = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(
    location.state?.activeTab || "myResponses"
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [myResponses, setMyResponses] = useState([]);
  const [receivedResponses, setReceivedResponses] = useState([]);
  const [receivedClaims, setReceivedClaims] = useState([]);
  const [pendingClaimsCount, setPendingClaimsCount] = useState(0);
  const [pendingResponsesCount, setPendingResponsesCount] = useState(0);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Dummy data for responses you've sent
  const myResponsesDummy = [
    {
      id: 1,
      itemTitle: "Black iPhone 13",
      itemImage: "https://via.placeholder.com/150",
      responseDate: "2024-03-15",
      message:
        "I think I found your iPhone at the library. It matches your description.",
      status: "approved",
      owner: "John Doe",
    },
    {
      id: 2,
      itemTitle: "Gold Watch",
      itemImage: "https://via.placeholder.com/150",
      responseDate: "2024-03-14",
      message:
        "I found a similar watch at Central Park. Please check if it's yours.",
      status: "in_moderation",
      owner: "Sarah Smith",
    },
    {
      id: 3,
      itemTitle: "Laptop Bag",
      itemImage: "https://via.placeholder.com/150",
      responseDate: "2024-03-13",
      message: "I have your laptop bag. It was left at the coffee shop.",
      status: "disapproved",
      owner: "Mike Johnson",
    },
  ];

  // Dummy data for claims received on your found items
  const receivedClaimsDummy = [
    {
      id: 1,
      itemTitle: "Found AirPods Pro",
      itemImage: "https://via.placeholder.com/150",
      claimDate: "2024-03-15",
      claimant: "Alice Brown",
      message:
        "Those are my AirPods! I can provide the serial number for verification.",
      status: "pending",
    },
    {
      id: 2,
      itemTitle: "Found Student ID",
      itemImage: "https://via.placeholder.com/150",
      claimDate: "2024-03-14",
      claimant: "Tom Wilson",
      message: "That's my student ID. I can verify my identity in person.",
      status: "approved",
    },
  ];

  // New dummy data for responses received on lost items
  const receivedResponsesDummy = [
    {
      id: 1,
      itemTitle: "Lost MacBook Pro",
      itemImage: "https://via.placeholder.com/150",
      responseDate: "2024-03-16",
      responder: "Emily Chen",
      message:
        "I found a MacBook Pro matching your description at the university library. It has the stickers you mentioned.",
      status: "pending",
    },
    {
      id: 2,
      itemTitle: "Lost Blue Backpack",
      itemImage: "https://via.placeholder.com/150",
      responseDate: "2024-03-15",
      responder: "David Wilson",
      message:
        "I think I saw your backpack at the gym. Please check if it matches yours.",
      status: "approved",
    },
  ];

  const handleDelete = async (responseId) => {
    showConfirmationDialog({
      message: "Are you sure you want to delete this response?",
      onConfirm: async () => {
        // First update the UI optimistically
        const removeFromList = (list) =>
          list.filter((r) => r._id !== responseId);

        setMyResponses((prev) => removeFromList(prev));
        setReceivedClaims((prev) => removeFromList(prev));
        setReceivedResponses((prev) => removeFromList(prev));

        // Show success message immediately
        showSuccessToast("Response deleted successfully");

        try {
          // Make API call in background without loading state
          const response = await fetch(`/api/responses/${responseId}`, {
            method: "DELETE",
          });

          if (!response.ok) {
            throw new Error("Failed to delete response");
          }
        } catch (error) {
          // If API call fails, show error and revert changes
          showErrorToast("Failed to delete response. Please try again.");
          fetchResponses(); // Only refetch if API call fails
        }
      },
    });
  };

  // Move fetchResponses function outside useEffect for reusability
  const fetchResponses = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [sentRes, receivedRes, claimsRes] = await Promise.all([
        fetch("/api/responses/sent"),
        fetch("/api/responses/received"),
        fetch("/api/responses/claims"),
      ]);

      if (!sentRes.ok || !receivedRes.ok || !claimsRes.ok) {
        throw new Error("Failed to fetch responses");
      }

      const [sentData, receivedData, claimsData] = await Promise.all([
        sentRes.json(),
        receivedRes.json(),
        claimsRes.json(),
      ]);

      setMyResponses(sentData.data);
      setReceivedResponses(receivedData.data);
      setReceivedClaims(claimsData.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResponses();
  }, []);

  useEffect(() => {
    setPendingClaimsCount(
      receivedClaims.filter((claim) => claim.status === "pending").length
    );
    setPendingResponsesCount(
      receivedResponses.filter((response) => response.status === "pending")
        .length
    );
  }, [receivedClaims, receivedResponses]);

  const handleStatusUpdate = async (responseId, status) => {
    try {
      const response = await fetch(`/api/responses/${responseId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      // Refresh the responses to show updated status
      const data = await response.json();

      // Update the corresponding list based on the response type
      if (status === "rejected") {
        showSuccessToast("Response rejected");
      } else {
        showSuccessToast("Response approved");
      }

      // Update the lists to reflect the new status
      setMyResponses((prev) =>
        prev.map((r) => (r._id === responseId ? { ...r, status } : r))
      );
      setReceivedResponses((prev) =>
        prev.map((r) => (r._id === responseId ? { ...r, status } : r))
      );
      setReceivedClaims((prev) =>
        prev.map((r) => (r._id === responseId ? { ...r, status } : r))
      );
    } catch (error) {
      showErrorToast(error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-light dark:border-[#361d7a]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p>Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary-light dark:bg-[#361d7a] text-white rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-4 sm:mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Responses & Claims
            </h1>
            <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Track your responses and manage item claims
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsLoading(true);
                fetchResponses();
              }}
              disabled={isLoading}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full transition-colors"
            >
              <svg
                className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
            {/* Mobile menu button - only visible on small screens */}
            <div className="relative md:hidden">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
                </svg>
              </button>
              {showMobileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-50">
                  {[
                    { id: "myResponses", label: "My Responses" },
                    {
                      id: "receivedClaims",
                      label: "Claim Responses",
                      count: pendingClaimsCount,
                    },
                    {
                      id: "receivedResponses",
                      label: "Find Responses",
                      count: pendingResponsesCount,
                    },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setShowMobileMenu(false);
                      }}
                      className="w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between"
                    >
                      <span>{tab.label}</span>
                      {tab.count > 0 && (
                        <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs - Hidden on mobile, visible on md and above */}
        <div className="hidden md:block mb-8">
          <div className="relative">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#2f256e]/5 via-purple-500/5 to-[#2f256e]/5 dark:from-[#2f256e]/10 dark:via-purple-500/10 dark:to-[#2f256e]/10 rounded-xl blur-xl"></div>

            <div className="relative flex items-center gap-3 p-1.5 bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-xl border border-gray-200/80 dark:border-gray-700/80 shadow-lg shadow-purple-500/5">
              {[
                {
                  id: "myResponses",
                  label: "My Responses",
                  icon: (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  ),
                },
                {
                  id: "receivedClaims",
                  label: "Claim Responses",
                  count: pendingClaimsCount,
                  icon: (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ),
                },
                {
                  id: "receivedResponses",
                  label: "Find Responses",
                  count: pendingResponsesCount,
                  icon: (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  ),
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex-1 flex items-center justify-center gap-2.5 px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? "text-[#2f256e] dark:text-white bg-white dark:bg-gray-800 shadow-md shadow-purple-500/5 ring-1 ring-purple-500/10 dark:ring-purple-400/10"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-gray-800/80"
                  }`}
                >
                  {/* Icon */}
                  <span
                    className={`transition-colors duration-200 ${
                      activeTab === tab.id
                        ? "text-[#2f256e] dark:text-purple-400"
                        : "text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400"
                    }`}
                  >
                    {tab.icon}
                  </span>

                  {/* Label */}
                  <span className="relative">
                    {tab.label}
                    {activeTab === tab.id && (
                      <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-[#2f256e] to-purple-500 dark:from-purple-400 dark:to-purple-500 rounded-full"></span>
                    )}
                  </span>

                  {/* Counter Badge */}
                  {tab.count > 0 && (
                    <span
                      className={`absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-medium transition-colors ${
                        activeTab === tab.id
                          ? "bg-[#2f256e] text-white dark:bg-purple-400 dark:text-gray-900"
                          : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Active Tab Indicator */}
        <div className="md:hidden mb-4 px-2">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
            {activeTab === "myResponses" && "My Responses"}
            {activeTab === "receivedClaims" && (
              <>
                Claim Responses
                {pendingClaimsCount > 0 && (
                  <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                    {pendingClaimsCount}
                  </span>
                )}
              </>
            )}
            {activeTab === "receivedResponses" && (
              <>
                Find Responses
                {pendingResponsesCount > 0 && (
                  <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                    {pendingResponsesCount}
                  </span>
                )}
              </>
            )}
          </h2>
        </div>

        {/* Content */}
        <div className="space-y-3 sm:space-y-4">
          {activeTab === "myResponses" &&
            myResponses.map((response) => (
              <ResponseCard
                key={response._id || response.id}
                data={response}
                type="sent"
                onStatusUpdate={handleStatusUpdate}
                onDelete={handleDelete}
              />
            ))}

          {activeTab === "receivedClaims" &&
            receivedClaims.map((claim) => (
              <ResponseCard
                key={claim._id || claim.id}
                data={claim}
                type="claim"
                onStatusUpdate={handleStatusUpdate}
                onDelete={handleDelete}
              />
            ))}

          {activeTab === "receivedResponses" &&
            receivedResponses.map((response) => (
              <ResponseCard
                key={response._id || response.id}
                data={response}
                type="received"
                onStatusUpdate={handleStatusUpdate}
                onDelete={handleDelete}
              />
            ))}

          {/* Empty States */}
          {((activeTab === "myResponses" && myResponses.length === 0) ||
            (activeTab === "receivedClaims" && receivedClaims.length === 0) ||
            (activeTab === "receivedResponses" &&
              receivedResponses.length === 0)) && (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-base font-medium text-gray-900 dark:text-white mb-1">
                No{" "}
                {activeTab === "myResponses"
                  ? "Responses"
                  : activeTab === "receivedClaims"
                  ? "Claims"
                  : "Responses"}{" "}
                Yet
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {activeTab === "myResponses"
                  ? "You haven't responded to any lost items yet."
                  : activeTab === "receivedClaims"
                  ? "You haven't received any claims on your found items yet."
                  : "You haven't received any responses on your lost items yet."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResponsesPage;
