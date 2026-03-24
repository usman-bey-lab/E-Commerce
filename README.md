# 🛍 Shopper — Full-Stack E-Commerce Application

A full-stack clothing e-commerce platform built with **Next.js**, **Express.js**, and **MongoDB**. The project is split into three separate applications that work together.

---

## 📁 Project Structure

```
E-Commerce/
├── shopper-next/       # Customer-facing shop (Next.js — port 3001)
├── shopper-admin/      # Admin panel (Next.js — port 3000)
└── backend/            # REST API (Express.js — port 4000)
```

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Customer Shop | Next.js 15 (App Router) |
| Admin Panel | Next.js 15 (App Router) |
| Backend API | Express.js |
| Database | MongoDB (via Mongoose) |
| Authentication | JWT (JSON Web Tokens) |
| Image Upload | Multer |
| Password Hashing | bcrypt |
| Styling | CSS Modules |

---

## ✨ Features

### Customer Shop (`shopper-next`)
- Browse products by category — Men, Women, Kids
- Product detail page with image gallery and size selector
- Size must be selected before adding to cart
- Cart with quantity management, size display, and promo codes
- Checkout with delivery form and order confirmation
- Product reviews and star ratings
- User authentication — signup and login
- Promo code validation at checkout
- Responsive design

### Admin Panel (`shopper-admin`)
- Secure admin login (separate from customer accounts)
- Dashboard with revenue stats and 7-day sales chart
- Orders management — view all orders, update status (pending → processing → shipped → delivered → cancelled)
- Order detail modal — customer info, items, sizes, delivery address
- Products management — add, edit, delete products with image upload
- Search and filter products by category with pagination
- Users management — view all users and their order history
- Promo codes — create, enable/disable, delete codes with expiry and usage limits
- Sales stats page with daily revenue breakdown

### Backend API (`backend`)
- RESTful API built with Express.js
- MongoDB database with Mongoose models
- JWT authentication for customers and admins (separate tokens)
- Image upload with Multer — stored in `upload/images/`
- Rate limiting on auth routes
- Input validation with express-validator
- CORS configured for all three apps
- Helmet for security headers

---

## 🚀 Getting Started

### Prerequisites

Make sure you have these installed:
- Node.js (v18 or higher)
- npm
- MongoDB Atlas account (or local MongoDB)

---

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd E-Commerce
```

---

### 2. Set Up the Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
PORT=4000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/e-commerce?appName=Cluster0
JWT_SECRET=your_jwt_secret_here
FRONTEND_URL=http://localhost:3001
BASE_URL=http://localhost:4000
ADMIN_URL=http://localhost:3000
```

> **Important:** Replace `<username>`, `<password>`, and the cluster URL with your actual MongoDB Atlas credentials. Make sure to include the database name (`e-commerce`) in the URI.

Start the backend:

```bash
npm run dev
```

Backend runs on `http://localhost:4000`.

---

### 3. Create the Admin Account

After the backend is running, seed the admin account:

```bash
node seedAdmin.js
```

This creates an admin account with:
- **Email:** `admin@shopper.com`
- **Password:** `admin123`

> Change these credentials after first login.

---

### 4. Set Up the Customer Shop

```bash
cd ../shopper-next
npm install
```

Create a `.env.local` file in `shopper-next/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Start the shop:

```bash
npm run dev -- -p 3001
```

Shop runs on `http://localhost:3001`.

---

### 5. Set Up the Admin Panel

```bash
cd ../shopper-admin
npm install
```

Create a `.env.local` file in `shopper-admin/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Start the admin panel:

```bash
npm run dev -- -p 3000
```

Admin panel runs on `http://localhost:3000`.

---

## 🖥 Running All Three Apps

You need **3 separate terminals** running simultaneously:

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Customer Shop
cd shopper-next
npm run dev -- -p 3001

# Terminal 3 — Admin Panel
cd shopper-admin
npm run dev -- -p 3000
```

---

## 🌐 App URLs

| App | URL |
|---|---|
| Customer Shop | http://localhost:3001 |
| Admin Panel | http://localhost:3000 |
| Backend API | http://localhost:4000 |

---

## 📡 API Endpoints

### Products
| Method | Endpoint | Description |
|---|---|---|
| GET | `/allproducts` | Get all products |
| GET | `/newcollection` | Get latest 8 products |
| GET | `/popularinwomen` | Get 4 popular women's products |
| POST | `/addproduct` | Add a new product |
| PUT | `/editproduct/:id` | Edit a product |
| POST | `/removeproduct` | Delete a product |
| POST | `/upload` | Upload a product image |

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/signup` | Register a new customer |
| POST | `/login` | Customer login |

### Cart
| Method | Endpoint | Description |
|---|---|---|
| POST | `/getcart` | Get user's cart |
| POST | `/addtocart` | Add item to cart |
| POST | `/removefromcart` | Remove item from cart |
| POST | `/clearcart` | Clear entire cart |
| POST | `/validatepromo` | Validate a promo code |

### Orders
| Method | Endpoint | Description |
|---|---|---|
| POST | `/orders` | Place a new order |
| GET | `/orders` | Get user's orders |

### Reviews
| Method | Endpoint | Description |
|---|---|---|
| GET | `/reviews/:productId` | Get reviews for a product |
| POST | `/reviews/:productId` | Add a review |

