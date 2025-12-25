using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using RentACar.ViewModel;

public class AttachmentDto
{
    public int? AttachmentId { get; set; }
    public string? FileName { get; set; }
    public string? FilePath { get; set; }
    public long? FileSize { get; set; }
    public DateTime UploadDate { get; set; }
    public object BookingId { get; set; }
    public List<BookingInfoDto> Bookings { get; set; } = new List<BookingInfoDto>();
}