using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.Data.SqlClient;
using System.Data.Common;
using System.Linq;
using System.Net.Sockets;
using System.Security;
using Dapper;
using Kodware.API.ViewModels;
using MenuManagement.Repositories;
using RentACar.Common;
using RentACar.Interfaces.RepoInterfaces;
using RentACar.Interfaces.ServiceInterface;
using RentACar.Models;
using RentACar.ViewModel;
using static System.Net.Mime.MediaTypeNames;
using static Dapper.SqlMapper;

namespace MenuManagement.Repositories
{
    public class UserRepository : BaseRepository, IUserRepository
    {
        private readonly IDbConnection _dbConnection;
        public UserRepository(IDbConnection connection) : base(connection)
        {
            _dbConnection = connection;

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
                UserRole = user.Role ?? "User",
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

            var parameters = new DynamicParameters();
            {
                parameters.Add("@OrganizationName", organization.Name ?? string.Empty);
                parameters.Add("@Email", organization.Email ?? string.Empty);
                parameters.Add("@Phone", organization.Phone ?? string.Empty);
                parameters.Add("@Address", organization.Address ?? string.Empty);
                parameters.Add("@password", organization.password ?? string.Empty);
                parameters.Add("@UserType", organization.UserType);
            }
            ;

            parameters.Add("@outp", dbType: DbType.Int32, direction: ParameterDirection.Output);


            await ExecuteAsync(
                "sp_CreateOrganization",
                parameters,
                commandType: CommandType.StoredProcedure
            ).ConfigureAwait(false);

            return parameters.Get<int>("@outp");

        }

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

            parameters.Add("@OutP", dbType: DbType.Int32, direction: ParameterDirection.Output);

            await _connection.ExecuteAsync(
                "sp_UpdateOrganization",
                parameters,
                commandType: CommandType.StoredProcedure
            ).ConfigureAwait(false);

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
                @Usertype = user.UserType
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
        public async Task<DBErrorResponse> CreateRole(Role domain)
        {
            var parameters = new
            {
                pRoleName = domain.RoleName,
                pOrganizationId = domain.OrganizationId,
                pRoleId = domain.RoleId,
            };
            DynamicParameters para = new DynamicParameters(parameters);
            para.Add("@pReturnId", dbType: DbType.Int32, direction: ParameterDirection.Output);
            para.Add("@pRequestStatus", dbType: DbType.Int32, direction: ParameterDirection.Output);
            var result = ExecuteAsync("sp_CreateRole", para, commandType: CommandType.StoredProcedure).Result;
            DBErrorResponseMessage requestStatus = para.Get<DBErrorResponseMessage>("@pRequestStatus");
            var roleId = para.Get<int>("@pReturnId");
            if (roleId > 0)
            {
                _ = CreateRolePermission(new Role()
                {
                    RoleId = roleId,
                    SelectedPermissions = domain.SelectedPermissions,
                });
                return new DBErrorResponse { RequestStatus = DBErrorResponseMessage.Success, Id = roleId };
            }
            return new DBErrorResponse { RequestStatus = DBErrorResponseMessage.Duplicate, Id = 0 };
        }

        public async Task<bool> CreateRolePermission(Role domain)
        {
            DynamicParameters dynamParameters = new DynamicParameters();
            dynamParameters.Add("@pRoleId", domain.RoleId);
            dynamParameters.Add(name: "@pPermissionIds", value: domain.SelectedPermissions?
                .Select(s => new { s.PermissionId }).ToList().ToDataTable()
                .AsTableValuedParameter("UDT_IntArray"), (DbType?)SqlDbType.Structured);
            return ExecuteAsync("uspCreateRolePermission", dynamParameters, commandType: CommandType.StoredProcedure).Result > 0;
        }

