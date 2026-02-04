using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using RentACar.Interfaces.RepoInterfaces;
using RentACar.Interfaces.ServiceInterface;
using RentACar.Models;
using RentACar.ViewModel;

namespace RentACar.Service
{
    public class RentACarService : IRentACarService
    {
        private readonly IRentACarRepository _carRepo;
        private readonly IAttachmentRepository _AttachmentRepository;

        public RentACarService(IRentACarRepository carRepo, IAttachmentRepository attachmentRepository)
        {
            _carRepo = carRepo;
            _AttachmentRepository = attachmentRepository;
        }


        public async Task<bool> CreateCars(Car Car)
        {
            long carId = await _carRepo.Create(Car);

            foreach (var attachment in Car.attachments)
            {
                if (attachment.Id != null)
                {
                    await _AttachmentRepository.DeleteCarAttachment(carId, (int)attachment.Id);
                }

                if (attachment.AttachmentType == AttachmentType.Image)
                {
                    long attachmentId = await _AttachmentRepository.CreateCarAttachment(
                        attachment.Path,
                        attachment.Name,
                        attachment.AttachmentType
                    );

                    await _AttachmentRepository.CreateCarAttachment(carId, attachmentId);
                }
            }

            return carId > 0;
        }

        public async Task<bool> DeletCar(long id)
        {
            return await _carRepo.DeleteCar(id);

        }

        public Task<IEnumerable<Car>> GetAllCars()
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<Models.KeyValuePair>> GetAllKeyValuePair(KeyValuePairType keyValuePair, long? id)
        {
            return await _carRepo.GetAllKeyValuePair(keyValuePair, id);
        }


        public async Task<IEnumerable<Car>> GetcarsByIdAsync(long? id)
        {
            return await _carRepo.GetcarsByIdAsync(id);

        }

        public Task<IEnumerable<Car>> GetNewsByIdAsync(long? id)
        {
            throw new NotImplementedException();
        }


        // Implementation

        public async Task<int> BookCarAndReturnId(CarBooking booking)
        {
            return await _carRepo.BookCarAndReturnId(booking);
        }

        public async Task SaveAttachment(int bookingId, string fileName, string filePath, long fileSize)
        {
            await _carRepo.SaveAttachment(bookingId, fileName, filePath, fileSize);
        }

        public async Task DeleteAttachment(int attachmentId)
        {
            await _carRepo.DeleteAttachment(attachmentId);
        }

        public async Task<PagedResponse<PersonWithCarDto>> GetAllBookings(
       int pageNumber,
       int pageSize,
       int? bookingStatus,
       string? fullName)
        {
            return await _carRepo.GetAllBookings(pageNumber, pageSize, bookingStatus, fullName);
        }
        public async Task<int> CancelBooking(CancelBookingRequest model)
        {
            return await _carRepo.CancelBooking(model);
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
            return await _carRepo.ReceiveCar(
                bookingId,
                isDamaged,
                remarks,
                damageRemarks,
                damageCharges,
                lateExtraCharges,
                dropOffDate,
                totalPrice,
                returnMileage,              // 🆕
                mileageCharges,             // 🆕
                returnMileageImageUrl       // 🆕
            );
        }

        public async Task<int> AddReceiveImage(int receiveId, string imageUrl, string? imageType)
        {
            return await _carRepo.AddReceiveImage(receiveId, imageUrl, imageType);
        }


        public async Task<PagedResponse<ReceivedCarResponseDto>> GetAllReceivedCars(
     int pageNumber,
     int pageSize,
     string? fullName,
     DateTime? fromDate,
     DateTime? toDate)
     => await _carRepo.GetAllReceivedCars(
         pageNumber, pageSize, fullName, fromDate, toDate);



        public async Task DeleteReceivedCar(int receiveId)
            => await _carRepo.DeleteReceivedCar(receiveId);

        public async Task<BillingDto> GetBillingByBookingId(int bookingId)
        {
            return await _carRepo.GetBillingByBookingId(bookingId);
        }

        public async Task<MonthlyProfitDto> GetMonthlyProfit(int month, int year)
        {
            return await _carRepo.GetMonthlyProfit(month, year);
        }

        public async Task<List<BillingDto>> GetAllBillings(DateTime? startDate, DateTime? endDate)
        {
            return await _carRepo.GetAllBillings(startDate, endDate);
        }

        public async Task CreatePaymentAsync(int bookingId)
        {
            await _carRepo.CreatePayment(bookingId);
        }

        public async Task FinalizePaymentAsync(int bookingId)
        {
            await _carRepo.FinalizePayment(bookingId);
        }
        public async Task<ReportPagedResponseDto> GetReports(ReportRequestDto request)
        {
            return await _carRepo.GetReports(request);
        }

        public async Task AddOrUpdateMaintenance(CompleteMaintenanceDto dto)
        {
            await _carRepo.AddOrUpdateMaintenance(dto);
        }


        public async Task<List<CarMaintenanceDto>> GetMaintenanceWithCarDetails()
        {
            return await _carRepo.GetMaintenanceWithCarDetails();
        }

        public async Task CancelMaintenance(int maintenanceId)
        {
            await _carRepo.CancelMaintenance(maintenanceId);
        }
        //public async Task<ApiResponse<bool>> InsertCarMileageHistoryAsync(int receiveId)
        //{
        //    try
        //    {
        //        if (receiveId <= 0)
        //        {
        //            return new ApiResponse<bool>
        //            {
        //                Success = false,
        //                Message = "Invalid ReceiveId provided",
        //                Data = false
        //            };
        //        }

        //        var result = await _carRepo.InsertCarMileageHistoryAsync(receiveId);

        //        return new ApiResponse<bool>
        //        {
        //            Success = true,
        //            Message = "Car mileage history inserted successfully",
        //            Data = result
        //        };
        //    }
        //    catch (Exception ex)
        //    {
        //        return new ApiResponse<bool>
        //        {
        //            Success = false,
        //            Message = $"Error: {ex.Message}",
        //            Data = false
        //        };
        //    }

        //}
        public async Task<MaintenanceReportPagedResponseDto> GetMaintenanceReports(MaintenanceReportRequestDto request)
        {
            return await _carRepo.GetMaintenanceReports(request);
        }

        // ✅ Car Mileage Details
        public async Task<IEnumerable<CarMileageDto>> GetCarMileageDetailsAsync()
        {
            return await _carRepo.GetCarMileageDetailsAsync();
        }

        public async Task<DefaulterDto> CheckDefaulter(string cnic)
        {
            return await _carRepo.CheckDefaulterByCnic(cnic);
        }
     public async Task<CustomerHistoryResponseDto> GetCustomerHistory(string cnic)
        {
            return await _carRepo.GetCustomerHistory(cnic);
        }
    }
}
