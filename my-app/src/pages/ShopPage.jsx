// ✅ Updated ShopPage.jsx
// All 53 products included with improved UI and fixes

import React, { useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const products = [
  // ================= BATS =================

  {
    id: 1,
    name: "NEW BALANCE TC 100i KASHMIR WILLOW CRICKET BAT",
    img: "/dsc wildfire ember.webp",
    mrp: "₹2,899",
    price: "₹2,319",
    discount: "20% OFF",
    desc: "Kashmir Willow",
    category: "Bat",
    size: "h-44",
  },

  {
    id: 2,
    name: "GRAY-NICOLLS JUMBO KASHMIR WILLOW CRICKET BAT",
    img: "/gray nicols jumbo.webp",
    mrp: "₹7,799",
    price: "₹5,849",
    discount: "25% OFF",
    desc: "Kashmir Willow",
    category: "Bat",
    size: "h-44",
  },

  {
    id: 3,
    name: "DSC WILDFIRE FALCON KASHMIR WILLOW CRICKET BAT",
    img: "/dsc falcon.webp",
    mrp: "₹2,699",
    price: "₹2,159",
    discount: "25% OFF",
    desc: "Kashmir Willow",
    category: "Bat",
    size: "h-44",
  },

  {
    id: 4,
    name: "SF CANNON KASHMIR WILLOW CRICKET BAT",
    img: "/sf cannon.webp",
    mrp: "₹2,040",
    price: "₹1,632",
    discount: "20% OFF",
    desc: "Kashmir Willow",
    category: "Bat",
    size: "h-44",
  },

  {
    id: 5,
    name: "KOOKABURA PLAYERS EDITION KASHMIR WILLOW CRICKET BAT",
    img: "/kookbura players edition.webp",
    mrp: "₹6,299",
    price: "₹5,039",
    discount: "20% OFF",
    desc: "Kashmir Willow",
    category: "Bat",
    size: "h-44",
  },

  {
    id: 6,
    name: "GRAY-NICOLLS SUPRA BLAZER KASHMIR WILLOW CRICKET BAT",
    img: "/Gray-Nicolls_Supra_Blazer_Kashmir_Willow_Cricket_Bat-01_1500x.webp",
    mrp: "₹3,999",
    price: "₹2,999",
    discount: "25% OFF",
    desc: "Kashmir Willow",
    category: "Bat",
    size: "h-44",
  },

  {
    id: 7,
    name: "DSC WILDFIRE EMBER KASHMIR WILLOW CRICKET BAT",
    img: "/dsc wildfire ember.webp",
    mrp: "₹2,699",
    price: "₹2,159",
    discount: "20% OFF",
    desc: "Kashmir Willow",
    category: "Bat",
    size: "h-44",
  },

  {
    id: 8,
    name: "SG KLR FLICKER KASHMIR WILLOW CRICKET BAT",
    img: "/sg klr flicker.webp",
    mrp: "₹2,699",
    price: "₹2,159",
    discount: "20% OFF",
    desc: "Kashmir Willow",
    category: "Bat",
    size: "h-44",
  },

  {
    id: 9,
    name: "SS PLAYER JUMBO KASHMIR WILLOW CRICKET BAT",
    img: "/ss player jambo.webp",
    mrp: "₹3,300",
    price: "₹2,784",
    discount: "16% OFF",
    desc: "Kashmir Willow",
    category: "Bat",
    size: "h-44",
  },

  {
    id: 10,
    name: "SG STROKEWELL CLASSIC KASHMIR WILLOW CRICKET BAT",
    img: "/sg strokewell classic.webp",
    mrp: "₹3,499",
    price: "₹3,149",
    discount: "10% OFF",
    desc: "Kashmir Willow",
    category: "Bat",
    size: "h-44",
  },

  // ================= ACCESSORIES =================

  {
    id: 49,
    name: "Cricket Ball",
    img: "/cricket_ball1.jpg",
    mrp: "₹699",
    price: "₹499",
    discount: "29% OFF",
    desc: "Leather Ball",
    category: "Ball",
    size: "h-32",
  },

  {
    id: 50,
    name: "Kit Bag",
    img: "/kitbag_1.webp",
    mrp: "₹3,999",
    price: "₹2,999",
    discount: "25% OFF",
    desc: "Water Resistant",
    category: "Kit Bag",
    size: "h-36",
  },

  {
    id: 51,
    name: "Batting Gloves",
    img: "/cricket_gloves.jpg",
    mrp: "₹1,799",
    price: "₹1,299",
    discount: "28% OFF",
    desc: "Premium Grip",
    category: "Gloves",
    size: "h-36",
  },

  {
    id: 52,
    name: "Keeping Gloves",
    img: "/cricket_keeping.jpg",
    mrp: "₹1,999",
    price: "₹1,499",
    discount: "25% OFF",
    desc: "High Protection",
    category: "Gloves",
    size: "h-36",
  },

  {
    id: 53,
    name: "Cricket Dress",
    img: "/cricket-dress.jpg",
    mrp: "₹1,299",
    price: "₹999",
    discount: "23% OFF",
    desc: "Team Kit",
    category: "Dress",
    size: "h-36",
  },
];

const categories = [
  "All",
  "Bat",
  "Ball",
  "Kit Bag",
  "Gloves",
  "Dress",
];

const ShopPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter(
          (product) => product.category === selectedCategory
        );

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4">

          {/* Heading */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900">
              Cricket Shop
            </h1>

            <p className="text-gray-600 mt-3 text-lg">
              Find the best cricket gear for every player
            </p>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-white border text-gray-700 hover:bg-green-50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Products */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 group"
              >
                {/* Discount */}
                <div className="absolute"></div>

                <div className="relative p-4">
                  <span className="absolute top-4 right-4 bg-green-600 text-white text-xs px-3 py-1 rounded-full font-semibold z-10">
                    {product.discount}
                  </span>

                  {/* Image */}
                  <div className="flex justify-center items-center bg-gray-50 rounded-2xl p-4">
                    <img
                      src={product.img}
                      alt={product.name}
                      className={`object-contain ${product.size} group-hover:scale-105 transition duration-300`}
                    />
                  </div>

                  {/* Info */}
                  <div className="mt-5">
                    <h3 className="font-bold text-sm text-gray-900 line-clamp-2 min-h-[45px]">
                      {product.name}
                    </h3>

                    <p className="text-gray-500 text-sm mt-1">
                      {product.desc}
                    </p>

                    {/* Price */}
                    <div className="mt-3">
                      <p className="text-gray-400 line-through text-sm">
                        {product.mrp}
                      </p>

                      <p className="text-2xl font-bold text-green-600">
                        {product.price}
                      </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-2 mt-5">
                      <button className="w-1/2 bg-gray-900 hover:bg-black text-white py-2 rounded-xl transition">
                        Add Cart
                      </button>

                      <button className="w-1/2 bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl transition">
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
};

export default ShopPage;
