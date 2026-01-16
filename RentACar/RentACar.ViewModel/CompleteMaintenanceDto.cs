using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RentACar.ViewModel
{
    public class CompleteMaintenanceDto
    {
        public int Id { get; set; }
        public int carId { get; set; }
        public decimal Cost { get; set; }
        public string Remarks { get; set; }
        public string status { get; set; }
    }

}
