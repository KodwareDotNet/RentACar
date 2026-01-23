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
        public int? MileageDueMaintenance { get; set; }
        public List<AttachmentViewModel> attachments { get; set; } = new List<AttachmentViewModel>();
        public DateTimeOffset? CreatedAt { get; set; }
        public int? CategoryId { get; set; }
        public DateTime? PublishedOn { get; set; }
        public string? CreatedBy { get; set; } = default!;
    }
}
public class ReportDto
{
    public int BookingId { get; set; }
    public string CarName { get; set; }
    public string Customer { get; set; }
    public DateTime Date { get; set; }
    public string Status { get; set; }
    public int StatusCode { get; set; }
    public string? DamageRemarks { get; set; }
    public decimal Amount { get; set; }
    public decimal DamageCharges { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class ReportRequestDto
{
    public int OrganizationId { get; set; }
    //public string ReportType { get; set; } // daily, weekly, monthly
    public DateTime? Date { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? Month { get; set; } // Format: 2026-01
}
public class ReportPagedResponseDto
{
    public IEnumerable<ReportDto> Data { get; set; } = new List<ReportDto>();
    public int TotalRecords { get; set; }
}
