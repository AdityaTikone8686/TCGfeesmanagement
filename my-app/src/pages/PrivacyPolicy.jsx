import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 bg-white p-8 rounded-xl shadow">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

        <p className="text-gray-700 mb-4">
          Tikone Cricket Gurukul respects your privacy. This Privacy Policy
          explains how we collect, use, and protect your information.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Information We Collect</h2>
        <p className="text-gray-700 mb-4">
          We may collect personal information such as name, phone number,
          email address, and academy-related details when you contact us or
          use our services.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">How We Use Information</h2>
        <p className="text-gray-700 mb-4">
          Information is used only for academy communication, inquiries,
          registrations, and service improvement.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Data Security</h2>
        <p className="text-gray-700 mb-4">
          We take reasonable measures to protect your data. However, no
          internet transmission is 100% secure.
        </p>

        <p className="text-gray-500 text-sm mt-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
