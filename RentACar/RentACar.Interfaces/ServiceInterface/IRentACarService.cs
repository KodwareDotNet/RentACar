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
            Task<PagedResponse<PersonWithCarDto>> GetAllBookings(
                int pageNumber,
                int pageSize,
                int? bookingStatus,
                string? fullName
            );
        }


        //Task<List<PersonWithCarDto>> GetAllBookings();
        //Task<int> UpdateBooking(int id, BookCarDto bookingDto);
        //Task<bool> UpdateBooking(UpdateBookingDto booking);
        Task<int> CancelBooking(CancelBookingRequest model);

        Task<int> ReceiveCar(int bookingId, bool isDamaged, string? remarks, string? damageRemarks, decimal charges, decimal lateExtraCharges, DateTime? dropOffDate, decimal totalPrice);
        Task<int> AddReceiveImage(int receiveId, string imageUrl, string? imageType);


        Task<List<ReceivedCarResponseDto>> GetAllReceivedCars();
        Task DeleteReceivedCar(int receiveId);
        Task<BillingDto> GetBillingByBookingId(int bookingId);
        Task<MonthlyProfitDto> GetMonthlyProfit(int month, int year);
        Task<List<BillingDto>> GetAllBillings(DateTime? startDate, DateTime? endDate);
        Task CreatePaymentAsync(int bookingId);
        Task FinalizePaymentAsync(int bookingId);
        Task<PagedResponse<PersonWithCarDto>> GetAllBookings(int pageNumber, int pageSize, int? bookingStatus, string? fullName);
        //Task<Payment> GetPaymentByBookingIdAsync(int bookingId);
        //Task<MonthlyProfitDto> GetMonthlyProfitAsync(int month, int year);
        //Task<List<Payment>> GetAllPaymentsAsync(DateTime? startDate, DateTime? endDate);

        //Task<BookCarDto> GetBookingWithCar(int bookingId); 
    }
}
