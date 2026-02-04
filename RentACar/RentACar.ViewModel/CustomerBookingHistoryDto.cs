using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RentACar.ViewModel
{
    public class CustomerBookingHistoryDto
    {
        public int BookingId { get; set; }
        public int CarId { get; set; }
        public DateTime PickupDate { get; set; }
        public DateTime DropoffDate { get; set; }
        public int BookingStatus { get; set; }
        public DateTime? ActualReturnDate { get; set; }
        public bool IsDamaged { get; set; }
        public decimal DamageCharges { get; set; }
        public decimal LateExtraCharges { get; set; }
        public decimal TotalPrice { get; set; }
    }
}
