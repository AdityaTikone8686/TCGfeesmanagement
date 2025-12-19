import React, { useState } from "react";

const products = [
  {
     name: "GRAY NICOLLS GN2 SUPRA ENGLISH WILLOW CRICKET BAT",
    img: "/Gray-Nicolls_GN2_Supra_English_Willow_Cricket_Bat-01_1500x.webp",
    mrp: "₹9,349",
    price: "₹7,479",
    discount: "20% OFF",
    desc: "English Willow",
    category: "Bat",
    size: "h-40",
  },
  {
    name: "MRF GENIUS GRAND ENGLISH WILLOW CRICKET BAT",
    img: "/MRF_Genius_Grand_Cricket_Bat-01_1500x.webp",
    mrp: "₹44,249",
    price: "₹39,824",
    discount: "10% OFF",
    desc: "English Willow",
    category: "Bat",
    size: "h-40",
  },
  {
     name: "KOOKABURRA EMPOWER PRO 3.0 ENGLISH WILLOW CRICKET BAT",
    img: "/Kookaburra_Empower_Pro_3.0_English_Willow_Cricket_Bat-01_1500x.webp",
    mrp: "₹24,499",
    price: "₹19,599",
    discount: "20% OFF",
    desc: "English Willow",
    category: "Bat",
    size: "h-40",
  },
  {
    name: "SS TON GLORY ENGLISH WILLOW CRICKET BAT",
    img: "/SS_Ton_Glory_English_Willow_Cricket_Bat-01_1500x.webp",
    mrp: "₹17,900",
    price: "₹14,320",
    discount: "20% OFF",
    desc: "English Willow",
    category: "Bat",
    size: "h-40",
  },
  {
     name: "GM DIAMOND 505 ENGLISH WILLOW CRICKET BAT",
    img: "/GM_Diamond_505_English_Willow_Cricket_Bat-01_1500x.webp",
    mrp: "₹17,749",
    price: "₹14,199",
    discount: "20% OFF",
    desc: "English Willow",
    category: "Bat",
    size: "h-40",
  },
  {
    name: "SG CENTURY CLASSIC ENGLISH WILLOW CRICKET BAT",
    img: "/SG_Century_Classic_English_Willow_Cricket_Bat-01_e9399ea7-3701-495e-8e9e-c00a95c988f3_1500x.webp",
    mrp: "₹13,999",
    price: "₹10,499",
    discount: "25% OFF",
    desc: "English Willow",
    category: "Bat",
    size: "h-40",
  },
  {
    name: "SF STANLITE ENGLISH WILLOW CRICKET BAT",
    img: "/SF_Stanlite_English_Willow_Cricket_Bat-01_1500x.webp",
    mrp: "₹15,600",
    price: "₹14,040",
    discount: "10% OFF",
    desc: "English Willow",
    category: "Bat",
    size: "h-40",
  },
  {
    name: "CEAT HITMAN JR CRICKET ENGLISH WILLOW BAT",
    img: "/71Gtb5_F3kL._SY879_375x.webp",
    mrp: "₹19,679",
    price: "₹14,759",
    discount: "25% OFF",
    desc: "English Willow",
    category: "Bat",
    size: "h-40",
  },
  {
    name: "SS DEVILS GREEN ENGLISH WILLOW CRICKET BAT",
    img: "/SS_Devils_Green_English_Willow_Cricket_Bat-01_1500x.webp",
    mrp: "₹25,400",
    price: "₹19,050",
    discount: "25% OFF",
    desc: "English Willow",
    category: "Bat",
    size: "h-40",
  },
  {
    name: "DSC KRUNCH 3.0 ENGLISH WILLOW CRICKET BAT",
    img: "/DSC_Krunch_3.0_English_Willow_Cricket_Bat-01_1500x.webp",
    mrp: "₹27,199",
    price: "₹19,124",
    discount: "30% OFF",
    desc: "English Willow",
    category: "Bat",
    size: "h-40",
  },
  {
    name: "SG SAVAGE ENGLISH WILLOW CRICKET BAT",
    img: "/cricket_bat.webp",
    mrp: "₹27,999",
    price: "₹22,399",
    discount: "29% OFF",
    desc: "English Willow",
    category: "Bat",
    size: "h-40",
  },
  {
    name: "Cricket Ball",
    img: "/cricket_ball1.jpg",
    mrp: "₹699",
    price: "₹499",
    discount: "29% OFF",
    desc: "Leather Ball",
    category: "Ball",
    size: "h-28",
  },
  {
    name: "Kit Bag",
    img: "/kitbag_1.webp",
    mrp: "₹3,999",
    price: "₹2,999",
    discount: "25% OFF",
    desc: "Water Resistant",
    category: "Kit Bag",
    size: "h-32",
  },
  {
    name: "Batting Gloves",
    img: "/cricket_gloves.jpg",
    mrp: "₹1,799",
    price: "₹1,299",
    discount: "28% OFF",
    desc: "Premium Grip",
    category: "Gloves",
    size: "h-32",
  },
  {
    name: "Keeping Gloves",
    img: "/cricket_keeping.jpg",
    mrp: "₹1,999",
    price: "₹1,499",
    discount: "25% OFF",
    desc: "High Protection",
    category: "Gloves",
    size: "h-32",
  },
  {
    name: "Cricket Dress",
    img: "/cricket-dress.jpg",
    mrp: "₹1,299",
    price: "₹999",
    discount: "23% OFF",
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
              className="bg-white rounded-2xl shadow-md p-3 hover:shadow-lg transition flex flex-col relative"
            >
              {/* Discount Badge */}
              <span className="absolute top-3 right-3 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                {product.discount}
              </span>

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

                {/* Price Section */}
                <div className="mt-2 text-center">
                  <p className="text-sm text-gray-400 line-through">
                    {product.mrp}
                  </p>
                  <p className="text-lg font-bold text-green-600">
                    {product.price}
                  </p>
                </div>
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
