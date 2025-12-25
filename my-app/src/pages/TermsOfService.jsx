import React from "react";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 bg-white p-8 rounded-xl shadow">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

        <p className="text-gray-700 mb-4">
          By using the Tikone Cricket Gurukul website, you agree to these
          terms and conditions.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Use of Website</h2>
        <p className="text-gray-700 mb-4">
          This website is for informational and academy-related purposes
          only. Unauthorized use is prohibited.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Content</h2>
        <p className="text-gray-700 mb-4">
          All content including images, logos, and text belongs to Tikone
          Cricket Gurukul unless stated otherwise.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Limitation of Liability</h2>
        <p className="text-gray-700 mb-4">
          We are not liable for any damages arising from the use of this
          website.
        </p>

        <p className="text-gray-500 text-sm mt-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default TermsOfService;
