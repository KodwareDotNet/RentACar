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
    }
}
