using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace RentACar.Models
{
    public class Driver
    {
        public int Id { get; set; } // PK
        public string DriverName { get; set; }
        public string DriverCNIC { get; set; }
        public bool HasLicense { get; set; }
    }
}
