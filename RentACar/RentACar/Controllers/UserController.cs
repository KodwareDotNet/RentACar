using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RentACar.Helpers;
using RentACar.Interfaces.ServiceInterface;
using RentACar.Map;
using RentACar.Models;
using RentACar.Services;
using RentACar.ViewModel;

namespace RentACar.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserMap _userMap;
        private readonly IUserService _userService;

        public UserController(IUserMap userMap, IUserService userService)
        {
            _userMap = userMap;
            _userService = userService;
        }

        [HttpGet("GetAllUsers")]
        public async Task<IEnumerable<UserViewModel>> GetAll(string name, int pagenumber, int pageSize)
        {
            return await _userMap.GetAll(name, pagenumber, pageSize);
        }
        [HttpPost("CreateUser")]
        public async Task<IActionResult> CreateUser([FromBody] UserCreateDto dto)
        {
            var userModel = new User
            {
                Username = dto.Username,
                Name = dto.Username,
                Email = dto.Email,
                Password = dto.Password,
                Role = dto.Role,
                OrganizationId = dto.OrganizationId
            };

            var user = await _userService.CreateUser(userModel);
            return Ok(user);
        }

        //[HttpPost("CreateUser")]
        //public async Task<int> Create([FromBody] UserViewModel user)
        //{
        //    var (hash, salt) = hassedPassword (user.Password); // Implement your hash
        //    user.Password = hash;
        //    user.Salt = salt;

        //    return await _userMap.Create(user);
        //}
        #region Organization
        [HttpPost("CreateOrganization")]
        public async Task<IActionResult> CreateOrganization([FromBody] OrganizationViewModel organization)
        {
            var organizationId = await _userMap.CreateOrganization(organization);

            return Ok(new { OrganizationId = organizationId });
        }


        [HttpGet("GetOrganization/{id}")]
        public async Task<OrganizationViewModel> GetOrganizationById(int id)
        {
            return await _userMap.GetOrganizationById(id);
        }
        [HttpGet("GetAllOrganizations")]
        public async Task<IEnumerable<OrganizationViewModel>> GetAllOrganizations()
        {
            return await _userMap.GetAllOrganizations();
        }
        [HttpPut("UpdateOrganization")]
        public async Task<int> UpdateOrganization([FromBody] OrganizationViewModel organization)
        {
            return await _userMap.UpdateOrganization(organization);
        }
        [HttpDelete("DeleteOrganization/{id}")]
        public async Task<int> DeleteOrganization(int id)
        {
            return await _userMap.DeleteOrganization(id);
        }
        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            if (dto == null)
                return BadRequest("Invalid login request.");

            var user = await _userMap.Login(dto);

            if (user == null)
                return Unauthorized("Invalid email or password.");

            return Ok(user);
        }

        #region Role
        [Authorize(Roles = "Admin,SuperAdmin")]
        [HttpPost("CreateRole")]
        public async Task<IActionResult> CreateRole([FromBody] RoleViewModel role)
        {
            var isCreated = await _userMap.CreateRole(role);
            return Ok(isCreated);
        }

        [HttpGet("GetAllRoles")]
        public async Task<IEnumerable<RoleViewModel>> GetAllRoles()
        {
            return await _userMap.GetAllRoles();
        }

        [HttpPut("UpdateRole")]
        public async Task<IActionResult> UpdateRole([FromBody] RoleViewModel role)
        {
            var isUpdated = await _userMap.UpdateRole(role);
            return Ok(isUpdated);
        }

        [HttpDelete("DeleteRole/{id}")]
        public async Task<IActionResult> DeleteRole(int id)
        {
            var isDeleted = await _userMap.DeleteRole(id);
            return Ok(isDeleted);
        }
    }
}

public enum UserType
{
    User = 1,
    Admin = 2,
    SuperAdmin = 3
}


#endregion


//        #region Category
//        [HttpPost("CreateCategory")]

//        public async Task<IActionResult> CreateCategory([FromBody] Categoryviewmodel category)
//        {
//            var iscreated = await _userMap.CreateCategory(category);
//            return Ok(iscreated);
//        }
//    }
//}



//#endregion


//[Authorize(Roles = "Superadmin")]
//[HttpPost("CreateAdminUser")]
//public async Task<IActionResult> CreateAdmin([FromBody] UserCreateDto dto)
//{
//    return await _userMap.CreateAdminUser(dto); 
//}
//        [HttpPost("Login")]
//        public async Task<IActionResult> Login([FromBody] LoginDto dto)
//        {
//            if (dto == null)
//                return BadRequest("Login data is required.");

//            var user = await _userService.Login(dto.Email, dto.Password);
//            if (user == null)
//                return Unauthorized(new { Message = "Invalid username or password." });

//            // ✅ Map to LoginResponseDto here
//            var response = new LoginResponseDto
//            {
//                Token = user.Token,               // string
//                TokenExpiresAt = user.TokenExpiresAt, // DateTime
//                Name = user.Name,
//                Email = user.Email,
//                Role = user.Role
//            };

//            return Ok(response);
//        }
//        [HttpPost("CreateRole")]
//        public async Task<IActionResult> CreateRole([FromBody] RoleViewModel role)
//        {
//            var id = await _userMap.CreateRole(role);
//            return Ok(new { RoleId = id });
//        }

//        [HttpPut("UpdateRole")]
//        public async Task<IActionResult> UpdateRole([FromBody] RoleViewModel role)
//        {
//            var rows = await _userMap.UpdateRole(role);
//            return Ok(new { Updated = rows });
//        }

//        [HttpDelete("DeleteRole/{id}")]
//        public async Task<IActionResult> DeleteRole(int id)
//        {
//            var rows = await _userMap.DeleteRole(id);
//            return Ok(new { Deleted = rows });
//        }

//    }
//}


//[HttpPut("UpdateOrganization/{id}")]
//public async Task<bool> UpdateOrganization(int id, [FromBody] OrganizationViewModel organization)
//{
//    organization.OrganizationId = id;
//    return await _userMap.UpdateOrganization(organization);
//}

//[HttpDelete("DeleteOrganization/{id}")]
//public async Task<bool> DeleteOrganization(int id)
//{
//    return await _userMap.DeleteOrganization(id);
//}
//    }

#endregion