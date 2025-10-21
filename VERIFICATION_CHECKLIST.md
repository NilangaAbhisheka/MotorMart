# MotorMart  - Verification Checklist

Use this checklist to verify all features are working correctly.

## 🔧 Pre-Flight Checks

### Database Setup
- [ ] MySQL server is running
- [ ] Database `motormart` exists
- [ ] EF Core migrations applied successfully
- [ ] Admin fields migration applied (`IsActive`, `CreatedAt`, `SoldToUserId`)
- [ ] Seed data imported successfully
- [ ] 5 users exist (1 Admin, 2 Sellers, 2 Buyers)
- [ ] 6 vehicles exist (5 active, 1 ended)

### Application Running
- [ ] Backend running on `http://localhost:5190`
- [ ] Swagger accessible at `http://localhost:5190/swagger`
- [ ] Frontend running on `http://localhost:5173`
- [ ] No console errors in browser DevTools
- [ ] No errors in backend terminal

## 🌐 Site-wide & User Features

### Public Pages
- [ ] Home page loads featured auctions
- [ ] Shop page lists active auctions with filters (make, body type, price, year)
- [ ] Vehicle details page shows images, specs, seller info, bid history
- [ ] About and Contact pages render

### Authentication
- [ ] Register a new user (Buyer)
- [ ] Login with demo accounts (Admin/Seller/Buyer)
- [ ] Invalid credentials show error without crash
- [ ] Auth persists after refresh (token in localStorage)
- [ ] Logout clears session and redirects appropriately

### Buyer Flows
- [ ] Browse and filter vehicles
- [ ] Place a valid bid (higher than current price)
- [ ] See bid in "My Bids" page
- [ ] Add/remove from watchlist; appears in "My Watchlist"

### Seller Flows
- [ ] Create a vehicle listing with multiple images (up to 5)
- [ ] Set starting price, reserve, end time
- [ ] See listing in Seller Dashboard
- [ ] Pause/Resume an auction (as Seller)
- [ ] Extend auction time (as Seller)

### Uploads & Media
- [ ] Image uploads succeed and appear in gallery
- [ ] Images served from `http://localhost:5190/uploads/*`
- [ ] Large/invalid files show appropriate error

### API Health
- [ ] Swagger is accessible at `/swagger`
- [ ] Core endpoints return expected data (Vehicles, Users, Bids)
- [ ] CORS allows `http://localhost:5173`

### UI/UX & Quality
- [ ] Responsive on mobile, tablet, desktop breakpoints
- [ ] Works in Chrome and Edge (basic cross-browser)
- [ ] Primary flows keyboard-accessible
- [ ] Basic ARIA labels present on interactive elements
- [ ] Toast notifications on success/error

### Data Integrity
- [ ] Seed counts match expectations (Users, Vehicles, Bids)
- [ ] Bid placement updates highest bid correctly
- [ ] Deletions cascade as expected (e.g., delete vehicle removes bids/watchlist entries)

## 🛒 Buyer Features

### Buyer Dashboard & Navigation
- [ ] "My Bids" page lists vehicles the buyer has bid on
- [ ] Each row shows vehicle title, current price, your last bid, auction end time
- [ ] Links navigate to the correct vehicle details

### Browse & Search
- [ ] Shop filters by make, body type, price, year range
- [ ] Clearing filters resets results
- [ ] Search term filters by title/make/model

### Bidding
- [ ] Cannot place a bid when not logged in (redirects to login)
- [ ] Bid must be higher than current price (validation error shows otherwise)
- [ ] Successful bid shows success toast and updates bid list
- [ ] Attempt to bid on ended/paused auction is blocked with message

### Watchlist
- [ ] Heart toggle adds/removes item from watchlist
- [ ] "My Watchlist" shows saved vehicles with current bid and end time
- [ ] Removing reflects immediately in list

