# 🛒 QuickMart – D2C E-commerce Platform

A modern, responsive grocery and essentials delivery platform built with **Next.js**, inspired by industry leaders like Zepto, Swiggy, and Zomato.

## 🚀 Features

- ✅ Responsive homepage with category navigation and featured products
- ✅ Product detail pages with image gallery, price, and add-to-cart
- ✅ Real-time shopping cart with quantity adjustment and promo code support
- ✅ Multi-step checkout: address selection + payment method
- ✅ Secure authentication (Sign Up / Sign In / Sign Out)
- ✅ Wishlist and move-to-cart functionality
- ✅ Order tracking and account management
- ✅ Clean, modern UI with Framer Motion animations
- ✅ Loading skeletons, toasts, and mobile-first design
- ✅ Server-side validation with detailed error handling

---




## 📸 Screenshots

### 🏠 Home Page
![image](https://github.com/user-attachments/assets/c878b9be-77f0-4ea5-b4f8-e92a056d717e)


### 🛍️ Product Page
![image](https://github.com/user-attachments/assets/1cee7749-28ca-49e4-89cc-7600e5da766a)


### 🛒 Cart Page
![image](https://github.com/user-attachments/assets/39dc65be-1e7b-4580-8c5c-417e0f0f5584)


### 💳 Checkout Flow
![image](https://github.com/user-attachments/assets/04dc51d2-6098-4425-97f2-ac20f9dcdd3b)

### 📦 Order Tracking
![image](https://github.com/user-attachments/assets/31de58c5-ae08-41bc-a3ce-4c857edce416)


### 👤 Profile Dropdown
![image](https://github.com/user-attachments/assets/17ae6b12-ad29-4ea9-bff5-f3d250f7ca04)


---
## 🧰 Technologies Used

| Tech           | Purpose                                  |
|----------------|-------------------------------------------|
| **Next.js 14** | Fullstack framework with App Router       |
| **Tailwind CSS** | Utility-first styling and responsiveness |
| **Prisma ORM** | DB modeling & type-safe queries           |
| **PostgreSQL** | Relational database                       |
| **NextAuth.js**| Authentication and session management     |
| **Framer Motion** | Animations and transitions             |
| **React Context** | Global cart state                      |
| **bcryptjs**   | Secure password hashing (drop-in fix)     |
| **shadcn**   | Modern UI comonents library     |
---



## 🛠 Setup Instructions

1. **Clone the Repository**

```bash
git clone https://github.com/MonuYadav05/d2c-E-commerce-Plateform
cd d2c-E-commerce-Plateform
pnpm install
cp .env.example .env
# Update DATABASE_URL and NEXTAUTH_SECRET in `.env`
npx prisma generate
npx prisma push

# Seed Mock Data - send an api request to 
http://localhost:3000/app/api/seed
pnpm run dev

GO to localhost:3000

# Sign-in with email - monuyadav60010@gmail.com & password - 12345678
# Or sign-up with new credentials
```
---
## 🔐 Auth Flow

- 🔑 Sign up and sign in via [`/sign-up`](http://localhost:3000/sign-up) and [`/sign-in`](http://localhost:3000/sign-in)
- 🔒 Protected routes (`/checkout`, `/account`, `/orders`) require login
- 👤 Login state reflected in header dropdown with access to profile
- 🚪 Logout functionality via profile dropdown
- 🛡️ Auth middleware (`middleware.ts`) handles redirection and route protection

---
## ⚠️ Challenges & Solutions

| Challenge                        | Solution                                                                 |
|----------------------------------|--------------------------------------------------------------------------|
| `bcrypt` failing on build        | Replaced with `bcryptjs` (pure JS) and added `@types/bcryptjs` support   |
| Invalid toast import paths       | Corrected imports to use `@/hooks/use-toast.ts`                          |
| Abort errors fetching fonts      | Ignored or resolved by restarting server (non-breaking)                  |
| Auth middleware redirect logic   | Implemented route protection via `middleware.ts` with `matcher` config   |
| Native `bcrypt` errors on Vercel | Switched to `bcryptjs` for easier deploys and cross-platform compatibility |


