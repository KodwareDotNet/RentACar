using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RentACar.ViewModel
{
    public class RentACarViewModel
    {
        public long Id { get; set; } = default!;
        public string? Title { get; set; } = default!;
        public string? Subtitle { get; set; } = default!;
        public string? Content { get; set; } = default!;
        public List<AttachmentViewModel> attachments { get; set; } = new List<AttachmentViewModel>();
        public DateTimeOffset? CreatedAt { get; set; }
        public int? CategoryId { get; set; }
        public DateTime? PublishedOn { get; set; }
        public string? CreatedBy { get; set; } = default!;
    }
}
