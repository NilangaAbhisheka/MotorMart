using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MotorMart_Backend.Data;
using MotorMart_Backend.Models;

namespace MotorMart_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class WatchlistController : ControllerBase
    {
        private readonly AppDbContext _db;

        public WatchlistController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetUserWatchlist()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type.EndsWith("/nameidentifier") || c.Type.Contains("sub"));
            if (userIdClaim == null) return Unauthorized();
            var userId = int.Parse(userIdClaim.Value);

            var watchlist = await _db.Watchlists
                .Where(w => w.UserId == userId)
                .Include(w => w.Vehicle)
                .ThenInclude(v => v.Seller)
                .OrderByDescending(w => w.AddedAt)
                .Select(w => new
                {
                    w.Id,
                    w.AddedAt,
                    Vehicle = new
                    {
                        w.Vehicle!.Id,
                        w.Vehicle.Title,
                        w.Vehicle.Make,
                        w.Vehicle.Model,
                        w.Vehicle.Year,
                        w.Vehicle.BodyType,
                        w.Vehicle.CurrentPrice,
                        w.Vehicle.ReservePrice,
                        w.Vehicle.ImageUrl,
                        w.Vehicle.AuctionEndTime,
                        w.Vehicle.IsClosed,
                        w.Vehicle.IsSold,
                        w.Vehicle.IsPaused,
                        Seller = new
                        {
                            w.Vehicle.Seller!.Username,
                            w.Vehicle.Seller.IsVerified
                        }
                    }
                })
                .ToListAsync();

            return Ok(watchlist);
        }

        [HttpPost("{vehicleId}")]
        public async Task<IActionResult> AddToWatchlist(int vehicleId)
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type.EndsWith("/nameidentifier") || c.Type.Contains("sub"));
            if (userIdClaim == null) return Unauthorized();
            var userId = int.Parse(userIdClaim.Value);

            // Check if vehicle exists
            var vehicle = await _db.Vehicles.FindAsync(vehicleId);
            if (vehicle == null) return NotFound("Vehicle not found");

            // Check if already in watchlist
            var existingWatchlist = await _db.Watchlists
                .FirstOrDefaultAsync(w => w.UserId == userId && w.VehicleId == vehicleId);

            if (existingWatchlist != null)
            {
                return BadRequest("Vehicle is already in your watchlist");
            }

            var watchlist = new Watchlist
            {
                UserId = userId,
                VehicleId = vehicleId,
                AddedAt = DateTime.UtcNow
            };

            _db.Watchlists.Add(watchlist);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Vehicle added to watchlist" });
        }

        [HttpDelete("{vehicleId}")]
        public async Task<IActionResult> RemoveFromWatchlist(int vehicleId)
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type.EndsWith("/nameidentifier") || c.Type.Contains("sub"));
            if (userIdClaim == null) return Unauthorized();
            var userId = int.Parse(userIdClaim.Value);

            var watchlist = await _db.Watchlists
                .FirstOrDefaultAsync(w => w.UserId == userId && w.VehicleId == vehicleId);

            if (watchlist == null)
            {
                return NotFound("Vehicle not found in watchlist");
            }

            _db.Watchlists.Remove(watchlist);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Vehicle removed from watchlist" });
        }

        [HttpGet("check/{vehicleId}")]
        public async Task<IActionResult> CheckWatchlistStatus(int vehicleId)
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type.EndsWith("/nameidentifier") || c.Type.Contains("sub"));
            if (userIdClaim == null) return Unauthorized();
            var userId = int.Parse(userIdClaim.Value);

            var isInWatchlist = await _db.Watchlists
                .AnyAsync(w => w.UserId == userId && w.VehicleId == vehicleId);

            return Ok(new { isInWatchlist });
        }
    }
}

