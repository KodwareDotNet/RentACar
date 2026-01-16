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
            string mileageImagePath = null;  // 🆕

            var uploadRoot = @"C:\Users\kodwa\source\repos\Rent-a-car\RentACarAPi\RentACar\RentACar\bin\Debug\net8.0\UploadedFiles\Bookings";

            if (!Directory.Exists(uploadRoot))
                Directory.CreateDirectory(uploadRoot);

            // 🆕 Upload Mileage Image
            if (dto.MileageImage != null && dto.MileageImage.Length > 0)
            {
                var mileageFileName = $"mileage_{Guid.NewGuid()}{Path.GetExtension(dto.MileageImage.FileName)}";
                var mileageFullPath = Path.Combine(uploadRoot, mileageFileName);

                using (var stream = new FileStream(mileageFullPath, FileMode.Create))
                {
                    await dto.MileageImage.CopyToAsync(stream);
                }

                mileageImagePath = $"/Images/Bookings/{mileageFileName}";
            }

            // Upload Car Image
            if (dto.CarImage != null && dto.CarImage.Length > 0)
            {
                var fileName = $"car_{Guid.NewGuid()}{Path.GetExtension(dto.CarImage.FileName)}";
                var fullPath = Path.Combine(uploadRoot, fileName);

                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    await dto.CarImage.CopyToAsync(stream);
                }

                carImagePath = $"/Images/Bookings/{fileName}";
            }

            // 🆕 Validate Mileage
            if (dto.PickupMileage.HasValue && dto.PickupMileage.Value < 0)
            {
                return BadRequest(new { success = false, message = "Mileage cannot be negative" });
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
                PricePerUnit = dto.PricePerUnit,
                PricingType = dto.PricingType,
                TotalAmount = dto.TotalAmount,
                PickupMileage = dto.PickupMileage,      // 🆕
                MileageImageUrl = mileageImagePath      // 🆕
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
                    var fileName = $"attach_{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
                    var fullPath = Path.Combine(uploadRoot, fileName);

                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    await _rentACarMap.SaveAttachment(
                        bookingId,
                        file.FileName,
                        $"/Images/Bookings/{fileName}",
                        file.Length
                    );
                }
            }

            return Ok(new
            {
                success = true,
                message = dto.Id > 0 ? "Booking updated successfully" : "Car booked successfully",
                bookingId = bookingId,
                totalAmount = dto.TotalAmount,
                pickupMileage = dto.PickupMileage  // 🆕
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
                string? returnMileageImagePath = null;

                var folder = @"C:\Users\kodwa\source\repos\Rent-a-car\RentACarAPi\RentACar\RentACar\bin\Debug\net8.0\UploadedFiles\Receives";
                if (!Directory.Exists(folder))
                    Directory.CreateDirectory(folder);

                // 🆕 Upload Return Mileage Image (if provided)
                if (dto.ReturnMileageImage != null && dto.ReturnMileageImage.Length > 0)
                {
                    var mileageFileName = $"mileage_{Guid.NewGuid()}{Path.GetExtension(dto.ReturnMileageImage.FileName)}";
                    var mileageFullPath = Path.Combine(folder, mileageFileName);

                    using (var stream = new FileStream(mileageFullPath, FileMode.Create))
                    {
                        await dto.ReturnMileageImage.CopyToAsync(stream);
                    }

                    returnMileageImagePath = $"/Images/Receives/{mileageFileName}";
                }

                // 🆕 Validate Return Mileage
                if (dto.ReturnMileage.HasValue && dto.ReturnMileage.Value < 0)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Return mileage cannot be negative"
                    });
                }

                // 1️⃣ Create the receive record with mileage
                int receiveId = await _rentACarMap.ReceiveCar(
                    dto.BookingId,
                    dto.IsDamaged,
                    dto.Remarks,
                    dto.DamageRemarks,
                    dto.DamageCharges,
                    dto.LateExtraCharges,
                    dto.DropOffDate,
                    dto.TotalPrice,
                    dto.ReturnMileage,          // 🆕
                    dto.MileageCharges ?? 0,    // 🆕
                    returnMileageImagePath      // 🆕
                );

                // 2️⃣ Save all receive images
                var uploadedImages = new List<ReceiveImageDto>();

                if (dto.ReceiveImages != null && dto.ReceiveImages.Count > 0)
                {
                    foreach (var image in dto.ReceiveImages)
                    {
                        if (image != null && image.Length > 0)
                        {
                            var fileName = $"receive_{Guid.NewGuid()}{Path.GetExtension(image.FileName)}";
                            var fullPath = Path.Combine(folder, fileName);

                            using (var stream = new FileStream(fullPath, FileMode.Create))
                            {
                                await image.CopyToAsync(stream);
                            }

                            var imagePath = $"/Images/Receives/{fileName}";

                            // Save image reference in database
                            await _rentACarMap.AddReceiveImage(receiveId, imagePath, "Receive");

                            uploadedImages.Add(new ReceiveImageDto
                            {
                                ImageUrl = imagePath,
                                ImageType = "Receive"
                            });
                        }
                    }
                }

                // 3️⃣ If mileage image was uploaded, save it as a separate record
                if (!string.IsNullOrEmpty(returnMileageImagePath))
                {
                    await _rentACarMap.AddReceiveImage(receiveId, returnMileageImagePath, "Mileage");

                    uploadedImages.Add(new ReceiveImageDto
                    {
                        ImageUrl = returnMileageImagePath,
                        ImageType = "Mileage"
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Car received successfully",
                    receiveId,
                    imagesCount = uploadedImages.Count,
                    images = uploadedImages,
                    // 🆕 Mileage Info
                    mileageInfo = new
                    {
                        returnMileage = dto.ReturnMileage,
                        mileageCharges = dto.MileageCharges ?? 0,
                        mileageImageUrl = returnMileageImagePath
                    }
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
        [HttpGet("GetReports")]
        public async Task<IActionResult> GetReports(
      int orgId,
      DateTime? startDate = null,
      DateTime? endDate = null)
        {
            // Validate date range
            if (startDate == null || endDate == null)
            {
                return BadRequest(new { message = "StartDate and EndDate are required." });
            }

            // Normalize dates to remove time component
            startDate = startDate.Value.Date;
            endDate = endDate.Value.Date;

            // Validate that endDate is after startDate
            if (endDate.Value < startDate.Value)
            {
                return BadRequest(new { message = "EndDate must be after StartDate." });
            }

            var request = new ReportRequestDto
            {
                OrganizationId = orgId,
                StartDate = startDate,
                EndDate = endDate
            };

            var result = await _rentACarMap.GetReports(request);
            return Ok(result);
        }
    //    [HttpPost("AddOrUpdateMaintanence")]
    //    public async Task<IActionResult> AddOrUpdateMaintenance(
    //    [FromForm] CarMaintenanceDto dto,
    //    IFormFile? image
    //)
    //    {
    //        if (image != null)
    //        {
    //            var fileName = Guid.NewGuid() + Path.GetExtension(image.FileName);
    //            var path = Path.Combine(
    //                @"C:\Users\kodwa\source\repos\Rent-a-car\RentACarAPi\RentACar\RentACar\bin\Debug\net8.0\UploadedFiles",
    //                fileName
    //            );

    //            using var stream = new FileStream(path, FileMode.Create);
    //            await image.CopyToAsync(stream);

    //            dto.ImageUrl = "/MaintenanceImages/" + fileName;
    //        }

    //        await _rentACarMap.AddMaintenance(dto);
    //        return Ok(new { success = true });
    //    }

        [HttpGet("GetAllMaintanence")]
        public async Task<IActionResult> GetAll()
        {
            var result = await _rentACarMap.GetMaintenanceWithCarDetails();
            return Ok(result);
        }

        [HttpPut("CancelMaintance/{id}")]
        public async Task<IActionResult> Cancel(int id)
        {
            await _rentACarMap.CancelMaintenance(id);
            return Ok(new { success = true, message = "Maintenance canceled" });
        }
        //[HttpPost("insert")]
        //public async Task<IActionResult> InsertCarMileageHistory([FromBody] InsertCarMileageHistoryRequest request)
        //{
        //    if (request == null || request.ReceiveId <= 0)
        //    {
        //        return BadRequest(new ApiResponse<bool>
        //        {
        //            Success = false,
        //            Message = "Invalid request. ReceiveId is required and must be greater than 0",
        //            Data = false
        //        });
        //    }

        //    var result = await _rentACarMap.InsertCarMileageHistoryAsync(request.ReceiveId);

        //    if (result.Success)
        //    {
        //        return Ok(result);
        //    }

        //    return BadRequest(result);
        //}

        ////        [HttpPost("insert/{receiveId}")]
        //        public async Task<IActionResult> InsertCarMileageHistoryByRoute(int receiveId)
        //        {
        //            if (receiveId <= 0)
        //            {
        //                return BadRequest(new ApiResponse<bool>
        //                {
        //                    Success = false,
        //                    Message = "Invalid ReceiveId. Must be greater than 0",
        //                    Data = false
        //                });
        //            }

        //            var result = await _rentACarMap.InsertCarMileageHistoryAsync(receiveId);

        //            if (result.Success)
        //            {
        //                return Ok(result);
        //            }
            
        //            return BadRequest(result);
        //        }
        //    }
        //}
        [HttpGet("GetCarMileageDetails")]
        public async Task<IActionResult> GetCarMileageDetails()
        {
            var data = await _rentACarMap.GetCarMileageDetailsAsync();
            return Ok(data);
        }

        [HttpGet("GetMaintenanceReports")]
        public async Task<IActionResult> GetMaintenanceReports(
        int orgId,
        DateTime? startDate = null,
        DateTime? endDate = null)
        {
            if (startDate == null || endDate == null)
                return BadRequest(new { message = "StartDate and EndDate are required." });

            startDate = startDate.Value.Date;
            endDate = endDate.Value.Date;

            if (endDate < startDate)
                return BadRequest(new { message = "EndDate must be after StartDate." });

            var request = new MaintenanceReportRequestDto
            {
                OrganizationId = orgId,
                StartDate = startDate,
                EndDate = endDate
            };

            var result = await _rentACarMap.GetMaintenanceReports(request);
            return Ok(result);
        }
        [HttpPut("CompleteMaintenance")]
        public async Task<IActionResult> CompleteMaintenance(
     [FromForm] CompleteMaintenanceDto dto)
        {
            await _rentACarMap.AddOrUpdateMaintenance(dto);

            return Ok(new
            {
                message = "Maintenance completed successfully"
            });
        }



    }
}
