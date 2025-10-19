using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MotorMart_Backend.Data;

namespace MotorMart_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BidsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public BidsController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet("vehicle/{vehicleId}")]
        public async Task<IActionResult> GetBidsForVehicle(int vehicleId)
        {
            var bids = await _db.Bids
                .Where(b => b.VehicleId == vehicleId)
                .OrderByDescending(b => b.TimePlaced)
                .ToListAsync();
            return Ok(bids);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> PlaceBid([FromBody] PlaceBidRequest request)
        {
            var vehicle = await _db.Vehicles.FirstOrDefaultAsync(v => v.Id == request.VehicleId);
            if (vehicle == null) return NotFound(new { message = "Vehicle not found" });
            if (vehicle.IsClosed || DateTime.UtcNow >= vehicle.AuctionEndTime)
            {
                return BadRequest(new { message = "Auction has ended" });
            }
            if (request.Amount <= vehicle.CurrentPrice)
            {
                return BadRequest(new { message = "Bid must be higher than current price" });
            }

            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type.EndsWith("/nameidentifier") || c.Type.Contains("sub"));
            if (userIdClaim == null) return Unauthorized();
            var userId = int.Parse(userIdClaim.Value);

            var bid = new Models.Bid
            {
                Amount = request.Amount,
                TimePlaced = DateTime.UtcNow,
                UserId = userId,
                VehicleId = request.VehicleId
            };

            _db.Bids.Add(bid);
            vehicle.CurrentPrice = request.Amount;
            await _db.SaveChangesAsync();
            return Ok(bid);
        }
    }

    public class PlaceBidRequest
    {
        public int VehicleId { get; set; }
        public decimal Amount { get; set; }
    }
}


