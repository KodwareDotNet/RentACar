using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RentACar.ViewModel
{
    public class MaintenanceReportDto
    {
        public int Id { get; set; }
        public string CarName { get; set; } = default!;
        public string CarBrand { get; set; } = default!;
        public string Color { get; set; } = default!;
        public string NumberPlate { get; set; } = default!;
        public long PickupMileage { get; set; }
        public long ReturnMileage { get; set; }
        public string Status { get; set; }
        public long TotalMileageCovered { get; set; }
        public string RepairType { get; set; } = default!;
        public DateTime CreatedAt { get; set; }
    }
}
