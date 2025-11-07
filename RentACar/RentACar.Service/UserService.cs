using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using RentACar.Interfaces.RepoInterfaces;
using RentACar.Interfaces.ServiceInterface;
using RentACar.Models;
using RentACar.Service;

namespace RentACar.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepo;
        private readonly ITokenService _tokenService;
        public UserService(IUserRepository userRepo,
            ITokenService tokenService)
        {
            _userRepo = userRepo;
            _tokenService = tokenService;
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
        public async Task<int> CreateUser(User user)
        {
            if (user == null)
                throw new ArgumentNullException(nameof(user));

            // Optional: hash password here
            // user.Password = HashPassword(user.Password);

            return await _userRepo.CreateUser(user);
        }

        public async Task<User> GetUserByUsername(string username)
        {
            return await _userRepo.GetUserByUsername(username);
        }
        //public async Task<User?> Login(string email, string password)
        //{
        //    return await _userRepo.Login(email, password);
        //}
        public async Task<User> Login(string email, string password)
        {
            var user = await _userRepo.Login(email, password);
            if (user == null) return null;

            // generate JWT token
            user.Token = _tokenService.GenerateToken(user, out DateTime expiresAt);
            user.TokenExpiresAt = expiresAt;

            return user;
        }


    }
}