### Error Handling & Edge Cases
- [ ] Network error during bid shows error toast and disables button while retrying
- [ ] Invalid vehicle ID in URL shows not-found state
- [ ] Unauthorized API responses redirect to login

### Security
- [ ] Authorization header sent with buyer token on protected endpoints
- [ ] Buyer cannot access any admin endpoints (receives 403)

## 🧰 Seller Features

### Seller Dashboard
- [ ] Lists seller’s active and ended auctions
- [ ] Shows bids count, current price, end time, status
- [ ] Actions available per row (Pause/Resume/Extend where applicable)

### Create & Manage Listings
- [ ] Create listing form validates required fields (title, make, model, year, prices)
- [ ] Image upload allows up to 5 images, validates size/type
- [ ] One image can be marked as cover and displays first in gallery
- [ ] Successfully created listing appears in dashboard
- [ ] Update listing saves changes and reflects in details view
- [ ] Delete listing asks for confirmation and removes associated bids/watchlists

### Auction Controls
- [ ] Pause/Resume toggles status and UI badges update
- [ ] Extend auction adds time and updates end time display
- [ ] Cannot pause or extend ended/closed auctions

### Error Handling & Edge Cases
- [ ] Server validation errors surface near form fields
- [ ] Upload failure shows clear message and preserves other form data
- [ ] Trying to edit another user’s vehicle is blocked (403)

### Security
- [ ] Seller endpoints require valid token
- [ ] Seller cannot call admin-only endpoints

## 🏛️ Admin Portal Features

### 1. Authentication & Access

- [ ] Navigate to `http://localhost:5173/login`
- [ ] Login with `admin@motormart.com` / `admin123`
- [ ] Automatically redirected to `/admin/dashboard`
- [ ] Admin sidebar visible with navigation items
- [ ] User profile shows "admin" username and "Admin" role
- [ ] "View Site" link in header works

### 2. Dashboard (`/admin/dashboard`)

**Statistics Cards:**
- [ ] Total Users shows correct count (5)
- [ ] Active Auctions shows correct count (5)
- [ ] Total Bids shows correct count (13)
- [ ] Total Revenue shows dollar amount

**Sub-Statistics:**
- [ ] Sellers count shows (2)
- [ ] Buyers count shows (2)
- [ ] Total Vehicles shows (6)
- [ ] Ended Auctions shows (1)

**Recent Activity:**
- [ ] Recent Auctions section shows 5 vehicles
- [ ] Each auction shows title, status badge, price
- [ ] Recent Users section shows 5 users
- [ ] Each user shows username, email, role badge

**Quick Actions:**
- [ ] All 4 quick action cards are clickable
- [ ] Cards link to correct admin pages

### 3. User Management (`/admin/users`)

**Display:**
- [ ] Table shows all 5 users
- [ ] Columns: User (avatar + name/email), Role, Status, Activity, Joined, Actions
- [ ] Role badges color-coded (Admin=purple, Seller=blue, Buyer=green)
- [ ] Status shows both verified and active/banned badges

**Filters:**
- [ ] Search box filters by username/email
- [ ] Role dropdown filters (Admin/Seller/Buyer)
- [ ] Verification filter (Verified/Unverified)
- [ ] Active status filter (Active/Banned)

**Actions - Verify Seller:**
- [ ] Create a new unverified seller (register as seller)
- [ ] Unverified badge shows in yellow
- [ ] Click "Verify" button
- [ ] Success toast appears
- [ ] Badge changes to green "✓ Verified"

**Actions - Ban User:**
- [ ] Select a buyer or seller (not admin)
- [ ] Click "Ban" button
- [ ] Success toast appears
- [ ] Status changes to red "● Banned"
- [ ] Click "Activate" to unban
- [ ] Status changes back to green "● Active"

**Actions - Delete User:**
- [ ] Click "Delete" on a non-admin user
- [ ] Confirmation modal appears
- [ ] Modal shows user details
- [ ] Click "Delete" to confirm
- [ ] Success toast appears
- [ ] User removed from table
- [ ] Try to delete admin user - should fail with error

