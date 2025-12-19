import React from "react";

const products = [
  { name: "Cricket Bat", desc: "English Willow", price: "₹4,999", img: "/bat.jpg" },
  { name: "Cricket Ball", desc: "Leather Ball", price: "₹499", img: "/ball.jpg" },
  { name: "Kit Bag", desc: "Water Resistant", price: "₹2,999", img: "/kitbag.jpg" },
  { name: "Batting Gloves", desc: "Premium Grip", price: "₹1,299", img: "/batting-gloves.jpg" },
  { name: "Keeping Gloves", desc: "High Protection", price: "₹1,499", img: "/keeping-gloves.jpg" },
  { name: "Cricket Dress", desc: "Team Kit", price: "₹999", img: "/cricket-dress.jpg" },
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
