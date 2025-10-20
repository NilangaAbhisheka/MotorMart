using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MotorMart_Backend.Data;
using MotorMart_Backend.Models;

namespace MotorMart_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Seller,Admin")]
    public class AuctionController : ControllerBase
    {
        private readonly AppDbContext _db;

        public AuctionController(AppDbContext db)
        {
            _db = db;
        }

        [HttpPost("pause/{vehicleId}")]
        public async Task<IActionResult> PauseAuction(int vehicleId)
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type.EndsWith("/nameidentifier") || c.Type.Contains("sub"));
            if (userIdClaim == null) return Unauthorized();
            var userId = int.Parse(userIdClaim.Value);

            var vehicle = await _db.Vehicles.FindAsync(vehicleId);
            if (vehicle == null) return NotFound("Vehicle not found");

            // Check if user owns this vehicle or is admin
            if (vehicle.SellerId != userId && !User.IsInRole("Admin"))
                return Forbid("You can only pause your own auctions");

            // Check if auction is still active
            if (vehicle.IsClosed || vehicle.IsSold)
                return BadRequest("Cannot pause a closed or sold auction");

            vehicle.IsPaused = !vehicle.IsPaused;
            await _db.SaveChangesAsync();

            var action = vehicle.IsPaused ? "paused" : "resumed";
            return Ok(new { message = $"Auction {action} successfully", isPaused = vehicle.IsPaused });
        }

        [HttpPost("extend/{vehicleId}")]
        public async Task<IActionResult> ExtendAuction(int vehicleId, [FromBody] ExtendAuctionRequest request)
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type.EndsWith("/nameidentifier") || c.Type.Contains("sub"));
            if (userIdClaim == null) return Unauthorized();
            var userId = int.Parse(userIdClaim.Value);

            var vehicle = await _db.Vehicles.FindAsync(vehicleId);
            if (vehicle == null) return NotFound("Vehicle not found");

            // Check if user owns this vehicle or is admin
            if (vehicle.SellerId != userId && !User.IsInRole("Admin"))
                return Forbid("You can only extend your own auctions");

            // Check if auction is still active
            if (vehicle.IsClosed || vehicle.IsSold)
                return BadRequest("Cannot extend a closed or sold auction");

            // Extend by specified minutes (default 5)
            var extendMinutes = request.ExtendMinutes ?? 5;
            vehicle.AuctionEndTime = vehicle.AuctionEndTime.AddMinutes(extendMinutes);
            await _db.SaveChangesAsync();

            return Ok(new { 
                message = $"Auction extended by {extendMinutes} minutes", 
                newEndTime = vehicle.AuctionEndTime 
            });
        }

        [HttpGet("status/{vehicleId}")]
        public async Task<IActionResult> GetAuctionStatus(int vehicleId)
        {
            var vehicle = await _db.Vehicles.FindAsync(vehicleId);
            if (vehicle == null) return NotFound("Vehicle not found");

            var now = DateTime.UtcNow;
            var isActive = !vehicle.IsClosed && !vehicle.IsSold && !vehicle.IsPaused && vehicle.AuctionEndTime > now;
            var isEnded = vehicle.IsClosed || vehicle.IsSold || vehicle.AuctionEndTime <= now;

            return Ok(new
            {
                vehicleId,
                isActive,
                isEnded,
                isPaused = vehicle.IsPaused,
                isSold = vehicle.IsSold,
                isClosed = vehicle.IsClosed,
                auctionEndTime = vehicle.AuctionEndTime,
                timeRemaining = isEnded ? TimeSpan.Zero : vehicle.AuctionEndTime - now
            });
        }
    }

    public class ExtendAuctionRequest
    {
        public int? ExtendMinutes { get; set; } = 5;
    }
}