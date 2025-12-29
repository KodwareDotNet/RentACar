using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RentACar.ViewModel
{
    public class BookingFilterDto
    {
        public int? OrganizationId { get; set; }
        public int? BookingStatus { get; set; }   // 1=Active,2=Completed,3=Cancelled
        public string? FullName { get; set; }
        public string? CNIC { get; set; }
        public string? Phone { get; set; }
        public string? City { get; set; }
        public int? CarId { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }
}
