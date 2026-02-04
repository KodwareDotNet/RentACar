using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RentACar.ViewModel
{
    public class CustomerHistorySummaryDto
    {
        public int TotalBookings { get; set; }
        public int CompletedBookings { get; set; }
        public int ActiveBookings { get; set; }
        public decimal TotalLateCharges { get; set; }
        public int DamageCount { get; set; }
        public decimal TotalAmountPaid { get; set; }
        public DateTime? LastBookingDate { get; set; }
    }
}
