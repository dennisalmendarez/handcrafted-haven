Handcrafted Haven updated scaffold

Place these files in your Next.js project using this structure:

public/images/Hero.webp
public/images/elefant.webp
public/images/plates.webp
public/images/pottery.webp

src/app/layout.tsx
src/app/globals.css
src/app/page.tsx
src/app/about/page.tsx
src/app/artisans/page.tsx
src/app/cart/page.tsx
src/app/checkout/page.tsx
src/app/dashboard/page.tsx
src/app/order-placed/page.tsx
src/app/shop/page.tsx
src/app/signin/page.tsx
src/app/signup/page.tsx

src/components/AboutSection.tsx
src/components/ArtisansFeed.tsx
src/components/CartContent.tsx
src/components/CategoryStrip.tsx
src/components/CheckoutContent.tsx
src/components/DashboardContent.tsx
src/components/Hero.tsx
src/components/MarketingShowcase.tsx
src/components/Navbar.tsx
src/components/ProductCard.tsx
src/components/ShopContent.tsx
src/components/SignInForm.tsx
src/components/SignUpForm.tsx

src/data/categories.ts
src/data/seed.ts

src/lib/store.tsx
src/lib/utils.ts

What this version does:
- Front page uses example images as marketing cards only, with no price.
- Shop page uses seller-created products only.
- Seller dashboard includes invoices, customers, product CRUD, artisan feed CRUD, comment moderation, logout, and home.
- Customer dashboard shows invoices summary and previous orders.
- Navbar swaps Sign In for Dashboard + Logout when logged in.
- Cart, checkout, and order placed pages work.
- Categories are wired into the shop and product creation form.
- Uses localStorage for a working demo before adding a real Vercel database.

Important:
- This is a client-side demo data system. When you connect Vercel Postgres, replace the store layer with database actions and API/server actions.
- You can sign in with seeded emails: maria@haven.test, javier@haven.test, emily@haven.test.
