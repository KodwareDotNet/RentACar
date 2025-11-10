using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using RentACar.Models;

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
        Task<int> CreateRole(Role role);
        Task<IEnumerable<Role>> GetAllRoles();
        Task<int> UpdateRole(Role role);
        Task<int> DeleteRole(int roleId);


    }
}
