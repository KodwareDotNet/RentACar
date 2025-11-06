using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using RentACar.Models;

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
    }
}