### Admin
| Method | Endpoint | Description |
|---|---|---|
| POST | `/admin/login` | Admin login |
| GET | `/admin/stats` | Dashboard stats |
| GET | `/admin/orders` | All orders |
| PUT | `/admin/orders/:id` | Update order status |
| GET | `/admin/users` | All users |
| GET | `/admin/users/:id/orders` | User's order history |
| GET | `/admin/promocodes` | All promo codes |
| POST | `/admin/promocodes` | Create promo code |
| PUT | `/admin/promocodes/:id` | Update promo code |
| DELETE | `/admin/promocodes/:id` | Delete promo code |

---

## 🗂 Database Models

### User
```
name, email, password, cartData, createdAt, updatedAt
```

### Product
```
id, name, image, category (men/women/kid), new_price, old_price, available, createdAt
```

### Order
```
userId, items[], delivery{}, totalAmount, status, promoCode, createdAt
```

### Review
```
productId, userId, username, rating, comment, createdAt
```

### PromoCode
```
code, discount, type (percent/fixed), maxUses, usedCount, expiresAt, isActive, createdAt
```

### Admin
```
name, email, password, role (admin/superadmin), createdAt
```

---

## 🛒 Cart Key Format

Cart items are stored using a composite key format:

```
{productId}_{size}
```

For example, product ID 5 in size Large is stored as `5_L`. This allows the same product in different sizes to be tracked separately in the cart.

---

## 🔐 Authentication

The project uses two separate JWT authentication systems:

**Customer Auth:**
- Token stored in `localStorage` as `auth-token`
- Sent in request header as `auth-token`
- Expires in 7 days

**Admin Auth:**
- Token stored in `localStorage` as `admin-token`
- Sent in request header as `admin-token`
- Expires in 1 day
- Admin accounts are completely separate from customer accounts

---

## 🖼 Image Upload

Product images are uploaded through the admin panel and stored in:

```
backend/upload/images/
```

They are served by Express as static files at:

```
http://localhost:4000/images/<filename>
```

Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`
Maximum file size: 5MB

---

## 📦 Order Status Flow

```
pending → processing → shipped → delivered
                              ↘
                           cancelled
```

Order status can be updated from the admin panel Orders page.

---

## 🎟 Promo Codes

Promo codes are managed through the admin panel and support:
- Percentage discount (e.g. 10% off)
- Fixed amount discount (e.g. $50 off)
- Usage limits (max number of uses)
- Expiry dates
- Enable/disable toggle

---

## 🗂 Folder Structure Details

### `backend/`
```
backend/
├── config/
│   └── db.js               # MongoDB connection
├── middleware/
│   ├── fetchUser.js         # Customer auth middleware
│   └── fetchAdmin.js        # Admin auth middleware
├── models/
│   ├── User.js
│   ├── Product.js
│   ├── Order.js
│   ├── Review.js
│   ├── PromoCode.js
│   └── Admin.js
├── routes/
│   ├── productRoutes.js
│   ├── userRoutes.js
│   ├── cartRoutes.js
│   ├── orderRoutes.js
│   ├── reviewRoutes.js
│   ├── promoRoutes.js
│   └── adminRoutes.js
├── upload/
│   └── images/              # Uploaded product images
├── index.js                 # Express server entry point
├── seedAdmin.js             # Admin account seeder
└── .env                     # Environment variables
```

### `shopper-next/`
```
shopper-next/
├── app/
│   ├── page.js              # Homepage
│   ├── mens/page.js         # Men's category
│   ├── womens/page.js       # Women's category
│   ├── kids/page.js         # Kids' category
│   ├── product/[id]/page.js # Product detail
│   ├── cart/page.js         # Cart
│   ├── checkout/page.js     # Checkout
│   ├── order-confirmed/page.js
│   └── login/page.js
├── components/
│   ├── Navbar/
│   ├── Hero/
│   ├── Popular/
│   ├── NewCollections/
│   ├── ProductDisplay/
│   ├── CartItems/
│   ├── Reviews/
│   └── ...
├── context/
│   └── ShopContext.jsx      # Global state
└── public/
    └── Assets/              # Static images
```

### `shopper-admin/`
```
shopper-admin/
├── app/
│   ├── login/page.js
│   └── dashboard/
│       ├── layout.js        # Sidebar + navbar layout
│       ├── page.js          # Dashboard overview
│       ├── orders/page.js
│       ├── products/
│       │   ├── page.js      # Product list
│       │   └── add/page.js  # Add product
│       ├── users/page.js
│       ├── promos/page.js
│       └── stats/page.js
└── .env.local
```

---

## ⚠️ Common Issues

**Products not showing:**
Make sure your MongoDB URI includes the database name:
```
mongodb+srv://user:pass@cluster.mongodb.net/e-commerce?appName=Cluster0
```

**CORS errors:**
Check that `backend/index.js` has all three ports in the CORS origins array:
```js
origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:4000"]
```

**Images not loading:**
Images are served from `http://localhost:4000/images/`. Make sure the backend is running and the `upload/images/` folder exists.

**Cart badge wrong count:**
Old cart data may have numeric keys from before the size feature was added. Clear `cartData` to `{}` in MongoDB Compass for affected users.

---

## 👤 Default Admin Credentials

After running `node seedAdmin.js`:

```
Email:    admin@shopper.com
Password: admin123
```

---

## 📝 License

This project was built for learning purposes as part of a full-stack MERN to Next.js migration journey.