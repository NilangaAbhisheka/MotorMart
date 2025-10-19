using System;
using System.Collections.Generic;

namespace MotorMart_Backend.Models
{
    public class Vehicle
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Make { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public int Year { get; set; }
        public string BodyType { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal StartingPrice { get; set; }
        public decimal CurrentPrice { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public DateTime AuctionEndTime { get; set; }
        public bool IsClosed { get; set; }

        public int SellerId { get; set; }
        public User? Seller { get; set; }

        public ICollection<Bid> Bids { get; set; } = new List<Bid>();
        public Winner? Winner { get; set; }
    }
}


