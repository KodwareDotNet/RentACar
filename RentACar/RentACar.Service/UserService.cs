using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MenuManagement.Repositories;
using RentACar.Interfaces.RepoInterfaces;
using RentACar.Interfaces.ServiceInterface;
using RentACar.Models;
using RentACar.Service;
using RentACar.ViewModel;

namespace RentACar.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepo;
        private readonly ITokenService _tokenService;
        private readonly IUserRepository _userRepository;
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
        //    public async Task<int> CreateRole(Role role)
        //    {
        //        if (role == null) throw new ArgumentNullException(nameof(role));
        //        return await _userRepository.CreateRole(role); // <-- _userRepository must not be null
        //    }

        //    // Update Role
        //    public async Task<int> UpdateRole(Role role)
        //    {
        //        if (role == null)
        //            throw new ArgumentNullException(nameof(role));

        //        if (role.Id <= 0)
        //            throw new ArgumentException("RoleId must be valid.");

        //        return await _userRepository.UpdateRole(role);
        //    }

        //    // Delete Role
        //    public async Task<int> DeleteRole(int roleId)
        //    {
        //        if (roleId <= 0)
        //            throw new ArgumentException("RoleId must be valid.");

        //        return await _userRepository.DeleteRole(roleId);
        //    }
        //}
        public async Task<bool> CreateRole(Role role)
        {
            var result = await _userRepo.CreateRole(role);
            return result > 0;
        }

        public async Task<IEnumerable<Role>> GetAllRoles()
        {
            return await _userRepo.GetAllRoles();
        }

        public async Task<bool> UpdateRole(Role role)
        {
            if (role == null)
                throw new ArgumentNullException(nameof(role));

            var result = await _userRepo.UpdateRole(role);
            return result > 0;
        }

        public async Task<bool> DeleteRole(int id)
        {
            var result = await _userRepo.DeleteRole(id);
            return result > 0;
        }

    }



}




