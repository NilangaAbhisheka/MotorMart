# MotorMart — Project Overview

## Summary
MotorMart is a full‑stack vehicle auction marketplace built as a monorepo with a React + Vite frontend and an ASP.NET Core 9 Web API backend backed by MySQL via Entity Framework Core. It supports browsing/filtering active auctions, rich vehicle detail pages with multiple images, authenticated bidding, watchlists, seller listings, image uploads, and seller‑side auction controls (pause/extend).

## Repository Structure
```
MotorMart/
├─ MotorMart-Frontend/           # React 18 + Vite + Tailwind CSS 4
│  ├─ src/
│  │  ├─ api/axios.js           # Axios instance with auth header + baseURL
│  │  ├─ components/            # Reusable UI components
│  │  ├─ pages/                 # Route pages (Home, Shop, Details, Login, etc.)
│  │  │  ├─ admin/              # Admin Portal pages
│  │  │  │  ├─ AdminLayout.jsx  # Admin sidebar layout
│  │  │  │  ├─ AdminDashboard.jsx
│  │  │  │  ├─ AdminUsers.jsx
│  │  │  │  ├─ AdminVehicles.jsx
│  │  │  │  ├─ AdminBids.jsx
│  │  │  │  ├─ AdminReports.jsx
│  │  │  │  └─ AdminSettings.jsx
│  │  ├─ routes/ProtectedRoute.jsx
│  │  ├─ state/AuthContext.jsx  # Auth state (token + user)
│  │  ├─ styles/                # Tailwind + app CSS
│  │  └─ main.jsx               # App entry, providers, router
│  ├─ index.html
│  ├─ vite.config.js            # Dev server on 5173
│  ├─ tailwind.config.js
│  └─ postcss.config.js
│
├─ MotorMart-Backend/            # ASP.NET Core 9 Web API + EF Core (MySQL)
│  ├─ Controllers/              # REST endpoints
│  │  ├─ UsersController.cs     # Auth (register/login)
│  │  ├─ VehiclesController.cs  # Listings CRUD + seller inventory
│  │  ├─ BidsController.cs      # Bidding
│  │  ├─ WatchlistController.cs # Watchlist management
│  │  ├─ UploadsController.cs   # Image uploads (single/multiple)
│  │  ├─ AuctionController.cs   # Pause/extend/status controls
│  │  └─ AdminController.cs     # Admin portal endpoints
│  ├─ Data/AppDbContext.cs      # EF Core DbContext
│  ├─ Models/                   # Entities (User, Vehicle, Bid, etc.)
│  ├─ Migrations/               # EF Core migrations
│  │  └─ AddAdminFields.sql     # Admin portal database updates
│  ├─ Properties/launchSettings.json # http://localhost:5190
│  ├─ Program.cs                # CORS, AuthN/Z, Swagger, static uploads
│  ├─ appsettings.json          # Connection string + JWT config (dev)
│  └─ uploads/                  # Uploaded vehicle images (created at runtime)
├─ seed_data.sql                # MySQL seed script with demo data
├─ init_db.ps1                  # PowerShell script to import seed data
├─ ADMIN_PORTAL.md              # Admin portal documentation
└─ ProjectOverview.md           # This document
```

## Tech Stack
- **Frontend**
  - React 18 (`react`, `react-dom`)
  - Vite 5 (`vite`, `@vitejs/plugin-react`)
  - React Router DOM 7 (`react-router-dom`)
  - Tailwind CSS 4 + PostCSS + Autoprefixer
  - Axios for HTTP (`src/api/axios.js`)
- **Backend**
  - ASP.NET Core 9 Web API
  - EF Core 9 + Pomelo MySQL provider
  - JWT Authentication (`Microsoft.AspNetCore.Authentication.JwtBearer`)
  - Swagger/OpenAPI (`Swashbuckle.AspNetCore`)
- **Database**
  - MySQL

## Key Features
- **Authentication**
  - Register and login with JWT (`UsersController.cs`)
  - Client‑side auth context with token persistence (`src/state/AuthContext.jsx`)
  - Role‑based route protection (`src/routes/ProtectedRoute.jsx`, roles: Buyer | Seller | Admin)

- **Vehicle Listings**
  - Browse active auctions with filters/sorting (`VehiclesController.GetActive` supports `make`, `bodyType`, price/year ranges, `sort`)
  - Vehicle details with seller info and multiple images (`VehiclesController.GetById`)

