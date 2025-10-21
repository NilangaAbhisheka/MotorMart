-- Migration: Add Admin Portal Fields
-- Run this after applying EF Core migrations or manually if needed

USE motormart;

-- Add new fields to Users table
ALTER TABLE `Users` 
ADD COLUMN IF NOT EXISTS `IsActive` TINYINT(1) NOT NULL DEFAULT 1 AFTER `IsVerified`,
ADD COLUMN IF NOT EXISTS `CreatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER `IsActive`;

-- Add new field to Vehicles table
ALTER TABLE `Vehicles` 
ADD COLUMN IF NOT EXISTS `SoldToUserId` INT NULL AFTER `SellerId`,
ADD CONSTRAINT `FK_Vehicles_SoldToUser` FOREIGN KEY (`SoldToUserId`) REFERENCES `Users`(`Id`) ON DELETE RESTRICT;

-- Update existing users to have CreatedAt if NULL
UPDATE `Users` SET `CreatedAt` = NOW() WHERE `CreatedAt` IS NULL OR `CreatedAt` = '0000-00-00 00:00:00';

SELECT 'Admin fields migration completed successfully!' AS Status;
