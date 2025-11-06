using RentACar.Interfaces.RepoInterfaces;
using RentACar.Interfaces.ServiceInterface;
using RentACar.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RentACar.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepo;

        public UserService(IUserRepository userRepo)
        {
            _userRepo = userRepo ?? throw new ArgumentNullException(nameof(userRepo));
        }

        public async Task<User?> GetByEmailOrGoogleIdAsync(string email, string? googleId)
        {
            if (string.IsNullOrWhiteSpace(email))
                throw new ArgumentException("Email cannot be null or empty.", nameof(email));

            return await _userRepo.GetByEmailOrGoogleIdAsync(email, googleId);
        }

        public async Task<int> CreateUserAsync(User user)
        {
            if (user == null)
                throw new ArgumentNullException(nameof(user));

            return await _userRepo.CreateAsync(user);
        }

        public async Task SaveRefreshTokenAsync(int userId, string refreshToken, DateTime expiryDate)
        {
            await _userRepo.SaveRefreshTokenAsync(userId, refreshToken, expiryDate);
        }

        public async Task<User?> GetUserByRefreshTokenAsync(string refreshToken)
        {
            if (string.IsNullOrWhiteSpace(refreshToken))
                throw new ArgumentException("Refresh token cannot be null or empty.", nameof(refreshToken));

            return await _userRepo.GetUserByRefreshTokenAsync(refreshToken);
        }

        public async Task DeleteRefreshTokenAsync(int userId)
        {
            await _userRepo.DeleteRefreshTokenAsync(userId);
        }

        public async Task<decimal> GetDailyIncomeAsync(DateTime date)
        {
            return await _userRepo.GetDailyIncome(date);
        }

        //        public async Task<int> CreateOrganization(Organization organization)
        //        {
        //            if (organization == null
        //)                throw new ArgumentNullException(nameof(organization));

        //            return await _userRepo.CreateOrganization(organization);
        //        }

        //    }
        //}

        public async Task<int> CreateOrganization(Organization organization)
        {
            if (organization == null)
                throw new ArgumentNullException(nameof(organization));

            return await _userRepo.CreateOrganization(organization);
        }
        public async Task<IEnumerable<Organization>> GetAllOrganizations()
        {
            return await _userRepo.GetAllOrganizations();
        }
        public async Task<int> UpdateOrganization(Organization organization)
        {
            if (organization == null)
                throw new ArgumentNullException(nameof(organization));

            return await _userRepo.UpdateOrganization(organization);
        }
        public async Task<int> DeleteOrganization(int id)
        {
            return await _userRepo.DeleteOrganization(id);
        }

    }
}


