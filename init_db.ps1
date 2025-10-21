# ============================================
# MotorMart Database Initialization Script
# PowerShell script for Windows
# ============================================
# This script imports the seed data into MySQL
# Usage: .\init_db.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "MotorMart Database Initialization" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$DatabaseName = "motormart"
$SeedFile = "seed_data.sql"

# Check if seed file exists
if (-Not (Test-Path $SeedFile)) {
    Write-Host "ERROR: seed_data.sql not found!" -ForegroundColor Red
    Write-Host "Please ensure seed_data.sql is in the same directory." -ForegroundColor Yellow
    exit 1
}

Write-Host "Database: $DatabaseName" -ForegroundColor Green
Write-Host "Seed File: $SeedFile" -ForegroundColor Green
Write-Host ""

# Prompt for MySQL credentials
$MySQLUser = Read-Host "Enter MySQL username (default: root)"
if ([string]::IsNullOrWhiteSpace($MySQLUser)) {
    $MySQLUser = "root"
}

Write-Host ""
Write-Host "Importing seed data..." -ForegroundColor Yellow

# Import the SQL file
try {
    # Use mysql command to import
    $command = "mysql -u $MySQLUser -p $DatabaseName"
    Get-Content $SeedFile | & mysql -u $MySQLUser -p $DatabaseName
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "SUCCESS! Database seeded successfully!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Demo Credentials:" -ForegroundColor Cyan
    Write-Host "  Admin:  admin@motormart.com / admin123" -ForegroundColor White
    Write-Host "  Seller: john.seller@motormart.com / seller123" -ForegroundColor White
    Write-Host "  Buyer:  mike.buyer@motormart.com / buyer123" -ForegroundColor White
    Write-Host ""
}
catch {
    Write-Host ""
    Write-Host "ERROR: Failed to import seed data!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}
