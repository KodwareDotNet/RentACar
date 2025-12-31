using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RentACar.Interfaces;
using RentACar.Map;
using RentACar.Models;
using RentACar.Repositories.Services.Interfaces;
using RentACar.ViewModel;

namespace NewsApi.Controllers
{
    [ApiController]
    [Route("api/Car")]
    public class CarController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IRentACarMap _rentACarMap;
        private object totalAmount;

        public CarController(IConfiguration configuration, IRentACarMap rentACarMap)
        {
            _configuration = configuration;
            _rentACarMap = rentACarMap;
        }


        // GET: api/Car
        [HttpGet("GetAllCars")]
        [Authorize(Policy = "CanViewCar")]
        public async Task<IEnumerable<RentACarViewModel>> GetAllCars()
        {
            var result = await _rentACarMap.GetAllCars();
            return result;
        }

        // GET: api/Car/GetAllKeyValuePair
        [HttpGet("GetAllKeyValuePair")]
        [Authorize(Policy = "CanViewCar")]
        public async Task<IEnumerable<RentACar.Models.KeyValuePair>> GetAllKeyValuePair(int keyValuePair, long? id)
        {
            return await _rentACarMap.GetAllKeyValuePair((KeyValuePairType)keyValuePair, id);
        }


        [HttpPost("AddCar")]
        [Authorize(Policy = "CanAddCar")]
        public async Task<IActionResult> CreateCars([FromBody] RentACarViewModel car)
        {
            var result = await _rentACarMap.CreateCars(car);
            return Ok(result);
        }

        // Example: Delete Car
        [HttpDelete("DeleteCar/{id}")]
        [Authorize(Policy = "CanDeleteCar")]
        public async Task<IActionResult> DeleteCar(long id)
        {
            var result = await _rentACarMap.DeleteCar(id);
            return Ok(result);
        }
        [HttpPost("BookCar")]
        public async Task<IActionResult> BookCar([FromForm] BookCarDto dto)
        {
            string carImagePath = dto.CarImageUrl;

            // Upload Car Image
            if (dto.CarImage != null && dto.CarImage.Length > 0)
            {
                var rootPath = @"C:\Users\kodwa\source\repos\Rent-a-car\RentACarAPi\RentACar\RentACar\bin\Debug\net8.0\UploadedFiles\Bookings";
                if (!Directory.Exists(rootPath))
                    Directory.CreateDirectory(rootPath);

                var fileName = Guid.NewGuid() + Path.GetExtension(dto.CarImage.FileName);
                var fullPath = Path.Combine(rootPath, fileName);

                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    await dto.CarImage.CopyToAsync(stream);
                }

                carImagePath = $"/Images/Bookings/{fileName}";
            }

            var booking = new CarBooking
            {
                Id = dto.Id,
                FullName = dto.FullName,
                FatherName = dto.FatherName,
                CNIC = dto.CNIC,
                LicenseNumber = dto.LicenseNumber,
                Phone = dto.Phone,
                Age = dto.Age,
                Address = dto.Address,
                City = dto.City,
                PickupDate = dto.PickupDate,
                DropoffDate = dto.DropoffDate,
                CarId = dto.CarId,
                OrganizationId = dto.OrganizationId,
                CarImageUrl = carImagePath,
                PricePerUnit = dto.PricePerUnit,      // ✅ New
                PricingType = dto.PricingType,
                TotalAmount = dto.TotalAmount// ✅ New
            };

            // Create or Update Booking
            int bookingId = await _rentACarMap.BookCarAndReturnId(booking);

            if (bookingId <= 0)
                return BadRequest(new { success = false, message = "Operation failed" });

            // Delete Old Attachments (for Update only)
            if (dto.DeleteAttachmentIds != null && dto.DeleteAttachmentIds.Any())
            {
                foreach (var attachmentId in dto.DeleteAttachmentIds)
                {
                    await _rentACarMap.DeleteAttachment(attachmentId);
                }
            }

            // Upload New Attachments
            if (dto.Attachments != null && dto.Attachments.Any())
            {
                foreach (var file in dto.Attachments)
                {
                    var folderPath = @"C:\Users\kodwa\source\repos\Rent-a-car\RentACarAPi\RentACar\RentACar\bin\Debug\net8.0\UploadedFiles\Bookings";
                    if (!Directory.Exists(folderPath))
                        Directory.CreateDirectory(folderPath);

                    var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
                    var fullPath = Path.Combine(folderPath, fileName);

                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    await _rentACarMap.SaveAttachment(
                        bookingId,
                        file.FileName,
                        "/Images/Bookings/" + fileName,
                        file.Length
                    );
                }
            }

