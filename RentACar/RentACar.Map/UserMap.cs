using System;
using System.Collections.Generic;
using System.Reflection.Metadata.Ecma335;
using System.Threading.Tasks;
using System.Xml.Linq;
using RentACar.Interfaces.ServiceInterface;
using RentACar.Models;
using RentACar.ViewModel;

namespace RentACar.Map
{
    public class UserMap : IUserMap
    {
        private readonly IUserService _userService;

        public UserMap(IUserService userService)
        {
            _userService = userService;
        }

        public async Task<IEnumerable<UserViewModel>> GetAll(string name, int pageNumber, int pageSize)
        {
            // Example: call service method and map to ViewModel
            var users = await _userService.GetByEmailOrGoogleIdAsync(name, null); // You can adjust for real GetAll logic
            var list = new List<UserViewModel>();

            if (users != null)
            {
                list.Add(new UserViewModel
                {
                    Id = users.Id,
                    Name = users.Name,
                    Email = users.Email,
                    Role = users.Role
                });
            }

            return list;
        }

        public async Task<int> Create(UserViewModel user)
        {
            var domain = new User
            {
                Name = user.Name,
                Email = user.Email,
                PasswordHash = user.Password,
                Role = user.Role ?? "User"
            };

            return await _userService.CreateUserAsync(domain);
        }

        public async Task<UserViewModel?> GetByEmailOrGoogleId(string email, string? googleId)
        {
            User data = await _userService.GetByEmailOrGoogleIdAsync(email, googleId);

            var model = new UserViewModel
            {
                Name = data.Name,
                Email = data.Email,
                Role = data.Role,


            };
            return model;
        }

        Task<decimal> IUserMap.GetDailyIncome(DateTime date)
        {
            throw new NotImplementedException();
        }

        public async Task<int> CreateOrganization(OrganizationViewModel organization)
        {
            var model = new Organization
            {
                Name = organization.Name,
                Email = organization.Email,
                Phone = organization.Phone,
                Address = organization.Address
            };

            return await _userService.CreateOrganization(model);
        }

        public Task<OrganizationViewModel> GetOrganizationById(int id)
        {
            throw new NotImplementedException();
        }
        public async Task<IEnumerable<OrganizationViewModel>> GetAllOrganizations()
        {
            var organizations = await _userService.GetAllOrganizations();

            return organizations.Select(org => new OrganizationViewModel
            {
                Id = org.OrganizationId,
                Name = org.Name,
                Email = org.Email,
                Phone = org.Phone,
                Address = org.Address,
                CreatedDate = org.CreatedDate
            });
        }
        public async Task<int> UpdateOrganization(OrganizationViewModel organization)
        {
            var model = new Organization
            {
                Id = organization.Id, // Make sure ViewModel has Id
                Name = organization.Name,
                Email = organization.Email,
                Phone = organization.Phone,
                Address = organization.Address
            };

            return await _userService.UpdateOrganization(model);
        }
        public async Task<int> DeleteOrganization(int id)
        {
            return await _userService.DeleteOrganization(id);
        }

    }
}



//public async Task<bool> UpdateOrganization(OrganizationViewModel organization)
//{
//    return await _userService.UpdateOrganization(new Organization
//    {
//        Id = organization.Id,
//        Name = organization.Name,
//        Email = organization.Email,
//        Phone = organization.Phone,
//        Address = organization.Address
//    });
//}


//public async Task<bool> DeleteOrganization(int id)
//{
//    return await _userService.DeleteOrganizationAsync(id);
//}
//    }
//}



