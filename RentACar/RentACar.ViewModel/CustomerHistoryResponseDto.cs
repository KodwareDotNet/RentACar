using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RentACar.ViewModel
{
    public class CustomerHistoryResponseDto
    {
        public string CNIC { get; set; }
        public CustomerHistorySummaryDto Summary { get; set; }
        public List<CustomerBookingHistoryDto> History { get; set; }
    }
}
