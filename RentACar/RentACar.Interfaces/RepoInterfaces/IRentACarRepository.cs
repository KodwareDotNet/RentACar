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
        Task<bool> BookCar(CarBooking booking);
        Task<List<PersonWithCarDto>> GetAllBookings();
        //Task<BookCarDto> GetBookingWithCar(int bookingId);
        Task<bool> UpdateBooking(UpdateBookingDto booking);
        Task<int> CancelBooking(int id);
        //Task<int> UpdateBooking(int id, BookCarDto bookingDto);

    }
}
