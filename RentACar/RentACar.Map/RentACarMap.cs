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

        private readonly IRentACarService newsService;

        public RentACarMap(IRentACarService _newsService)
        {
            newsService = _newsService;
        }
        public async Task<bool> CreateCars(RentACarViewModel cars)
        {
            Car newss = NewsViewModelToDomain(cars);
            return await newsService.CreateCars(newss);
        }

        private Car NewsViewModelToDomain(RentACarViewModel news)
        {
            Car domain1 = new Car();
            domain1.Id = news.Id;


            return domain1;
        }

        public async Task<IEnumerable<RentACarViewModel>> GetAllCars()
        {
            IEnumerable<Car> domain = await newsService.GetAllCars();
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
            return await newsService.DeletCar(id);
        }

        public async Task<IEnumerable<Models.KeyValuePair>> GetAllKeyValuePair(KeyValuePairType keyValuePair, long? id)
        {
            return await newsService.GetAllKeyValuePair(keyValuePair, id);
        }
    }
}