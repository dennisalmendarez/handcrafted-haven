export const categories = [
  'Pottery & Ceramics',
  'Jewelry & Chains',
  'Artisan Tools',
  'Animal Statues & Figurines',
  'Sculptures & Art Pieces',
  'Clothing & Textiles',
  'Hammocks & Home Goods',
] as const;

export type Category = (typeof categories)[number];
