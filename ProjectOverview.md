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
│  │  └─ AuctionController.cs   # Pause/extend/status controls
│  ├─ Data/AppDbContext.cs      # EF Core DbContext
│  ├─ Models/                   # Entities (User, Vehicle, Bid, etc.)
│  ├─ Migrations/               # EF Core migrations
│  ├─ Properties/launchSettings.json # http://localhost:5190
│  ├─ Program.cs                # CORS, AuthN/Z, Swagger, static uploads
│  └─ appsettings.json          # Connection string + JWT config (dev)
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

## Frontend Application
- **Entry**: `src/main.jsx` mounts `App`, wraps with `AuthProvider`, `ToastProvider`, and `BrowserRouter`.
- **Routing**: `src/pages/App.jsx`
  - `/` Home
  - `/shop` Listings
  - `/about`, `/contact`
  - `/vehicle/:id` Vehicle details
  - `/login`, `/register`
  - Protected: `/add-vehicle`, `/my-bids`, `/my-watchlist`, `/seller`
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

## Local Development
### Prerequisites
- Node.js (LTS) + npm
- .NET SDK 9.x
- MySQL 8.x (ensure a database exists, e.g. `motormart`)

### Backend — Run
- Configure connection string and JWT in environment variables (recommended) or `appsettings.json` (development only):
  - `ConnectionStrings__DefaultConnection="server=localhost;port=3306;database=motormart;user=<user>;password=<password>;"`
  - `Jwt__Key`, `Jwt__Issuer`, `Jwt__Audience`
- Apply migrations (optional via CLI if you use migrations):
  - `dotnet tool install -g dotnet-ef` (once)
  - `dotnet ef database update` (run from `MotorMart-Backend/`)
- Start API:
  - `dotnet run` → http://localhost:5190
  - Swagger UI in Development

### Frontend — Run
- Configure API base URL (optional):
  - Create `.env` in `MotorMart-Frontend/` with `VITE_API_URL=http://localhost:5190`
- Install deps and start dev server:
  - `npm install`
  - `npm run dev` → http://localhost:5173

## Environment & Configuration
- **Frontend**
  - `VITE_API_URL` — API base URL (defaults to `http://localhost:5190`)
- **Backend**
  - `ASPNETCORE_ENVIRONMENT` — `Development` enables Swagger
  - `ConnectionStrings__DefaultConnection` — MySQL connection string
  - `Jwt__Key`, `Jwt__Issuer`, `Jwt__Audience` — JWT settings
- **CORS**
  - Allowed origin: `http://localhost:5173` (`Program.cs` policy `FrontendPolicy`)

## Scripts
- **Frontend (`MotorMart-Frontend/package.json`)**
  - `npm run dev` — Start Vite dev server on 5173
  - `npm run build` — Production build
  - `npm run preview` — Preview built app

## Production Notes
- Set strong `Jwt__Key` and do not commit secrets
- Serve frontend build via a static host/CDN; point it at the backend base URL
- Harden CORS and HTTPS in production
- Store uploads on durable storage (e.g., S3/Blob) and serve via CDN if needed

## Known Defaults
- Frontend dev: `http://localhost:5173` (`vite.config.js`)
- Backend dev: `http://localhost:5190` (`launchSettings.json`)
- Static uploads path: `/uploads/*` served from `MotorMart-Backend/uploads/`
