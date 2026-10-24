# 🏔️ RockCity Explorer (Version 2.1)
### Local Tourist Day-Visit Planner & Information System for Kurunegala, Sri Lanka

A complete, production-quality MERN web application built in accordance with the **Software Requirements Specification (SRS) Version 2.1**. RockCity Explorer serves tourists exploring Kurunegala (Athugalpura) — the historic city of seven rocks — with interactive maps, deterministic proximity calculations, opening hours intelligence, and a drag-and-drop 1-day itinerary builder.

---

## 📌 1. Critical Fixed Reference Location

All straight-line distance calculations, proximity sorting, travel times, place cards, detail views, and map centers in RockCity Explorer are anchored to a **single fixed Kurunegala reference coordinate**:

* **Latitude:** `7.4692807`
* **Longitude:** `80.4424776`
* **Reference Name:** `Kurunegala Central Reference Point`
* **Average Travel Speed:** `30 km/h` (standard local road speed for duration estimates)

> **Deterministic Rule:** Distances are computed deterministically using the spherical **Haversine formula** from this fixed location. Tourist accounts, registrations, logins, or browser GPS permissions are **never required** for normal distance and travel-time calculations.

---

## 🚀 2. Technology Stack

* **Frontend:**
  * **React.js (Vite)** — Fast, lightweight single-page application.
  * **React Router v6** — Client-side declarative routing.
  * **Responsive Vanilla CSS Design System** — Tailored tokens, CSS variables, glassmorphism, micro-animations, and 320px mobile support.
  * **Leaflet & React-Leaflet** — Free, open-source interactive mapping using OpenStreetMap tile servers (no paid mapping API key required).
  * **@hello-pangea/dnd** — Smooth, accessible drag-and-drop itinerary reordering.
  * **Lucide React** — Modern, consistent icon set.
* **Backend:**
  * **Node.js & Express.js** — Modular REST API with route controllers and middleware.
  * **Mongoose ODM** — Schemas, validation, indexes, and virtual fields.
  * **Turnkey In-Memory MongoDB & Atlas Connector** — Zero-friction local development via `mongodb-memory-server` with turnkey fallback if no local MongoDB instance is running, plus full MongoDB Atlas cloud support.
