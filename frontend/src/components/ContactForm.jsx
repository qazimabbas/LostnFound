import React, { useState } from "react";
import { showSuccessToast } from "./CustomToast";

const ContactForm = () => {
  // Add state for form fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // Add change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Update submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    // Clear all form fields
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
    // Show success toast
    showSuccessToast("Message sent successfully!");
  };

  return (
    <section className="bg-background-light dark:bg-background-dark py-16 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-light dark:text-[#361d7a] mb-4">
          GET IN TOUCH
        </h2>
        <div className="w-24 h-1 bg-primary-light dark:bg-[#361d7a] mx-auto rounded-full mb-4" />
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Have questions or feedback? We'd love to hear from you. Send us a
          message and we'll respond as soon as possible.
        </p>
      </div>

      {/* Form Container */}
      <div className="max-w-4xl mx-auto bg-white dark:bg-card-dark rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100 dark:border-gray-800">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Input */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                  focus:ring-2 focus:ring-primary-light dark:focus:ring-[#361d7a] 
                  focus:border-transparent outline-none transition-all duration-200
                  placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="Your name"
                required
              />
            </div>

            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                  focus:ring-2 focus:ring-primary-light dark:focus:ring-[#361d7a] 
                  focus:border-transparent outline-none transition-all duration-200
                  placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          {/* Subject Input */}
          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                focus:ring-2 focus:ring-primary-light dark:focus:ring-[#361d7a] 
                focus:border-transparent outline-none transition-all duration-200
                placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="What is this about?"
              required
            />
          </div>

          {/* Message Input */}
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                focus:ring-2 focus:ring-primary-light dark:focus:ring-[#361d7a] 
                focus:border-transparent outline-none transition-all duration-200 resize-none
                placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="Your message..."
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="inline-flex items-center justify-center px-8 py-3 
                text-base font-medium rounded-lg text-white 
                bg-primary-light dark:bg-[#361d7a]
                hover:opacity-90 transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-offset-2 
                focus:ring-primary-light dark:focus:ring-[#361d7a]"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContactForm;
