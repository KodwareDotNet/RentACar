using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using RentACar.Models;
using RentACar.ViewModel;

namespace RentACar.Map
{
    public interface IUserMap
    {
        /// <summary>
        /// Get a paginated list of users, optionally filtered by name
        /// </summary>
        /// <param name="name">Optional search by name</param>
        /// <param name="pageNumber">Page number (1-based)</param>
        /// <param name="pageSize">Number of users per page</param>
        /// <returns>List of UserViewModel</returns>
        Task<IEnumerable<UserViewModel>> GetAll(string name, int pageNumber, int pageSize);

        /// <summary>
        /// Create a new user
        /// </summary>
        /// <param name="user">UserViewModel containing user data</param>
        /// <returns>Id of the created user</returns>
        Task<int> Create(UserViewModel user);

        Task<int> CreateOrganization(OrganizationViewModel create);
        Task<OrganizationViewModel> GetOrganizationById(int id);
        Task<IEnumerable<OrganizationViewModel>> GetAllOrganizations();
        Task<int> UpdateOrganization(OrganizationViewModel update);
        Task<int> DeleteOrganization(int id);
        Task<IEnumerable<RoleViewModel>> GetRolesByOrganization(int orgId);

        Task<int> CreateUser(UserCreateDto dto);
        Task<User?> Login(LoginDto dto);
        public Task<DBErrorResponse> CreateRole(RoleViewModel role);
        //Task<int> CreateCategory(Categoryviewmodel category);

        Task<bool> UpdateRole(RoleViewModel role);
        Task<List<PermissionsViewModel>> GetAllPermissions(long? userId, long? organizationId, UserType userType);
        Task<bool> DeleteRole(int id);

        Task<UserViewModel?> GetByEmailOrGoogleId(string email, string? googleId);
        Task<bool> AddCar(Car car);
        //Task<bool> BookCar(CarBooking booking);
        //Task<List<CarBooking>> GetAllBookings();
        //Task<int> CancelBooking(int id);

        Task<IEnumerable<Car>> GetCars(int orgId);
        Task<bool> DeleteCar(int id);


        Task<decimal> GetDailyIncome(DateTime date);
        Task<List<RoleViewModel>> GetAllRoles(string? searchString, int pageNumber, long? userId, long? organizationId, long? pageSize);
    }

}
