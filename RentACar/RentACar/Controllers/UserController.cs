using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RentACar.Helpers;
using RentACar.Interfaces.ServiceInterface;
using RentACar.Map;
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

        //        [HttpPost("CreateUser")]
        //        public async Task<int> Create([FromBody] UserViewModel user)
        //        {
        //            var (hash, salt) = HashPassword(user.Password); // Implement your hash
        //            user.Password = hash;
        //            user.Salt = salt;

        //            return await _userMap.Create(user);
        //        }
        //    }
        //}



        #region Organization
        [HttpPost("CreateOrganization")]
        public async Task<int> CreateOrganization([FromBody] OrganizationViewModel organization)
        {
            return await _userMap.CreateOrganization(organization);
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

        //[Authorize(Roles = "Superadmin")]
        //[HttpPost("CreateAdminUser")]
        //public async Task<IActionResult> CreateAdmin([FromBody] UserCreateDto dto)
        //{
        //    return await _userMap.CreateAdminUser(dto); 
        //}
        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            if (dto == null)
                return BadRequest("Login data is required.");

            var user = await _userService.Login(dto.Email, dto.Password);
            if (user == null)
                return Unauthorized(new { Message = "Invalid username or password." });

            // ✅ Map to LoginResponseDto here
            var response = new LoginResponseDto
            {
                Token = user.Token,               // string
                TokenExpiresAt = user.TokenExpiresAt, // DateTime
                Name = user.Name,
                Email = user.Email,
                Role = user.Role
            };

            return Ok(response);
        }
    }
}

#endregion

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
