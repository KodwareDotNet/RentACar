using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RentACar.ViewModel
{
    public class MaintenanceReportPagedResponseDto
    {
        public IEnumerable<MaintenanceReportDto> Data { get; set; } = new List<MaintenanceReportDto>();
        public int TotalRecords { get; set; }

}
}
