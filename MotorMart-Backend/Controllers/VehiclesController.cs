using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MotorMart_Backend.Data;
using MotorMart_Backend.Models;

namespace MotorMart_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VehiclesController : ControllerBase
    {
        private readonly AppDbContext _db;

        public VehiclesController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetActive()
        {
            var now = DateTime.UtcNow;
            var vehicles = await _db.Vehicles
                .Where(v => !v.IsClosed && v.AuctionEndTime > now)
                .OrderBy(v => v.AuctionEndTime)
                .Select(v => new
                {
                    v.Id,
                    v.Title,
                    v.Make,
                    v.Model,
                    v.Year,
                    v.BodyType,
                    v.CurrentPrice,
                    v.ImageUrl,
                    v.AuctionEndTime
                }).ToListAsync();
            return Ok(vehicles);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            // Project to a DTO to avoid circular reference serialization issues
            var vehicle = await _db.Vehicles
                .Where(v => v.Id == id)
                .Select(v => new
                {
                    v.Id,
                    v.Title,
                    v.Make,
                    v.Model,
                    v.Year,
                    v.BodyType,
                    v.Description,
                    v.StartingPrice,
                    v.CurrentPrice,
                    v.ImageUrl,
                    v.AuctionEndTime,
                    v.IsClosed
                })
                .FirstOrDefaultAsync();

            if (vehicle == null) return NotFound();
            return Ok(vehicle);
        }

        [HttpPost]
        [Authorize(Roles = "Seller,Admin")]
        public async Task<IActionResult> Create([FromBody] CreateVehicleRequest request)
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type.EndsWith("/nameidentifier") || c.Type.Contains("sub"));
            if (userIdClaim == null) return Unauthorized();
            var sellerId = int.Parse(userIdClaim.Value);

            var vehicle = new Vehicle
            {
                Title = request.Title,
                Make = request.Make,
                Model = request.Model,
                Year = request.Year,
                BodyType = request.BodyType,
                Description = request.Description,
                StartingPrice = request.StartingPrice,
                CurrentPrice = request.StartingPrice,
                ImageUrl = request.ImageUrl,
                AuctionEndTime = request.AuctionEndTime,
                SellerId = sellerId,
                IsClosed = false
            };
            _db.Vehicles.Add(vehicle);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = vehicle.Id }, vehicle);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Seller,Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateVehicleRequest request)
        {
            var vehicle = await _db.Vehicles.FindAsync(id);
            if (vehicle == null) return NotFound();

            vehicle.Title = request.Title ?? vehicle.Title;
            vehicle.Description = request.Description ?? vehicle.Description;
            vehicle.ImageUrl = request.ImageUrl ?? vehicle.ImageUrl;
            if (request.AuctionEndTime.HasValue) vehicle.AuctionEndTime = request.AuctionEndTime.Value;

            await _db.SaveChangesAsync();
            return Ok(vehicle);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Seller,Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var vehicle = await _db.Vehicles.FindAsync(id);
            if (vehicle == null) return NotFound();
            _db.Vehicles.Remove(vehicle);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }

    public class CreateVehicleRequest
    {
        public string Title { get; set; } = string.Empty;
        public string Make { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public int Year { get; set; }
        public string BodyType { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal StartingPrice { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public DateTime AuctionEndTime { get; set; }
    }

    public class UpdateVehicleRequest
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
        public DateTime? AuctionEndTime { get; set; }
    }
}