- **Bidding**
  - Authenticated bid placement with validation rules (`BidsController.PlaceBid`)
  - Bid history per vehicle (`BidsController.GetBidsForVehicle`)

- **Watchlist**
  - Add/remove and list user watchlist (`WatchlistController`)
  - Check watch status per vehicle

- **Seller Tools**
  - Create/Update/Delete vehicles (role: Seller/Admin) (`VehiclesController`)
  - View seller’s own inventory (`VehiclesController.GetBySeller`)
  - Pause/resume and extend auctions; check status (`AuctionController`)

- **Uploads**
  - Authenticated image uploads (single/multiple) with validation; served under `/uploads` (`UploadsController`, `Program.cs` static file config)

- **Admin Portal** 🆕
  - Dedicated admin dashboard at `/admin/dashboard`
  - User management (verify, ban/unban, delete)
  - Vehicle/auction management (pause, close, delete)
  - Bid monitoring and moderation
  - Analytics and reports (popular makes, top sellers, highest bids)
  - System settings configuration
  - All endpoints protected with Admin role authorization

### Admin Portal Details
This section consolidates the separate `ADMIN_PORTAL.md` and `ADMIN_SETUP_GUIDE.md` into one place.

#### Features and Pages
- Dashboard: statistics, recent activity, quick actions
- Users: list/filter, verify sellers, ban/unban, delete (no admin deletion)
- Vehicles: list/filter, pause/resume, close with/without sale, delete
- Bids: list, statistics (total bids/value, unique bidders), delete bid with price recalculation
- Reports: auction overview, average duration, popular makes, top sellers, highest bids
- Settings: site name, max auction duration, commission rate, maintenance mode; platform info and system actions

#### Admin API Endpoints
All admin endpoints require `Authorization: Bearer <token>` with role `Admin`.
```
GET  /api/admin/stats
GET  /api/admin/recent-auctions
GET  /api/admin/recent-users
GET  /api/admin/users
PATCH /api/admin/users/{id}/verify
PATCH /api/admin/users/{id}/status
DELETE /api/admin/users/{id}
GET  /api/admin/vehicles
PATCH /api/admin/vehicles/{id}
DELETE /api/admin/vehicles/{id}
POST /api/admin/auction/pause/{id}
POST /api/admin/auction/close/{id}
GET  /api/admin/bids
DELETE /api/admin/bids/{id}
GET  /api/admin/reports
GET  /api/admin/settings
POST /api/admin/settings
```

#### UI/UX Notes
- Persistent sidebar with active highlighting
- Responsive, sortable tables with status badges
- Toast notifications, loading and error states
- Filters and search across entities

#### Security
- Role-based access control; non-admins redirected
- Admin users cannot be deleted
- Confirmation modals for destructive actions

#### Setup (Quick Start)
1) Apply database changes (EF Core or SQL)
2) Import seed data
3) Start backend (`http://localhost:5190`)
4) Start frontend (`http://localhost:5173`)
5) Login at `/login` with admin credentials → redirected to `/admin/dashboard`

#### Testing Checklist (Admin)
- Login redirects to admin dashboard
- Dashboard statistics and recent lists render correctly
- Users: filter/search, verify seller, ban/unban, delete non-admin, protect admin
- Vehicles: filter/search, pause/resume, close with/without sale, delete
- Bids: list, delete bid, updates current price if needed
- Reports: overview cards, popular makes, top sellers, highest bids
- Settings: update values, maintenance mode toggle, system info
- Logout and route protection

#### Troubleshooting
- Admin access issues: check role claim in JWT and database role value
- Statistics not loading: backend running on 5190, CORS allows 5173
- DB errors: ensure `IsActive`, `CreatedAt`, `SoldToUserId` exist; check FKs

#### Demo Credentials
| Role   | Email                    | Password |
|--------|--------------------------|----------|
| Admin  | admin@motormart.com      | admin123 |
| Seller | john.seller@motormart.com| seller123|
| Buyer  | mike.buyer@motormart.com | buyer123 |

