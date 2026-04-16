export type ArtisanPost = {
  id: number;
  artisanName: string;
  title: string;
  story: string;
  image: string;
};

export const artisanPosts: ArtisanPost[] = [
  {
    id: 1,
    artisanName: "Maria Lopez",
    title: "The Story Behind My Pottery",
    story:
      "Each pottery piece is shaped by hand and inspired by generations of family tradition. I want every customer to feel the care and creativity in each design.",
    image: "/images/pottery.webp",
  },
  {
    id: 2,
    artisanName: "Daniel Okoro",
    title: "Why I Create Handcrafted Decor",
    story:
      "I create handmade decor to bring warmth and personality into everyday spaces. My work is influenced by culture, color, and the beauty of natural materials.",
    image: "/images/elefant.webp",
  },
  {
    id: 3,
    artisanName: "Sophia Chen",
    title: "Designing with Meaning",
    story:
      "For me, handcrafted art is about storytelling. Every pattern and detail reflects patience, purpose, and a connection to the people who will use it.",
    image: "/images/plates.webp",
  },
];
