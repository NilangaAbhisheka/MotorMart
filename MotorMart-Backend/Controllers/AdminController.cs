using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MotorMart_Backend.Data;
using MotorMart_Backend.Models;

namespace MotorMart_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")] // All endpoints require Admin role
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;

        public class AdminStatsResponse
        {
            public int TotalUsers { get; set; }
            public int TotalSellers { get; set; }
            public int TotalBuyers { get; set; }
            public int TotalActiveAuctions { get; set; }
            public int TotalBids { get; set; }
            public decimal TotalRevenue { get; set; }
            public int TotalVehicles { get; set; }
            public int TotalEndedAuctions { get; set; }
        }

        public class UserManagementDto
        {
            public int Id { get; set; }
            public string Username { get; set; } = string.Empty;
            public string Email { get; set; } = string.Empty;
            public string Role { get; set; } = string.Empty;
            public bool IsVerified { get; set; }
            public bool IsActive { get; set; }
            public DateTime CreatedAt { get; set; }
            public int VehicleCount { get; set; }
            public int BidCount { get; set; }
        }

        public class VehicleManagementDto
        {
            public int Id { get; set; }
            public string Title { get; set; } = string.Empty;
            public string Make { get; set; } = string.Empty;
            public string Model { get; set; } = string.Empty;
            public int Year { get; set; }
            public string SellerName { get; set; } = string.Empty;
            public int SellerId { get; set; }
            public decimal StartingPrice { get; set; }
            public decimal CurrentPrice { get; set; }
            public decimal? ReservePrice { get; set; }
            public DateTime AuctionEndTime { get; set; }
            public bool IsClosed { get; set; }
            public bool IsSold { get; set; }
            public bool IsPaused { get; set; }
            public int BidCount { get; set; }
            public bool ReserveMet { get; set; }
            public string Status { get; set; } = string.Empty;
        }

        public class BidManagementDto
        {
            public int Id { get; set; }
            public decimal Amount { get; set; }
            public DateTime TimePlaced { get; set; }
            public string BidderName { get; set; } = string.Empty;
            public string BidderEmail { get; set; } = string.Empty;
            public int UserId { get; set; }
            public string VehicleTitle { get; set; } = string.Empty;
            public int VehicleId { get; set; }
        }

        public class ReportData
        {
            public List<MakePopularity> PopularMakes { get; set; } = new();
            public List<TopSeller> TopSellers { get; set; } = new();
            public List<HighestBid> HighestBids { get; set; } = new();
            public decimal AverageAuctionDuration { get; set; }
            public int TotalAuctions { get; set; }
            public int ActiveAuctions { get; set; }
            public int EndedAuctions { get; set; }
        }

        public class MakePopularity
        {
            public string Make { get; set; } = string.Empty;
            public int Count { get; set; }
        }

        public class TopSeller
        {
            public string SellerName { get; set; } = string.Empty;
            public int VehicleCount { get; set; }
            public decimal TotalRevenue { get; set; }
        }

        public class HighestBid
        {
            public string VehicleTitle { get; set; } = string.Empty;
            public decimal Amount { get; set; }
            public string BidderName { get; set; } = string.Empty;
        }

        public AdminController(AppDbContext context)
        {
            _context = context;
        }

        // ============================================
        // DASHBOARD & STATISTICS
        // ============================================

        /// <summary>
        /// GET /api/admin/stats - Get dashboard statistics
        /// </summary>
        [HttpGet("stats")]
        public async Task<ActionResult<AdminStatsResponse>> GetStats()
        {
            var totalUsers = await _context.Users.CountAsync();
            var totalSellers = await _context.Users.CountAsync(u => u.Role == "Seller");
            var totalBuyers = await _context.Users.CountAsync(u => u.Role == "Buyer");
            var totalActiveAuctions = await _context.Vehicles
                .CountAsync(v => !v.IsClosed && v.AuctionEndTime > DateTime.UtcNow);
            var totalBids = await _context.Bids.CountAsync();
            var totalRevenue = await _context.Winners.SumAsync(w => (decimal?)w.FinalPrice) ?? 0;
            var totalVehicles = await _context.Vehicles.CountAsync();
            var totalEndedAuctions = await _context.Vehicles
                .CountAsync(v => v.IsClosed || v.AuctionEndTime <= DateTime.UtcNow);

            return Ok(new AdminStatsResponse
            {
                TotalUsers = totalUsers,
                TotalSellers = totalSellers,
                TotalBuyers = totalBuyers,
                TotalActiveAuctions = totalActiveAuctions,
                TotalBids = totalBids,
                TotalRevenue = totalRevenue,
                TotalVehicles = totalVehicles,
                TotalEndedAuctions = totalEndedAuctions
            });
        }

        /// <summary>
        /// GET /api/admin/recent-auctions - Get recent 5 auctions
        /// </summary>
        [HttpGet("recent-auctions")]
        public async Task<ActionResult<List<VehicleManagementDto>>> GetRecentAuctions()
        {
            var auctions = await _context.Vehicles
                .Include(v => v.Seller)
                .Include(v => v.Bids)
                .OrderByDescending(v => v.Id)
                .Take(5)
                .Select(v => new VehicleManagementDto
                {
                    Id = v.Id,
                    Title = v.Title,
                    Make = v.Make,
                    Model = v.Model,
                    Year = v.Year,
                    SellerName = v.Seller!.Username,
                    SellerId = v.SellerId,
                    StartingPrice = v.StartingPrice,
                    CurrentPrice = v.CurrentPrice,
                    ReservePrice = v.ReservePrice,
                    AuctionEndTime = v.AuctionEndTime,
                    IsClosed = v.IsClosed,
                    IsSold = v.IsSold,
                    IsPaused = v.IsPaused,
                    BidCount = v.Bids.Count,
                    ReserveMet = v.ReservePrice == null || v.CurrentPrice >= v.ReservePrice,
                    Status = v.IsClosed ? "Closed" : v.IsPaused ? "Paused" : v.AuctionEndTime <= DateTime.UtcNow ? "Ended" : "Active"
                })
                .ToListAsync();

            return Ok(auctions);
        }

        /// <summary>
        /// GET /api/admin/recent-users - Get recent 5 users
        /// </summary>
        [HttpGet("recent-users")]
        public async Task<ActionResult<List<UserManagementDto>>> GetRecentUsers()
        {
            var users = await _context.Users
                .OrderByDescending(u => u.CreatedAt)
                .Take(5)
                .Select(u => new UserManagementDto
                {
                    Id = u.Id,
                    Username = u.Username,
                    Email = u.Email,
                    Role = u.Role,
                    IsVerified = u.IsVerified,
                    IsActive = u.IsActive,
                    CreatedAt = u.CreatedAt,
                    VehicleCount = u.Vehicles.Count,
                    BidCount = u.Bids.Count
                })
                .ToListAsync();

            return Ok(users);
        }

        // ============================================
        // USER MANAGEMENT
        // ============================================

        /// <summary>
        /// GET /api/admin/users - Get all users with filters
        /// </summary>
        [HttpGet("users")]
        public async Task<ActionResult<List<UserManagementDto>>> GetUsers(
            [FromQuery] string? role = null,
            [FromQuery] bool? isVerified = null,
            [FromQuery] bool? isActive = null,
            [FromQuery] string? search = null)
        {
            var query = _context.Users.AsQueryable();

            if (!string.IsNullOrEmpty(role))
                query = query.Where(u => u.Role == role);

            if (isVerified.HasValue)
                query = query.Where(u => u.IsVerified == isVerified.Value);

            if (isActive.HasValue)
                query = query.Where(u => u.IsActive == isActive.Value);

            if (!string.IsNullOrEmpty(search))
                query = query.Where(u => u.Username.Contains(search) || u.Email.Contains(search));

            var users = await query
                .OrderByDescending(u => u.CreatedAt)
                .Select(u => new UserManagementDto
                {
                    Id = u.Id,
                    Username = u.Username,
                    Email = u.Email,
                    Role = u.Role,
                    IsVerified = u.IsVerified,
                    IsActive = u.IsActive,
                    CreatedAt = u.CreatedAt,
                    VehicleCount = u.Vehicles.Count,
                    BidCount = u.Bids.Count
                })
                .ToListAsync();

            return Ok(users);
        }

        /// <summary>
        /// PATCH /api/admin/users/{id}/verify - Verify a seller
        /// </summary>
        [HttpPatch("users/{id}/verify")]
        public async Task<IActionResult> VerifyUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound(new { message = "User not found" });

            user.IsVerified = true;
            await _context.SaveChangesAsync();

            return Ok(new { message = "User verified successfully", user = new { user.Id, user.Username, user.IsVerified } });
        }

        /// <summary>
        /// PATCH /api/admin/users/{id}/status - Ban or unban a user
        /// </summary>
        [HttpPatch("users/{id}/status")]
        public async Task<IActionResult> UpdateUserStatus(int id, [FromBody] UpdateStatusRequest request)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound(new { message = "User not found" });

            user.IsActive = request.IsActive;
            await _context.SaveChangesAsync();

            return Ok(new { message = $"User {(request.IsActive ? "activated" : "banned")} successfully", user = new { user.Id, user.Username, user.IsActive } });
        }

        public class UpdateStatusRequest
        {
            public bool IsActive { get; set; }
        }

        /// <summary>
        /// DELETE /api/admin/users/{id} - Delete a user
        /// </summary>
        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users
                .Include(u => u.Vehicles)
                .Include(u => u.Bids)
                .Include(u => u.Watchlists)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
                return NotFound(new { message = "User not found" });

            // Check if user is an admin (prevent deleting admins)
            if (user.Role == "Admin")
                return BadRequest(new { message = "Cannot delete admin users" });

            // Remove related data
            _context.Watchlists.RemoveRange(user.Watchlists);
            _context.Bids.RemoveRange(user.Bids);
            
            // Mark vehicles as closed if seller is deleted
            foreach (var vehicle in user.Vehicles)
            {
                vehicle.IsClosed = true;
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User deleted successfully" });
        }

        // ============================================
        // VEHICLE / AUCTION MANAGEMENT
        // ============================================

        /// <summary>
        /// GET /api/admin/vehicles - Get all vehicles with filters
        /// </summary>
        [HttpGet("vehicles")]
        public async Task<ActionResult<List<VehicleManagementDto>>> GetVehicles(
            [FromQuery] string? status = null,
            [FromQuery] string? search = null)
        {
            var query = _context.Vehicles
                .Include(v => v.Seller)
                .Include(v => v.Bids)
                .AsQueryable();

            if (!string.IsNullOrEmpty(status))
            {
                switch (status.ToLower())
                {
                    case "active":
                        query = query.Where(v => !v.IsClosed && !v.IsPaused && v.AuctionEndTime > DateTime.UtcNow);
                        break;
                    case "ended":
                        query = query.Where(v => v.AuctionEndTime <= DateTime.UtcNow && !v.IsClosed);
                        break;
                    case "sold":
                        query = query.Where(v => v.IsSold);
                        break;
                    case "paused":
                        query = query.Where(v => v.IsPaused);
                        break;
                    case "closed":
                        query = query.Where(v => v.IsClosed);
                        break;
                }
            }

            if (!string.IsNullOrEmpty(search))
                query = query.Where(v => v.Title.Contains(search) || v.Make.Contains(search) || v.Model.Contains(search));

            var vehicles = await query
                .OrderByDescending(v => v.Id)
                .Select(v => new VehicleManagementDto
                {
                    Id = v.Id,
                    Title = v.Title,
                    Make = v.Make,
                    Model = v.Model,
                    Year = v.Year,
                    SellerName = v.Seller!.Username,
                    SellerId = v.SellerId,
                    StartingPrice = v.StartingPrice,
                    CurrentPrice = v.CurrentPrice,
                    ReservePrice = v.ReservePrice,
                    AuctionEndTime = v.AuctionEndTime,
                    IsClosed = v.IsClosed,
                    IsSold = v.IsSold,
                    IsPaused = v.IsPaused,
                    BidCount = v.Bids.Count,
                    ReserveMet = v.ReservePrice == null || v.CurrentPrice >= v.ReservePrice,
                    Status = v.IsClosed ? "Closed" : v.IsPaused ? "Paused" : v.AuctionEndTime <= DateTime.UtcNow ? "Ended" : "Active"
                })
                .ToListAsync();

            return Ok(vehicles);
        }

        /// <summary>
        /// PATCH /api/admin/vehicles/{id} - Update vehicle details
        /// </summary>
        [HttpPatch("vehicles/{id}")]
        public async Task<IActionResult> UpdateVehicle(int id, [FromBody] UpdateVehicleRequest request)
        {
            var vehicle = await _context.Vehicles.FindAsync(id);
            if (vehicle == null)
                return NotFound(new { message = "Vehicle not found" });

            if (!string.IsNullOrEmpty(request.Title))
                vehicle.Title = request.Title;
            if (!string.IsNullOrEmpty(request.Description))
                vehicle.Description = request.Description;
            if (request.StartingPrice.HasValue)
                vehicle.StartingPrice = request.StartingPrice.Value;
            if (request.ReservePrice.HasValue)
                vehicle.ReservePrice = request.ReservePrice.Value;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Vehicle updated successfully", vehicle });
        }

        public class UpdateVehicleRequest
        {
            public string? Title { get; set; }
            public string? Description { get; set; }
            public decimal? StartingPrice { get; set; }
            public decimal? ReservePrice { get; set; }
        }

        /// <summary>
        /// DELETE /api/admin/vehicles/{id} - Delete a vehicle
        /// </summary>
        [HttpDelete("vehicles/{id}")]
        public async Task<IActionResult> DeleteVehicle(int id)
        {
            var vehicle = await _context.Vehicles
                .Include(v => v.Bids)
                .Include(v => v.Images)
                .Include(v => v.Watchlists)
                .FirstOrDefaultAsync(v => v.Id == id);

            if (vehicle == null)
                return NotFound(new { message = "Vehicle not found" });

            // Remove related data
            _context.Watchlists.RemoveRange(vehicle.Watchlists);
            _context.Bids.RemoveRange(vehicle.Bids);
            _context.VehicleImages.RemoveRange(vehicle.Images);

            _context.Vehicles.Remove(vehicle);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Vehicle deleted successfully" });
        }

        /// <summary>
        /// POST /api/admin/auction/pause/{id} - Pause or resume an auction
        /// </summary>
        [HttpPost("auction/pause/{id}")]
        public async Task<IActionResult> PauseAuction(int id)
        {
            var vehicle = await _context.Vehicles.FindAsync(id);
            if (vehicle == null)
                return NotFound(new { message = "Vehicle not found" });

            vehicle.IsPaused = !vehicle.IsPaused;
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Auction {(vehicle.IsPaused ? "paused" : "resumed")} successfully", isPaused = vehicle.IsPaused });
        }

        /// <summary>
        /// POST /api/admin/auction/close/{id} - Close an auction and mark as sold
        /// </summary>
        [HttpPost("auction/close/{id}")]
        public async Task<IActionResult> CloseAuction(int id, [FromBody] CloseAuctionRequest? request = null)
        {
            var vehicle = await _context.Vehicles
                .Include(v => v.Bids)
                .FirstOrDefaultAsync(v => v.Id == id);

            if (vehicle == null)
                return NotFound(new { message = "Vehicle not found" });

            vehicle.IsClosed = true;

            if (request?.MarkAsSold == true)
            {
                vehicle.IsSold = true;
                
                // Find highest bidder
                var highestBid = vehicle.Bids.OrderByDescending(b => b.Amount).FirstOrDefault();
                if (highestBid != null)
                {
                    vehicle.SoldToUserId = highestBid.UserId;
                    
                    // Create winner record if doesn't exist
                    var existingWinner = await _context.Winners.FirstOrDefaultAsync(w => w.VehicleId == id);
                    if (existingWinner == null)
                    {
                        _context.Winners.Add(new Winner
                        {
                            VehicleId = id,
                            UserId = highestBid.UserId,
                            FinalPrice = highestBid.Amount
                        });
                    }
                }
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Auction closed successfully", vehicle = new { vehicle.Id, vehicle.IsClosed, vehicle.IsSold } });
        }

        public class CloseAuctionRequest
        {
            public bool MarkAsSold { get; set; }
        }

        // ============================================
        // BID MANAGEMENT
        // ============================================

        /// <summary>
        /// GET /api/admin/bids - Get all bids with filters
        /// </summary>
        [HttpGet("bids")]
        public async Task<ActionResult<List<BidManagementDto>>> GetBids(
            [FromQuery] int? vehicleId = null,
            [FromQuery] int? userId = null)
        {
            var query = _context.Bids
                .Include(b => b.User)
                .Include(b => b.Vehicle)
                .AsQueryable();

            if (vehicleId.HasValue)
                query = query.Where(b => b.VehicleId == vehicleId.Value);

            if (userId.HasValue)
                query = query.Where(b => b.UserId == userId.Value);

            var bids = await query
                .OrderByDescending(b => b.TimePlaced)
                .Select(b => new BidManagementDto
                {
                    Id = b.Id,
                    Amount = b.Amount,
                    TimePlaced = b.TimePlaced,
                    BidderName = b.User!.Username,
                    BidderEmail = b.User.Email,
                    UserId = b.UserId,
                    VehicleTitle = b.Vehicle!.Title,
                    VehicleId = b.VehicleId
                })
                .ToListAsync();

            return Ok(bids);
        }

        /// <summary>
        /// DELETE /api/admin/bids/{id} - Delete a bid
        /// </summary>
        [HttpDelete("bids/{id}")]
        public async Task<IActionResult> DeleteBid(int id)
        {
            var bid = await _context.Bids
                .Include(b => b.Vehicle)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (bid == null)
                return NotFound(new { message = "Bid not found" });

            // Update vehicle's current price if this was the highest bid
            var vehicle = bid.Vehicle;
            if (vehicle != null)
            {
                var highestBid = await _context.Bids
                    .Where(b => b.VehicleId == vehicle.Id && b.Id != id)
                    .OrderByDescending(b => b.Amount)
                    .FirstOrDefaultAsync();

                vehicle.CurrentPrice = highestBid?.Amount ?? vehicle.StartingPrice;
            }

            _context.Bids.Remove(bid);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Bid deleted successfully" });
        }

        // ============================================
        // REPORTS & ANALYTICS
        // ============================================

        /// <summary>
        /// GET /api/admin/reports - Get analytics and reports
        /// </summary>
        [HttpGet("reports")]
        public async Task<ActionResult<ReportData>> GetReports()
        {
            // Popular makes
            var popularMakes = await _context.Vehicles
                .GroupBy(v => v.Make)
                .Select(g => new MakePopularity
                {
                    Make = g.Key,
                    Count = g.Count()
                })
                .OrderByDescending(m => m.Count)
                .Take(5)
                .ToListAsync();

            // Top sellers
            var topSellers = await _context.Users
                .Where(u => u.Role == "Seller")
                .Select(u => new TopSeller
                {
                    SellerName = u.Username,
                    VehicleCount = u.Vehicles.Count,
                    TotalRevenue = u.Vehicles.Where(v => v.IsSold).Sum(v => (decimal?)v.CurrentPrice) ?? 0
                })
                .OrderByDescending(s => s.TotalRevenue)
                .Take(5)
                .ToListAsync();

            // Highest bids
            var highestBids = await _context.Bids
                .Include(b => b.User)
                .Include(b => b.Vehicle)
                .OrderByDescending(b => b.Amount)
                .Take(5)
                .Select(b => new HighestBid
                {
                    VehicleTitle = b.Vehicle!.Title,
                    Amount = b.Amount,
                    BidderName = b.User!.Username
                })
                .ToListAsync();

            // Average auction duration (in days)
            // Since vehicles don't have CreatedAt, we'll calculate a simple average
            // based on the assumption that auctions typically run for 7-30 days
            var avgDuration = 14.0; // Default average for demo purposes

            var totalAuctions = await _context.Vehicles.CountAsync();
            var activeAuctions = await _context.Vehicles.CountAsync(v => !v.IsClosed && v.AuctionEndTime > DateTime.UtcNow);
            var endedAuctions = totalAuctions - activeAuctions;

            return Ok(new ReportData
            {
                PopularMakes = popularMakes,
                TopSellers = topSellers,
                HighestBids = highestBids,
                AverageAuctionDuration = (decimal)avgDuration,
                TotalAuctions = totalAuctions,
                ActiveAuctions = activeAuctions,
                EndedAuctions = endedAuctions
            });
        }

        // ============================================
        // SYSTEM SETTINGS
        // ============================================

        /// <summary>
        /// GET /api/admin/settings - Get system settings
        /// </summary>
        [HttpGet("settings")]
        public ActionResult<object> GetSettings()
        {
            // For this assignment, return hardcoded settings
            // In production, these would be stored in database
            return Ok(new
            {
                siteName = "MotorMart",
                maxAuctionDuration = 30, // days
                defaultCommissionRate = 5.0, // percentage
                maintenanceMode = false
            });
        }

        /// <summary>
        /// POST /api/admin/settings - Update system settings
        /// </summary>
        [HttpPost("settings")]
        public ActionResult UpdateSettings([FromBody] SystemSettingsRequest request)
        {
            // For this assignment, just return success
            // In production, these would be saved to database
            return Ok(new { message = "Settings updated successfully", settings = request });
        }

        public class SystemSettingsRequest
        {
            public string? SiteName { get; set; }
            public int? MaxAuctionDuration { get; set; }
            public decimal? DefaultCommissionRate { get; set; }
            public bool? MaintenanceMode { get; set; }
        }
    }
}
