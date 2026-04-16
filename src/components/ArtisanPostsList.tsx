import ArtisanPostCard from "./ArtisanPostCard";
import { artisanPosts } from "@/data/artisanPosts";

export default function ArtisanPostsList() {
  return (
    <section
      style={{
        padding: "3rem 0",
        backgroundColor: "var(--eggshell)",
      }}
    >
      <div
        style={{
          width: "90%",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            fontSize: "2rem",
            marginBottom: "1.5rem",
            color: "var(--blue-slate)",
          }}
        >
          Artisan Stories
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {artisanPosts.map((post) => (
            <ArtisanPostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
