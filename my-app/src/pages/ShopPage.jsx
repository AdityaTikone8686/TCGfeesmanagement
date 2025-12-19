import React from "react";

const products = [
  { name: "Cricket Bat", img: "/cricket_bat.webp", price: "₹4,999", desc: "English Willow", size: "h-32" },
  { name: "Cricket Ball", img: "/cricket_ball.jpg", price: "₹499", desc: "Leather Ball", size: "h-24" },
  { name: "Kit Bag", img: "/kit_bag.jpg", price: "₹2,999", desc: "Water Resistant", size: "h-32" },
  { name: "Batting Gloves", img: "/cricket_gloves.jpg", price: "₹1,299", desc: "Premium Grip" },
  { name: "Keeping Gloves", img: "/cricket_keeping.jpg", price: "₹1,499", desc: "High Protection" },
  { name: "Cricket Dress", img: "/cricket-dress.jpg", price: "₹999", desc: "Team Kit" },
];

const ShopPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-4">Shop</h1>
        <p className="text-center text-gray-600 mb-12">
          Find the best cricket gear for every player
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition"
            >
              
              <img
                src={product.img}
                alt={product.name}
                className="w-full h-48 object-cover rounded-xl mb-4"
              />
              
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <p className="text-sm text-gray-500">{product.desc}</p>
              <p className="font-bold mt-2">{product.price}</p>
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
