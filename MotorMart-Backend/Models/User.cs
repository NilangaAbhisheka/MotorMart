using System.Collections.Generic;

namespace MotorMart_Backend.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Role { get; set; } = "Buyer"; // Buyer | Seller | Admin
        public bool IsVerified { get; set; } = true; // Default to true for existing users

        public ICollection<Vehicle> Vehicles { get; set; } = new List<Vehicle>();
        public ICollection<Bid> Bids { get; set; } = new List<Bid>();
        public ICollection<Watchlist> Watchlists { get; set; } = new List<Watchlist>();
    }
}


