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
                    booking.PricePerUnit,
                    booking.PricingType,
                    booking.TotalAmount,
                    booking.PickupMileage,      // 🆕 Mileage at pickup
                    booking.MileageImageUrl     // 🆕 Mileage photo
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
                PageSize = pageSize,

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

                        // 🆕 Pickup Mileage
                        PickupMileage = first.PickupMileage,
                        MileageImageUrl = first.MileageImageUrl,

                        // 🆕 Return Mileage (only available for completed bookings)
                        ReturnMileage = first.ReturnMileage,
                        TotalMileageCovered = first.TotalMileageCovered,
                        MileageCharges = first.MileageCharges,
                        ReturnMileageImageUrl = first.ReturnMileageImageUrl,

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
                                FileSize = a.FileSize.HasValue ? a.FileSize.Value : 0,  // ✅ Fixed
                                UploadDate = a.UploadDate.HasValue ? a.UploadDate.Value : DateTime.Now  // ✅ Fixed
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
         decimal totalPrice,
         decimal? returnMileage,           // 🆕
         decimal? mileageCharges,          // 🆕
         string? returnMileageImageUrl     // 🆕
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
            parameters.Add("@TotalPrice", totalPrice);

            // 🆕 Mileage Parameters
            parameters.Add("@ReturnMileage", returnMileage);
            parameters.Add("@MileageCharges", mileageCharges ?? 0);
            parameters.Add("@ReturnMileageImageUrl", returnMileageImageUrl);

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


        public async Task<PagedResponse<ReceivedCarResponseDto>> GetAllReceivedCars(
     int pageNumber,
     int pageSize,
     string? fullName,
     DateTime? fromDate,
     DateTime? toDate)
        {
            var parameters = new
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                FullName = fullName,
                FromDate = fromDate,
                ToDate = toDate
            };

            using (var multi = await _connection.QueryMultipleAsync(
                "sp_GetAllReceivedCars",
                parameters,
                commandType: CommandType.StoredProcedure))
            {
                var receives = (await multi.ReadAsync<ReceivedCarResponseDto>()).ToList();
                var images = (await multi.ReadAsync<ReceiveImageDto>()).ToList();

                if (!receives.Any())
                {
                    return new PagedResponse<ReceivedCarResponseDto>
                    {
                        Data = new List<ReceivedCarResponseDto>(),
                        Pagination = new PaginationDto
                        {
                            CurrentPage = pageNumber,
                            PageSize = pageSize,
                            TotalRecords = 0,
                            TotalPages = 0
                        }
                    };
                }

                int totalRecords = receives.First().TotalRecords;

                // 🔥 ONLY current page ReceiveIds
                var receiveIds = receives.Select(r => r.ReceiveId).ToList();

                var imageGroups = images
                    .Where(img => receiveIds.Contains(img.ReceiveId))
                    .GroupBy(img => img.ReceiveId)
                    .ToDictionary(g => g.Key, g => g.ToList());

                foreach (var receive in receives)
                {
                    receive.Images = imageGroups.TryGetValue(receive.ReceiveId, out var imgs)
                        ? imgs
                        : new List<ReceiveImageDto>();
                }

                return new PagedResponse<ReceivedCarResponseDto>
                {
                    Data = receives,
                    Pagination = new PaginationDto
                    {
                        CurrentPage = pageNumber,
                        PageSize = pageSize,
                        TotalRecords = totalRecords,
                        TotalPages = (int)Math.Ceiling((double)totalRecords / pageSize)
                    }
                };
            }
        }



        public async Task<bool> DeleteReceivedCar(int receiveId)
        {
            var rows = await _connection.ExecuteScalarAsync<int>(
                "sp_DeleteReceiveCar",
                new { ReceiveId = receiveId },
                commandType: CommandType.StoredProcedure
            );

            return rows > 0;
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
        public async Task<ReportPagedResponseDto> GetReports(ReportRequestDto request)
        {
            var parameters = new
            {
                OrganizationId = request.OrganizationId,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                PageNumber = request.PageNumber,
                PageSize = request.PageSize
            };

            using var multi = await _connection.QueryMultipleAsync(
                "sp_GetReports",
                parameters,
                commandType: CommandType.StoredProcedure
            );

            var reports = await multi.ReadAsync<ReportDto>();
            var totalRecords = await multi.ReadSingleAsync<int>();

            return new ReportPagedResponseDto
            {
                Data = reports,
                TotalRecords = totalRecords
            };
        }



        public async Task AddOrUpdateMaintenance(CompleteMaintenanceDto dto)
        {
            await _connection.ExecuteAsync(
                "sp_AddOrUpdateCarMaintenance",
                new
                {
                    Id = dto.Id,
                    Cost = dto.Cost,
                    Remarks = dto.Remarks
                },
                commandType: CommandType.StoredProcedure
            );
        }


        public async Task<List<CarMaintenanceDto>> GetMaintenanceWithCarDetails()
        {
            var result = await _connection.QueryAsync<CarMaintenanceDto>(
                "sp_GetCarMaintenanceWithDetails",
                commandType: CommandType.StoredProcedure
            );

            return result.ToList();
        }

        public async Task CancelMaintenance(int maintenanceId)
        {
            await _connection.ExecuteAsync(
                "sp_CancelCarMaintenance",
                new { MaintenanceId = maintenanceId },
                commandType: CommandType.StoredProcedure
            );
        }

        //        public async Task<bool> InsertCarMileageHistoryAsync(int receiveId)
        //        {
        //            await _connection.ExecuteAsync(
        //                "sp_InsertCarMileageHistory",
        //                new { ReceiveId = receiveId },
        //                commandType: CommandType.StoredProcedure
        //            );
        //            return true;
        //        }
        //    }
        //}   
        public async Task<IEnumerable<CarMileageDto>> GetCarMileageDetailsAsync()
        {
            var result = await _connection.QueryAsync<CarMileageDto>(
                "sp_GetCarMileageDetails",
                commandType: CommandType.StoredProcedure
            );

            return result;
        }
        public async Task<MaintenanceReportPagedResponseDto> GetMaintenanceReports(MaintenanceReportRequestDto request)
        {
            var parameters = new
            {
                OrganizationId = request.OrganizationId,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                PageNumber = request.PageNumber,
                PageSize = request.PageSize
            };

            // SP now returns 2 result sets: data + total records
            using var multi = await _connection.QueryMultipleAsync(
                "sp_GetMaintenanceReports",
                parameters,
                commandType: CommandType.StoredProcedure
            );

            var reports = await multi.ReadAsync<MaintenanceReportDto>();
            var totalRecords = await multi.ReadSingleAsync<int>();

            return new MaintenanceReportPagedResponseDto
            {
                Data = reports,
                TotalRecords = totalRecords
            };
        }
    }
}