using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using RentACar.Models;
using RentACar.ViewModel;

namespace RentACar.Interfaces.RepoInterfaces
{
    public interface IUserRepository
    {
        public Task<decimal> GetDailyIncome(DateTime date);
        Task<User?> GetByEmailOrGoogleIdAsync(string email, string? googleId);
        Task<int> CreateAsync(User user);
        Task SaveRefreshTokenAsync(int userId, string refreshToken, DateTime expiresAt);
        Task<User?> GetUserByRefreshTokenAsync(string refreshToken);
        Task<int> CreateOrganization(Organization organization);
        Task<IEnumerable<Organization>> GetAllOrganizations();
        Task<int> UpdateOrganization(Organization organization);
        Task<int> DeleteOrganization(int organizationId);
        Task DeleteRefreshTokenAsync(int userId);
        Task<int> CreateUser(User user);
        Task<User?> Login(string email, string password);
        Task<User> GetUserByUsername(string username);
        Task<DBErrorResponse> CreateRole(Role role);
        Task<bool> AddCar(Car car);
        Task<PagedResponse<Car>> GetCars(int orgId, int page, int pageSize);
        Task<bool> DeleteCar(int id);
        Task<IEnumerable<Permissions>> GetAllPermissions(long? userId, long? organizationId, UserType userType);
        Task<IEnumerable<Role>> GetRolesByOrganization(int organizationId);
        Task<int> UpdateRole(Role role);
        Task<int> DeleteRole(int roleId);
        Task<IEnumerable<Role>> GetAllRoles(string searchString, int pageNumber, long? userId, long? organizationId, long? pageSize);
        Task<IEnumerable<User>> GetAll(string name, int pageNumber, int pageSize);
        Task<int> Update(User user);
        Task<int> Delete(int id);
        Task<bool> CreateOrganizationRole(Organization adminUser);
    }
}
