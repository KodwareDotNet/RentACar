using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using RentACar.Models;
using RentACar.ViewModel;

namespace RentACar.Interfaces.RepoInterfaces
{
    public interface IRentACarRepository
    {
        Task<IEnumerable<Car>> GetcarsByIdAsync(long? id);
        //Task UpdateAsync(News post);
        //Task DeleteAsync(long? id);
        public Task<long> Create(Car cars);
        Task<bool> DeleteNews(long id);
        Task<IEnumerable<Models.KeyValuePair>> GetAllKeyValuePair(KeyValuePairType keyValuePair, long? id);
        public Task<IEnumerable<Car>> GetAllNews();
        Task<bool> DeleteCar(long id);
        Task<int> BookCarAndReturnId(CarBooking booking);
        Task SaveAttachment(int bookingId, string fileName, string filePath, long fileSize);
        Task DeleteAttachment(int attachmentId);
        Task<List<PersonWithCarDto>> GetAllBookings();
        //Task<BookCarDto> GetBookingWithCar(int bookingId);
        //Task<bool> UpdateBooking(UpdateBookingDto booking);
        Task<int> CancelBooking(CancelBookingRequest model);

        Task<int> ReceiveCar(int bookingId, bool isDamaged, string? remarks, string? damageRemarks, decimal charges, decimal lateExtraCharges, DateTime? dropOffDate, decimal totalPrice);   
        Task<int> AddReceiveImage(int receiveId, string imageUrl, string? imageType);
        Task<List<ReceivedCarResponseDto>> GetAllReceivedCars();
        Task DeleteReceivedCar(int receiveId);
        Task<BillingDto> GetBillingByBookingId(int bookingId);
        Task<MonthlyProfitDto> GetMonthlyProfit(int month, int year);
        Task<List<BillingDto>> GetAllBillings(DateTime? startDate, DateTime? endDate);
        Task CreatePayment(int bookingId);
        Task FinalizePayment(int bookingId);
        //Task<Payment> GetPaymentByBookingId(int bookingId);
        //Task<Models.MonthlyProfitDto> GetMonthlyProfit(int month, int year);
        //Task<List<Payment>> GetAllPayments(DateTime? startDate, DateTime? endDate);

        //Task SaveAttachment(
        //int carBookingId,
        //string fileName,
        //string filePath,
        //long fileSize);
        ////Task<int> UpdateBooking(int id, BookCarDto bookingDto);

    }
}
