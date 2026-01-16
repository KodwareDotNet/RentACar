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
        public long? MaintenanceId { get; set; }
        public string? CarName { get; set; }
        public string? NumberPlate { get; set; }
        public int BookingId { get; set; }
        public DateTime? PickupDate { get; set; }
        public DateTime? ReceivedDate { get; set; }
        public decimal PickupMileage { get; set; }
        public string? ImageUrl { get; set; }
        //public int Status { get; set; }
        public decimal ReturnMileage { get; set; }
        public decimal TotalMileageCovered { get; set; }
        public int RepairType { get; set; }          // 1 / 2
        public string? RepairTypeText { get; set; }
        public MaintenanceStatus Status { get; set; }
    }
}
public enum MaintenanceStatus
{
    Active = 1,
    Completed = 2
}