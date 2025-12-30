using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using MenuManagement.Repositories;
using RentACar.Interfaces.RepoInterfaces;
using RentACar.Models;
using RentACar.ViewModel;

namespace RentACar.Repository
{
    public class RentACarRepository : BaseRepository, IRentACarRepository
    {
        private new readonly IDbConnection _connection;
        public RentACarRepository(IDbConnection connection) : base(connection)
        {

            _connection = connection;

        }

        public Task<long> Create(Car cars)
        {
            throw new NotImplementedException();
        }

        public async Task<long> Createcars(Car cars)
        {
            var parameters = new
            {

                pId = cars.Id,


            };
            DynamicParameters para = new DynamicParameters(parameters);
            para.Add("@pReturnId", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await ExecuteAsync("sp_CreateNews", para, CommandType.StoredProcedure);
            var NewsId = para.Get<int>("@pReturnId");
            return NewsId;
        }

        public async Task<bool> DeleteNews(long id)
        {

            var parameters = new
            {
                pId = id
            };
            DynamicParameters para = new DynamicParameters(parameters);
            para.Add("@pReturnId", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await ExecuteAsync("uspDeleteNews", para, CommandType.StoredProcedure);
            var NewsId = para.Get<int>("@pReturnId");
            if (NewsId > 0)
            {
                return true;
            }
            return false;
        }

        public async Task<IEnumerable<Models.KeyValuePair>> GetAllKeyValuePair(KeyValuePairType keyValuePair, long? id)
        {
            var parameters = new
            {
                pKeyValueType = keyValuePair,
                pId = id,
            };
            var result = await QueryAsync<Models.KeyValuePair>("uspGetKeyValuePairs", parameters);
            return result;
        }

        public async Task<IEnumerable<Car>> GetAllNews()
        {
            var parameters = new
            {
            };
            (IEnumerable<Car> postedNews, IEnumerable<AttachmentViewModel> attachments) =
                await QueryMultipleAsync<Car, AttachmentViewModel>("sp_GetAllNews", parameters);

            foreach (Car car in postedNews)
            {
                //Associate attachments with each board if available
                car.attachments = attachments.Any()
                    ? attachments.Where(a => a.Id == car.Id).ToList()
                    : new List<AttachmentViewModel>();
            }
            return postedNews;
            //var term = await QueryAsync<News>("sp_GetAllNews", parameters);   
            //return term;
        }

        public Task<IEnumerable<Car>> GetcarsByIdAsync(long? id)
        {
            throw new NotImplementedException();
        }

        public async Task<bool> DeleteCar(long id)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@pId", id);
            parameters.Add("@pReturnId", dbType: DbType.Int32, direction: ParameterDirection.Output);

            await ExecuteAsync("sp_DeleteCar", parameters, CommandType.StoredProcedure);

            var returnId = parameters.Get<int>("@pReturnId");
            return returnId > 0;
        }
        public async Task<int> BookCarAndReturnId(CarBooking booking)
        {
            return await _connection.ExecuteScalarAsync<int>(
                "sp_BookCar",
                new
                {
                    Id = booking.Id == 0 ? (int?)null : booking.Id,
                    booking.FullName,
                    booking.FatherName,
                    booking.CNIC,
                    booking.LicenseNumber,
                    booking.Phone,
                    booking.Age,
                    booking.Address,
                    booking.City,
                    booking.PickupDate,
                    booking.DropoffDate,
                    booking.CarId,
                    booking.OrganizationId,
                    booking.CarImageUrl,
                    booking.PricePerUnit,      // ✅ New
                    booking.PricingType,
                    booking.TotalAmount// ✅ New
                },
                commandType: CommandType.StoredProcedure
            );
        }

        public async Task SaveAttachment(int bookingId, string fileName, string filePath, long fileSize)
        {
            await _connection.ExecuteAsync(
                "sp_SaveAttachment",
                new
                {
                    CarBookingId = bookingId,
                    FileName = fileName,
                    FilePath = filePath,
                    FileSize = fileSize
                },
                commandType: CommandType.StoredProcedure
            );
        }

        public async Task DeleteAttachment(int attachmentId)
        {
            await _connection.ExecuteAsync(
                "sp_DeleteAttachment",
                new { AttachmentId = attachmentId },
                commandType: CommandType.StoredProcedure
            );
        }
        // Interface

        // Implementation
        public async Task<PagedResponse<PersonWithCarDto>> GetAllBookings(
    int pageNumber,
    int pageSize,
    int? bookingStatus,
    string? fullName
)
        {
            var parameters = new
            {
                BookingStatus = bookingStatus,
                FullName = fullName,
                PageNumber = pageNumber,
                PageSize = pageSize
            };

            var result = await _connection.QueryAsync<BookCarDto>(
                "sp_GetAllBookings",
                parameters,
                commandType: CommandType.StoredProcedure
            );

            if (!result.Any())
            {
                return new PagedResponse<PersonWithCarDto>
                {
                    Data = new List<PersonWithCarDto>(),
                    Pagination = new PaginationDto
                    {
                        CurrentPage = pageNumber,
                        PageSize = pageSize,
                        TotalPages = 0,
                        TotalRecords = 0
                    }
                };
            }

            int totalRecords = result.First().TotalRecords;

            var bookings = result
                .GroupBy(b => b.BookingId)
                .Select(g =>
                {
                    var first = g.First();

                    return new PersonWithCarDto
                    {
                        BookingId = first.BookingId,
                        OrganizationId = first.OrganizationId,
                        FullName = first.FullName,
                        FatherName = first.FatherName,
                        CNIC = first.CNIC,
                        LicenseNumber = first.LicenseNumber,
                        Phone = first.Phone,
                        Age = first.Age,
                        Address = first.Address,
                        City = first.City,
                        PickupDate = first.PickupDate,
                        DropoffDate = first.DropoffDate,
                        BookingStatus = first.BookingStatus,
                        Status = first.Status,
                        PricePerUnit = first.PricePerUnit,
                        PricingType = first.PricingType,
                        TotalAmount = first.TotalAmount,

                        Car = new CarInfoDto
                        {
                            CarId = first.CarId,
                            CarName = first.CarName,
                            Model = first.Model,
                            PricePerHour = first.PricePerHour,
                            Transmission = first.Transmission,
                            Fuel = first.Fuel,
                            Description = first.Description,

                            // 🔥 IMAGE FIX
                            ImageUrl = !string.IsNullOrEmpty(first.ImageUrl)
                                ? first.ImageUrl
                                : first.CarImageUrl
                        },

                        Attachments = g
                            .Where(x => x.AttachmentId > 0)
                            .Select(a => new AttachmentDto
                            {
                                AttachmentId = a.AttachmentId,
                                FileName = a.FileName,
                                FilePath = a.FilePath,
                                FileSize = a.FileSize,
                                UploadDate = a.UploadDate
                            })
                            .ToList()
                    };
                })
                .ToList();

            return new PagedResponse<PersonWithCarDto>
            {
                Data = bookings,
                Pagination = new PaginationDto
                {
                    CurrentPage = pageNumber,
                    PageSize = pageSize,
                    TotalRecords = totalRecords,
                    TotalPages = (int)Math.Ceiling((double)totalRecords / pageSize)
                }
            };
        }





        public async Task<int> ReceiveCar(
      int bookingId,
      bool isDamaged,
      string? remarks,
      string? damageRemarks,
      decimal damageCharges,
      decimal lateExtraCharges,
      DateTime? dropOffDate,
        decimal totalPrice
  )
        {
            var parameters = new DynamicParameters();
            parameters.Add("@BookingId", bookingId);
            parameters.Add("@Remarks", remarks);
            parameters.Add("@IsDamaged", isDamaged);
            parameters.Add("@DamageRemarks", damageRemarks);
            parameters.Add("@DamageCharges", damageCharges);
            parameters.Add("@LateExtraCharges", lateExtraCharges);
            parameters.Add("@DropOffDate", dropOffDate);
            parameters.Add("@TotalPrice", totalPrice); // totalPrice calculated in front end


            return await _connection.ExecuteScalarAsync<int>(
                "sp_ReceiveCar",
                parameters,
                commandType: CommandType.StoredProcedure
            );
        }

        public async Task<int> AddReceiveImage(int receiveId, string imageUrl, string? imageType)
        {
            return await _connection.ExecuteScalarAsync<int>(
                "sp_AddReceiveImage",
                new
                {
                    ReceiveId = receiveId,  // ✅ Changed from CarReceiveId
                    ImageUrl = imageUrl,
                    ImageType = imageType
                },
                commandType: CommandType.StoredProcedure
            );
        }


        public async Task<List<ReceivedCarResponseDto>> GetAllReceivedCars()
        {
            using (var multi = await _connection.QueryMultipleAsync(
                "sp_GetAllReceivedCars",
                commandType: CommandType.StoredProcedure))
            {
                var receives = (await multi.ReadAsync<ReceivedCarResponseDto>()).ToList();
                var images = (await multi.ReadAsync<ReceiveImageDto>()).ToList();

                var imageGroups = images
                    .GroupBy(img => img.ReceiveId)
                    .ToDictionary(g => g.Key, g => g.ToList());

                foreach (var receive in receives)
                {
                    receive.Images = imageGroups.ContainsKey(receive.ReceiveId)
                        ? imageGroups[receive.ReceiveId]
                        : new List<ReceiveImageDto>();
                }

                return receives;
            }
        }

        public async Task DeleteReceivedCar(int receiveId)
        {
            await _connection.ExecuteAsync(
                "sp_DeleteReceiveCar",
                new { ReceiveId = receiveId },
                commandType: CommandType.StoredProcedure
            );
        }
        public async Task<BillingDto> GetBillingByBookingId(int bookingId)
        {
            var result = await _connection.QueryFirstOrDefaultAsync<BillingDto>(
                "sp_GetBillingByBookingId",
                new { BookingId = bookingId },
                commandType: CommandType.StoredProcedure
            );
            return result;
        }

        public async Task<MonthlyProfitDto> GetMonthlyProfit(int month, int year)
        {
            var result = await _connection.QueryFirstOrDefaultAsync<MonthlyProfitDto>(
                "sp_GetMonthlyProfit",
                new { Month = month, Year = year },
                commandType: CommandType.StoredProcedure
            );
            return result;
        }

        public async Task<List<BillingDto>> GetAllBillings(DateTime? startDate, DateTime? endDate)
        {
            var result = await _connection.QueryAsync<BillingDto>(
                "sp_GetAllBillings",
                new { StartDate = startDate, EndDate = endDate },
                commandType: CommandType.StoredProcedure
            );
            return result.ToList();
        }
        public async Task CreatePayment(int bookingId)
        {
            await _connection.ExecuteAsync(
                "sp_CreatePayment",
                new { BookingId = bookingId },
                commandType: CommandType.StoredProcedure
            );
        }

        public async Task FinalizePayment(int bookingId)
        {
            await _connection.ExecuteAsync(
                "sp_FinalizePayment",
                new { BookingId = bookingId },
                commandType: CommandType.StoredProcedure
            );
        }

        //public async Task<Payment> GetPaymentByBookingId(int bookingId)
        //{
        //    return await _connection.QueryFirstOrDefaultAsync<Payment>(
        //        "sp_GetPaymentByBookingId",
        //        new { BookingId = bookingId },
        //        commandType: CommandType.StoredProcedure
        //    );
        //}

        //public async Task<Module> GetMonthlyProfit(int month, int year)
        //{
        //    return await _connection.QueryFirstOrDefaultAsync<Module>(
        //        "sp_GetMonthlyProfit",
        //        new { Month = month, Year = year },
        //        commandType: CommandType.StoredProcedure
        //    );
        //}

        //        public async Task<List<Payment>> GetAllPayments(DateTime? startDate, DateTime? endDate)
        //        {
        //            var result = await _connection.QueryAsync<Payment>(
        //                "sp_GetAllPayments",
        //                new { StartDate = startDate, EndDate = endDate },
        //                commandType: CommandType.StoredProcedure
        //            );
        //            return result.ToList();
        //        }
        //}



        //        public async Task SaveAttachment(
        //    int carBookingId,
        //    string fileName,
        //    string filePath,
        //    long fileSize
        //)
        //        {
        //            await _connection.ExecuteAsync(
        //                "sp_SaveAttachment",
        //                new
        //                {
        //                    CarBookingId = carBookingId,
        //                    FileName = fileName,
        //                    FilePath = filePath,
        //                    FileSize = fileSize
        //                },
        //                commandType: CommandType.StoredProcedure
        //            );
        //        }



        //public async Task<bool> UpdateBooking(UpdateBookingDto booking)
        //{
        //    var parameters = new DynamicParameters();
        //    parameters.Add("@Id", booking.Id);
        //    parameters.Add("@CarId", booking.CarId);
        //    parameters.Add("@OrganizationId", booking.OrganizationId);
        //    parameters.Add("@FullName", booking.FullName);
        //    parameters.Add("@FatherName", booking.FatherName);
        //    parameters.Add("@CNIC", booking.CNIC);
        //    parameters.Add("@LicenseNumber", booking.LicenseNumber);
        //    parameters.Add("@Phone", booking.Phone);
        //    parameters.Add("@Age", booking.Age);
        //    parameters.Add("@Address", booking.Address);
        //    parameters.Add("@City", booking.City);
        //    parameters.Add("@PickupDate", booking.PickupDate);
        //    parameters.Add("@DropoffDate", booking.DropoffDate);
        //    parameters.Add("@CarImageUrl", booking.CarImageUrl);

        //    var result = await _connection.QueryFirstOrDefaultAsync<int>(
        //        "sp_UpdateBooking",
        //        parameters,
        //        commandType: CommandType.StoredProcedure
        //    );

        //    return result > 0;
        //}
        //public async Task<BookCarDto> GetBookingWithCar(int bookingId)
        //{
        //    var result = await _connection.QueryAsync<BookCarDto>(
        //        "sp_GetBookingWithCar",
        //        (booking, car) =>
        //        {
        //            booking.Car = car;  // Car object assign karo
        //            return booking;
        //        },
        //        new { BookingId = bookingId },
        //        splitOn: "CarId",  // Car data yahan se start hota hai
        //        commandType: CommandType.StoredProcedure
        //    );

        //    return result.FirstOrDefault();
        //}
        //public async Task<int> UpdateBooking(int id, BookCarDto bookingDto)
        //{
        //    string carImageUrl = null;

        //    // Agar nayi image upload hui hai
        //    if (bookingDto.CarImage != null)
        //    {
        //        var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/Images/Bookings");

        //        if (!Directory.Exists(uploadsFolder))
        //            Directory.CreateDirectory(uploadsFolder);

        //        var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(bookingDto.CarImage.FileName);
        //        var filePath = Path.Combine(uploadsFolder, uniqueFileName);

        //        using (var fileStream = new FileStream(filePath, FileMode.Create))
        //        {
        //            await bookingDto.CarImage.CopyToAsync(fileStream);
        //        }

        //        carImageUrl = "/Images/Bookings/" + uniqueFileName;
        //    }

        //    var parameters = new DynamicParameters();
        //    parameters.Add("@BookingId", id);
        //    parameters.Add("@FullName", bookingDto.FullName);
        //    parameters.Add("@FatherName", bookingDto.FatherName);
        //    parameters.Add("@CNIC", bookingDto.CNIC);
        //    parameters.Add("@LicenseNumber", bookingDto.LicenseNumber);
        //    parameters.Add("@Phone", bookingDto.Phone);
        //    parameters.Add("@Age", bookingDto.Age);
        //    parameters.Add("@Address", bookingDto.Address);
        //    parameters.Add("@City", bookingDto.City);
        //    parameters.Add("@PickupDate", bookingDto.PickupDate);
        //    parameters.Add("@DropoffDate", bookingDto.DropoffDate);
        //    parameters.Add("@CarId", bookingDto.CarId);
        //    parameters.Add("@OrganizationId", bookingDto.OrganizationId);

        //    // Agar nayi image hai toh update karo, warna null pass karo (SP mein handle hoga)
        //    if (carImageUrl != null)
        //        parameters.Add("@CarImageUrl", carImageUrl);
        //    else
        //        parameters.Add("@CarImageUrl", DBNull.Value);

        //    var result = await _connection.ExecuteAsync(
        //        "sp_UpdateBooking",
        //        parameters,
        //        commandType: CommandType.StoredProcedure
        //    );

        //    return result;
        //}

        public async Task<int> CancelBooking(CancelBookingRequest model)
        {
            var result = await _connection.ExecuteScalarAsync<int>(
                "sp_CancelBooking",
                new
                {
                    Id = model.Id,
                    DeductedCharges = model.UsedAmount,
                    RefundAmount = model.RefundableAmount,
                    CancelledAt = model.CancelledAt
                },
                commandType: CommandType.StoredProcedure
            );

            return result;
        }
    }
}