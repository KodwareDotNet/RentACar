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
        private readonly IRentACarRepository carRepo;
        private readonly IAttachmentRepository AttachmentRepository;

        public RentACarService(IRentACarRepository _carRepo, IAttachmentRepository attachmentRepository)
        {
            carRepo = _carRepo;
            AttachmentRepository = attachmentRepository;
        }


        public async Task<bool> CreateCars(Car Car)
        {
            long NewsId = await carRepo.Create(Car);
            foreach (var attachment in Car.attachments)
            {
                if (attachment.Id != null)
                {
                    _ = AttachmentRepository.DeleteNewsAttachment(NewsId, (int)attachment.Id);
                }
                if (attachment.AttachmentType == AttachmentType.Image)
                {
                    long attachmentId = AttachmentRepository.CreateAttachment(attachment.Path, attachment.Name, attachment.AttachmentType);
                    _ = AttachmentRepository.CreateNewsAttachment(NewsId, attachmentId);
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
            return await carRepo.DeleteCar(id);

        }

        public Task<IEnumerable<Car>> GetAllCars()
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<Models.KeyValuePair>> GetAllKeyValuePair(KeyValuePairType keyValuePair, long? id)
        {
            return await carRepo.GetAllKeyValuePair(keyValuePair, id);
        }

        public async Task<IEnumerable<Car>> GetAllNews()
        {
            return await carRepo.GetAllNews();
        }

        public async Task<IEnumerable<Car>> GetcarsByIdAsync(long? id)
        {
            return await carRepo.GetcarsByIdAsync(id);

        }

        public Task<IEnumerable<Car>> GetNewsByIdAsync(long? id)
        {
            throw new NotImplementedException();
        }
    }
}
