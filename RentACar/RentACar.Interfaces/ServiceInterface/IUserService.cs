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
    }
}
