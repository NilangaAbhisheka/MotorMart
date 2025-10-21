-- ============================================
-- MotorMart Database Seed Script
-- School Assignment - Local Development Only
-- ============================================
-- This script populates the MotorMart database with sample data for testing and demonstration.
-- Run this after applying EF Core migrations.
--
-- Usage:
--   mysql -u root -p motormart < seed_data.sql
--
-- Demo Credentials:
--   Admin:  admin@motormart.com / admin123
--   Seller: john.seller@motormart.com / seller123
--   Seller: sarah.dealer@motormart.com / seller123
--   Buyer:  mike.buyer@motormart.com / buyer123
--   Buyer:  emma.customer@motormart.com / buyer123
-- ============================================

USE motormart;

-- Disable foreign key checks temporarily for clean inserts
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================
-- Clear existing data (for re-running script)
-- ============================================
TRUNCATE TABLE `Winners`;
TRUNCATE TABLE `Watchlists`;
TRUNCATE TABLE `VehicleImages`;
TRUNCATE TABLE `Bids`;
TRUNCATE TABLE `Vehicles`;
TRUNCATE TABLE `Users`;

-- ============================================
-- Insert Users
-- ============================================
-- Password hashes are SHA256:
--   "admin123"  -> 240BE518FABD2724DDB6F04EEB1DA5967448D7E831C08C8FA822809F74C720A9
--   "seller123" -> 8D969EEF6ECAD3C29A3A629280E686CF0C3F5D5A86AFF3CA12020C923ADC6C92
--   "buyer123"  -> 8D969EEF6ECAD3C29A3A629280E686CF0C3F5D5A86AFF3CA12020C923ADC6C92 (same as seller123)

INSERT INTO `Users` (`Id`, `Username`, `Email`, `PasswordHash`, `Role`, `IsVerified`, `IsActive`, `CreatedAt`) VALUES
(1, 'admin', 'admin@motormart.com', '240BE518FABD2724DDB6F04EEB1DA5967448D7E831C08C8FA822809F74C720A9', 'Admin', 1, 1, DATE_SUB(NOW(), INTERVAL 180 DAY)),
(2, 'john_seller', 'john.seller@motormart.com', '8D969EEF6ECAD3C29A3A629280E686CF0C3F5D5A86AFF3CA12020C923ADC6C92', 'Seller', 1, 1, DATE_SUB(NOW(), INTERVAL 120 DAY)),
(3, 'sarah_dealer', 'sarah.dealer@motormart.com', '8D969EEF6ECAD3C29A3A629280E686CF0C3F5D5A86AFF3CA12020C923ADC6C92', 'Seller', 1, 1, DATE_SUB(NOW(), INTERVAL 90 DAY)),
(4, 'mike_buyer', 'mike.buyer@motormart.com', '8D969EEF6ECAD3C29A3A629280E686CF0C3F5D5A86AFF3CA12020C923ADC6C92', 'Buyer', 1, 1, DATE_SUB(NOW(), INTERVAL 60 DAY)),
(5, 'emma_customer', 'emma.customer@motormart.com', '8D969EEF6ECAD3C29A3A629280E686CF0C3F5D5A86AFF3CA12020C923ADC6C92', 'Buyer', 1, 1, DATE_SUB(NOW(), INTERVAL 30 DAY));

-- ============================================
-- Insert Vehicles
-- ============================================
-- Mix of active auctions (future end times) and ended auctions (past end times)
-- AuctionEndTime format: 'YYYY-MM-DD HH:MM:SS'

INSERT INTO `Vehicles` (`Id`, `Title`, `Make`, `Model`, `Year`, `BodyType`, `Description`, `StartingPrice`, `CurrentPrice`, `ReservePrice`, `ImageUrl`, `AuctionEndTime`, `IsClosed`, `IsSold`, `IsPaused`, `SellerId`, `Vin`, `ServiceHistory`, `OwnershipCount`, `ConditionGrade`, `HighlightChips`) VALUES
-- Active Auctions (ending in the future)
(1, '2020 BMW 3 Series - Luxury Sedan', 'BMW', '3 Series', 2020, 'Sedan', 
 'Pristine condition BMW 3 Series with full service history. Features include leather interior, navigation system, and premium sound. Only 35,000 miles. Garage kept, non-smoker vehicle.',
 28000.00, 32500.00, 30000.00, 
 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
 DATE_ADD(NOW(), INTERVAL 3 DAY), 0, 0, 0, 2,
 '5UXWX7C5XBA123456', 1, 2, 'Excellent', '["Accident-Free","Recently Serviced","Garage Kept","Low Mileage"]'),

