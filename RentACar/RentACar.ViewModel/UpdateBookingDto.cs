using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace RentACar.ViewModel
{
    public class UpdateBookingDto
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
        public string CarImageUrl { get; set; }
        public IFormFile CarImage { get; set; }  // Optional - agar new image upload karni ho
}
}
