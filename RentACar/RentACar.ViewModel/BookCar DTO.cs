using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace RentACar.ViewModel
{
    public class BookCarDto
    {
        public int Id { get; set; }

        public int BookingId { get; set; }
        public string FullName { get; set; }
        public string FatherName { get; set; }
        public string CNIC { get; set; }
        public string LicenseNumber { get; set; }
        public string Phone { get; set; }
        public int Age { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public DateTime PickupDate { get; set; }
        public DateTime DropoffDate { get; set; }
        public int BookingStatus { get; set; }   // 1,2,3
        public string Status { get; set; }
        public int CarId { get; set; }
        public int OrganizationId { get; set; }
        public string CarImageUrl { get; set; }
        public decimal? PricePerUnit { get; set; }
        public string PricingType { get; set; }
        public decimal? TotalAmount { get; set; }
        public decimal? PickupMileage { get; set; }
        public IFormFile? MileageImage { get; set; }

        // File Uploads


        // Car columns (flat - for Dapper mapping)
        public string CarName { get; set; }
        public string? Model { get; set; }
        public decimal PricePerHour { get; set; }
        public string? Transmission { get; set; }
        public string? Fuel { get; set; }
        public string? Description { get; set; }

        public string? ImageUrl { get; set; }

        public IFormFile? CarImage { get; set; }
        public List<IFormFile>? Attachments { get; set; }
        public List<AttachmentDto>? AttachmentsArray { get; set; }

        public int AttachmentId { get; set; }
        public string? FileName { get; set; }
        public string? FilePath { get; set; }
        public long? FileSize { get; set; }
        public DateTime? UploadDate { get; set; }
        public decimal? ReturnMileage { get; set; }
        public decimal? TotalMileageCovered { get; set; }
        public decimal? MileageCharges { get; set; }
        public string? ReturnMileageImageUrl { get; set; }
        public List<int>? DeleteAttachmentIds { get; set; }
        public int TotalRecords { get; set; }
        public string? MileageImageUrl { get; set; }
    }

    // Response ke liye (Car + its bookings)
    public class CarWithBookingsDto
    {
        public int CarId { get; set; }
        public string CarName { get; set; }
        public string Model { get; set; }
        public decimal PricePerDay { get; set; }
        public string? Transmission { get; set; }
        public string? Fuel { get; set; }
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }

        public List<BookingInfoDto> Bookings { get; set; } = new List<BookingInfoDto>();

    }

    // Booking info (nested ke liye)
    public class BookingInfoDto
    {
        public int Id { get; set; }
        public int OrganizationId { get; set; }
        public string FullName { get; set; }
        public string FatherName { get; set; }
        public string CNIC { get; set; }
        public string LicenseNumber { get; set; }
        public string Phone { get; set; }
        public int Age { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public DateTime PickupDate { get; set; }
        public DateTime DropoffDate { get; set; }

    }
}

