namespace Hotel_Booking_system.Models
{
    public class Room
    {
        public int Id { get; set; }
        public string RoomName { get; set; }
        public decimal PricePerNight { get; set; }
        public string Description { get; set; }
        public string ImageUrl { get; set; }

        public int RoomTypeId { get; set; }
        public RoomType RoomType { get; set; }
    }
    public class RoomType
    {
        public int Id { get; set; }
        public string TypeName { get; set; } // Normal, Premium, Luxury
        public ICollection<Room> Rooms { get; set; }
    }

}
