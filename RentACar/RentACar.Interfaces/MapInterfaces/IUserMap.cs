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
        Task<int> CreateUser(UserCreateDto dto);
        Task<User?> Login(LoginDto dto);


        /// <summary>
        /// Optional: Get a single user by email or GoogleId
        /// </summary>
        Task<UserViewModel?> GetByEmailOrGoogleId(string email, string? googleId);

        /// <summary>
        /// Optional: Get daily income (if needed in map)
        /// </summary>
        Task<decimal> GetDailyIncome(DateTime date);
    }

}
//public interface IUserMap
//{
//    // User methods
//    Task<int> Create(UserViewModel user);
//    Task<UserViewModel> GetById(int id);
//    Task<List<UserViewModel>> GetAll();
//    Task<bool> Update(UserViewModel user);
//    Task<bool> Delete(int id);

//    // Organization methods
//    Task<int> CreateOrganization(OrganizationViewModel organization);
//    Task<OrganizationViewModel> GetOrganizationById(int id);
//    Task<List<OrganizationViewModel>> GetAllOrganizations();
//    Task<bool> UpdateOrganization(OrganizationViewModel organization);
//    Task<bool> DeleteOrganization(int id);
//}