## Frontend Application
- **Entry**: `src/main.jsx` mounts `App`, wraps with `AuthProvider`, `ToastProvider`, and `BrowserRouter`.
- **Routing**: `src/pages/App.jsx`
  - `/` Home
  - `/shop` Listings
  - `/about`, `/contact`
  - `/vehicle/:id` Vehicle details
  - `/login`, `/register`
  - Protected: `/add-vehicle`, `/my-bids`, `/my-watchlist`, `/seller`
  - Admin Portal: `/admin/dashboard`, `/admin/users`, `/admin/vehicles`, `/admin/bids`, `/admin/reports`, `/admin/settings`
- **Auth State**: `src/state/AuthContext.jsx`
  - Persists `token` and `user` to `localStorage`. Exposes `login()`/`logout()`.
- **HTTP Client**: `src/api/axios.js`
  - `baseURL` = `VITE_API_URL` or `http://localhost:5190`
  - Attaches `Authorization: Bearer <token>` if present
- **Styling**
  - Tailwind CSS 4, content paths in `tailwind.config.js`
  - Global styles under `src/styles/`

## Backend Application
- **Hosting**: `Properties/launchSettings.json` sets `http://localhost:5190`
- **CORS**: Policy `FrontendPolicy` allows origin `http://localhost:5173` (`Program.cs`)
- **Authentication**: JWT with issuer/audience/key from config (`Program.cs`, `Services/TokenService.cs`)
- **Data Access**: EF Core to MySQL (`appsettings.json` connection string; `Pomelo.EntityFrameworkCore.MySql`)
- **Static Files**: Serves physical `uploads/` directory at `/uploads`
- **Swagger**: Enabled in Development

### Data Models (selected)
- `User`: `Id`, `Username`, `Email`, `PasswordHash`, `Role`, `IsVerified`
- `Vehicle`: listing fields + trust/clarity fields (`Vin`, `ServiceHistory`, `OwnershipCount`, `ConditionGrade`, `HighlightChips`), relations to `User`, `Bids`, `Images`, `Watchlists`, `Winner`
- `Bid`: `Amount`, `TimePlaced`, `UserId`, `VehicleId`
- `Watchlist`: `UserId`, `VehicleId`, `AddedAt`
- `VehicleImages`: `VehicleId`, `ImageUrl`, `DisplayOrder`

## REST API Overview
Base URL defaults to `http://localhost:5190`.

- **Auth — `api/Users`**
  - `POST /api/Users/register` body: `{ username, email, password, role? }`
  - `POST /api/Users/login` body: `{ email, password }` → `{ token, user }`

- **Vehicles — `api/Vehicles`**
  - `GET /api/Vehicles` query: `make?`, `bodyType?`, `minPrice?`, `maxPrice?`, `minYear?`, `maxYear?`, `minMileage?`, `maxMileage?`, `sort?`
  - `GET /api/Vehicles/{id}`
  - `POST /api/Vehicles` (Seller/Admin) body: `CreateVehicleRequest` (+ optional `Images[]`)
  - `PUT /api/Vehicles/{id}` (Seller/Admin) body: `UpdateVehicleRequest`
  - `DELETE /api/Vehicles/{id}` (Seller/Admin)
  - `GET /api/Vehicles/seller/{sellerId}` (Seller/Admin; self or Admin)

- **Bids — `api/Bids`**
  - `GET /api/Bids/vehicle/{vehicleId}`
  - `POST /api/Bids` (Auth) body: `{ vehicleId, amount }`

- **Watchlist — `api/Watchlist`** (Auth)
  - `GET /api/Watchlist`
  - `POST /api/Watchlist/{vehicleId}`
  - `DELETE /api/Watchlist/{vehicleId}`
  - `GET /api/Watchlist/check/{vehicleId}` → `{ isInWatchlist }`

- **Uploads — `api/Uploads`** (Auth)
  - `POST /api/Uploads` form‑data: `file`
  - `POST /api/Uploads/multiple` form‑data: `files[]`

- **Auction — `api/Auction`** (Seller/Admin)
  - `POST /api/Auction/pause/{vehicleId}`
  - `POST /api/Auction/extend/{vehicleId}` body: `{ extendMinutes? }`
  - `GET /api/Auction/status/{vehicleId}`

## 🚀 Getting Started — Complete Setup Guide

