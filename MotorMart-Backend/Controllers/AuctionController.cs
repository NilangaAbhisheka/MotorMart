using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MotorMart_Backend.Data;
using MotorMart_Backend.Models;

namespace MotorMart_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuctionController : ControllerBase
    {
        private readonly AppDbContext _db;
        public AuctionController(AppDbContext db)
        {
            _db = db;
        }

        // On-demand closing of auctions
        [HttpPost("close-ended")]
        public async Task<IActionResult> CloseEndedAuctions()
        {
            var now = DateTime.UtcNow;
            var ended = await _db.Vehicles
                .Where(v => !v.IsClosed && v.AuctionEndTime <= now)
                .ToListAsync();

            foreach (var vehicle in ended)
            {
                var topBid = await _db.Bids
                    .Where(b => b.VehicleId == vehicle.Id)
                    .OrderByDescending(b => b.Amount)
                    .FirstOrDefaultAsync();

                vehicle.IsClosed = true;
                if (topBid != null)
                {
                    vehicle.Winner = new Winner
                    {
                        VehicleId = vehicle.Id,
                        UserId = topBid.UserId,
                        FinalPrice = topBid.Amount
                    };
                }
            }

            await _db.SaveChangesAsync();
            return Ok(new { closed = ended.Count });
        }
    }
}


