using System;

namespace MotorMart_Backend.Models
{
    public class VehicleImages
    {
        public int Id { get; set; }
        public int VehicleId { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public int DisplayOrder { get; set; } = 0;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        public Vehicle? Vehicle { get; set; }
    }
}

