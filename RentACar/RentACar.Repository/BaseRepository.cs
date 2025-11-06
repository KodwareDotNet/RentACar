
using Dapper;
using System.Data;

namespace MenuManagement.Repositories
{
    public abstract class BaseRepository
    {
        protected IDbConnection _connection;

        public BaseRepository(IDbConnection connection)
        {
            _connection = connection;
        }

        protected async Task<(IEnumerable<T1>, IEnumerable<T2>)> QueryMultipleAsync<T1, T2>(string storedProcedure, object parameters)
        {
            using (var multi = await _connection.QueryMultipleAsync(storedProcedure, parameters, commandType: CommandType.StoredProcedure))
            {
                var result1 = await multi.ReadAsync<T1>();
                var result2 = await multi.ReadAsync<T2>();

                return (result1, result2);
            }
        }

        protected async Task<(IEnumerable<T1>, IEnumerable<T2>, IEnumerable<T3>)> QueryMultipleAsync<T1, T2, T3>(string storedProcedure, object parameters)
        {
            using (var multi = await _connection.QueryMultipleAsync(storedProcedure, parameters, commandType: CommandType.StoredProcedure))
            {
                var result1 = await multi.ReadAsync<T1>();
                var result2 = await multi.ReadAsync<T2>();
                var result3 = await multi.ReadAsync<T3>();

                return (result1, result2, result3);
            }
        }

        protected async Task<(IEnumerable<T1>, IEnumerable<T2>, IEnumerable<T3>, IEnumerable<T4>)> QueryMultipleAsync<T1, T2, T3, T4>(string storedProcedure, object parameters)
        {
            using (var multi = await _connection.QueryMultipleAsync(storedProcedure, parameters, commandType: CommandType.StoredProcedure))
            {
                var result1 = await multi.ReadAsync<T1>();
                var result2 = await multi.ReadAsync<T2>();
                var result3 = await multi.ReadAsync<T3>();
                var result4 = await multi.ReadAsync<T4>();

                return (result1, result2, result3, result4);
            }
        }
        protected async Task<(IEnumerable<T1>, IEnumerable<T2>, IEnumerable<T3>, IEnumerable<T4>, IEnumerable<T5>)> QueryMultipleAsync<T1, T2, T3, T4, T5>(string storedProcedure, object parameters)
        {
            using (var multi = await _connection.QueryMultipleAsync(storedProcedure, parameters, commandType: CommandType.StoredProcedure))
            {
                var result1 = await multi.ReadAsync<T1>();
                var result2 = await multi.ReadAsync<T2>();
                var result3 = await multi.ReadAsync<T3>();
                var result4 = await multi.ReadAsync<T4>();
                var result5 = await multi.ReadAsync<T5>();
                return (result1, result2, result3, result4, result5);
            }
        }
        protected async Task<(IEnumerable<T1>, IEnumerable<T2>, IEnumerable<T3>, IEnumerable<T4>, IEnumerable<T5>, IEnumerable<T6>)> QueryMultipleAsync<T1, T2, T3, T4, T5, T6>(string storedProcedure, object parameters)
        {
            using (var multi = await _connection.QueryMultipleAsync(storedProcedure, parameters, commandType: CommandType.StoredProcedure))
            {
                var result1 = await multi.ReadAsync<T1>();
                var result2 = await multi.ReadAsync<T2>();
                var result3 = await multi.ReadAsync<T3>();
                var result4 = await multi.ReadAsync<T4>();
                var result5 = await multi.ReadAsync<T5>();
                var result6 = await multi.ReadAsync<T6>();
                return (result1, result2, result3, result4, result5, result6);
            }
        }

        protected async Task<(IEnumerable<T1>, IEnumerable<T2>, IEnumerable<T3>, IEnumerable<T4>, IEnumerable<T5>, IEnumerable<T6>, IEnumerable<T7>)> QueryMultipleAsync<T1, T2, T3, T4, T5, T6, T7>(string storedProcedure, object parameters)
        {
            using (var multi = await _connection.QueryMultipleAsync(storedProcedure, parameters, commandType: CommandType.StoredProcedure))
            {
                var result1 = await multi.ReadAsync<T1>();
                var result2 = await multi.ReadAsync<T2>();
                var result3 = await multi.ReadAsync<T3>();
                var result4 = await multi.ReadAsync<T4>();
                var result5 = await multi.ReadAsync<T5>();
                var result6 = await multi.ReadAsync<T6>();
                var result7 = await multi.ReadAsync<T7>();
                return (result1, result2, result3, result4, result5, result6,result7);
            }
        }
        protected async Task<(IEnumerable<T1>, IEnumerable<T2>, IEnumerable<T3>, IEnumerable<T4>, IEnumerable<T5>, IEnumerable<T6>, IEnumerable<T7>, IEnumerable<T8>)> QueryMultipleAsync<T1, T2, T3, T4, T5, T6, T7, T8>(string storedProcedure, object parameters)
        {
            using (var multi = await _connection.QueryMultipleAsync(storedProcedure, parameters, commandType: CommandType.StoredProcedure))
            {
                var result1 = await multi.ReadAsync<T1>();
                var result2 = await multi.ReadAsync<T2>();
                var result3 = await multi.ReadAsync<T3>();
                var result4 = await multi.ReadAsync<T4>();
                var result5 = await multi.ReadAsync<T5>();
                var result6 = await multi.ReadAsync<T6>();
                var result7 = await multi.ReadAsync<T7>();
                var result8 = await multi.ReadAsync<T8>();
                return (result1, result2, result3, result4, result5, result6, result7, result8);
            }
        }
        protected async Task<T> QueryFirstOrDefaultAsync<T>(string storedProcedure, object parameters, CommandType commandType)
        {
            return await _connection.QueryFirstOrDefaultAsync<T>(storedProcedure, parameters, commandType: CommandType.StoredProcedure);
        }

        protected async Task<int> ExecuteAsync(string storedProcedure, object parameters, CommandType commandType)
        {
            return await _connection.ExecuteAsync(storedProcedure, parameters, commandType: CommandType.StoredProcedure);
        }

        protected async Task<IEnumerable<T>> QueryAsync<T>(string storedProcedure, object parameters)
        {
            return await _connection.QueryAsync<T>(storedProcedure, parameters, commandType: CommandType.StoredProcedure);
        }
       

    }
}
