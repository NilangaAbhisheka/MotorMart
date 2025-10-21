-- ============================================
-- MotorMart Setup Verification Script
-- ============================================
-- Run this script to verify your database is set up correctly
-- Usage: mysql -u root -p motormart < verify_setup.sql

USE motormart;

SELECT '========================================' AS '';
SELECT 'MotorMart Database Verification' AS '';
SELECT '========================================' AS '';
SELECT '' AS '';

-- Check if database exists and is selected
SELECT DATABASE() AS 'Current Database';
SELECT '' AS '';

-- Verify all tables exist
SELECT '--- Checking Tables ---' AS '';
SELECT 
    TABLE_NAME AS 'Table',
    TABLE_ROWS AS 'Rows (Approx)'
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = 'motormart'
ORDER BY TABLE_NAME;
SELECT '' AS '';

-- Count records in each table
SELECT '--- Record Counts ---' AS '';
SELECT 'Users' AS 'Table', COUNT(*) AS 'Count' FROM Users
UNION ALL
SELECT 'Vehicles', COUNT(*) FROM Vehicles
UNION ALL
SELECT 'Bids', COUNT(*) FROM Bids
UNION ALL
SELECT 'Watchlists', COUNT(*) FROM Watchlists
UNION ALL
SELECT 'VehicleImages', COUNT(*) FROM VehicleImages
UNION ALL
SELECT 'Winners', COUNT(*) FROM Winners;
SELECT '' AS '';

-- Verify user roles
SELECT '--- User Roles ---' AS '';
SELECT Role, COUNT(*) AS 'Count' 
FROM Users 
GROUP BY Role 
ORDER BY Role;
SELECT '' AS '';

-- Check active auctions
SELECT '--- Active Auctions ---' AS '';
SELECT 
    Id,
    Title,
    Make,
    Model,
    CurrentPrice,
    AuctionEndTime,
    CASE 
        WHEN AuctionEndTime > NOW() THEN 'Active'
        ELSE 'Ended'
    END AS Status
FROM Vehicles
ORDER BY AuctionEndTime DESC;
SELECT '' AS '';

-- Verify foreign key relationships
SELECT '--- Foreign Key Integrity ---' AS '';
SELECT 'Vehicles with valid Sellers' AS 'Check',
    COUNT(*) AS 'Valid',
    (SELECT COUNT(*) FROM Vehicles) AS 'Total'
FROM Vehicles v
INNER JOIN Users u ON v.SellerId = u.Id;

SELECT 'Bids with valid Users' AS 'Check',
    COUNT(*) AS 'Valid',
    (SELECT COUNT(*) FROM Bids) AS 'Total'
FROM Bids b
INNER JOIN Users u ON b.UserId = u.Id;

SELECT 'Bids with valid Vehicles' AS 'Check',
    COUNT(*) AS 'Valid',
    (SELECT COUNT(*) FROM Bids) AS 'Total'
FROM Bids b
INNER JOIN Vehicles v ON b.VehicleId = v.Id;
SELECT '' AS '';

-- Check for any data issues
SELECT '--- Data Validation ---' AS '';
SELECT 
    CASE 
        WHEN (SELECT COUNT(*) FROM Users) >= 5 THEN '✓ Users table populated'
        ELSE '✗ Users table missing data'
    END AS 'Status'
UNION ALL
SELECT 
    CASE 
        WHEN (SELECT COUNT(*) FROM Vehicles) >= 5 THEN '✓ Vehicles table populated'
        ELSE '✗ Vehicles table missing data'
    END
UNION ALL
SELECT 
    CASE 
        WHEN (SELECT COUNT(*) FROM Bids) >= 10 THEN '✓ Bids table populated'
        ELSE '✗ Bids table missing data'
    END
UNION ALL
SELECT 
    CASE 
        WHEN (SELECT COUNT(*) FROM VehicleImages) >= 10 THEN '✓ VehicleImages table populated'
        ELSE '✗ VehicleImages table missing data'
    END;
SELECT '' AS '';

-- Summary
SELECT '========================================' AS '';
SELECT 'Verification Complete!' AS '';
SELECT '========================================' AS '';
SELECT 'If all checks show ✓, your database is ready!' AS '';
SELECT 'You can now start the backend and frontend.' AS '';
SELECT '' AS '';
SELECT 'Demo Credentials:' AS '';
SELECT '  Admin:  admin@motormart.com / admin123' AS '';
SELECT '  Seller: john.seller@motormart.com / seller123' AS '';
SELECT '  Buyer:  mike.buyer@motormart.com / buyer123' AS '';
SELECT '' AS '';