### 4. Vehicle Management (`/admin/vehicles`)

**Display:**
- [ ] Table shows all 6 vehicles
- [ ] Columns: Vehicle, Seller, Price, Bids, Status, End Time, Actions
- [ ] Status badges color-coded correctly
- [ ] Reserve price shows with ✓/✗ indicator

**Filters:**
- [ ] Search box filters by title/make/model
- [ ] Status dropdown filters (Active/Ended/Paused/Sold/Closed)
- [ ] Filter by "Active" shows only active auctions
- [ ] Filter by "Ended" shows ended auctions

**Actions - Pause Auction:**
- [ ] Select an active vehicle
- [ ] Click "Pause" button
- [ ] Success toast appears
- [ ] Status badge changes to yellow "Paused"
- [ ] Click "Resume" button
- [ ] Status changes back to green "Active"

**Actions - Close Auction:**
- [ ] Select an active vehicle
- [ ] Click "Close" button
- [ ] Modal appears with 3 options
- [ ] Click "Close & Mark as Sold"
- [ ] Success toast appears
- [ ] Status changes to "Closed"
- [ ] Vehicle marked as sold in database

**Actions - Delete Vehicle:**
- [ ] Click "Delete" on any vehicle
- [ ] Confirmation modal appears
- [ ] Warning about deleting bids/watchlist
- [ ] Click "Delete" to confirm
- [ ] Success toast appears
- [ ] Vehicle removed from table

### 5. Bid Management (`/admin/bids`)

**Display:**
- [ ] Table shows all 13 bids
- [ ] Columns: Bid ID, Vehicle, Bidder, Amount, Time Placed, Actions
- [ ] Vehicle titles are clickable links
- [ ] Amounts formatted with $ and commas

**Statistics Cards:**
- [ ] Total Bids shows 13
- [ ] Total Value shows sum of all bids
- [ ] Unique Bidders shows correct count

**Actions - Delete Bid:**
- [ ] Click "Delete" on any bid
- [ ] Confirmation modal appears
- [ ] Modal shows bid details
- [ ] Warning about price update
- [ ] Click "Delete" to confirm
- [ ] Success toast appears
- [ ] Bid removed from table
- [ ] Vehicle's current price updated if it was highest bid

### 6. Reports & Analytics (`/admin/reports`)

**Auction Overview Cards:**
- [ ] Total Auctions shows 6
- [ ] Active Auctions shows 5
- [ ] Ended Auctions shows 1

**Average Duration:**
- [ ] Shows number in days
- [ ] Formatted with 1 decimal place

**Popular Makes:**
- [ ] Shows top 5 car makes
- [ ] Bar chart displays correctly
- [ ] Bars proportional to counts
- [ ] Count numbers visible on bars

**Top Sellers Table:**
- [ ] Shows up to 5 sellers
- [ ] Columns: Rank, Seller, Vehicles, Total Revenue
- [ ] Rank badges color-coded (1st=gold, 2nd=silver, 3rd=bronze)
- [ ] Revenue formatted with $ and commas

**Highest Bids Table:**
- [ ] Shows top 5 bids
- [ ] Columns: Rank, Vehicle, Bidder, Amount
- [ ] Amounts formatted correctly

**Export Buttons:**
- [ ] "Export as CSV" button visible
- [ ] "Export as PDF" button visible
- [ ] Buttons show placeholder alerts when clicked

### 7. System Settings (`/admin/settings`)

**General Settings:**
- [ ] Site Name field shows "MotorMart"
- [ ] Max Auction Duration shows 30 days
- [ ] Commission Rate shows 5.0%
- [ ] Maintenance Mode toggle works

**Platform Information:**
- [ ] Version shows v1.0.0
- [ ] Environment shows Development
- [ ] Database shows MySQL
- [ ] Server Status shows "● Online"

