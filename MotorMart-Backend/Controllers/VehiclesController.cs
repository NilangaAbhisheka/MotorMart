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
        public async Task<IActionResult> GetActive([FromQuery] string? make = null, [FromQuery] string? bodyType = null, 
            [FromQuery] decimal? minPrice = null, [FromQuery] decimal? maxPrice = null, 
            [FromQuery] int? minYear = null, [FromQuery] int? maxYear = null,
            [FromQuery] int? minMileage = null, [FromQuery] int? maxMileage = null,
            [FromQuery] string? sort = "endingSoon")
        {
            var now = DateTime.UtcNow;
            var query = _db.Vehicles
                .Where(v => !v.IsClosed && v.AuctionEndTime > now && !v.IsPaused)
                .Include(v => v.Seller)
                .AsQueryable();

            // Apply filters
            if (!string.IsNullOrEmpty(make))
                query = query.Where(v => v.Make.ToLower().Contains(make.ToLower()));

            if (!string.IsNullOrEmpty(bodyType))
                query = query.Where(v => v.BodyType == bodyType);

            if (minPrice.HasValue)
                query = query.Where(v => v.CurrentPrice >= minPrice.Value);

            if (maxPrice.HasValue)
                query = query.Where(v => v.CurrentPrice <= maxPrice.Value);

            if (minYear.HasValue)
                query = query.Where(v => v.Year >= minYear.Value);

            if (maxYear.HasValue)
                query = query.Where(v => v.Year <= maxYear.Value);

            // Apply sorting
            query = sort switch
            {
                "endingSoon" => query.OrderBy(v => v.AuctionEndTime),
                "newlyListed" => query.OrderByDescending(v => v.Id),
                "priceLow" => query.OrderBy(v => v.CurrentPrice),
                "priceHigh" => query.OrderByDescending(v => v.CurrentPrice),
                _ => query.OrderBy(v => v.AuctionEndTime)
            };

            var vehicles = await query.Select(v => new
            {
                v.Id,
                v.Title,
                v.Make,
                v.Model,
                v.Year,
                v.BodyType,
                v.CurrentPrice,
                v.ReservePrice,
                v.ImageUrl,
                v.AuctionEndTime,
                v.IsSold,
                v.IsPaused,
                Seller = new
                {
                    v.Seller!.Username,
                    v.Seller.IsVerified
                }
            }).ToListAsync();

            return Ok(vehicles);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            // Project to a DTO to avoid circular reference serialization issues
            var vehicle = await _db.Vehicles
                .Where(v => v.Id == id)
                .Include(v => v.Seller)
                .Include(v => v.Images)
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
                    v.ReservePrice,
                    v.ImageUrl,
                    v.AuctionEndTime,
                    v.IsClosed,
                    v.IsSold,
                    v.IsPaused,
                    v.Vin,
                    v.ServiceHistory,
                    v.OwnershipCount,
                    v.ConditionGrade,
                    v.HighlightChips,
                    Seller = new
                    {
                        v.Seller!.Id,
                        v.Seller.Username,
                        v.Seller.IsVerified
                    },
                    Images = v.Images.OrderBy(i => i.DisplayOrder).Select(i => new
                    {
                        i.Id,
                        i.ImageUrl,
                        i.DisplayOrder
                    })
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
                ReservePrice = request.ReservePrice,
                ImageUrl = request.ImageUrl,
                AuctionEndTime = request.AuctionEndTime,
                SellerId = sellerId,
                IsClosed = false,
                IsSold = false,
                IsPaused = false,
                Vin = request.Vin,
                ServiceHistory = request.ServiceHistory,
                OwnershipCount = request.OwnershipCount,
                ConditionGrade = request.ConditionGrade,
                HighlightChips = request.HighlightChips
            };
            _db.Vehicles.Add(vehicle);
            await _db.SaveChangesAsync();
            
            // Return a clean response without navigation properties to avoid circular references
            return CreatedAtAction(nameof(GetById), new { id = vehicle.Id }, new
            {
                id = vehicle.Id,
                title = vehicle.Title,
                make = vehicle.Make,
                model = vehicle.Model,
                year = vehicle.Year,
                bodyType = vehicle.BodyType,
                description = vehicle.Description,
                startingPrice = vehicle.StartingPrice,
                currentPrice = vehicle.CurrentPrice,
                reservePrice = vehicle.ReservePrice,
                imageUrl = vehicle.ImageUrl,
                auctionEndTime = vehicle.AuctionEndTime,
                isClosed = vehicle.IsClosed,
                isSold = vehicle.IsSold,
                isPaused = vehicle.IsPaused,
                vin = vehicle.Vin,
                serviceHistory = vehicle.ServiceHistory,
                ownershipCount = vehicle.OwnershipCount,
                conditionGrade = vehicle.ConditionGrade,
                highlightChips = vehicle.HighlightChips,
                sellerId = vehicle.SellerId
            });
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
            
            // Return a clean response without navigation properties to avoid circular references
            return Ok(new
            {
                id = vehicle.Id,
                title = vehicle.Title,
                make = vehicle.Make,
                model = vehicle.Model,
                year = vehicle.Year,
                bodyType = vehicle.BodyType,
                description = vehicle.Description,
                startingPrice = vehicle.StartingPrice,
                currentPrice = vehicle.CurrentPrice,
                reservePrice = vehicle.ReservePrice,
                imageUrl = vehicle.ImageUrl,
                auctionEndTime = vehicle.AuctionEndTime,
                isClosed = vehicle.IsClosed,
                isSold = vehicle.IsSold,
                isPaused = vehicle.IsPaused,
                vin = vehicle.Vin,
                serviceHistory = vehicle.ServiceHistory,
                ownershipCount = vehicle.OwnershipCount,
                conditionGrade = vehicle.ConditionGrade,
                highlightChips = vehicle.HighlightChips,
                sellerId = vehicle.SellerId
            });
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
        public decimal? ReservePrice { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public DateTime AuctionEndTime { get; set; }
        
        // Trust & Clarity Features
        public string? Vin { get; set; }
        public bool ServiceHistory { get; set; }
        public int? OwnershipCount { get; set; }
        public string? ConditionGrade { get; set; }
        public string? HighlightChips { get; set; }
    }

    public class UpdateVehicleRequest
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
        public DateTime? AuctionEndTime { get; set; }
    }
}