(2, '2019 Tesla Model 3 - Performance', 'Tesla', 'Model 3', 2019, 'Electric',
 'Tesla Model 3 Performance with Autopilot. White exterior, black interior. Dual motor AWD, 0-60 in 3.2 seconds. Full self-driving capability. Battery health at 95%. Includes home charger.',
 42000.00, 45000.00, 44000.00,
 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800',
 DATE_ADD(NOW(), INTERVAL 5 DAY), 0, 0, 0, 2,
 '5YJ3E1EA8KF123789', 1, 1, 'Excellent', '["First Owner","Accident-Free","Low Mileage","Recently Serviced"]'),

(3, '2018 Ford F-150 Raptor - Off-Road Beast', 'Ford', 'F-150', 2018, 'Pick Up',
 'Ford F-150 Raptor in excellent condition. 450HP twin-turbo V6, Fox Racing shocks, Terrain Management System. Lifted suspension, 35" all-terrain tires. Perfect for off-road adventures.',
 48000.00, 51000.00, 50000.00,
 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800',
 DATE_ADD(NOW(), INTERVAL 7 DAY), 0, 0, 0, 3,
 '1FTFW1RG5JFA12345', 1, 2, 'Very Good', '["Accident-Free","Recently Serviced","One Owner"]'),

(4, '2021 Porsche 911 Carrera - Sports Car', 'Porsche', '911', 2021, 'Sports',
 'Stunning Porsche 911 Carrera in Guards Red. 379HP flat-six engine, 7-speed manual transmission. Sport Chrono package, PASM suspension. Only 8,000 miles. Showroom condition.',
 95000.00, 98000.00, 96000.00,
 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
 DATE_ADD(NOW(), INTERVAL 10 DAY), 0, 0, 0, 3,
 'WP0AA2A99MS123456', 1, 1, 'Excellent', '["First Owner","Accident-Free","Garage Kept","Low Mileage"]'),

(5, '2017 Honda CR-V EX - Family SUV', 'Honda', 'CR-V', 2017, 'SUV',
 'Reliable Honda CR-V with excellent fuel economy. Spacious interior, backup camera, lane departure warning. Well-maintained with complete service records. Perfect family vehicle.',
 18000.00, 20500.00, 19500.00,
 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800',
 DATE_ADD(NOW(), INTERVAL 2 DAY), 0, 0, 0, 2,
 '2HKRM4H75HH123456', 1, 3, 'Good', '["Accident-Free","Recently Serviced"]'),

-- Ended Auctions (for demo purposes)
(6, '2016 Toyota Camry - Sedan', 'Toyota', 'Camry', 2016, 'Sedan',
 'Clean Toyota Camry with low miles. Great commuter car with excellent reliability. Recently serviced, new tires.',
 12000.00, 14500.00, 13000.00,
 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800',
 DATE_SUB(NOW(), INTERVAL 2 DAY), 1, 1, 0, 3,
 '4T1BF1FK5GU123456', 1, 2, 'Good', '["Accident-Free","New Tires"]');