**System Actions:**
- [ ] Clear Cache button visible
- [ ] Database Backup button visible
- [ ] Reset Platform button visible (red warning)

**Save Settings:**
- [ ] Change site name to "MotorMart Test"
- [ ] Click "Save Settings"
- [ ] Success toast appears
- [ ] Click "Reset Changes" to revert

### 8. Navigation & UX

**Sidebar:**
- [ ] All 6 menu items visible
- [ ] Active page highlighted in orange
- [ ] Hover effects work on inactive items
- [ ] Icons display correctly
- [ ] User profile at bottom shows correctly

**Header:**
- [ ] Page title updates based on current page
- [ ] Subtitle shows "Manage your auction platform"
- [ ] "View Site" link works

**Logout:**
- [ ] Click "Logout" button in sidebar
- [ ] Redirected to public site
- [ ] Admin portal no longer accessible
- [ ] Must login again to access

### 9. Security & Permissions

**Role Protection:**
- [ ] Logout and login as seller
- [ ] Try to access `/admin/dashboard`
- [ ] Redirected to login page
- [ ] Login as buyer
- [ ] Try to access `/admin/dashboard`
- [ ] Redirected to login page

**API Authorization:**
- [ ] Open browser DevTools Network tab
- [ ] Navigate admin pages
- [ ] All `/api/admin/*` requests include Authorization header
- [ ] Requests return 200 status (not 401/403)

**Admin Protection:**
- [ ] Cannot delete admin users
- [ ] Error message shows when attempting
- [ ] Admin users don't show delete button (optional)

### 10. Error Handling

**Network Errors:**
- [ ] Stop backend server
- [ ] Try to load admin dashboard
- [ ] Error toast appears
- [ ] Loading state shows appropriately

**Invalid Data:**
- [ ] Try to delete already deleted item
- [ ] Appropriate error message shows
- [ ] Application doesn't crash

## 📊 Database Verification

Run these SQL queries to verify data integrity:

```sql
-- Check admin fields exist
DESCRIBE Users;
-- Should show: IsActive, CreatedAt

DESCRIBE Vehicles;
-- Should show: SoldToUserId

-- Check admin user
SELECT * FROM Users WHERE Role = 'Admin';
-- Should return 1 row

-- Check statistics
SELECT 
    (SELECT COUNT(*) FROM Users) AS TotalUsers,
    (SELECT COUNT(*) FROM Vehicles) AS TotalVehicles,
    (SELECT COUNT(*) FROM Bids) AS TotalBids,
    (SELECT COUNT(*) FROM Watchlists) AS TotalWatchlist;
```

## 🎓 Assignment Submission Checklist

Before submitting:
- [ ] All features working as expected
- [ ] No console errors
- [ ] Database properly seeded
- [ ] Documentation complete (README, ProjectOverview, ADMIN_PORTAL)
- [ ] Code is clean and commented
- [ ] Screenshots taken (optional)
- [ ] Demo video recorded (optional)

## 📝 Known Limitations (Expected)

These are intentional for a school assignment:
- Export CSV/PDF shows placeholder alerts (not implemented)
- Charts are simple bar charts (no advanced charting library)
- No real-time updates (requires WebSockets)
- No email notifications
- Settings are stored in memory (not persisted to database)
- No pagination on tables (acceptable for small datasets)

## ✅ Success Criteria

Your admin portal is working correctly if:
- ✅ All authentication and authorization works
- ✅ All CRUD operations function properly
- ✅ Statistics display accurate data
- ✅ Filters and search work correctly
- ✅ Confirmation modals appear for destructive actions
- ✅ Toast notifications show for all actions
- ✅ No breaking errors in console
- ✅ UI is responsive and professional
- ✅ Documentation is comprehensive

---

**Congratulations!** If all items are checked, your MotorMart Admin Portal is complete and ready for submission! 🎉
