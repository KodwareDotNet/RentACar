using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RentACar.Models
{
    public class Defaulter
    {
        public int DefaulterId { get; set; }
        public string CNIC { get; set; }
        public string Reason { get; set; }
        public DateTime DateAdded { get; set; }
}
}