        public async Task<IEnumerable<Role>> GetAllRoles(string searchString, int pageNumber, long? userId, long? organizationId, long? pageSize)
        {
            var parameters = new { @psearchString = searchString, pPageNumber = pageNumber, pUserId = userId, pOrganizationid = organizationId, ppageSize = pageSize };
            (IEnumerable<Role> data1, IEnumerable<PermissionIdViewModel> data2) = await
                QueryMultipleAsync<Role, PermissionIdViewModel>("sp_GetAllRoles", parameters);
            IEnumerable<Role> roles = data1;
            IEnumerable<PermissionIdViewModel> rolePermissions = data2;
            foreach (Role role in roles)
            {
                role.SelectedPermissions = rolePermissions.Any() ? rolePermissions.Where(p => p.RoleId == role.RoleId).ToList()
                    : new List<PermissionIdViewModel>();
            }
            return roles;
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
        public async Task<IEnumerable<Permissions>> GetAllPermissions(long? userId, long? organizationId, UserType userType)
        {
            var parameters = new
            {
                pUserId = userId,
                pOrganizationId = organizationId,
                pUserType = userType
            };
            var result = await QueryAsync<Permissions>("uspGetAllPermissions", parameters);
            return result;
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

        public async Task<IEnumerable<Role>> GetRolesByOrganization(int orgId)
        {
            var parameters = new { OrgId = orgId };

            var roleDict = new Dictionary<int, Role>();

            var result = await _connection.QueryAsync<Role, PermissionIdViewModel, Role>(
      "sp_GetRolesByOrganization",
      (role, perm) =>
      {
          if (!roleDict.TryGetValue(role.RoleId, out var currentRole))
          {
              currentRole = role;
              currentRole.Permission = new List<PermissionIdViewModel>();
              roleDict.Add(currentRole.RoleId, currentRole);
          }

          if (perm != null && perm.PermissionId != 0)
              currentRole.Permission.Add(perm);

          return currentRole;
      },
      parameters,
      splitOn: "PermissionId",
      commandType: CommandType.StoredProcedure
  );

            return roleDict.Values;
        }
        public async Task<bool> AddCar(Car car)
        {
            var parameters = new
            {
                Id = car.Id,
                ImageUrl = car.ImageUrl,
                CarName = car.CarName,
                Brand = car.Brand,
                Model = car.Model,
                Year = car.Year,
                PricePerHour = car.PricePerHour,
                Transmission = car.Transmission,
                Fuel = car.Fuel,
                Seats = car.Seats,
                Doors = car.Doors,
                Color = car.Color,
                NumberPlate = car.NumberPlate,
                Mileage = car.Mileage,
                Vin = car.Vin,
                BodyType = car.BodyType,
                EngineSize = car.EngineSize,
                Description = car.Description,
                OrganizationId = car.OrganizationId
            };

            var result = await _connection.ExecuteScalarAsync<int>(
                  "sp_AddCar",
                  parameters,
                commandType: CommandType.StoredProcedure
 );

            return result > 0;
        }

        public async Task<PagedResponse<Car>> GetCars(int orgId, int page, int pageSize)
        {
            var parameters = new
            {
                OrganizationId = orgId,
                PageNumber = page,
                PageSize = pageSize
            };

            var cars = (await _connection.QueryAsync<Car>(
                "sp_GetCars",
                parameters,
                commandType: CommandType.StoredProcedure
            )).ToList();

            if (!cars.Any())
            {
                return new PagedResponse<Car>
                {
                    Data = new List<Car>(),
                    Pagination = new PaginationDto
                    {
                        CurrentPage = page,
                        PageSize = pageSize,
                        TotalRecords = 0,
                        TotalPages = 0
                    }
                };
            }

            int totalRecords = cars.First().TotalRecords;

            return new PagedResponse<Car>
            {
                Data = cars,
                Pagination = new PaginationDto
                {
                    CurrentPage = page,
                    PageSize = pageSize,
                    TotalRecords = totalRecords,
                    TotalPages = (int)Math.Ceiling((double)totalRecords / pageSize)
                }
            };
        }

        public async Task<bool> DeleteCar(int id)
        {
            var car = await _connection.QueryFirstOrDefaultAsync<Car>(
                "SELECT * FROM Cars WHERE Id = @Id",
                new { Id = id }
            );

            if (car == null)
                return false; // car not found

            // 2️⃣ Delete image file if it exists
            if (!string.IsNullOrEmpty(car.ImageUrl))
            {
                var fullPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", car.ImageUrl.TrimStart('/'));
                if (File.Exists(fullPath))
                    File.Delete(fullPath);
            }

            var result = await _connection.ExecuteScalarAsync<int>(
                "sp_DeleteCar",
                new { Id = id },
                commandType: CommandType.StoredProcedure
            );

            return result > 0; // true if deleted
        }
    }
}
   
#endregion



