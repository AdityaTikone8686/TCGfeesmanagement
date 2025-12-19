import React, { useState } from "react";

const products = [
  {
    name: "Cricket Bat",
    img: "/cricket_bat.webp",
    price: "₹4,999",
    desc: "English Willow",
    category: "Bat",
    size: "h-40",
  },
  {
    name: "Cricket Ball",
    img: "/cricket_ball1.jpg",
    price: "₹499",
    desc: "Leather Ball",
    category: "Ball",
    size: "h-28",
  },
  {
    name: "Kit Bag",
    img: "/kitbag_1.webp",
    price: "₹2,999",
    desc: "Water Resistant",
    category: "Kit Bag",
    size: "h-32",
  },
  {
    name: "Batting Gloves",
    img: "/cricket_gloves.jpg",
    price: "₹1,299",
    desc: "Premium Grip",
    category: "Gloves",
    size: "h-32",
  },
  {
    name: "Keeping Gloves",
    img: "/cricket_keeping.jpg",
    price: "₹1,499",
    desc: "High Protection",
    category: "Gloves",
    size: "h-32",
  },
  {
    name: "Cricket Dress",
    img: "/cricket-dress.jpg",
    price: "₹999",
    desc: "Team Kit",
    category: "Dress",
    size: "h-32",
  },
];

const categories = ["All", "Bat", "Ball", "Kit Bag", "Gloves", "Dress"];

const ShopPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter(
          (product) => product.category === selectedCategory
        );

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-4">Shop</h1>
        <p className="text-center text-gray-600 mb-12">
          Find the best cricket gear for every player
        </p>

        {/* Category Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                selectedCategory === category
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-700 border hover:bg-green-50"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md p-3 hover:shadow-lg transition flex flex-col"
            >
              <div className="flex-1 flex flex-col items-center">
                <img
                  src={product.img}
                  alt={product.name}
                  className={`w-full object-contain rounded-xl mb-4 ${
                    product.size || "h-32"
                  }`}
                />
                <h3 className="font-semibold text-lg text-center">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500 text-center">
                  {product.desc}
                </p>
                <p className="font-bold mt-2">{product.price}</p>
              </div>

              <button className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">
                Enquire Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;



