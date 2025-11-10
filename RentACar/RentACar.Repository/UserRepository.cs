using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.Linq;
using System.Net.Sockets;
using Dapper;
using MenuManagement.Repositories;
using RentACar.Interfaces.RepoInterfaces;
using RentACar.Interfaces.ServiceInterface;
using RentACar.Models;
using static System.Net.Mime.MediaTypeNames;
using static Dapper.SqlMapper;

namespace MenuManagement.Repositories
{
    public class UserRepository : BaseRepository, IUserRepository
    {
        public UserRepository(IDbConnection connection) : base(connection)
        {

        }

        public async Task<decimal> GetDailyIncome(DateTime date)
        {
            try
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pDate", date);
                parameters.Add("@pIncome", dbType: DbType.Decimal, direction: ParameterDirection.Output);
                await ExecuteAsync("uspGetDailyIncome", parameters, CommandType.StoredProcedure);
                return parameters.Get<decimal>("@pIncome");
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<User?> GetByEmailOrGoogleIdAsync(string pEmail, string? googleId)
        {
            if (string.IsNullOrWhiteSpace(pEmail))
                throw new ArgumentException("Email cannot be null or empty.", nameof(pEmail));


            var parameters = new
            {
                Email = pEmail,
                GoogleId = googleId
            };

            return await QueryFirstOrDefaultAsync<User>(
                "sp_GetUserByEmailOrGoogleId",
                parameters,
                commandType: CommandType.StoredProcedure
            ).ConfigureAwait(false);
        }

        public async Task<int> CreateAsync(User user)
        {
            if (user is null)
                throw new ArgumentNullException(nameof(user));


            var parameters = new
            {
                Name = user.Name ?? string.Empty,
                Email = user.Email ?? string.Empty,
                Role = user.Role ?? "User",
                PasswordHash = user.PasswordHash ?? string.Empty,
                GoogleId = user.GoogleId
            };

            return await ExecuteAsync(
                "sp_CreateUser",
                parameters,
                commandType: CommandType.StoredProcedure
            ).ConfigureAwait(false);
        }

        public async Task SaveRefreshTokenAsync(int userId, string refreshToken, DateTime expiryDate)
        {
            if (string.IsNullOrWhiteSpace(refreshToken))
                throw new ArgumentException("Refresh token cannot be null or empty.", nameof(refreshToken));


            var parameters = new
            {
                UserId = userId,
                RefreshToken = refreshToken,
                ExpiryDate = expiryDate
            };

            await ExecuteAsync(
                "sp_SaveRefreshToken",
                parameters,
                commandType: CommandType.StoredProcedure
            ).ConfigureAwait(false);
        }

        public async Task<User?> GetUserByRefreshTokenAsync(string refreshToken)
        {
            if (string.IsNullOrWhiteSpace(refreshToken))
                throw new ArgumentException("Refresh token cannot be null or empty.", nameof(refreshToken));

            var parameters = new { RefreshToken = refreshToken };

            return await QueryFirstOrDefaultAsync<User>(
                "sp_GetUserByRefreshToken",
                parameters,
                commandType: CommandType.StoredProcedure
            ).ConfigureAwait(false);
        }

        public async Task DeleteRefreshTokenAsync(int userId)
        {

            var parameters = new { UserId = userId };

            await ExecuteAsync(
                "sp_DeleteRefreshToken",
                parameters,
                commandType: CommandType.StoredProcedure
            ).ConfigureAwait(false);
        }
        public async Task<int> CreateOrganization(Organization organization)
        {
            if (organization is null)
                throw new ArgumentNullException(nameof(organization));

            var parameters = new
            {
                OrganizationName = organization.Name ?? string.Empty,
                Email = organization.Email ?? string.Empty,
                Phone = organization.Phone ?? string.Empty,
                Address = organization.Address ?? string.Empty
            };

            return await ExecuteAsync(
                "sp_CreateOrganization",
                parameters,
                commandType: CommandType.StoredProcedure
            ).ConfigureAwait(false);
        }
        //        public async Task<IEnumerable<Organization>> GetAllOrganizations()
        //        {
        //            return await QueryAsync<Organization>(
        //                "sp_GetAllOrganizations",
        //                commandType: CommandType.StoredProcedure
        //            ).ConfigureAwait(false);
        //        }

        //    }
        //}
        public async Task<IEnumerable<Organization>> GetAllOrganizations()
        {
            // _connection is the IDbConnection passed to the repository
            return await _connection.QueryAsync<Organization>(
                "sp_GetAllOrganizations",
                commandType: CommandType.StoredProcedure
            );
        }
        public async Task<int> UpdateOrganization(Organization organization)
        {
            if (organization is null)
                throw new ArgumentNullException(nameof(organization));

            var parameters = new DynamicParameters();
            parameters.Add("@OrganizationId", organization.Id);
            parameters.Add("@OrganizationName", organization.Name ?? string.Empty);
            parameters.Add("@Email", organization.Email ?? string.Empty);
            parameters.Add("@Phone", organization.Phone ?? string.Empty);
            parameters.Add("@Address", organization.Address ?? string.Empty);

            // Define output parameter
            parameters.Add("@OutP", dbType: DbType.Int32, direction: ParameterDirection.Output);

            // Execute stored procedure
            await _connection.ExecuteAsync(
                "sp_UpdateOrganization",
                parameters,
                commandType: CommandType.StoredProcedure
            ).ConfigureAwait(false);

            // Return the output parameter value
            return parameters.Get<int>("@OutP");
        }

        public async Task<int> DeleteOrganization(int organizationId)
        {
            if (organizationId <= 0)
                throw new ArgumentException("Invalid organization Id", nameof(organizationId));

            var parameters = new DynamicParameters();
            parameters.Add("@OrganizationId", organizationId);
            parameters.Add("@OutP", dbType: DbType.Int32, direction: ParameterDirection.Output);

            await _connection.ExecuteAsync(
                "sp_DeleteOrganization",
                parameters,
                commandType: CommandType.StoredProcedure
            ).ConfigureAwait(false);

            return parameters.Get<int>("@OutP");
        }
        public async Task<int> CreateUser(User user)
        {
            var parameters = new
            {
                @Username = user.Username,
                @PasswordHash = user.Password,
                @OrganizationId = user.OrganizationId,
                @UserRole = user.Role,
                @Email = user.Email,
            };

            return await ExecuteAsync(
                "sp_CreateUser",
                parameters,
                commandType: CommandType.StoredProcedure
            );
        }
        public async Task<User> GetUserByUsername(string username)
        {
            return await QueryFirstOrDefaultAsync<User>(
                "sp_GetUserByUsername",
                new { Username = username },
                commandType: CommandType.StoredProcedure
            );
        }
        public async Task<User?> Login(string email, string password)
        {
            var parameters = new
            {
                @Email = email,
                PasswordHash = password
            };

            var user = await QueryFirstOrDefaultAsync<User>(
                "sp_LoginUser",
                parameters,
                commandType: CommandType.StoredProcedure
            );

            return user;
        }
        #region Role

        public async Task<int> CreateRole(Role role)
        {
            if (role is null)
                throw new ArgumentNullException(nameof(role));

            var parameters = new
            {
                RoleName = role.RoleName ?? string.Empty,
                OrganizationId = role.OrganizationId
            };

            return await ExecuteAsync(
                "sp_CreateRole",
                parameters,
                commandType: CommandType.StoredProcedure
            );
        }

        public async Task<IEnumerable<Role>> GetAllRoles()
        {
            return await _connection.QueryAsync<Role>(
                "sp_GetAllRoles",
                commandType: CommandType.StoredProcedure
            );
        }


        public async Task<int> UpdateRole(Role role)
        {
            if (role is null)
                throw new ArgumentNullException(nameof(role));

            var parameters = new
            {
                RoleId = role.RoleId,
                RoleName = role.RoleName ?? string.Empty,
                OrganizationId = role.OrganizationId
            };

            return await ExecuteAsync(
                "sp_UpdateRole",
                parameters,
                commandType: CommandType.StoredProcedure
            );
        }

        public async Task<int> DeleteRole(int roleId)
        {
            var parameters = new
            {
                RoleId = roleId
            };

            return await ExecuteAsync(
                "sp_DeleteRole",
                parameters,
                commandType: CommandType.StoredProcedure
            );
        }
    }
}
#endregion


//public async Task<int> CreateRole(Role role)
//{
//    if (role is null)
//        throw new ArgumentNullException(nameof(role));

//    var parameters = new
//    {
//        RoleName = role.Name,
//        @OrganizationId = role.OrganizationId
//    };

//    return await ExecuteAsync("sp_CreateRole", parameters, commandType: CommandType.StoredProcedure);
//}

//public async Task<int> UpdateRole(Role role)
//{
//    if (role is null)
//        throw new ArgumentNullException(nameof(role));

//    var parameters = new
//    {
//        @RoleId = role.Id,
//        @Name = role.Name,
//        @OrganizationId = role.OrganizationId
//    };

//    return await ExecuteAsync("sp_UpdateRole", parameters, commandType: CommandType.StoredProcedure);
//}

//public async Task<int> DeleteRole(int roleId)
//{
//    var parameters = new { @RoleId = roleId };
//    return await ExecuteAsync("sp_DeleteRole", parameters, commandType: CommandType.StoredProcedure);
//}

//        public async Task<int> CreateRole(Role role)
//        {
//            var parameters = new
//            {
//                RoleName = role.RoleName ?? string.Empty,
//                OrganizationId = role.OrganizationId
//            };

//            return await ExecuteAsync(
//                "sp_CreateRole",
//                parameters,
//                commandType: CommandType.StoredProcedure
//            );
//        }

//        //public async Task<IEnumerable<Role>> GetAllRoles()
//        //{
//        //    return await QueryAsync<Role>(
//        //        "sp_GetAllRoles",
//        //        commandType: CommandType.StoredProcedure
//        //    );
//        //}

//        public async Task<int> UpdateRole(Role role)
//        {
//            var parameters = new
//            {
//                RoleId = role.RoleId,
//                RoleName = role.RoleName ?? string.Empty,
//                OrganizationId = role.OrganizationId
//            };

//            return await ExecuteAsync(
//                "sp_UpdateRole",
//                parameters,
//                commandType: CommandType.StoredProcedure
//            );
//        }

//        public async Task<int> DeleteRole(int roleId)
//        {
//            var parameters = new { RoleId = roleId };

//            return await ExecuteAsync(
//                "sp_DeleteRole",
//                parameters,
//                commandType: CommandType.StoredProcedure
//            );
//        }

//    }
//}





//[Id][bigint] IDENTITY(1,1) NOT NULL,
//    [Email] [nvarchar] (200) NOT NULL,

//    [UserRole] [nvarchar] (50) NOT NULL,