* **Security & Authentication:**
  * Password hashing via `bcryptjs` (10 salt rounds).
  * Stateless `jsonwebtoken` (JWT) authentication for administrator mutation routes.
  * Custom NoSQL injection protection middleware stripping `$` and `.` operators.
  * Security headers (`X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `X-XSS-Protection`).
  * Generic authentication error messages (`"Invalid username or password."`).
  * Stack trace suppression in production error responses.

---

## 🏗️ 3. Project Architecture & Folder Structure

```
RockCity Explorer-V2.1/
│
├── client/                               # React + Vite Frontend
│   ├── public/                           # Static assets
│   ├── src/
│   │   ├── config/constants.js           # Fixed reference coordinates & travel speeds
│   │   ├── context/
│   │   │   ├── PlanContext.jsx           # Day plan state, max-5 stops, consecutive legs, localStorage
│   │   │   └── AuthContext.jsx           # Admin JWT state, login/logout session
│   │   ├── components/
│   │   │   ├── Navbar.jsx                # Navigation with live plan counter & mobile drawer
│   │   │   ├── Footer.jsx                # Fixed reference coordinates banner & emergency contacts
│   │   │   ├── PlaceCard.jsx             # Card with distance, travel time, open status badge
│   │   │   ├── PlaceSkeletonCard.jsx     # Shimmering loading skeleton cards
│   │   │   ├── FilterBar.jsx             # Search input, category pills, open-now toggle, sort select
│   │   │   ├── MapComponent.jsx          # Leaflet map with error boundary & reference pin
│   │   │   └── AdminMapPicker.jsx        # Embedded Leaflet coordinate picker for Admin form
│   │   ├── pages/
│   │   │   ├── HomePage.jsx              # Hero, reference point banner, categories, highlighted places
│   │   │   ├── PlacesPage.jsx            # Full catalogue with server filtering & empty states
│   │   │   ├── PlaceDetailPage.jsx       # Photo gallery, etiquette, Google Maps directions link
│   │   │   ├── MapPage.jsx               # Dedicated interactive map & synchronized places drawer
│   │   │   ├── PlanPage.jsx              # "Your Day Plan" builder with drag-and-drop reordering
│   │   │   ├── AdminLoginPage.jsx        # Admin sign-in with generic error handling
│   │   │   └── admin/
│   │   │       ├── AdminDashboardPage.jsx # Metrics overview, category stats, recent updates
│   │   │       ├── AdminPlacesPage.jsx    # Places table with soft-delete & restore actions
│   │   │       └── AdminPlaceFormPage.jsx # Add / edit destination with interactive map picker
│   │   ├── services/api.js               # Centralized REST API client
│   │   ├── utils/                        # geoDistance.js, travelTime.js, openStatus.js
│   │   └── styles/index.css              # Global styles, variables, shimmer animations, responsive rules
│   ├── index.html                        # SEO metadata, Google Fonts, Leaflet stylesheet
│   ├── vite.config.js
│   └── package.json
│
├── server/                               # Node.js + Express REST API
│   ├── config/
│   │   ├── constants.js                  # Fixed reference coordinates & defaults
│   │   └── db.js                         # MongoDB connection (Atlas + memory fallback)
│   ├── controllers/
│   │   ├── placeController.js            # Public catalogue (filters, distance calculation, open-now)
│   │   ├── adminPlaceController.js       # Admin CRUD, authoritative duplicate check, soft delete
│   │   ├── categoryController.js         # Category catalogue & place counts
│   │   ├── authController.js             # Admin authentication (username or email login)
│   │   └── planController.js             # Route metrics & consecutive leg distance calculation
│   ├── middleware/
│   │   ├── authMiddleware.js             # JWT bearer verification
│   │   ├── security.js                   # NoSQL injection protection & input sanitization
│   │   └── errorHandler.js               # Centralized error handler without stack trace leak
│   ├── models/
│   │   ├── Place.js                      # Schema, virtuals, soft-delete, indexes
│   │   ├── Category.js                   # Category model
│   │   ├── Admin.js                      # Admin model with bcrypt hashing & matchPassword
│   │   └── VisitPlan.js                  # Saved itinerary model
│   ├── routes/                           # API Route declarations
│   ├── seed/
│   │   ├── seedData.js                   # 12 authentic Kurunegala destinations dataset
│   │   └── seed.js                       # Seeder execution script
│   ├── tests/
│   │   └── suite.test.js                 # Automated 20-point verification test suite
│   ├── .env.example
│   ├── app.js                            # Express app, middleware, routes
│   ├── server.js                         # Server entry point & auto-seeder
│   └── package.json
│
├── .env.example                          # Root environment variables reference
├── .gitignore                            # Ignoring .env, node_modules, build artifacts
├── package.json                          # Monorepo runner scripts
└── README.md                             # Comprehensive project documentation
```

---

## ⚡ 4. Installation & Getting Started

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher
* *(Optional)* Local MongoDB or MongoDB Atlas URI (if not present, an in-memory database starts automatically)

### Quick Start (Monorepo)
From the project root directory:

```bash
# 1. Install dependencies across all packages
npm run install:all

# 2. Run both Backend (Port 5000) and Frontend (Port 5173) concurrently
npm run dev
```

### Running Services Separately
If you prefer running frontend and backend in dedicated terminal windows:

**Terminal 1 — Backend API:**
```bash
cd server
npm install
npm run dev
```
> The API server starts on **http://localhost:5000**. If the database is empty, it automatically seeds 12 authentic Kurunegala places of interest and the default administrator account.

**Terminal 2 — Frontend App:**
```bash
cd client
npm install
npm run dev
```
> The Vite development server starts on **http://localhost:5173**. Open this URL in your web browser.

---

## 🌐 5. Environment Variables

Create a `.env` file in the `server/` directory (or use `.env.example` as a template):

```ini
# Server Port
PORT=5000
NODE_ENV=development

# Database Configuration
# Leave blank to use turnkey in-memory MongoDB, or provide a MongoDB Atlas URI:
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/rockcity_explorer?retryWrites=true&w=majority

# JWT Authentication Secret
JWT_SECRET=rockcity_kurunegala_secure_secret_key_2026_jwt_token_auth
JWT_EXPIRES_IN=7d

# Administrator Default Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=
DEFAULT_ADMIN_EMAIL=admin@rockcity.lk
DEFAULT_ADMIN_PASSWORD=AdminRockCity@2026

# CRITICAL FIXED REFERENCE LOCATION (Kurunegala Reference Point)
REFERENCE_LATITUDE=7.4692807
REFERENCE_LONGITUDE=80.4424776
REFERENCE_LOCATION_NAME=Kurunegala Central Reference Point

# Travel Speed Configuration (Average speed in km/h for road calculations)
AVERAGE_TRAVEL_SPEED_KMH=30
DEFAULT_AVERAGE_SPEED_KMH=30
```

### MongoDB Atlas Setup (Optional Cloud Storage)
1. Log in to [MongoDB Atlas](https://www.mongodb.com/atlas) and create a free Shared Cluster (M0).
2. Under **Database Access**, create a database user with read/write privileges.
3. Under **Network Access**, add IP address `0.0.0.0/0` (allow access from anywhere) or your local IP.
4. Click **Connect** > **Drivers** > copy the connection string.
5. Paste into `server/.env` as `MONGODB_URI=...` and replace `<password>` with your database user password.

---

## 🌱 6. Database Seeding & Initial Catalogue

The initial database contains **12 verified Kurunegala destinations** covering all 4 required tourist categories:

1. **Ethagala (Elephant Rock) & Samadhi Buddha** (`Religious`) — 8.4 km from reference point
2. **Ridi Viharaya (Silver Temple), Ridigama** (`Heritage`) — 10.3 km from reference point
3. **Kurunegala Lake Promenade (Kurunegala Wewa)** (`Nature`) — 8.1 km from reference point
4. **Arankele Forest Monastery & Ancient Hospital** (`Heritage`) — 21.3 km from reference point
5. **Ibbagala (Tortoise Rock) Ancient Viharaya** (`Religious`) — 8.6 km from reference point
6. **Badagamuwa Conservation Forest & Nature Trail** (`Nature`) — 11.0 km from reference point
7. **Panduwasnuwara Ancient Kingdom & Moated Citadel** (`Heritage`) — 29.8 km from reference point
8. **Kurunegala Clock Tower & Heritage Quarter** (`Cultural`) — 8.8 km from reference point
9. **Athkanda Viharaya Ancient Buddhist Monastery** (`Religious`) — 8.8 km from reference point
10. **Andagala (Eel Rock) Scenic Ridge & Viewpoint** (`Nature`) — 9.5 km from reference point
11. **Dambadeniya Ancient Royal Palace Complex** (`Heritage`) — 34.7 km from reference point
12. **Wayamba Traditional Pottery & Handloom Center** (`Cultural`) — 9.7 km from reference point

To re-seed the database manually at any time:
```bash
npm run seed
```

---

## 🔐 7. Administrator Authentication & Management

### Administrator Sign-In
* **URL:** `http://localhost:5173/admin/login`
* **Username / Email:** `admin` (or `admin@rockcity.lk`)
* **Password:** `AdminRockCity@2026`

### Key Security & Admin Features:
* **Generic Error Messages:** Failed logins return `"Invalid username or password."` without disclosing whether the username or password was incorrect.
* **Protected Routes:** All routes under `/api/admin/*` require a valid JWT in the `Authorization: Bearer <token>` header.
* **Authoritative Duplicate Name Validation:** Case-insensitive check before saving rejects duplicates with `"A place with this name already exists."`
* **Soft Delete:** Places are archived via `PATCH /api/admin/places/:id/archive` (`isArchived: true`), hiding them from tourists while retaining them for administrators, with one-click **Restore**.
* **Metadata Tracking:** Records display `createdAt`, `updatedAt`, and `updatedBy`.
* **Embedded Leaflet Map Picker:** Admins can pick coordinates by clicking or dragging a marker on the map in real-time.

---

## 🗺️ 8. One-Day Visit Plan Builder (`/plan`)

* **Maximum 5 Places Limit:** Strictly enforced. If the user attempts to add a 6th destination:
  `"Your one-day plan can contain a maximum of 5 places."`
* **Consecutive Stop Distance Calculation:** Distance is calculated between **consecutive legs** ($Stop_1 \to Stop_2 \to Stop_3$), rather than summing reference distances.
* **Departure Point:** The first stop clearly displays its distance from the fixed reference point `(7.4692807, 80.4424776)`.
* **Drag-and-Drop Reordering:** Reorder destinations using drag handles (`@hello-pangea/dnd`), instantly updating leg distances and travel times in $< 1\text{ms}$.
* **Browser Persistence:** Persists in browser `localStorage`. Fully restores after accidental page refreshes.
* **Empty State:** When no places are added, displays `"Your day plan is empty. Explore places and add your first stop."`
* **External Google Maps Multi-Stop Navigation:** Generates multi-stop Google Maps directions in a new tab without requiring paid API keys.

---

## 📡 9. REST API Endpoints

### Public Tourist Endpoints
| Method | Endpoint | Description | Query Parameters Supported |
|---|---|---|---|
| `GET` | `/api/info` | API metadata & fixed reference coordinates | — |
| `GET` | `/api/places` | List of active destinations | `?category=nature`, `?openNow=true`, `?sort=distance`, `?sort=rating`, `?search=rock` |
| `GET` | `/api/places/:id` | Single destination details & Google Maps directions URL | — |
| `GET` | `/api/categories` | Categories with place counts | — |
| `POST` | `/api/plans/calculate` | Compute consecutive leg distances & travel times | `{ placeIds: [], includeReturn: false }` |
| `POST` | `/api/plans` | Save and generate share code | `{ title, items, notes }` |
| `GET` | `/api/plans/:code` | Retrieve saved plan by code | — |

### Protected Administrative Endpoints (JWT Required)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Authenticate administrator & get JWT |
| `POST` | `/api/auth/logout` | Logout administrator |
| `GET` | `/api/auth/profile` | Current authenticated administrator details |
| `GET` | `/api/admin/places/summary` | Admin dashboard metrics (active, archived, categories) |
| `GET` | `/api/admin/places` | Manage places with filter (`?status=all\|active\|archived`) |
| `POST` | `/api/admin/places` | Create destination with authoritative duplicate check |
| `PUT` | `/api/admin/places/:id` | Update destination details with duplicate check |
| `PATCH` | `/api/admin/places/:id/archive` | Soft-delete (archive) destination |
| `PATCH` | `/api/admin/places/:id/restore` | Restore archived destination to public view |

---

## 🧪 10. Automated Testing

The project includes an automated test suite covering all SRS Section 40 requirements:

```bash
# Run the automated test suite
npm test
```

### Verification Coverage:
1. **Distance & Haversine:**
   * Reference coordinate verification (`7.4692807, 80.4424776`).
   * Haversine spherical math accuracy.
   * Travel time estimation at 30 km/h.
2. **Places & Open Now:**
   * Active places listing and distance formatting.
   * Server-side category filtering (`?category=nature`).
   * Proximity sorting (`?sort=distance`) and rating sorting (`?sort=rating`).
   * Asia/Colombo timezone evaluation and unknown schedule handling.
3. **Admin & Security:**
   * Valid login and JWT token generation.
   * Generic error handling on invalid credentials (`"Invalid username or password."`).
   * Unauthorized request rejection (401).
   * Destination creation, authoritative duplicate validation (`"A place with this name already exists."`), update, soft-delete, and restoration.
4. **Visit Plan:**
   * Consecutive leg distance and duration calculation.
   * Maximum 5 stops enforcement (`"Your one-day plan can contain a maximum of 5 places."`).

---

## 📦 11. Deployment Considerations

* **Frontend Production Build:**
  ```bash
  npm run build
  ```
  Generates minified static assets in `client/dist/`.
* **Hosting Options:**
  * **Frontend:** Vercel, Netlify, or AWS S3 + CloudFront.
  * **Backend:** Render, Railway, AWS App Runner, or Heroku.
  * **Database:** MongoDB Atlas M0 (Free Tier).
* **Production Environment Variables:** Set `NODE_ENV=production` on the production server to automatically suppress all internal stack traces from error responses.

---

## 📄 License
Academic Coursework Project — Kurunegala Day-Visit Tourism System (Version 2.1).
Developed for University Programming Demonstration.
#   R o c k C i t y - E x p l o r e r  
 