import Image from "next/image";
import type { ArtisanPost } from "@/data/artisanPosts";

type ArtisanPostCardProps = {
  post: ArtisanPost;
};

export default function ArtisanPostCard({ post }: ArtisanPostCardProps) {
  return (
    <article
      style={{
        backgroundColor: "white",
        borderRadius: "10px",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <Image
        src={post.image}
        alt={post.title}
        width={500}
        height={300}
        style={{ width: "100%", height: "220px", objectFit: "cover" }}
      />

      <div style={{ padding: "1rem" }}>
        <h3
          style={{
            marginBottom: "0.5rem",
            color: "var(--blue-slate)",
          }}
        >
          {post.title}
        </h3>

        <p
          style={{
            marginBottom: "0.5rem",
            fontWeight: "bold",
          }}
        >
          By {post.artisanName}
        </p>

        <p style={{ lineHeight: 1.6 }}>{post.story}</p>
      </div>
    </article>
  );
}
