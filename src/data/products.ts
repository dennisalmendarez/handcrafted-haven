export type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
};

export const products: Product[] = [
  {
    id: 1,
    name: "Hand-Painted Elephant",
    price: 35,
    description: "A colorful handcrafted elephant made with care.",
    image: "/images/elefant.webp",
  },
  {
    id: 2,
    name: "Decorative Pottery Vase",
    price: 42,
    description: "Beautiful artisan pottery with painted details.",
    image: "/images/Hero.webp",
  },
  {
    id: 3,
    name: "Ceramic Plate Set",
    price: 28,
    description: "Creative ceramic plates with unique village designs.",
    image: "/images/plates.webp",
  },
  {
    id: 4,
    name: "Clay Kitchen Set",
    price: 24,
    description: "Simple and elegant handcrafted clay pieces.",
    image: "/images/pottery.webp",
  },
];
