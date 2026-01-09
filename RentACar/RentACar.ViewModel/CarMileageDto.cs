using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RentACar.ViewModel
{
    public class CarMileageDto
    {
        public int CarId { get; set; }
        public string? CarName { get; set; }
        public string? NumberPlate { get; set; }
        public int BookingId { get; set; }
        public DateTime? PickupDate { get; set; }
        public DateTime? ReceivedDate { get; set; }
        public decimal PickupMileage { get; set; }
        public string? ImageUrl { get; set; }
        public decimal ReturnMileage { get; set; }
        public decimal TotalMileageCovered { get; set; }
    }
}
