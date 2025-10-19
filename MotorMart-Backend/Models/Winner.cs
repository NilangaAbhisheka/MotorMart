namespace MotorMart_Backend.Models
{
    public class Winner
    {
        public int Id { get; set; }

        public int VehicleId { get; set; }
        public Vehicle? Vehicle { get; set; }

        public int UserId { get; set; }
        public User? User { get; set; }

        public decimal FinalPrice { get; set; }
    }
}


