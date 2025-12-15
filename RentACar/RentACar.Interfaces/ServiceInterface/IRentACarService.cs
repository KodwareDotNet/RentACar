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
        Task<bool> BookCar(CarBooking booking);
        Task<List<PersonWithCarDto>> GetAllBookings();
        //Task<int> UpdateBooking(int id, BookCarDto bookingDto);
        Task<bool> UpdateBooking(UpdateBookingDto booking);
        Task<int> CancelBooking(int id);
        //Task<BookCarDto> GetBookingWithCar(int bookingId); 
    }
}
