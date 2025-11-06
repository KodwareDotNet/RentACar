using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using MenuManagement.Repositories;
using RentACar.Interfaces.RepoInterfaces;
using RentACar.Models;
using RentACar.ViewModel;

namespace RentACar.Repository
{
    public class RentACarRepository : BaseRepository, IRentACarRepository
    {
        private new readonly IDbConnection _connection;
        public RentACarRepository(IDbConnection connection) : base(connection)
        {

            _connection = connection;

        }

        public Task<long> Create(Car cars)
        {
            throw new NotImplementedException();
        }

        public async Task<long> Createcars(Car cars)
        {
            var parameters = new
            {

                pId = cars.Id,
               

            };
            DynamicParameters para = new DynamicParameters(parameters);
            para.Add("@pReturnId", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await ExecuteAsync("sp_CreateNews", para, CommandType.StoredProcedure);
            var NewsId = para.Get<int>("@pReturnId");
            return NewsId;
        }

        public async Task<bool> DeleteNews(long id)
        {

            var parameters = new
            {
                pId = id
            };
            DynamicParameters para = new DynamicParameters(parameters);
            para.Add("@pReturnId", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await ExecuteAsync("uspDeleteNews", para, CommandType.StoredProcedure);
            var NewsId = para.Get<int>("@pReturnId");
            if (NewsId > 0)
            {
                return true;
            }
            return false;
        }

        public async Task<IEnumerable<Models.KeyValuePair>> GetAllKeyValuePair(KeyValuePairType keyValuePair, long? id)
        {
            var parameters = new
            {
                pKeyValueType = keyValuePair,
                pId = id,
            };
            var result = await QueryAsync<Models.KeyValuePair>("uspGetKeyValuePairs", parameters);
            return result;
        }

        public async Task<IEnumerable<Car>> GetAllNews()
        {
            var parameters = new
            {
            };
            (IEnumerable<Car> postedNews, IEnumerable<AttachmentViewModel> attachments) =
                await QueryMultipleAsync<Car, AttachmentViewModel>("sp_GetAllNews", parameters);

            foreach (Car car in postedNews)
            {
                //Associate attachments with each board if available
                car.attachments = attachments.Any()
                    ? attachments.Where(a => a.Id == car.Id).ToList()
                    : new List<AttachmentViewModel>();
            }
            return postedNews;
            //var term = await QueryAsync<News>("sp_GetAllNews", parameters);
            //return term;
        }

        public Task<IEnumerable<Car>> GetcarsByIdAsync(long? id)
        {
            throw new NotImplementedException();
        }

        public async Task<bool> DeleteCar(long id)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@pId", id);
            parameters.Add("@pReturnId", dbType: DbType.Int32, direction: ParameterDirection.Output);

            await ExecuteAsync("sp_DeleteCar", parameters, CommandType.StoredProcedure);

            var returnId = parameters.Get<int>("@pReturnId");
            return returnId > 0;
        }
    }
}
