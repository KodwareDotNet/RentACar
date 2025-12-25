using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RentACar.Models
{
    public class CancelBookingRequest
    {
        public int Id { get; set; }
        public decimal UsedAmount { get; set; }
        public decimal RefundableAmount { get; set; }
        public DateTime CancelledAt { get; set; }
    }
}
