using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using RentACar.Helpers;
using RentACar.Map;
using RentACar.ViewModel;

namespace RentACar.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserMap _userMap;

        public UserController(IUserMap userMap)
        {
            _userMap = userMap;
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


        [HttpPost("CreateUser")]
        public async Task<int> Create([FromBody] UserViewModel user)
        {
            var (hash, salt) = PasswordHelper.HashPassword(user.Password);
            user.Password = hash;
            user.Salt = salt;

            return await _userMap.Create(user);
        }



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

