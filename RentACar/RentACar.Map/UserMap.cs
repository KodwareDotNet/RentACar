using System;
using System.Collections.Generic;
using System.Reflection.Metadata.Ecma335;
using System.Threading.Tasks;
using System.Xml.Linq;
using Kodware.API.ViewModels;
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

            var userType = Enum.TryParse<UserType>(users.UserRole, ignoreCase: true, out var result)
                  ? result
                  : UserType.User;

            if (users != null)
            {
                list.Add(new UserViewModel
                {
                    Id = users.Id,
                    Name = users.Name,
                    Email = users.Email,
                    UserType = userType,
                    Role = users.UserRole
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
                //Role = user.Role ?? "User"   // here

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
                Address = organization.Address,
                password = organization.password,
                UserType = organization.UserType
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
                password = org.password,
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
        public async Task<int> CreateUser(UserCreateDto dto)
        {
            var user = new User
            {
                Username = dto.Username,
                Password = dto.Password,  // hash if needed
                OrganizationId = dto.OrganizationId,
                Role = "User", // default role for this endpoint
                Email = dto.Email,
                UserType = dto.Usertype
            };
            return await _userService.CreateUser(user);
        }
        public async Task<User?> Login(LoginDto dto)
        {
            if (dto == null)
                throw new ArgumentNullException(nameof(dto));

            // Optionally: hash dto.Password before sending to service
            return await _userService.Login(dto.Email, dto.Password);
        }
        #region

        public async Task<DBErrorResponse> CreateRole(RoleViewModel viewModel)
        {
            Role role = ViewModelToDomain(viewModel);
            return await _userService.CreateRole(role);

        }
        public Role ViewModelToDomain(RoleViewModel officeViewModel)
        {
            Role domain = new Role();
            domain.RoleName = officeViewModel.RoleName;
            domain.OrganizationId = officeViewModel.OrganizationId;
            domain.RoleId = officeViewModel.RoleId;
            domain.SelectedPermissions = officeViewModel.SelectedPermissions == null ? new List<PermissionIdViewModel>() : officeViewModel.SelectedPermissions;
            return domain;
        }
        public async Task<List<RoleViewModel>> GetAllRoles(string searchString, int pageNumber, long? userId, long? organizationId, long? pageSize)
        {
            return DomainToViewModel(await _userService.GetAllRoles(searchString, pageNumber, userId, organizationId, pageSize));
        }
        public List<RoleViewModel> DomainToViewModel(IEnumerable<Role> domain)
        {
            List<RoleViewModel> model = new List<RoleViewModel>();
            foreach (Role of in domain)
            {
                model.Add(DomainToViewModel(of));
            }
            return model;
        }
        public RoleViewModel DomainToViewModel(Role domain)
        {
            RoleViewModel model = new RoleViewModel();
            model.RoleId = domain.RoleId;
            model.RoleName = domain.RoleName;
            model.SelectedPermissions = domain.SelectedPermissions == null ? new List<PermissionIdViewModel>() : domain.SelectedPermissions;
            return model;
        }

        public async Task<bool> UpdateRole(RoleViewModel role)
        {
            var model = new Role
            {
                RoleId = role.RoleId,
                RoleName = role.RoleName,
                OrganizationId = role.OrganizationId
            };
            return await _userService.UpdateRole(model);
        }
        public async Task<List<PermissionsViewModel>> GetAllPermissions(long? userId, long? organizationId, UserType userType)
        {
            return PermissionsDomainToViewModel(await _userService.GetAllPermissions(userId, organizationId, userType));
        }
        public List<PermissionsViewModel> PermissionsDomainToViewModel(IEnumerable<Permissions> domain)
        {
            List<PermissionsViewModel> model = new List<PermissionsViewModel>();
            foreach (Permissions of in domain)
            {
                model.Add(PermissionsDomainToViewModel(of));
            }
            return model;
        }
        public PermissionsViewModel PermissionsDomainToViewModel(Permissions domain)
        {
            PermissionsViewModel model = new PermissionsViewModel();
            model.Id = domain.Id;
            model.DisplayName = domain.DisplayName;
            model.Value = domain.Value;
            model.Group = domain.Group;
            return model;
        }

        public async Task<bool> DeleteRole(int id)
        {
            return await _userService.DeleteRole(id);
        }
        public async Task<IEnumerable<RoleViewModel>> GetRolesByOrganization(int orgId)
        {
            var roles = await _userService.GetRolesByOrganization(orgId);

            return roles.Select(r => new RoleViewModel
            {
                RoleId = r.RoleId,
                RoleName = r.RoleName,
                OrganizationId = r.OrganizationId,
                OrganizationName = r.OrganizationName,
                SelectedPermissions = r.Permission?.Select(p => new PermissionIdViewModel
                {
                    PermissionId = p.PermissionId,
                    ////DisplayName = p.PermissionName,
                    //PermissionName = p.PermissionName,
                    //PermissionValue = p.PermissionValue
                }).ToList()
            });
        }
        public async Task<bool> AddCar(Car car)
        {
            return await _userService.AddCar(car);
        }
        //Task<IEnumerable<Car>> GetCars(int orgId);

        public async Task<IEnumerable<Car>> GetCars(int orgId)
        {
            return await _userService.GetCars(orgId);
        }
        public async Task<bool> DeleteCar(int id)
        {
            return await _userService.DeleteCar(id);
        }
    }
}
//        public async Task<bool> BookCar(CarBooking booking)
//        {
//            return await _userService.BookCar(booking);
//        }
//        public async Task<List<CarBooking>> GetAllBookings()
//        {
//            return await _userService.GetAllBookings();
//        }
//        public async Task<int> CancelBooking(int id)
//        {
//            return await _userService.CancelBooking(id);
//        }
//    }
//}


#endregion



