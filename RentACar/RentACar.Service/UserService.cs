using System;
using System.Collections.Generic;
using System.Formats.Asn1;
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

        public async Task<User> CreateUser(UserCreateDto dto)
        {
            var user = new User
            {
                Username = dto.Username,
                Name = dto.Username,
                Email = dto.Email,
                Password = dto.Password,
                Role = dto.Role,
                OrganizationId = dto.OrganizationId
            };

            await _userRepo.CreateUser(user);
            DateTime tokenExpiry;
            user.Token = _tokenService.CreateToken(user, out tokenExpiry);
            user.TokenExpiresAt = tokenExpiry;

            return user;
        }



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

        public async Task<User> Login(string email, string password)
        {
            var user = await _userRepo.Login(email, password);
            if (user == null) return null;
            user.Token = _tokenService.CreateToken(user, out DateTime expiresAt);
            user.TokenExpiresAt = expiresAt;

            return user;
        }



        public async Task<DBErrorResponse> CreateRole(Role role)
        {
            DBErrorResponse dbresponse = await _userRepo.CreateRole(role);
            if (dbresponse.RequestStatus == DBErrorResponseMessage.Duplicate)
            {
                return new DBErrorResponse { RequestStatus = DBErrorResponseMessage.Duplicate, Id = 0 };
            }
            if (dbresponse.Id > 0)
            {
                return new DBErrorResponse { RequestStatus = DBErrorResponseMessage.Success, Id = dbresponse.Id };
            }
            else
            {
                return new DBErrorResponse { RequestStatus = DBErrorResponseMessage.Error, Id = 0 };
            }
        }
        public async Task<IEnumerable<Role>> GetAllRoles(string searchString, int pageNumber, long? userId, long? organizationId, long? pageSize)
        {
            return await _userRepo.GetAllRoles(searchString, pageNumber, userId, organizationId, pageSize);
        }

        public async Task<bool> UpdateRole(Role role)
        {
            if (role == null)
                throw new ArgumentNullException(nameof(role));

            var result = await _userRepo.UpdateRole(role);
            return result > 0;
        }
        public async Task<IEnumerable<Permissions>> GetAllPermissions(long? userId, long? organizationId, UserType userType)
        {
            return await _userRepo.GetAllPermissions(userId, organizationId, userType);
        }

        public async Task<bool> DeleteRole(int id)
        {
            var result = await _userRepo.DeleteRole(id);
            return result > 0;
        }
        public async Task<IEnumerable<Role>> GetRolesByOrganization(int orgId)
        {
            return await _userRepo.GetRolesByOrganization(orgId);
        }
        public async Task<bool> AddCar(Car car)
        {
            if (car == null)
                throw new ArgumentNullException(nameof(car));

            return await _userRepo.AddCar(car);
        }
        //Task<IEnumerable<Car>> GetCars(int orgId);

        public async Task<IEnumerable<Car>> GetCars(int orgId)
        {
            return await _userRepo.GetCars(orgId);
        }
        public async Task<bool> DeleteCar(int id)
        {
            if (id <= 0)
                throw new ArgumentException("Invalid Car Id");

            return await _userRepo.DeleteCar(id);
        }
    }
}

//        public async Task<bool> BookCar(CarBooking booking)
//        {
//            return await _userRepo.BookCar(booking);
//        }
//        public async Task<List<CarBooking>> GetAllBookings()
//        {
//            return await _userRepo.GetAllBookings();
//        }
//        public async Task<int> CancelBooking(int id)
//        {
//            return await _userRepo.CancelBooking(id);
//        }
//    }
//}
