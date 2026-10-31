import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { mediaAPI } from "../services/mediaAPI";
import { X, ChevronLeft, ChevronRight, Loader2, Image as ImageIcon } from "lucide-react";

const BACKEND_URL = "https://tikonecricketgurukulbackend.onrender.com";

// Existing photos — preserved
const staticMediaItems = [
{ id: "static-1", type: "image", src: "/tcg_ground.jpeg", alt: "Tikone Cricket Academy Ground" },
{ id: "static-2", type: "image", src: "/tcg_pr1.jpg", alt: "Training Session" },
{ id: "static-3", type: "image", src: "/tcg_pr2.jpg", alt: "Match Day" },
{ id: "static-4", type: "image", src: "/tcg_pr4.jpg", alt: "Match Pr Day" },
{ id: "static-5", type: "image", src: "/U-14 TEAM PHOTO.jpg", alt: "U-14 Team" },
{ id: "static-6", type: "image", src: "/TCG U-13 MATCH.jpg", alt: "U-13 Match" },
{ id: "static-7", type: "image", src: "/21 DEC 25 MATCH PHOTO.jpeg", alt: "Match Photo" },
];

const MediaPage = () => {
const [uploadedMedia, setUploadedMedia] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
const [selectedImage, setSelectedImage] = useState(null);

// Fetch images and videos uploaded from Admin Dashboard
useEffect(() => {
const fetchMedia = async () => {
try {
setLoading(true);
setError("");

    const data = await mediaAPI.getAll();

    const formattedMedia = data.map((item) => ({
      id: item.id,
      type: item.mediaType,
      src: `${BACKEND_URL}${item.url}`,
      alt: item.title || "Tikone Cricket Gurukul Media",
      title: item.title || "",
      description: item.description || "",
      uploadDate: item.uploadDate,
    }));

    setUploadedMedia(formattedMedia);
  } catch (err) {
    console.error("Error loading media:", err);
    setError("Unable to load newly uploaded media. Please try again later.");
  } finally {
    setLoading(false);
  }
};

fetchMedia();

}, []);

// Combine existing photos and newly uploaded media
const allMedia = [...staticMediaItems, ...uploadedMedia];

// Only images are displayed in the image lightbox
const images = allMedia.filter((item) => item.type === "image");

const openImage = (item) => {
const index = images.findIndex((image) => image.id === item.id);
setSelectedImage(index);
};

const closeImage = () => setSelectedImage(null);

const showPrevious = (e) => {
e?.stopPropagation();
setSelectedImage((current) =>
current === 0 ? images.length - 1 : current - 1
);
};

const showNext = (e) => {
e?.stopPropagation();
setSelectedImage((current) =>
current === images.length - 1 ? 0 : current + 1
);
};

// Keyboard navigation
useEffect(() => {
if (selectedImage === null) return;

const handleKeyDown = (e) => {
  if (e.key === "Escape") closeImage();
  if (e.key === "ArrowLeft") showPrevious();
  if (e.key === "ArrowRight") showNext();
};

document.addEventListener("keydown", handleKeyDown);
document.body.style.overflow = "hidden";

return () => {
  document.removeEventListener("keydown", handleKeyDown);
  document.body.style.overflow = "";
};

}, [selectedImage, images.length]);

return (
<Layout>
<style>{`
@keyframes galleryFade {
from { opacity: 0; }
to { opacity: 1; }
}

    @keyframes galleryZoom {
      from { opacity: 0; transform: scale(.88) translateY(15px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }

    @keyframes galleryCard {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .gallery-card {
      animation: galleryCard .5s ease both;
    }

    .gallery-card img {
      transition: transform .5s ease;
    }

    .gallery-card:hover img {
      transform: scale(1.06);
    }

    .gallery-lightbox {
      animation: galleryFade .25s ease both;
    }

    .gallery-lightbox-content {
      animation: galleryZoom .3s ease both;
    }

    .gallery-nav {
      transition: background .2s, transform .2s;
    }

    .gallery-nav:hover {
      transform: scale(1.1);
    }

    @media (prefers-reduced-motion: reduce) {
      .gallery-card,
      .gallery-lightbox,
      .gallery-lightbox-content {
        animation: none !important;
      }

      .gallery-card img,
      .gallery-nav {
        transition: none !important;
      }
    }
  `}</style>

  <section className="py-16 bg-gray-50 min-h-screen">
    <div className="container mx-auto px-4">

      {/* Heading */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Photos & Media
        </h1>

        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore our gallery of images and videos from Tikone Cricket Gurukul.
          Relive our training sessions, matches and special moments.
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center gap-3 py-8 text-gray-600">
          <Loader2 className="animate-spin" size={24} />
          <span>Loading gallery...</span>
        </div>
      )}

      {/* API error */}
      {error && (
        <div className="text-center text-red-600 mb-6">
          {error}
        </div>
      )}

      {/* Media count */}
      <div className="flex items-center gap-2 mb-6 text-gray-600">
        <ImageIcon size={20} />
        <span>{allMedia.length} photos and videos</span>
      </div>

      {/* Gallery */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

        {allMedia.map((item, idx) => (
          <div
            key={item.id}
            className="gallery-card rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-shadow duration-300"
            style={{ animationDelay: `${Math.min(idx * 70, 500)}ms` }}
          >
            {item.type === "image" ? (
              <div
                className="relative overflow-hidden cursor-zoom-in"
                onClick={() => openImage(item)}
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  className="w-full h-64 object-cover"
                />

                <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <span className="text-white opacity-0 hover:opacity-100 font-semibold text-lg">
                    View Image
                  </span>
                </div>
              </div>
            ) : (
              <video
                src={item.src}
                controls
                preload="metadata"
                className="w-full h-64 object-cover bg-black"
              >
                Your browser does not support video playback.
              </video>
            )}

            {(item.title || item.description) && (
              <div className="p-4">
                {item.title && (
                  <h3 className="font-bold text-lg text-gray-800">
                    {item.title}
                  </h3>
                )}

                {item.description && (
                  <p className="text-sm text-gray-600 mt-1">
                    {item.description}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}

      </div>

      {!loading && allMedia.length === 0 && (
        <p className="text-center text-gray-500 py-12">
          No media available yet.
        </p>
      )}

    </div>
  </section>

  {/* Full-screen Image Preview */}
  {selectedImage !== null && images[selectedImage] && (
    <div
      className="gallery-lightbox fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4"
      onClick={closeImage}
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
    >
      {/* Close button */}
      <button
        onClick={closeImage}
        className="absolute top-5 right-5 z-20 bg-white/15 hover:bg-white/30 text-white rounded-full p-3"
        aria-label="Close image preview"
      >
        <X size={28} />
      </button>

      {/* Previous */}
      {images.length > 1 && (
        <button
          onClick={showPrevious}
          className="gallery-nav absolute left-3 md:left-8 z-20 bg-white/15 hover:bg-white/30 text-white rounded-full p-3"
          aria-label="Previous image"
        >
          <ChevronLeft size={30} />
        </button>
      )}

      {/* Image */}
      <div
        className="gallery-lightbox-content flex flex-col items-center max-w-full max-h-full"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          key={images[selectedImage].id}
          src={images[selectedImage].src}
          alt={images[selectedImage].alt}
          className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
        />

        <div className="text-white text-center mt-4">
          <p className="font-semibold">
            {images[selectedImage].title || images[selectedImage].alt}
          </p>

          <p className="text-sm text-gray-300 mt-1">
            {selectedImage + 1} / {images.length}
          </p>
        </div>
      </div>

      {/* Next */}
      {images.length > 1 && (
        <button
          onClick={showNext}
          className="gallery-nav absolute right-3 md:right-8 z-20 bg-white/15 hover:bg-white/30 text-white rounded-full p-3"
          aria-label="Next image"
        >
          <ChevronRight size={30} />
        </button>
      )}
    </div>
  )}

</Layout>

);
};

export default MediaPage;


