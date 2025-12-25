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
        //Task<bool> AddCar(Car car);
        Task<int> BookCarAndReturnId(CarBooking booking);
        Task SaveAttachment(int bookingId, string fileName, string filePath, long fileSize);
        Task DeleteAttachment(int attachmentId);
        Task<List<PersonWithCarDto>> GetAllBookings();
        //Task UpdateBooking(CarBooking booking);
        //Task<bool> UpdateBooking(UpdateBookingDto booking);
        //Task<BookCarDto> GetBookingWithCar(int bookingId);
        //Task<BookCarDto> GetBookingWithCar(int bookingId);
        //Task<int> UpdateBooking(int id, BookCarDto bookingDto);
        Task<int> CancelBooking(CancelBookingRequest model);

        Task<int> ReceiveCar(int bookingId, bool isDamaged, string? remarks, string? damageRemarks, decimal charges);
        Task<int> AddReceiveImage(int receiveId, string imageUrl, string? imageType);
        Task<List<ReceivedCarResponseDto>> GetAllReceivedCars();
        Task DeleteReceivedCar(int receiveId);
        Task<BillingDto> GetBillingByBookingId(int bookingId);
        Task<MonthlyProfitDto> GetMonthlyProfit(int month, int year);
        Task<List<BillingDto>> GetAllBillings(DateTime? startDate, DateTime? endDate);
        //Task<int> ReceiveCar(int bookingId, string? imagePath, object isDamaged, object damageRemarks, object damageCharges);

        //Task<bool> UpdateBooking(UpdateBookingDto dto);
        //Task UpdateBooking(CarBooking booking);
        //Task<bool> UpdateBooking(UpdateBookingDto dto);
        //Task<int> BookCarAndReturnId(CarBooking booking);
    }
}
