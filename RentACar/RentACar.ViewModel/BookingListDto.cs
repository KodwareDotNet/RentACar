//namespace RentACar.ViewModel
//{
//    public class CarWithBookingsDto
//    {
//        // Car Info
//        public int CarId { get; set; }
//        public string CarName { get; set; }
//        public string Model { get; set; }
//        public decimal PricePerDay { get; set; }
//        public string Transmission { get; set; }
//        public string Fuel { get; set; }
//        public string Description { get; set; }
//        public string ImageUrl { get; set; }

//        // Is car ki saari bookings
//        public List<BookingInfo> Bookings { get; set; } = new List<BookingInfo>();
//    }

//    public class BookingInfo
//    {
//        public int Id { get; set; }
//        public int OrganizationId { get; set; }
//        public string FullName { get; set; }
//        public string FatherName { get; set; }
//        public string CNIC { get; set; }
//        public string LicenseNumber { get; set; }
//        public string Phone { get; set; }
//        public int Age { get; set; }
//        public string Address { get; set; }
//        public string City { get; set; }
//        public DateTime PickupDate { get; set; }
//        public DateTime DropoffDate { get; set; }
//    }
//}