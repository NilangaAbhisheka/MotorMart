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
        public decimal? ReservePrice { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public DateTime AuctionEndTime { get; set; }
        public bool IsClosed { get; set; }
        public bool IsSold { get; set; }
        public bool IsPaused { get; set; }

        // Trust & Clarity Features
        public string? Vin { get; set; }
        public bool ServiceHistory { get; set; }
        public int? OwnershipCount { get; set; }
        public string? ConditionGrade { get; set; }
        public string? HighlightChips { get; set; } // JSON string for multiple highlights

        public int SellerId { get; set; }
        public User? Seller { get; set; }

        public ICollection<Bid> Bids { get; set; } = new List<Bid>();
        public ICollection<VehicleImages> Images { get; set; } = new List<VehicleImages>();
        public ICollection<Watchlist> Watchlists { get; set; } = new List<Watchlist>();
        public Winner? Winner { get; set; }
    }
}


