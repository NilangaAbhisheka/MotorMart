# MotorMart - Vehicle Auction Platform

> **📚 School Assignment Project** - Local Development Only

A full-stack vehicle auction marketplace built with React, ASP.NET Core, and MySQL.

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18+ and npm
- .NET SDK 9.x
- MySQL 8.x

### 2. Database Setup
```bash
# Create database
mysql -u root -p -e "CREATE DATABASE motormart;"

# Apply migrations
cd MotorMart-Backend
dotnet ef database update

# Import seed data
cd ..
.\init_db.ps1
```

### 3. Start Backend
```bash
cd MotorMart-Backend
dotnet run
# API: http://localhost:5190
```

### 4. Start Frontend
```bash
cd MotorMart-Frontend
npm install
npm run dev
# App: http://localhost:5173
```

## 🔐 Demo Credentials

| Role   | Email                       | Password   |
|--------|-----------------------------|------------|
| Admin  | admin@motormart.com         | admin123   |
| Seller | john.seller@motormart.com   | seller123  |
| Buyer  | mike.buyer@motormart.com    | buyer123   |

## 📖 Full Documentation

- **Single source of truth:** [ProjectOverview.md](./ProjectOverview.md)
- **Verification guide:** [VERIFICATION_CHECKLIST.md](./VERIFICATION_CHECKLIST.md)

## ✨ Features

- 🔐 JWT Authentication & Role-based Authorization
- 🚗 Vehicle Listings with Multiple Images
- 💰 Real-time Auction Bidding
- ❤️ Watchlist Management
- 📊 Seller Dashboard with Auction Controls
- 🏛️ **Admin Portal** - Complete platform management
- 📤 Image Upload (up to 5 per vehicle)
- 🎨 Modern UI with Tailwind CSS

## 🛠️ Tech Stack

**Frontend:** React 18, Vite, Tailwind CSS, React Router  
**Backend:** ASP.NET Core 9, Entity Framework Core  
**Database:** MySQL 8.x  
**Authentication:** JWT Bearer Tokens

## 📁 Project Structure

```
MotorMart/
├── MotorMart-Frontend/    # React + Vite app
├── MotorMart-Backend/     # ASP.NET Core Web API
├── seed_data.sql          # Sample data script
├── init_db.ps1            # Database import script
└── ProjectOverview.md     # Complete documentation
```

## 🐛 Common Issues

**Can't connect to database?**
- Check MySQL is running: `net start MySQL80`
- Verify connection string in `appsettings.json`

**Images not showing?**
- Ensure backend is running at http://localhost:5190
- Check `uploads/` folder exists in backend directory

**Port already in use?**
```bash
netstat -ano | findstr :5190
taskkill /PID <PID> /F
```

For more troubleshooting, see [ProjectOverview.md](./ProjectOverview.md#-troubleshooting)

## 📝 Assignment Checklist

- [x] Full-stack implementation
- [x] User authentication
- [x] Role-based access control
- [x] CRUD operations
- [x] File uploads
- [x] Database with relationships
- [x] Responsive UI
- [x] Sample data
- [x] Documentation

---

**For detailed setup, API documentation, and feature guides, please refer to [ProjectOverview.md](./ProjectOverview.md)**
