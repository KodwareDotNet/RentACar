using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using RentACar.Models;
using RentACar.ViewModel;

namespace RentACar.Repositories.Services.Interfaces
{
    public interface IRentACarMap
    {
        public Task<bool> CreateCars(RentACarViewModel cars);
        Task<IEnumerable<Models.KeyValuePair>> GetAllKeyValuePair(KeyValuePairType keyValuePair, long? id);
        Task<IEnumerable<RentACarViewModel>> GetAllCars();
        Task<bool> DeleteCar(long id);
        Task<int> BookCarAndReturnId(CarBooking booking);
        Task SaveAttachment(int bookingId, string fileName, string filePath, long fileSize);
        Task DeleteAttachment(int attachmentId);
        Task<PagedResponse<PersonWithCarDto>> GetAllBookings(int pageNumber,int pageSize,int? bookingStatus,string? fullName);
        Task<int> CancelBooking(CancelBookingRequest model);

        Task<int> ReceiveCar(int bookingId,bool isDamaged,string? remarks,string? damageRemarks,decimal damageCharges,decimal lateExtraCharges,DateTime? dropOffDate,decimal totalPrice, decimal? returnMileage,decimal? mileageCharges,string? returnMileageImageUrl);

        Task<int> AddReceiveImage(int receiveId, string imageUrl, string? imageType);
        Task<PagedResponse<ReceivedCarResponseDto>> GetAllReceivedCars(int pageNumber,int pageSize,string? fullName,DateTime? fromDate,DateTime? toDate);

        Task DeleteReceivedCar(int receiveId);
        Task<BillingDto> GetBillingByBookingId(int bookingId);
        Task<MonthlyProfitDto> GetMonthlyProfit(int month, int year);
        Task<List<BillingDto>> GetAllBillings(DateTime? startDate, DateTime? endDate);
        Task<IEnumerable<ReportDto>> GetReports(ReportRequestDto request);
    }
}