-- ============================================
-- Insert Vehicle Images (Additional photos)
-- ============================================
INSERT INTO `VehicleImages` (`Id`, `VehicleId`, `ImageUrl`, `DisplayOrder`, `CreatedAt`) VALUES
-- BMW 3 Series images
(1, 1, 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800', 1, NOW()),
(2, 1, 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800', 2, NOW()),
(3, 1, 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800', 3, NOW()),

-- Tesla Model 3 images
(4, 2, 'https://images.unsplash.com/photo-1617704548623-340376564e68?w=800', 1, NOW()),
(5, 2, 'https://images.unsplash.com/photo-1617704548623-340376564e68?w=800', 2, NOW()),

-- Ford F-150 images
(6, 3, 'https://images.unsplash.com/photo-1587883012610-e3df17d84e58?w=800', 1, NOW()),
(7, 3, 'https://images.unsplash.com/photo-1587883012610-e3df17d84e58?w=800', 2, NOW()),

-- Porsche 911 images
(8, 4, 'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=800', 1, NOW()),
(9, 4, 'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=800', 2, NOW()),
(10, 4, 'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=800', 3, NOW()),

-- Honda CR-V images
(11, 5, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800', 1, NOW()),

-- Toyota Camry images
(12, 6, 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800', 1, NOW());

-- ============================================
-- Insert Bids
-- ============================================
-- Bids are placed by buyers on active vehicles
-- TimePlaced should be before AuctionEndTime

INSERT INTO `Bids` (`Id`, `Amount`, `TimePlaced`, `UserId`, `VehicleId`) VALUES
-- Bids on BMW 3 Series (Vehicle 1)
(1, 29000.00, DATE_SUB(NOW(), INTERVAL 2 DAY), 4, 1),
(2, 30500.00, DATE_SUB(NOW(), INTERVAL 1 DAY), 5, 1),
(3, 32500.00, DATE_SUB(NOW(), INTERVAL 12 HOUR), 4, 1),

-- Bids on Tesla Model 3 (Vehicle 2)
(4, 43000.00, DATE_SUB(NOW(), INTERVAL 3 DAY), 4, 2),
(5, 45000.00, DATE_SUB(NOW(), INTERVAL 1 DAY), 5, 2),

-- Bids on Ford F-150 (Vehicle 3)
(6, 49000.00, DATE_SUB(NOW(), INTERVAL 2 DAY), 5, 3),
(7, 51000.00, DATE_SUB(NOW(), INTERVAL 6 HOUR), 4, 3),

-- Bids on Porsche 911 (Vehicle 4)
(8, 96000.00, DATE_SUB(NOW(), INTERVAL 4 DAY), 5, 4),
(9, 98000.00, DATE_SUB(NOW(), INTERVAL 2 DAY), 4, 4),

-- Bids on Honda CR-V (Vehicle 5)
(10, 19000.00, DATE_SUB(NOW(), INTERVAL 1 DAY), 5, 5),
(11, 20500.00, DATE_SUB(NOW(), INTERVAL 8 HOUR), 4, 5),

-- Bids on ended Toyota Camry (Vehicle 6)
(12, 13000.00, DATE_SUB(NOW(), INTERVAL 5 DAY), 4, 6),
(13, 14500.00, DATE_SUB(NOW(), INTERVAL 3 DAY), 5, 6);

-- ============================================
-- Insert Watchlist Entries
-- ============================================
-- Buyers add vehicles to their watchlist

INSERT INTO `Watchlists` (`Id`, `UserId`, `VehicleId`, `AddedAt`) VALUES
(1, 4, 1, DATE_SUB(NOW(), INTERVAL 3 DAY)),  -- Mike watching BMW
(2, 4, 2, DATE_SUB(NOW(), INTERVAL 4 DAY)),  -- Mike watching Tesla
(3, 4, 4, DATE_SUB(NOW(), INTERVAL 2 DAY)),  -- Mike watching Porsche
(4, 5, 3, DATE_SUB(NOW(), INTERVAL 5 DAY)),  -- Emma watching Ford
(5, 5, 5, DATE_SUB(NOW(), INTERVAL 1 DAY));  -- Emma watching Honda

-- ============================================
-- Insert Winners (for ended auctions)
-- ============================================
INSERT INTO `Winners` (`Id`, `VehicleId`, `UserId`, `FinalPrice`) VALUES
(1, 6, 5, 14500.00);  -- Emma won the Toyota Camry

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- Verification Queries
-- ============================================
-- Uncomment these to verify the data was inserted correctly:

-- SELECT COUNT(*) AS TotalUsers FROM Users;
-- SELECT COUNT(*) AS TotalVehicles FROM Vehicles;
-- SELECT COUNT(*) AS TotalBids FROM Bids;
-- SELECT COUNT(*) AS TotalWatchlistItems FROM Watchlists;
-- SELECT COUNT(*) AS TotalVehicleImages FROM VehicleImages;
-- SELECT COUNT(*) AS TotalWinners FROM Winners;

-- SELECT 'Data seeded successfully!' AS Status;

-- ============================================
-- End of Seed Script
-- ============================================