            return Ok(new
            {
                success = true,
                message = dto.Id > 0 ? "Booking updated successfully" : "Car booked successfully",
                bookingId = bookingId,
                totalAmount = totalAmount
            });
        }
        // Controller
        [HttpGet("GetAllBookings")]
        public async Task<IActionResult> GetAllBookings(
    int pageNumber = 1,
    int pageSize = 10,
    int? bookingStatus = null,
    string? fullName = null
)
        {
            var result = await _rentACarMap.GetAllBookings(
                pageNumber,
                pageSize,
                bookingStatus,
                fullName
            );

            return Ok(result);
        }

        [HttpPut("CancelBooking")]
public async Task<IActionResult> CancelBooking(CancelBookingRequest model)
{
    var result = await _rentACarMap.CancelBooking(model);

    if (result == 1)
        return Ok(new { success = true, message = "Booking cancelled successfully" });
    else if (result == -2)
        return BadRequest(new { success = false, message = "Booking already cancelled" });
    else if (result == 0)
        return NotFound(new { success = false, message = "Booking not found" });
    else
        return StatusCode(500, new { success = false, message = "Error cancelling booking" });
}


        [HttpPost("ReceiveCar")]
        public async Task<IActionResult> ReceiveCar([FromForm] ReceiveCarDto dto)
        {
            try
            {
                // 1️⃣ First create the receive record
                int receiveId = await _rentACarMap.ReceiveCar(
                    dto.BookingId,
                    dto.IsDamaged,
                    dto.Remarks,
                    dto.DamageRemarks,
                    dto.DamageCharges,
                    dto.LateExtraCharges,
                    dto.DropOffDate,
                    dto.TotalPrice
                );

                // 2️⃣ Then save all images
                var uploadedImages = new List<ReceiveImageDto>();

                if (dto.ReceiveImages != null && dto.ReceiveImages.Count > 0)
                {
                    var folder = @"C:\Users\kodwa\source\repos\Rent-a-car\RentACarAPi\RentACar\RentACar\bin\Debug\net8.0\UploadedFiles\Receives";

                    if (!Directory.Exists(folder))
                        Directory.CreateDirectory(folder);

                    foreach (var image in dto.ReceiveImages)
                    {
                        if (image != null && image.Length > 0)
                        {
                            var fileName = Guid.NewGuid() + Path.GetExtension(image.FileName);
                            var fullPath = Path.Combine(folder, fileName);

                            using (var stream = new FileStream(fullPath, FileMode.Create))
                            {
                                await image.CopyToAsync(stream);
                            }

                            var imagePath = "/Images/Receives/" + fileName;

                            // Save image reference in database
                            await _rentACarMap.AddReceiveImage(receiveId, imagePath, null);

                            uploadedImages.Add(new ReceiveImageDto
                            {
                                ImageUrl = imagePath,
                                ImageType = "Receive"
                            });
                        }
                    }
                }

                return Ok(new
                {
                    success = true,
                    message = "Car received successfully",
                    receiveId,
                    imagesCount = uploadedImages.Count,
                    images = uploadedImages
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }



        [HttpGet("GetAllReceivedCars")]
        public async Task<IActionResult> GetAllReceivedCars(
    int pageNumber = 1,
    int pageSize = 10,
    string? fullName = null,
    DateTime? fromDate = null,
    DateTime? toDate = null)
        {
            var data = await _rentACarMap.GetAllReceivedCars(
                pageNumber, pageSize, fullName, fromDate, toDate);

            return Ok(data);
        }



        [HttpDelete("DeleteReceivedCar/{id}")]
        public async Task<IActionResult> DeleteReceivedCar(int id)
        {
            await _rentACarMap.DeleteReceivedCar(id);
            return Ok(new { success = true, message = "Received record deleted" });
        }
        [HttpGet("GetBilling/{bookingId}")]
        public async Task<IActionResult> GetBilling(int bookingId)
        {
            try
            {
                var billing = await _rentACarMap.GetBillingByBookingId(bookingId);
                if (billing == null)
                    return NotFound(new { success = false, message = "Billing not found" });

                return Ok(new { success = true, data = billing });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("GetMonthlyProfit")]
        public async Task<IActionResult> GetMonthlyProfit([FromQuery] int month, [FromQuery] int year)
        {
            try
            {
                var profit = await _rentACarMap.GetMonthlyProfit(month, year);
                return Ok(new { success = true, data = profit });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }
    }
}



