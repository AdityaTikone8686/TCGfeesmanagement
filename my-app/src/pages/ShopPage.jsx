import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const products = [
  {
    id: 1,
    name: "NEW BALANCE TC 100i KASHMIR WILLOW CRICKET BAT",
    img: "dsc wildfire ember.webp",
    mrp: "₹2,319",
    price: 2899,
    discount: "20% OFF",
    desc: "Kashmir Willow",
    category: "Bat",
    size: "h-40",
  },

  {
    id: 2,
    name: "GRAY-NICOLLS JUMBO KASHMIR WILLOW CRICKET BAT",
    img: "gray nicols jumbo.webp",
    mrp: "₹7,799",
    price: 5849,
    discount: "25% OFF",
    desc: "Kashmir Willow",
    category: "Bat",
    size: "h-40",
  },

  {
    id: 3,
    name: "Cricket Ball",
    img: "/cricket_ball1.jpg",
    mrp: "₹699",
    price: 499,
    discount: "29% OFF",
    desc: "Leather Ball",
    category: "Ball",
    size: "h-28",
  },

  {
    id: 4,
    name: "Kit Bag",
    img: "/kitbag_1.webp",
    mrp: "₹3,999",
    price: 2999,
    discount: "25% OFF",
    desc: "Water Resistant",
    category: "Kit Bag",
    size: "h-32",
  },

  {
    id: 5,
    name: "Batting Gloves",
    img: "/cricket_gloves.jpg",
    mrp: "₹1,799",
    price: 1299,
    discount: "28% OFF",
    desc: "Premium Grip",
    category: "Gloves",
    size: "h-32",
  },
];

const categories = ["All", "Bat", "Ball", "Kit Bag", "Gloves"];

const ShopPage = () => {
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState("All");

  const [cart, setCart] = useState([]);

  // FILTER PRODUCTS
  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter(
          (product) => product.category === selectedCategory
        );

  // ADD TO CART
  const addToCart = (product) => {
    const existingItem = cart.find(
      (item) => item.id === product.id
    );

    if (existingItem) {
      const updatedCart = cart.map((item) =>
        item.id === product.id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      );

      setCart(updatedCart);

      localStorage.setItem(
        "cart",
        JSON.stringify(updatedCart)
      );
    } else {
      const updatedCart = [
        ...cart,
        { ...product, quantity: 1 },
      ];

      setCart(updatedCart);

      localStorage.setItem(
        "cart",
        JSON.stringify(updatedCart)
      );
    }
  };

  // BUY NOW
  const handleBuyNow = (product) => {
    const singleProduct = [
      {
        ...product,
        quantity: 1,
      },
    ];

    localStorage.setItem(
      "cart",
      JSON.stringify(singleProduct)
    );

    navigate("/cart");
  };

  return (
    <>
      <Header />

      {/* CART BUTTON */}
      <div
        onClick={() => navigate("/cart")}
        className="fixed top-5 right-5 z-50 bg-black text-white px-5 py-3 rounded-full shadow-lg cursor-pointer hover:bg-gray-800 transition"
      >
        Cart ({cart.length})
      </div>

      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* TITLE */}
          <h1 className="text-4xl font-bold text-center mb-4">
            Shop
          </h1>

          <p className="text-center text-gray-600 mb-12">
            Find the best cricket gear for every player
          </p>

          {/* CATEGORY BUTTONS */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() =>
                  setSelectedCategory(category)
                }
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

          {/* PRODUCTS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-md p-3 hover:shadow-xl hover:scale-105 transition duration-300 flex flex-col relative"
              >
                {/* DISCOUNT BADGE */}
                <span className="absolute top-3 right-3 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {product.discount}
                </span>

                {/* PRODUCT IMAGE */}
                <div className="flex-1 flex flex-col items-center">
                  <img
                    src={product.img}
                    alt={product.name}
                    className={`w-full object-contain rounded-xl mb-4 ${
                      product.size || "h-32"
                    }`}
                  />

                  {/* PRODUCT NAME */}
                  <h3 className="font-semibold text-lg text-center">
                    {product.name}
                  </h3>

                  {/* DESCRIPTION */}
                  <p className="text-sm text-gray-500 text-center">
                    {product.desc}
                  </p>

                  {/* PRICE */}
                  <div className="mt-2 text-center">
                    <p className="text-sm text-gray-400 line-through">
                      {product.mrp}
                    </p>

                    <p className="text-lg font-bold text-green-600">
                      ₹{product.price}
                    </p>
                  </div>
                </div>

                {/* BUTTONS */}
                <div className="mt-4 flex gap-2">
                  {/* ADD TO CART */}
                  <button
                    onClick={() => addToCart(product)}
                    className="w-1/2 bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
                  >
                    Add to Cart
                  </button>

                  {/* BUY NOW */}
                  <button
                    onClick={() => handleBuyNow(product)}
                    className="w-1/2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    Buy Now
                  </button>
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
