using Microsoft.EntityFrameworkCore;
using MotorMart_Backend.Models;

namespace MotorMart_Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<Vehicle> Vehicles => Set<Vehicle>();
        public DbSet<Bid> Bids => Set<Bid>();
        public DbSet<Winner> Winners => Set<Winner>();
        public DbSet<Watchlist> Watchlists => Set<Watchlist>();
        public DbSet<VehicleImages> VehicleImages => Set<VehicleImages>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<Vehicle>()
                .HasOne(v => v.Seller)
                .WithMany(u => u.Vehicles)
                .HasForeignKey(v => v.SellerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Vehicle>()
                .HasOne(v => v.SoldToUser)
                .WithMany()
                .HasForeignKey(v => v.SoldToUserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Bid>()
                .HasOne(b => b.Vehicle)
                .WithMany(v => v.Bids)
                .HasForeignKey(b => b.VehicleId);

            modelBuilder.Entity<Bid>()
                .HasOne(b => b.User)
                .WithMany(u => u.Bids)
                .HasForeignKey(b => b.UserId);

            modelBuilder.Entity<Winner>()
                .HasOne(w => w.Vehicle)
                .WithOne(v => v.Winner)
                .HasForeignKey<Winner>(w => w.VehicleId);

            modelBuilder.Entity<Watchlist>()
                .HasOne(w => w.User)
                .WithMany(u => u.Watchlists)
                .HasForeignKey(w => w.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Watchlist>()
                .HasOne(w => w.Vehicle)
                .WithMany(v => v.Watchlists)
                .HasForeignKey(w => w.VehicleId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<VehicleImages>()
                .HasOne(vi => vi.Vehicle)
                .WithMany(v => v.Images)
                .HasForeignKey(vi => vi.VehicleId)
                .OnDelete(DeleteBehavior.Cascade);

            // Ensure unique watchlist entries per user-vehicle pair
            modelBuilder.Entity<Watchlist>()
                .HasIndex(w => new { w.UserId, w.VehicleId })
                .IsUnique();
        }
    }
}


