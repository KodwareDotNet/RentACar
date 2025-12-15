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
  
       public async Task<bool> BookCar(CarBooking booking)
        {
            return await _rentService.BookCar(booking);
        }
        // Interface


        // Implementation
        public async Task<List<PersonWithCarDto>> GetAllBookings()
        {
            return await _rentService.GetAllBookings();
        }
        public async Task<bool> UpdateBooking(UpdateBookingDto booking)
        {
            return await _rentService.UpdateBooking(booking);
        }
        //public async Task<BookCarDto> GetBookingWithCar(int bookingId)
        //{
        //    return await _rentService.GetBookingWithCar(bookingId);
        //}
        //public async Task<int> UpdateBooking(int id, BookCarDto bookingDto)
        //{
        //    return await _rentService.UpdateBooking(id, bookingDto);
        //}

        public async Task<int> CancelBooking(int id)
        {
            return await _rentService.CancelBooking(id);
        }
    }
}
