import React from "react";
import Layout from "../components/layout/Layout";

const mediaItems = [
  { type: "image", src: "/tcg_ground.jpeg", alt: "Tikone Cricket Academy Ground" },
  { type: "image", src: "/tcg_pr1.jpg", alt: "Training Session" },
  { type: "image", src: "/tcg_pr2.jpg", alt: "Match Day" },
  { type: "image", src: "/tcg_pr4.jpg", alt: "Match Pr Day" },
  { type: "image", src: "/U-14 TEAM PHOTO.jpg", alt: "pr" },
  { type: "image", src: "/TCG U-13 MATCH.jpg", alt: "pr" },
  { type: "image", src: "/21 DEC 25 MATCH PHOTO.jpeg", alt: "pr" },
  { type: "image", src: "/2.jpg", alt: "pr" },
];

const MediaPage = () => {
  return (
    <Layout>
      <section className="py-16 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-8">Photos & Media</h1>
          <p className="text-center text-gray-600 mb-12">
            Explore our gallery of images and videos from Tikone Cricket Gurukul
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {mediaItems.map((item, idx) => (
              <div key={idx} className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition">
                {item.type === "image" ? (
                  <img src={item.src} alt={item.alt} className="w-full h-64 object-cover" />
                ) : (
                  <video
                    src={item.src}
                    controls
                    className="w-full h-64 object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default MediaPage;
