using System;
using System.Collections.Generic;
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
            long NewsId = await _carRepo.Create(Car);
            foreach (var attachment in Car.attachments)
            {
                if (attachment.Id != null)
                {
                    _ = _AttachmentRepository.DeleteNewsAttachment(NewsId, (int)attachment.Id);
                }
                if (attachment.AttachmentType == AttachmentType.Image)
                {
                    long attachmentId = _AttachmentRepository.CreateAttachment(attachment.Path, attachment.Name, attachment.AttachmentType);
                    _ = _AttachmentRepository.CreateNewsAttachment(NewsId, attachmentId);
                }
            }
            if (NewsId > 0)
            {
                return true;

            }
            else
            {
                return false;
            }
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

        public async Task<IEnumerable<Car>> GetAllNews()
        {
            return await _carRepo.GetAllNews();
        }

        public async Task<IEnumerable<Car>> GetcarsByIdAsync(long? id)
        {
            return await _carRepo.GetcarsByIdAsync(id);

        }

        public Task<IEnumerable<Car>> GetNewsByIdAsync(long? id)
        {
            throw new NotImplementedException();
        }
        public async Task<bool> BookCar(CarBooking booking)
        {
            return await _carRepo.BookCar(booking);
        }
        // Interface


        // Implementation
        public async Task<List<PersonWithCarDto>> GetAllBookings()
        {
            return await _carRepo.GetAllBookings();
        }
        //public async Task<BookCarDto> GetBookingWithCar(int bookingId)
        //{
        //    return await _carRepo.GetBookingWithCar(bookingId);
        //}
        //public async Task<int> UpdateBooking(int id, BookCarDto bookingDto)
        //{
        //    return await _carRepo.UpdateBooking(id, bookingDto);
        //}
        public async Task<bool> UpdateBooking(UpdateBookingDto booking)
        {
            return await _carRepo.UpdateBooking(booking);
        }

        public async Task<int> CancelBooking(int id)
        {
            return await _carRepo.CancelBooking(id);
        }
    }
}
