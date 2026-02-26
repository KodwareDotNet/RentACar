using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using RentACar.Models;
using RentACar.ViewModel;

namespace RentACar.Interfaces.ServiceInterface
{
    public interface IUserService
    {
        Task<User?> GetByEmailOrGoogleIdAsync(string email, string? googleId);
        Task<int> CreateUserAsync(User user);
        Task SaveRefreshTokenAsync(int userId, string refreshToken, DateTime expiryDate);
        Task<User?> GetUserByRefreshTokenAsync(string refreshToken);
        Task DeleteRefreshTokenAsync(int userId);
        Task<decimal> GetDailyIncomeAsync(DateTime date);
        Task<IEnumerable<Organization>> GetAllOrganizations();
        Task<int> CreateOrganization(Organization create);
        Task<int> UpdateOrganization(Organization organization);
        Task<int> DeleteOrganization(int organizationId);
        Task<int> CreateUser(User user);
        Task<User?> Login(string email, string password);
        Task<bool> AddCar(Car car);
        Task<PagedResponse<Car>> GetCars(int orgId, int page, int pageSize);
        Task<bool> DeleteCar(int id);
        Task<User> GetUserByUsername(string username);
        Task<DBErrorResponse> CreateRole(Role role);
        Task<IEnumerable<Role>> GetRolesByOrganization(int organizationId);
        Task<IEnumerable<Permissions>> GetAllPermissions(long? userId, long? organizationId, UserType userType);
        Task<bool> UpdateRole(Role role);
Task<bool> DeleteRole(int roleId);
        Task<IEnumerable<Role>> GetAllRoles(string searchString, int pageNumber, long? userId, long? organizationId, long? pageSize);
        Task<IEnumerable<User>> GetAll(string name, int pageNumber, int pageSize);
        Task Update(User user);
        Task Delete(int id);


    }
}
