// ✅ Updated ShopPage.jsx
// All 53 products included with improved UI and fixes

import React, { useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const products = [
  {
    id: 1,
    name: "NEW BALANCE TC 100i KASHMIR WILLOW CRICKET BAT",
    img: "dsc wildfire ember.webp",
    mrp: "₹2,319",
    price: "2,899",
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
    price: "5,849",
    discount: "25% OFF",
    desc: "Kashmir Willow",
    category: "Bat",
    size: "h-40",
  },
  {
    id: 3,
    name: "DSC WILDFIRE FALCON KASHMIR WILLOW CRICKET BAT",
    img: "dsc falcon.webp",
    mrp: "₹2,699",
    price: "2,159",
    discount: "25% OFF",
    desc: "Kashmir Willow",
    category: "Bat",
    size: "h-40",
  },
  {
    id: 4,
    name: "SF CANNON KASHMIR WILLOW CRICKET BAT",
    img: "sf cannon.webp",
    mrp: "₹1,632",
    price: "2,040",
    discount: "20% OFF",
    desc: "Kashmir Willow",
    category: "Bat",
    size: "h-40",
  },
  {
    id: 5,
    name: "KOOKABURA PLAYERS EDITION KASHMIR WILLOW CRICKET BAT",
    img: "kookbura players edition.webp",
    mrp: "₹6,299",
    price: "5,039",
    discount: "20% OFF",
    desc: "Kashmir Willow",
    category: "Bat",
    size: "h-40",
  },
  {
    id: 6,
    name: "GRAY-NICOLLS SUPRA BLAZER KASHMIR WILLOW CRICKET BAT",
    img: "/Gray-Nicolls_Supra_Blazer_Kashmir_Willow_Cricket_Bat-01_1500x.webp",
    mrp: "₹3,999",
    price: "2,999",
    discount: "25% OFF",
    desc: "Kashmir Willow",
    category: "Bat",
    size: "h-40",
  },
  {
    id: 7,
    name: "DSC WILDFIRE EMBER KASHMIR WILLOW CRICKET BAT",
    img: "dsc wildfire ember.webp",
    mrp: "₹2,699",
    price: "2,159",
    discount: "20% OFF",
    desc: "Kashmir Willow",
    category: "Bat",
    size: "h-40",
  },
  {
    id: 8,
    name: "SG KLR FLICKER KASHMIR WILLOW CRICKET BAT",
    img: "/sg klr flicker.webp",
    mrp: "₹2,699",
    price: "2,159",
    discount: "20% OFF",
    desc: "Kashmir Willow",
    category: "Bat",
    size: "h-40",
  },
  {
    id: 9,
    name: "SS PLAYER JUMBO KASHMIR WILLOW CRICKET BAT",
    img: "/ss player jambo.webp",
    mrp: "₹3,300",
    price: "2,784",
    discount: "16% OFF",
    desc: "Kashmir Willow",
    category: "Bat",
    size: "h-40",
  },
  {
    id: 10,
    name: "SG STROKEWELL CLASSIC KASHMIR WILLOW CRICKET BAT",
    img: "/sg strokewell classic.webp",
    mrp: "₹3,499",
    price: "3,149",
    discount: "10% OFF",
    desc: "Kashmir Willow",
    category: "Bat",
    size: "h-40",
  },
  {
    id: 11,
    name: "KOOKABURA PRODIGY 2L0 KASHMIR WILLOW CRICKET BAT",
    img: "/kookabura prodigy 2.0.webp",
    mrp: "₹2,490",
    price: "1,992",
    discount: "20% OFF",
    desc: "Kashmir Willow",
    category: "Bat",
    size: "h-40",
  },
  {
    id: 12,
    name: "NEW BALANCE DC 100i KASHMIR WILLOW CRICKET BAT",
    img: "/nb dc 100i.webp",
    mrp: "₹2,899",
    price: "2,319",
    discount: "20% OFF",
    desc: "Kashmir Willow",
    category: "Bat",
    size: "h-40",
  },
  {
    id: 13,
    name: "NEW BALANCE TC 200i KASHMIR WILLOW CRICKET BAT",
    img: "/nb tc 200i.webp",
    mrp: "₹3,399",
    price: "2,719",
    discount: "20% OFF",
    desc: "Kashmir Willow",
    category: "Bat",
    size: "h-40",
  },
  {
    id: 14,
    name: "DSC MASTER 2000 KASHMIR WILLOW CRICKET BAT",
    img: "/dsc master 2000.webp",
    mrp: "₹2,959",
    price: "2,219",
    discount: "25% OFF",
    desc: "Kashmir Willow",
    category: "Bat",
    size: "h-40",
  },
  {
    id: 15,
    name: "SS SKY SUPER KASHMIR WILLOW CRICKET BAT",
    img: "/ss sky super.webp",
    mrp: "₹2,650",
    price: "2,120",
    discount: "20% OFF",
    desc: "Kashmir Willow",
    category: "Bat",
    size: "h-40",
  },
  {
    id: 16,
    name: "DSC WILDFIRE FLARE KASHMIR WILLOW CRICKET BAT",
    img: "/dsc wildfire flare.webp",
    mrp: "₹2,899",
    price: "2,174",
    discount: "25% OFF",
    desc: "Kashmir Willow",
    category: "Bat",
    size: "h-40",
  },
  {
    id: 17,
    name: "DSC WILDFIRE HEAT KASHMIR WILLOW CRICKET BAT",
    img: "/dsc wildfire heat.webp",
    mrp: "₹3,075",
    price: "2,306",
    discount: "25% OFF",
    desc: "Kashmir Willow",
    category: "Bat",
    size: "h-40",
  },
  {
    id: 18,
    name: "DSC WILDFIRE VOLCANO KASHMIR WILLOW CRICKET BAT",
    img: "/dsc wildfire volcano.webp",
    mrp: "₹2,775",
    price: "2,081",
    discount: "25% OFF",
    desc: "Kashmir Willow",
    category: "Bat",
    size: "h-40",
  },
  {
    id: 19,
    name: "KOOKABURA AURA PRO 9.0 KASHMIR WILLOW CRICKET BAT",
    img: "/kookabura aura.webp",
    mrp: "₹2,699",
    price: "2,159",
    discount: "20% OFF",
    desc: "Kashmir Willow",
    category: "Bat",
    size: "h-40",
  },
  {
    id: 20,
    name: "DSC WILDFIRE MAGMA KASHMIR WILLOW CRICKET BAT",
    img: "/dsc wildfire magma.webp",
    mrp: "₹3,275",
    price: "2,459",
    discount: "25% OFF",
    desc: "Kashmir Willow",
    category: "Bat",
    size: "h-40",
  },
  {
    id: 21,
    name: "DSC PENTAZONE KASHMIR WILLOW CRICKET BAT",
    img: "/dsc pentazone.webp",
    mrp: "₹3,409",
    price: "2,556",
    discount: "25% OFF",
    desc: "Kashmir Willow",
    category: "Bat",
    size: "h-40",
  },
  {
    id: 22,
    name: "SG THUNDER PLUS KASHMIR WILLOW CRICKET BAT",
    img: "/sg thunder plus.webp",
    mrp: "₹2,499",
    price: "1,874",
    discount: "25% OFF",
    desc: "Kashmir Willow",
    category: "Bat",
    size: "h-40",
  },
  {
    id: 23,
    name: "SS 281 KASHMIR WILLOW CRICKET BAT",
    img: "/ss 281.webp",
    mrp: "₹3,130",
    price: "2,347",
    discount: "25% OFF",
    desc: "Kashmir Willow",
    category: "Bat",
    size: "h-40",
  },
  {
    id: 24,
    name: "TON MAXIMUS KASHMIR WILLOW CRICKET BAT",
    img: "/ss ton maximus.webp",
    mrp: "₹2,930",
    price: "2,472",
    discount: "16% OFF",
    desc: "Kashmir Willow",
    category: "Bat",
    size: "h-40",
  },
  {
    id: 25,
    name: "SG KLR SPARK KASHMIR WILLOW CRICKET BAT",
    img: "/sg klr spark.webp",
    mrp: "₹2,899",
    price: "2,319",
    discount: "20% OFF",
    desc: "Kashmir Willow",
    category: "Bat",
    size: "h-40",
  },
  {
    id: 26,
    name: "SG RSD KASHMIR WILLOW CRICKET BAT",
    img: "/SG_RSD_Spark_Kashmir_Willow_Cricket_Bat_1066x.webp",
    mrp: "₹2,749",
    price: "2,199",
    discount: "20% OFF",
    desc: "Kashmir Willow",
    category: "Bat",
    size: "h-40",
  },
  {
    id: 27,
    name: "MRF CHAMP KASHMIR WILLOW CRICKET BAT",
    img: "/mrf chaamp best.webp",
    mrp: "₹2,820",
    price: "2,115",
    discount: "25% OFF",
    desc: "Kashmir Willow",
    category: "Bat",
    size: "h-40",
  },
  {
    id: 28,
    name: "SS GUTSY KASHMIR WILLOW CRICKET BAT",
    img: "/ss gutsyy.jpg",
    mrp: "₹3,110",
    price: "2,706",
    discount: "13% OFF",
    desc: "Kashmir Willow",
    category: "Bat",
    size: "h-40",
  },
  {
    id: 29,
    name: "SS KLASSEN KASHMIR WILLOW CRICKET BAT",
    img: "/ss klassen.jpg",
    mrp: "₹3,010",
    price: "2,619",
    discount: "13% OFF",
    desc: "Kashmir Willow",
    category: "Bat",
    size: "h-40",
  },
  {
    id: 30,
    name: "SS CLUB VELLUM KASHMIR WILLOW CRICKET BAT",
    img: "/ss club vellum.jpg",
    mrp: "₹3,010",
    price: "2,619",
    discount: "13% OFF",
    desc: "Kashmir Willow",
    category: "Bat",
    size: "h-40",
  },
  {
    id: 31,
    name: "SS SUPER POWER KASHMIR WILLOW CRICKET BAT",
    img: "/ss super power.jpg",
    mrp: "₹2,970",
    price: "2,584",
    discount: "13% OFF",
    desc: "Kashmir Willow",
    category: "Bat",
    size: "h-40",
  },
  {
    id: 32,
    name: "SS POWER KASHMIR WILLOW CRICKET BAT",
    img: "/ss power kashmir.jpg",
    mrp: "₹2,920",
    price: "2,540",
    discount: "13% OFF",
    desc: "Kashmir Willow",
    category: "Bat",
    size: "h-40",
  },
  {
    id: 33,
    name: "SS TILAK VERMA KASHMIR WILLOW CRICKET BAT",
    img: "/ss tilak.jpg",
    mrp: "₹2,453",
    price: "2,820",
    discount: "13% OFF",
    desc: "Kashmir Willow",
    category: "Bat",
    size: "h-40",
  },
  {
    id: 34,
    name: "SS SKY STUNNER KASHMIR WILLOW CRICKET BAT",
    img: "/ss sky stunner.jpg",
    mrp: "₹2,453",
    price: "2,820",
    discount: "13% OFF",
    desc: "Kashmir Willow",
    category: "Bat",
    size: "h-40",
  },
  {
    id: 35,
    name: "SS SHIVAM DUBE KASHMIR WILLOW CRICKET BAT",
    img: "/ss shivam dube'.jpg",
    mrp: "₹2,453",
    price: "₹2,820",
    discount: "13% OFF",
    desc: "Kashmir Willow",
    category: "Bat",
    size: "h-40",
  },
  {
    id: 36,
    name: "SS JOSH KASHMIR WILLOW CRICKET BAT",
    img: "/ss josh.jpg",
    mrp: "₹2,590",
    price: "2,253",
    discount: "13% OFF",
    desc: "Kashmir Willow",
    category: "Bat",
    size: "h-40",
  },
  {
    id: 37,
    name: "SS IKON KASHMIR WILLOW CRICKET BAT",
    img: "/shopping.webp",
    mrp: "₹2,590",
    price: "2,253",
    discount: "13% OFF",
    desc: "Kashmir Willow",
    category: "Bat",
    size: "h-40",
  },
  {
    id: 38,
    name: "GRAY NICOLLS GN2 SUPRA ENGLISH WILLOW CRICKET BAT",
    img: "/Gray-Nicolls_GN2_Supra_English_Willow_Cricket_Bat-01_1500x.webp",
    mrp: "₹9,349",
    price: "7,479",
    discount: "20% OFF",
    desc: "English Willow",
    category: "Bat",
    size: "h-40",
  },
  {
    id: 39,
    name: "MRF GENIUS GRAND ENGLISH WILLOW CRICKET BAT",
    img: "/MRF_Genius_Grand_Cricket_Bat-01_1500x.webp",
    mrp: "₹44,249",
    price: "39,824",
    discount: "10% OFF",
    desc: "English Willow",
    category: "Bat",
    size: "h-40",
  },
  {
    id: 40,
    name: "KOOKABURRA EMPOWER PRO 3.0 ENGLISH WILLOW CRICKET BAT",
    img: "/Kookaburra_Empower_Pro_3.0_English_Willow_Cricket_Bat-01_1500x.webp",
    mrp: "₹24,499",
    price: "19,599",
    discount: "20% OFF",
    desc: "English Willow",
    category: "Bat",
    size: "h-40",
  },
  {
    id: 41,
    name: "SS TON GLORY ENGLISH WILLOW CRICKET BAT",
    img: "/SS_Ton_Glory_English_Willow_Cricket_Bat-01_1500x.webp",
    mrp: "₹17,900",
    price: "14,320",
    discount: "20% OFF",
    desc: "English Willow",
    category: "Bat",
    size: "h-40",
  },
  {
    id: 42,
    name: "GM DIAMOND 505 ENGLISH WILLOW CRICKET BAT",
    img: "/GM_Diamond_505_English_Willow_Cricket_Bat-01_1500x.webp",
    mrp: "₹17,749",
    price: "14,199",
    discount: "20% OFF",
    desc: "English Willow",
    category: "Bat",
    size: "h-40",
  },
  {
    id: 43,
    name: "SG CENTURY CLASSIC ENGLISH WILLOW CRICKET BAT",
    img: "/SG_Century_Classic_English_Willow_Cricket_Bat-01_e9399ea7-3701-495e-8e9e-c00a95c988f3_1500x.webp",
    mrp: "₹13,999",
    price: "10,499",
    discount: "25% OFF",
    desc: "English Willow",
    category: "Bat",
    size: "h-40",
  },
  {
    id: 44,
    name: "SF STANLITE ENGLISH WILLOW CRICKET BAT",
    img: "/SF_Stanlite_English_Willow_Cricket_Bat-01_1500x.webp",
    mrp: "₹15,600",
    price: "14,040",
    discount: "10% OFF",
    desc: "English Willow",
    category: "Bat",
    size: "h-40",
  },
  {
    id: 45,
    name: "CEAT HITMAN JR CRICKET ENGLISH WILLOW BAT",
    img: "/71Gtb5_F3kL._SY879_375x.webp",
    mrp: "₹19,679",
    price: "14,759",
    discount: "25% OFF",
    desc: "English Willow",
    category: "Bat",
    size: "h-40",
  },
  {
    id: 46,
    name: "SS DEVILS GREEN ENGLISH WILLOW CRICKET BAT",
    img: "/SS_Devils_Green_English_Willow_Cricket_Bat-01_1500x.webp",
    mrp: "₹25,400",
    price: "19,050",
    discount: "25% OFF",
    desc: "English Willow",
    category: "Bat",
    size: "h-40",
  },
  {
    id: 47,
    name: "DSC KRUNCH 3.0 ENGLISH WILLOW CRICKET BAT",
    img: "/DSC_Krunch_3.0_English_Willow_Cricket_Bat-01_1500x.webp",
    mrp: "₹27,199",
    price: "19,124",
    discount: "30% OFF",
    desc: "English Willow",
    category: "Bat",
    size: "h-40",
  },
  {
    id: 48,
    name: "SG SAVAGE ENGLISH WILLOW CRICKET BAT",
    img: "/cricket_bat.webp",
    mrp: "₹27,999",
    price: "22,399",
    discount: "29% OFF",
    desc: "English Willow",
    category: "Bat",
    size: "h-40",
  },
  {
    id: 49,
    name: "Cricket Ball",
    img: "/cricket_ball1.jpg",
    mrp: "₹699",
    price: "499",
    discount: "29% OFF",
    desc: "Leather Ball",
    category: "Ball",
    size: "h-28",
  },
  {
    id: 50,
    name: "Kit Bag",
    img: "/kitbag_1.webp",
    mrp: "₹3,999",
    price: "2,999",
    discount: "25% OFF",
    desc: "Water Resistant",
    category: "Kit Bag",
    size: "h-32",
  },
  {
    id: 51,
    name: "Batting Gloves",
    img: "/cricket_gloves.jpg",
    mrp: "₹1,799",
    price: "1,299",
    discount: "28% OFF",
    desc: "Premium Grip",
    category: "Gloves",
    size: "h-32",
  },
  {
    id: 52,
    name: "Keeping Gloves",
    img: "/cricket_keeping.jpg",
    mrp: "₹1,999",
    price: "1,499",
    discount: "25% OFF",
    desc: "High Protection",
    category: "Gloves",
    size: "h-32",
  },
  {
    id: 53,
    name: "Cricket Dress",
    img: "/cricket-dress.jpg",
    mrp: "₹1,299",
    price: "999",
    discount: "23% OFF",
    desc: "Team Kit",
    category: "Dress",
    size: "h-32",
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
  const [cart, setCart] = useState([]);

   const addToCart = (product) => {
    setCart([...cart, product]);
    alert(`${product.name} added to cart`);
   };

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
                className="relative bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 group"
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
                      className={`object-contain ${product.size} group-hover:scale-115 transition duration-300`}
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
  <button
    onClick={() => addToCart(product)}
    className="w-1/2 bg-gray-900 hover:bg-black text-white py-2 rounded-xl transition"
  >
    Add To Cart
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
