using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using RentACar.ViewModel;

namespace RentACar.ViewModel
{
    public class PersonWithCarDto
    {
        public int BookingId { get; set; }
        public int OrganizationId { get; set; }

        // Person Info
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
        public decimal? PricePerUnit { get; set; }
        public string PricingType { get; set; }

        // Car Info (nested)
        public CarInfoDto Car { get; set; }

        public List<AttachmentDto> Attachments { get; set; } = new List<AttachmentDto>();
        public int BookingStatus { get; set; }
        public string Status { get; set; }
        public decimal? TotalAmount { get; set; }
    }

    public class CarInfoDto
    {
        public int CarId { get; set; }
        public string CarName { get; set; }
        public string Model { get; set; }
        public decimal PricePerHour { get; set; }
        public string Transmission { get; set; }
        public string Fuel { get; set; }
        public string Description { get; set; }
        public string ImageUrl { get; set; }
    }
}
