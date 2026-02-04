using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RentACar.Models
{
    public class CarBooking
    {
        public int Id { get; set; }
        public int CarId { get; set; }
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
        public decimal? PricePerUnit { get; set; }
        public string PricingType { get; set; }
        public string CarImageUrl { get; set; }
        public decimal? TotalAmount { get; set; }
        public decimal? PickupMileage { get; set; }
        public string MileageImageUrl { get; set; }
        public bool IsDriverRequired { get; set; }

        public string? DriverName { get; set; }
        public string? DriverCNIC { get; set; }
        public bool? HasLicense { get; set; }
        public int? DriverId { get; set; }
        public decimal? DriverCharges { get; set; }
        public decimal? BookingTotal { get; set; }   // 🆕




    }
}
