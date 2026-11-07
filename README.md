# LPU Kart - Smart Shop for Campus Vendors

> **A centralized campus marketplace web platform connecting Lovely Professional University (LPU) students with campus hostel canteens, WH-Smith, and retail vendors.**

Built with **React.js, Node.js, Express.js, and MongoDB (MERN Stack)**.

---

## Key Features

### 1. Campus Marketplace & Availability Tracking
* **Centralized Discovery:** Browse products across major campus categories including **Food & Snacks**, **Stationary & Lab Supplies**, and **Personal Care & Essentials**.
* **Live Stock Availability Tracking:** Instantly see if an item is **Available (Green)** or **Out of Stock (Red)** with unit counts.
* **Smart Search:** Real-time search across products, descriptions, and hostel shop locations (e.g. *BH-6 WH-Smith*, *LPU Mart Block 34*, *Kaata Churi BH-6*).

### 2. Real-Time Inventory & Discount Synchronization
* **Sync Within Seconds:** Updates made by vendors (stock changes, price adjustments, discount activations) synchronize live across all student views without page reload.
* **Discount Notifications:** Campus vendor discount alerts with instant percentage calculation (e.g. *20% OFF Campus Special*), striking through original prices.

### 3. Price Comparison Feature
* **Cost-Effective Student Decisions:** Compare prices across multiple hostel vendors selling similar essentials to help students find the lowest price on campus.

### 4. Vendor & Student Account Management Modules
* **Secure JWT Authentication:** Role-based access control (Student vs. Vendor) with encrypted password hashing (`bcryptjs`).
* **Student Dashboard:** Track campus pickup orders, view order status updates in real-time (*Pending* -> *Confirmed* -> *Ready for Pickup* -> *Completed*).
* **Vendor Portal / Dashboard:**
  * One-click stock availability toggling
  * Product creation & inventory management
  * Campus promotional discount publisher
  * Order status management with student verification (Enrollment ID)

### 5. Interactive Cart & Checkout
* Flexible cart management with item checkboxes, quantity adjusters, and responsive sticky payout summary matching the original UI layout.

---

## Tech Stack

* **Frontend:** React 18, Vite, React Router v6, Axios, React Hot Toast
* **Backend:** Node.js, Express.js, Mongoose (MongoDB ODM), JSON Web Tokens (JWT), Bcrypt.js, CORS
* **Database:** MongoDB
* **Styling & Design:** Glassmorphic modern aesthetic  `section.html`, `style.css`, and `Description-page` layouts with responsive CSS grid.

---

## Project Architecture

```
vendor-managment-main/
|-- client/                          # React Frontend (Vite)
|   |-- public/
|   |   `-- assets/                  # Original campus images & media
|   |       |-- personalcare/        # Lotions, creams, perfumes, nail cutters
|   |       `-- videos/              # Campus food & stall background clips
|   |-- src/
|   |   |-- components/
|   |   |   |-- Navbar.jsx           # Iconic orange sticky campus navbar
|   |   |   |-- ProductCard.jsx      # 4-column responsive product card
|   |   |   |-- DiscountBadge.jsx    # Promo badge
|   |   |   `-- ProtectedRoute.jsx   # Role-based route guard
|   |   |-- context/
|   |   |   |-- AuthContext.jsx      # JWT Auth state & login/register
|   |   |   `-- CartContext.jsx      # Persistent shopping cart state
|   |   |-- pages/
|   |   |   |-- LandingPage.jsx      # FOOD & STATIONARY animated hero cards
|   |   |   |-- LoginPage.jsx        # Glassmorphic login with demo 1-click
|   |   |   |-- SignupPage.jsx       # Student & Vendor dual registration
|   |   |   |-- CategoryPage.jsx     # Filterable product grid with live sync
|   |   |   |-- ProductPage.jsx      # Carousel image slider & related items
|   |   |   |-- CartPage.jsx         # Itemized payout & checkout
|   |   |   |-- VendorDashboard.jsx  # Inventory, discounts & order hub
|   |   |   `-- StudentDashboard.jsx # Profile & order status tracking
|   |   |-- App.jsx                  # Route definitions
|   |   |-- main.jsx                 # Client entry point
|   |   `-- index.css                # Global theme variables & typography
|   |-- package.json
|   `-- vite.config.js
|
|-- server/                          # Node.js & Express Backend
|   |-- middleware/
|   |   `-- auth.js                  # JWT token verify & vendor-only guard
|   |-- models/
|   |   |-- User.js                  # Student & Vendor user schema
|   |   |-- Product.js               # Product with price, stock, vendor refs
|   |   |-- Vendor.js                # Shop profile & verification
|   |   |-- Order.js                 # Orders with pickup status workflow
|   |   `-- Discount.js              # Active promotional discounts
|   |-- routes/
|   |   |-- auth.js                  # Login, register, me
|   |   |-- products.js              # Product CRUD, category & search
|   |   |-- vendors.js               # Vendor listing & registration
|   |   |-- cart.js                  # Cart sync endpoints
|   |   |-- discounts.js             # Discount publishing & deactivation
|   |   `-- orders.js                # Student order placement & vendor updates
|   |-- seed.js                      # Realistic campus demo data seeder
|   |-- server.js                    # Express application entry
|   |-- .env                         # Server environment configuration
|   `-- package.json
|
|-- package.json                     # Root workspace scripts
`-- README.md
```

---

## Getting Started

### Prerequisites
* **Node.js** (v18+ recommended)
* **MongoDB** installed and running locally on `mongodb://localhost:27017` (or provide a MongoDB Atlas URI in `server/.env`)

---

### Step 1: Install Dependencies

Open a terminal in the root folder:

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

---

### Step 2: Seed Demo Campus Data

To populate the database with real campus shops (WH-Smith BH-6, LPU Mart, Kaata Churi) and student test accounts:

```bash
cd server
node seed.js
```

---

### Step 3: Run the Application

#### Run Server and Client in separate terminals:

**Terminal 1 (Backend Server):**
```bash
cd server
npm run dev
# Server will run on http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
cd client
npm run dev
# Frontend will run on http://localhost:5173
```

Now open **http://localhost:5173** in your browser!

---

## Demo Login Credentials

For quick testing without creating a new account:

| Role | Email | Password | Details |
|---|---|---|---|
| **Student** | `student@lpu.in` | `password123` | Aman Kumar (Reg: 12109845) |
| **Vendor 1** | `whsmith@lpu.in` | `password123` | BH-6 WH-Smith Store |
| **Vendor 2** | `lpumart@lpu.in` | `password123` | LPU Mart (Central Mall) |
| **Vendor 3** | `kaatachuri@lpu.in` | `password123` | Kaata Churi (Food Street BH-6) |

*(You can also use the 1-click "Student Demo" or "Vendor Demo" buttons on the Login page!)*
