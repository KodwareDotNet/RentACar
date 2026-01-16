using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using RentACar.Models;
using RentACar.ViewModel;

namespace RentACar.Interfaces.ServiceInterface
{
    public interface IRentACarService
    {
        Task<bool> CreateCars(Car cars);
        Task<IEnumerable<Car>> GetcarsByIdAsync(long? id);
        Task<IEnumerable<Car>> GetAllCars();
        Task<bool> DeletCar(long id);
        Task<IEnumerable<Models.KeyValuePair>> GetAllKeyValuePair(KeyValuePairType keyValuePair, long? id);
        Task<int> BookCarAndReturnId(CarBooking booking);
        Task SaveAttachment(int bookingId, string fileName, string filePath, long fileSize);
        Task DeleteAttachment(int attachmentId);
        public interface IRentACarService
        {
            Task<PagedResponse<PersonWithCarDto>> GetAllBookings(int pageNumber,int pageSize,int? bookingStatus,string? fullName);
        }
        Task<int> CancelBooking(CancelBookingRequest model);
        Task<int> ReceiveCar(int bookingId, bool isDamaged, string? remarks, string? damageRemarks, decimal charges, decimal lateExtraCharges, DateTime? dropOffDate, decimal totalPrice, decimal? returnMileage,decimal? mileageCharges,string? returnMileageImageUrl);
        Task<int> AddReceiveImage(int receiveId, string imageUrl, string? imageType);
        Task<PagedResponse<ReceivedCarResponseDto>> GetAllReceivedCars(int pageNumber,int pageSize,string? fullName,DateTime? fromDate,DateTime? toDate);
        Task DeleteReceivedCar(int receiveId);
        Task<BillingDto> GetBillingByBookingId(int bookingId);
        Task<MonthlyProfitDto> GetMonthlyProfit(int month, int year);
        Task<List<BillingDto>> GetAllBillings(DateTime? startDate, DateTime? endDate);
        Task CreatePaymentAsync(int bookingId);
        Task FinalizePaymentAsync(int bookingId);
        Task<IEnumerable<ReportDto>> GetReports(ReportRequestDto request);
        Task<PagedResponse<PersonWithCarDto>> GetAllBookings(int pageNumber, int pageSize, int? bookingStatus, string? fullName);
        Task AddOrUpdateMaintenance(CompleteMaintenanceDto dto);

        Task<List<CarMaintenanceDto>> GetMaintenanceWithCarDetails();
        Task CancelMaintenance(int maintenanceId);
        //Task<ApiResponse<bool>> InsertCarMileageHistoryAsync(int receiveId);
        Task<IEnumerable<CarMileageDto>> GetCarMileageDetailsAsync();
        Task<IEnumerable<MaintenanceReportDto>> GetMaintenanceReports(MaintenanceReportRequestDto request);

    }
}
