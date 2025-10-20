using System;

namespace MotorMart_Backend.Models
{
    public class Watchlist
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int VehicleId { get; set; }
        public DateTime AddedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public User? User { get; set; }
        public Vehicle? Vehicle { get; set; }
    }
}
