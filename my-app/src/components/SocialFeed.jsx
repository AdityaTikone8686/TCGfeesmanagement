import { useEffect, useState } from "react";
import axios from "axios";

export default function SocialFeed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/social`)
      .then(res => setPosts(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map(post => (
        <div key={post._id} className="rounded-xl overflow-hidden shadow-md">
          {post.mediaType === "video" ? (
            <video src={post.mediaUrl} controls className="w-full" />
          ) : (
            <img src={post.mediaUrl} alt="" className="w-full object-cover" />
          )}
          {post.caption && (
            <p className="p-3 text-sm text-muted-foreground">{post.caption}</p>
          )}
        </div>
      ))}
    </div>
  );
}