### Prerequisites
Before you begin, ensure you have the following installed:
- **Node.js** (LTS version 18.x or higher) + npm
- **.NET SDK 9.x** ([Download](https://dotnet.microsoft.com/download))
- **MySQL 8.x** ([Download](https://dev.mysql.com/downloads/mysql/))
- **Git** (optional, for cloning)

### Step 1: Database Setup

#### 1.1 Create the Database
Open MySQL command line or MySQL Workbench and create the database:

```sql
CREATE DATABASE motormart CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### 1.2 Configure Connection String
Navigate to `MotorMart-Backend/appsettings.json` and update the connection string:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "server=localhost;port=3306;database=motormart;user=root;password=YOUR_PASSWORD;"
  }
}
```

**Important:** Replace `YOUR_PASSWORD` with your actual MySQL root password.

#### 1.3 Apply Database Migrations
Open a terminal in the `MotorMart-Backend/` directory and run:

```bash
# Install EF Core tools (first time only)
dotnet tool install --global dotnet-ef

# Apply migrations to create tables
dotnet ef database update
```

This will create all necessary tables (Users, Vehicles, Bids, Watchlists, VehicleImages, Winners).

#### 1.4 Import Seed Data
To populate the database with demo data, use one of these methods:

**Option A: Using PowerShell Script (Windows)**
```powershell
# From the MotorMart/ root directory
.\init_db.ps1
```

**Option B: Using MySQL Command Line**
```bash
# From the MotorMart/ root directory
mysql -u root -p motormart < seed_data.sql
```

**Option C: Using MySQL Workbench**
1. Open MySQL Workbench
2. Connect to your MySQL server
3. Select the `motormart` database
4. Go to File → Run SQL Script
5. Select `seed_data.sql` and execute

**Verify Data Import:**
```sql
USE motormart;
SELECT COUNT(*) FROM Users;      -- Should return 5
SELECT COUNT(*) FROM Vehicles;   -- Should return 6
SELECT COUNT(*) FROM Bids;       -- Should return 13
```

### Step 2: Backend Setup

#### 2.1 Configure JWT Settings
In `MotorMart-Backend/appsettings.json`, ensure JWT settings are configured:

```json
{
  "Jwt": {
    "Key": "YourSuperSecretKeyThatIsAtLeast32CharactersLong!",
    "Issuer": "MotorMartAPI",
    "Audience": "MotorMartClient"
  }
}
```

#### 2.2 Start the Backend
Open a terminal in `MotorMart-Backend/` and run:

```bash
dotnet run
```

The API will start at: **http://localhost:5190**

**Verify Backend is Running:**
- Open browser to http://localhost:5190/swagger
- You should see the Swagger API documentation

### Step 3: Frontend Setup

#### 3.1 Install Dependencies
Open a terminal in `MotorMart-Frontend/` and run:

```bash
npm install
```

#### 3.2 Configure API URL (Optional)
Create a `.env` file in `MotorMart-Frontend/` (optional, defaults to localhost:5190):

```env
VITE_API_URL=http://localhost:5190
```

#### 3.3 Start the Frontend
In the same terminal, run:

```bash
npm run dev
```

The frontend will start at: **http://localhost:5173**

### Step 4: Access the Application

Open your browser and navigate to: **http://localhost:5173**

## User Journeys

### Public (Unauthenticated)
- Routes: `/`, `/shop`, `/vehicle/:id`, `/about`, `/contact`
- Actions: browse and filter auctions, view vehicle details with images and specs
- Protections: bid/watchlist/actions prompt login; API access is read-only

### Buyer
- Routes: `/login`, `/register`, `/my-bids`, `/my-watchlist`
- Actions: place bids, view bid history, manage watchlist
- Protections: authenticated endpoints require token; cannot access seller/admin-only routes

### Seller
- Routes: `/seller` (dashboard), `/add-vehicle`, `/vehicle/:id` (manage)
- Actions: create/update/delete listings, upload images, pause/resume, extend auctions
- Protections: role=Seller|Admin; can only manage own listings unless Admin

### Admin
- Routes: `/admin/dashboard`, `/admin/users`, `/admin/vehicles`, `/admin/bids`, `/admin/reports`, `/admin/settings`
- Actions: verify/ban/delete users, pause/close/delete vehicles, moderate bids, view analytics, configure settings
- Protections: role=Admin; guarded frontend routes and backend `[Authorize(Roles="Admin")]`

## 🔐 Demo Credentials

Use these credentials to test different user roles:

| Role   | Email                          | Password   | Description                    |
|--------|--------------------------------|------------|--------------------------------|
| Admin  | admin@motormart.com            | admin123   | Full system access             |
| Seller | john.seller@motormart.com      | seller123  | Can create/manage vehicles     |
| Seller | sarah.dealer@motormart.com     | seller123  | Another seller account         |
| Buyer  | mike.buyer@motormart.com       | buyer123   | Can bid and use watchlist      |
| Buyer  | emma.customer@motormart.com    | buyer123   | Another buyer account          |

## 🎯 Feature Walkthrough

### For Buyers (mike.buyer@motormart.com / buyer123)

1. **Browse Vehicles**
   - Visit the Home page to see featured auctions
   - Click "Shop" to view all active auctions
   - Use filters to search by make, body type, price range, etc.

2. **Place Bids**
   - Click on any vehicle to view details
   - Enter a bid amount higher than the current price
   - Click "Place Bid" to submit
   - View your bid in the "My Bids" page

3. **Watchlist**
   - Click the heart icon on any vehicle card to add to watchlist
   - View saved vehicles in "My Watchlist" page
   - Click heart again to remove from watchlist

4. **View Bid History**
   - Go to "My Bids" to see all vehicles you've bid on
   - Track auction end times and current highest bids

### For Sellers (john.seller@motormart.com / seller123)

1. **Add New Vehicle**
   - Navigate to "Seller Dashboard"
   - Click "Add New Vehicle"
   - Fill in vehicle details (title, make, model, year, etc.)
   - Upload up to 5 images (select cover image)
   - Set starting price, reserve price, and auction end time
   - Add trust features (VIN, service history, condition grade)
   - Click "Create Auction"

2. **Manage Auctions**
   - View all your active and ended auctions in the dashboard
   - **Pause/Resume:** Click "Pause" to temporarily stop bidding
   - **Extend Auction:** Add more time to an active auction
   - Monitor current bids and bid counts

3. **Upload Images**
   - When creating a vehicle, click the upload area
   - Select multiple images (up to 5, max 20MB each)
   - Set one image as the cover (main listing image)
   - Images are stored in `MotorMart-Backend/uploads/`

### For Admins (admin@motormart.com / admin123)

**Admin Portal Access:** `http://localhost:5173/admin/dashboard`

Admins have access to a dedicated admin portal with comprehensive management tools:

1. **Dashboard Overview**
   - View platform statistics (users, auctions, bids, revenue)
   - Monitor recent activity
   - Quick access to all management features

2. **User Management** (`/admin/users`)
   - View all users with filtering options
   - Verify seller accounts
   - Ban/unban users
   - Delete user accounts (except admins)
   - Search by username or email

3. **Vehicle Management** (`/admin/vehicles`)
   - View all vehicles and auctions
   - Filter by status (active, ended, paused, sold)
   - Pause/resume auctions
   - Close auctions (with or without sale)
   - Delete vehicle listings

4. **Bid Management** (`/admin/bids`)
   - View all bids across platform
   - Monitor bid statistics
   - Delete invalid or suspicious bids

5. **Reports & Analytics** (`/admin/reports`)
   - Popular car makes
   - Top sellers by revenue
   - Highest bids
   - Average auction duration
   - Export options (CSV/PDF)

6. **System Settings** (`/admin/settings`)
   - Configure site name
   - Set maximum auction duration
   - Adjust commission rates
   - Enable maintenance mode
   - System actions (cache, backup)

**Note:** After logging in as admin, you'll be automatically redirected to the admin dashboard.

## 📁 Uploads Folder

Vehicle images are stored locally in `MotorMart-Backend/uploads/`:
- Created automatically when first image is uploaded
- Images are served at `http://localhost:5190/uploads/{filename}`
- Supported formats: JPG, PNG, GIF, WebP
- Max file size: 20MB per image

**Note:** The `uploads/` folder is not included in the repository. It will be created automatically when you upload your first image.

## Environment & Configuration
- **Frontend**
  - `VITE_API_URL` — API base URL (defaults to `http://localhost:5190`)
- **Backend**
  - `ASPNETCORE_ENVIRONMENT` — `Development` enables Swagger
  - `ConnectionStrings__DefaultConnection` — MySQL connection string
  - `Jwt__Key`, `Jwt__Issuer`, `Jwt__Audience` — JWT settings
- **CORS**
  - Allowed origin: `http://localhost:5173` (`Program.cs` policy `FrontendPolicy`)

## 📜 Available Scripts

### Frontend Scripts
Run these from `MotorMart-Frontend/` directory:

```bash
npm run dev       # Start Vite dev server on http://localhost:5173
npm run build     # Production build (creates dist/ folder)
npm run preview   # Preview production build locally
npm run lint      # Run ESLint (if configured)
```

### Backend Scripts
Run these from `MotorMart-Backend/` directory:

```bash
dotnet run                    # Start the API server
dotnet watch run              # Start with hot reload
dotnet ef database update     # Apply migrations
dotnet ef migrations add <Name>  # Create new migration
```

### Database Scripts
Run from `MotorMart/` root directory:

```powershell
# Windows PowerShell
.\init_db.ps1                 # Import seed data (interactive)
```

```bash
# MySQL Command Line
mysql -u root -p motormart < seed_data.sql
```

## 🐛 Troubleshooting

### Database Connection Issues

**Problem:** `Unable to connect to MySQL server`

**Solutions:**
1. Verify MySQL service is running:
   ```bash
   # Windows
   net start MySQL80
   
   # Check status
   mysql -u root -p -e "SELECT 1;"
   ```

2. Check connection string in `appsettings.json`:
   - Correct server: `localhost` or `127.0.0.1`
   - Correct port: `3306` (default)
   - Correct username and password
   - Database exists: `motormart`

3. Test connection manually:
   ```bash
   mysql -u root -p motormart
   ```

### Migration Issues

**Problem:** `Pending model changes` or `No migrations found`

**Solution:**
```bash
cd MotorMart-Backend
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### Frontend Can't Connect to Backend

**Problem:** `Network Error` or `CORS policy` errors

**Solutions:**
1. Verify backend is running at http://localhost:5190
2. Check browser console for specific error
3. Ensure CORS is configured in `Program.cs`:
   ```csharp
   builder.Services.AddCors(options => {
       options.AddPolicy("FrontendPolicy", policy => {
           policy.WithOrigins("http://localhost:5173")
                 .AllowAnyHeader()
                 .AllowAnyMethod();
       });
   });
   ```

### Images Not Displaying

**Problem:** Uploaded images show broken image icon

**Solutions:**
1. Check `uploads/` folder exists in `MotorMart-Backend/`
2. Verify backend serves static files (`Program.cs`):
   ```csharp
   app.UseStaticFiles(new StaticFileOptions {
       FileProvider = new PhysicalFileProvider(
           Path.Combine(builder.Environment.ContentRootPath, "uploads")),
       RequestPath = "/uploads"
   });
   ```
3. Check image URLs in database start with `/uploads/`
4. Verify frontend uses `getImageUrl()` helper function

### Seed Data Import Fails

**Problem:** Foreign key constraint errors

**Solution:**
```sql
-- Run this before importing seed_data.sql
USE motormart;
SET FOREIGN_KEY_CHECKS = 0;
SOURCE seed_data.sql;
SET FOREIGN_KEY_CHECKS = 1;
```

### Port Already in Use

**Problem:** `Address already in use: localhost:5190` or `localhost:5173`

**Solutions:**
```bash
# Windows - Find and kill process using port
netstat -ano | findstr :5190
taskkill /PID <PID> /F

# Or change port in launchSettings.json (backend)
# Or change port in vite.config.js (frontend)
```

## 📊 Sample Data Overview

The `seed_data.sql` script includes:

| Table          | Records | Description                                    |
|----------------|---------|------------------------------------------------|
| Users          | 5       | 1 Admin, 2 Sellers, 2 Buyers                  |
| Vehicles       | 6       | 5 active auctions, 1 ended auction            |
| Bids           | 13      | Bids from buyers on various vehicles           |
| Watchlists     | 5       | Saved vehicles by buyers                       |
| VehicleImages  | 12      | Additional photos for vehicles (2-3 per car)   |
| Winners        | 1       | Winner of the ended Toyota Camry auction       |

**Vehicle Highlights:**
- 2020 BMW 3 Series (Sedan) - $32,500 current bid
- 2019 Tesla Model 3 (Electric) - $45,000 current bid
- 2018 Ford F-150 Raptor (Pick Up) - $51,000 current bid
- 2021 Porsche 911 (Sports) - $98,000 current bid
- 2017 Honda CR-V (SUV) - $20,500 current bid
- 2016 Toyota Camry (Ended) - Sold for $14,500

## 🎓 Assignment Notes

### Local Development Only
- This project is configured for **localhost development only**
- No deployment configuration included
- Database credentials are stored in `appsettings.json` (not secure for production)
- JWT secret key is hardcoded (acceptable for school projects)

### What's Included
✅ Complete full-stack implementation  
✅ User authentication with JWT  
✅ Role-based authorization (Admin, Seller, Buyer)  
✅ Real-time auction bidding  
✅ Image upload functionality  
✅ Watchlist feature  
✅ Seller dashboard with auction controls  
✅ **Admin Portal with full management capabilities** 🆕  
✅ Responsive UI with Tailwind CSS  
✅ Sample data for testing  
✅ Comprehensive documentation  

### Testing Checklist
Use this checklist to verify all features work:

**Public & User Features:**
- [ ] Register new user account
- [ ] Login with demo credentials
- [ ] Browse vehicles on Home and Shop pages
- [ ] Filter vehicles by make, body type, price
- [ ] View vehicle details with image gallery
- [ ] Place bid on active auction (as Buyer)
- [ ] Add vehicle to watchlist (heart icon)
- [ ] View "My Bids" page
- [ ] View "My Watchlist" page
- [ ] Create new vehicle listing (as Seller)
- [ ] Upload multiple images for vehicle
- [ ] View Seller Dashboard
- [ ] Pause/Resume auction (as Seller)
- [ ] Extend auction time (as Seller)
- [ ] Verify ended auctions display correctly

**Admin Portal Features:** 🆕
- [ ] Login as admin redirects to `/admin/dashboard`
- [ ] Dashboard shows correct statistics
- [ ] View and filter users in User Management
- [ ] Verify a seller account
- [ ] Ban/unban a user
- [ ] Delete a non-admin user
- [ ] View and filter vehicles
- [ ] Pause/resume an auction (as Admin)
- [ ] Close an auction with/without sale
- [ ] Delete a vehicle listing
- [ ] View all bids across platform
- [ ] Delete a bid
- [ ] View reports and analytics
- [ ] Update system settings
- [ ] Logout from admin portal

## 📚 Additional Resources

### Entity Relationship Diagram
```
Users (1) ──< (M) Vehicles
Users (1) ──< (M) Bids
Users (1) ──< (M) Watchlists
Vehicles (1) ──< (M) Bids
Vehicles (1) ──< (M) VehicleImages
Vehicles (1) ──< (M) Watchlists
Vehicles (1) ──── (1) Winners
```

### Key Technologies Documentation
- [ASP.NET Core](https://docs.microsoft.com/en-us/aspnet/core/)
- [Entity Framework Core](https://docs.microsoft.com/en-us/ef/core/)
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MySQL](https://dev.mysql.com/doc/)

## 🔒 Security Notes (For Assignment)

**Current Implementation (Development Only):**
- Passwords hashed with SHA256 (basic, not production-ready)
- JWT tokens stored in localStorage (vulnerable to XSS)
- No HTTPS enforcement
- CORS allows localhost:5173 only
- No rate limiting on API endpoints
- File uploads limited to 20MB per file

**For Production (Not Implemented):**
- Use bcrypt or Argon2 for password hashing
- Implement refresh tokens
- Use httpOnly cookies for token storage
- Enable HTTPS/TLS
- Add rate limiting and request throttling
- Implement file type validation and virus scanning
- Use environment variables for all secrets
- Add logging and monitoring

## 📝 Known Limitations

1. **Auction End Handling:** No automatic auction closing mechanism (would require background service)
2. **Real-time Updates:** No WebSocket/SignalR for live bid updates
3. **Email Notifications:** No email service integration
4. **Payment Processing:** No payment gateway integration
5. **Search:** Basic filtering only, no full-text search
6. **Mobile App:** Web-only, no native mobile apps

## Known Defaults
- Frontend dev: `http://localhost:5173` (`vite.config.js`)
- Backend dev: `http://localhost:5190` (`launchSettings.json`)
- Static uploads path: `/uploads/*` served from `MotorMart-Backend/uploads/`
- Database: `motormart` on MySQL localhost:3306

---
For questions or issues, refer to the troubleshooting section above.
