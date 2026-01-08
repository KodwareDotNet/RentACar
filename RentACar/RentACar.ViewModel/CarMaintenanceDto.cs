using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RentACar.ViewModel
{
    public class CarMaintenanceDto
    {
        public int MaintenanceId { get; set; }
        public int CarId { get; set; }
        public string? CarName { get; set; }

        public string? Remarks { get; set; }
        public bool IsRepair { get; set; }
        public bool IsReplace { get; set; }

        public decimal Cost { get; set; }
        public DateTime LastMaintenanceDate { get; set; }
        public string? ImageUrl { get; set; }
        public EnumMaintenanceStatus Status { get; set; }
        public string StatusText { get; set; } = string.Empty;
    }
}
