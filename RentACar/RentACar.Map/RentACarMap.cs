using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using RentACar.Interfaces.ServiceInterface;
using RentACar.Models;
using RentACar.Repositories.Services.Interfaces;
using RentACar.ViewModel;

namespace RentACar.Map
{
    public class RentACarMap : IRentACarMap
    {

        private readonly IRentACarService _rentService;

        public RentACarMap(IRentACarService rentService)
        {
            _rentService = rentService;
        }
        public async Task<bool> CreateCars(RentACarViewModel cars)
        {
            Car newss = NewsViewModelToDomain(cars);
            return await _rentService.CreateCars(newss);
        }

        private Car NewsViewModelToDomain(RentACarViewModel news)
        {
            Car domain1 = new Car();
            domain1.Id = news.Id;


            return domain1;
        }

        public async Task<IEnumerable<RentACarViewModel>> GetAllCars()
        {
            IEnumerable<Car> domain = await _rentService.GetAllCars();
            List<RentACarViewModel> modelList = new List<RentACarViewModel>();
            foreach (var news in domain)
            {
                RentACarViewModel model = new RentACarViewModel();

                model.Id = news.Id;

                modelList.Add(model);


            }
            return modelList;
        }



        public async Task<bool> DeleteCar(long id)
        {
            return await _rentService.DeletCar(id);
        }

        public async Task<IEnumerable<Models.KeyValuePair>> GetAllKeyValuePair(KeyValuePairType keyValuePair, long? id)
        {
            return await _rentService.GetAllKeyValuePair(keyValuePair, id);
        }

        public async Task<int> BookCarAndReturnId(CarBooking booking)
        {
            return await _rentService.BookCarAndReturnId(booking);
        }

        public async Task SaveAttachment(int bookingId, string fileName, string filePath, long fileSize)
        {
            await _rentService.SaveAttachment(bookingId, fileName, filePath, fileSize);
        }

        public async Task DeleteAttachment(int attachmentId)
        {
            await _rentService.DeleteAttachment(attachmentId);
        }

        // Interface


        // Implementation
        public async Task<PagedResponse<PersonWithCarDto>> GetAllBookings(
    int pageNumber,
    int pageSize,
    int? bookingStatus,
    string? fullName)
        {
            return await _rentService.GetAllBookings(
                pageNumber,
                pageSize,
                bookingStatus,
                fullName
            );
        }

        public async Task<int> CancelBooking(CancelBookingRequest model)
        {
            return await _rentService.CancelBooking(model);
        }

        // 🔥 NEW
        public async Task<int> ReceiveCar(
        int bookingId,
        bool isDamaged,
        string? remarks,
        string? damageRemarks,
        decimal damageCharges,
        decimal lateExtraCharges,
        DateTime? dropOffDate,
        decimal TotalPrice
    )
        {
            return await _rentService.ReceiveCar(
                bookingId,
                isDamaged,
                remarks,
                damageRemarks,
                damageCharges,
                lateExtraCharges,
                dropOffDate,
                TotalPrice
            );
        }

        public async Task<int> AddReceiveImage(int receiveId, string imageUrl, string? imageType)
        {
            return await _rentService.AddReceiveImage(receiveId, imageUrl, imageType);
        }


        public async Task<PagedResponse<ReceivedCarResponseDto>> GetAllReceivedCars(
    int pageNumber,
    int pageSize,
    string? fullName,
    DateTime? fromDate,
    DateTime? toDate)
    => await _rentService.GetAllReceivedCars(
        pageNumber, pageSize, fullName, fromDate, toDate);


        public async Task DeleteReceivedCar(int receiveId)
            => await _rentService.DeleteReceivedCar(receiveId);
    
    public async Task<BillingDto> GetBillingByBookingId(int bookingId)
        {
            return await _rentService.GetBillingByBookingId(bookingId);
        }

        public async Task<MonthlyProfitDto> GetMonthlyProfit(int month, int year)
        {
            return await _rentService.GetMonthlyProfit(month, year);
        }

        public async Task<List<BillingDto>> GetAllBillings(DateTime? startDate, DateTime? endDate)
        {
            return await _rentService.GetAllBillings(startDate, endDate);
        }
    }
}