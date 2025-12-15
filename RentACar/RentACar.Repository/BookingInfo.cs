
namespace RentACar.Repository
{
    internal class BookingInfo
    {
        public int Id { get; set; }
        public int OrganizationId { get; set; }
        public string FullName { get; set; }
        public string FatherName { get; set; }
        public string CNIC { get; set; }
        public string LicenseNumber { get; set; }
        public string Phone { get; set; }
        public int Age { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public DateTime PickupDate { get; set; }
        public DateTime DropoffDate { get; set; }
    }
}