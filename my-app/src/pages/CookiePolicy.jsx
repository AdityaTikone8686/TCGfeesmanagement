import React from "react";

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 bg-white p-8 rounded-xl shadow">
        <h1 className="text-3xl font-bold mb-6">Cookie Policy</h1>

        <p className="text-gray-700 mb-4">
          This website uses cookies to improve user experience.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">What Are Cookies?</h2>
        <p className="text-gray-700 mb-4">
          Cookies are small text files stored on your device to help us
          understand website usage.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">How We Use Cookies</h2>
        <p className="text-gray-700 mb-4">
          We use cookies for analytics, performance, and basic functionality.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Managing Cookies</h2>
        <p className="text-gray-700 mb-4">
          You can disable cookies in your browser settings at any time.
        </p>

        <p className="text-gray-500 text-sm mt-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default CookiePolicy;
