using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace RentACar.ViewModel
{
    public class ReceiveCarDto
    {
        public int Id { get; set; }
        public int BookingId { get; set; }
        public string? Remarks { get; set; }
        public List<IFormFile>? ReceiveImages { get; set; }
        public bool IsDamaged { get; set; }
        public string? DamageRemarks { get; set; }
        public decimal DamageCharges { get; set; }
        public int ReceiveId { get; set; }
        public decimal LateExtraCharges { get; set; }
        public DateTime? DropOffDate { get; set; }
        public decimal TotalPrice { get; set; }
    }
    public class ReceiveImageDto
    {
        public int ImageId { get; set; }
        public int ReceiveId { get; set; }
        public string ImageUrl { get; set; }
        public string? ImageType { get; set; }
        public DateTime? UploadedAt { get; set; }
        public List<ReceiveImageDto>? Images { get; set; }
    }
    public class ReceivedCarResponseDto
    {
        public int ReceiveId { get; set; }
        public int BookingId { get; set; }
        public string FullName { get; set; }
        public string? ReceiveImageUrl { get; set; }
        public int CarId { get; set; }
        public string? CarName { get; set; }
        public bool IsDamaged { get; set; }
        public string? DamageRemarks { get; set; }
        public decimal DamageCharges { get; set; }
        public DateTime ReceivedDate { get; set; }
        public DateTime? CreatedAt { get; set; }
        public string? Remarks { get; set; }
        public int TotalRecords { get; set; }
        public List<ReceiveImageDto>? Images { get; set; }
    }
    public class BillingDto
    {
        public int BillingId { get; set; }
        public int BookingId { get; set; }
        public int CarId { get; set; }
        public string CarName { get; set; }
        public decimal PerDayRent { get; set; }
        public int TotalDays { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal DamageCharges { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime PickupDate { get; set; }
        public DateTime ActualReturnDate { get; set; }
        public decimal LateExtraCharges { get; set; }
        public DateTime? DropOffDate { get; set; }

    }

    public class MonthlyProfitDto
    {
        public int Month { get; set; }
        public int Year { get; set; }
        public decimal TotalRevenue { get; set; }
        public decimal TotalDamageCharges { get; set; }
        public decimal TotalProfit { get; set; }
        public int TotalBookings { get; set; }
        public List<BillingDto> Billings { get; set; } = new List<BillingDto>();
    }
}
