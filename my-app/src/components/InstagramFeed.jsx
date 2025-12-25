import { useEffect, useState } from "react";

const InstagramFeed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/instagram");
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error("Failed to fetch Instagram posts:", err);
      }
    };
    fetchPosts();
  }, []);

  return (
    <section className="bg-muted/20 py-10 sm:py-16">
      <div className="container mx-auto px-3 sm:px-4">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-16 animate-fade-in">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-4 sm:mb-6">
            Our Instagram Feed
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Stay connected and see the latest updates, training highlights, and behind-the-scenes at Tikone Cricket Gurukul.
          </p>
        </div>

        {/* Instagram Posts Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {posts.length > 0 ? (
            posts.map((post) => (
              <a
                key={post.id}
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="group overflow-hidden rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300 bg-white"
              >
                <img
                  src={post.media_url}
                  alt={post.caption || "Instagram post"}
                  className="w-full h-64 object-cover"
                />
                {post.caption && (
                  <div className="p-2 text-sm text-foreground bg-white/90 line-clamp-2">
                    {post.caption}
                  </div>
                )}
              </a>
            ))
          ) : (
            <p className="text-center col-span-full text-muted-foreground">
              Loading posts...
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default InstagramFeed;

