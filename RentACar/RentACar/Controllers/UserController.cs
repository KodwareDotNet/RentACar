using System.Collections.Generic;
using System.Data.SqlTypes;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RentACar.Helpers;
using RentACar.Interfaces.ServiceInterface;
using RentACar.Logging;
using RentACar.Map;
using RentACar.Models;
using RentACar.Services;
using RentACar.ViewModel;
using static System.Net.Mime.MediaTypeNames;

namespace RentACar.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : TsmController
    {
        private readonly IUserMap _userMap;
        private readonly IUserService _userService;
        ILoggerService loggerService;
        public object Images { get; private set; }
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
                Password = dto.Password,
                OrganizationId = dto.OrganizationId,
                UserType = UserType.User,
                Email = dto.Email,
            };

            var user = await _userService.CreateUser(userModel);
            return Ok(user);
        }

        #region Organization
        [HttpPost("CreateOrganization")]
        public async Task<IActionResult> CreateOrganization([FromBody] OrganizationViewModel organization)
        {
            organization.UserType = UserType.Admin;
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


        [HttpPost("CreateRole")]
        public async Task<OkObjectResult> Create([FromBody] RoleViewModel role)
        {

            LogControllerInfo("CreateRole params: UserName >>> {@UserName}, role >>> {@role}", GetCurrentUserName(), role);
            long userId = GetCurrentUserId();

            DBErrorResponse dbResponse = await _userMap.CreateRole(role);
            if (role != null)
            {
                if (dbResponse.RequestStatus == DBErrorResponseMessage.Success)
                {
                    return Ok(new { Response = true });
                }
                else if (dbResponse.RequestStatus == DBErrorResponseMessage.Duplicate)
                {
                    return Ok(new { Response = false, ErrorMessage = string.Format(CannotCreateAlreadyInUseMessage, "role") });
                }
            }
            return Ok(new { response = false, ErrorMessage = string.Format(SomethingWrongHappenedMessage, "role") });
        }

        [HttpGet("GetAllRoles")]
        public async Task<IEnumerable<RoleViewModel>> GetAllRoles(string? searchString, int pageNumber, long? pageSize = null)
        {
            LogControllerInfo(
            "GetAllRoles params: UserName >>> {@UserName},searchString >>> {@searchString}, pageNumber >>> {@pageNumber}, pageSize >>> {@pageSize}",
            GetCurrentUserName() ?? string.Empty,
            searchString ?? string.Empty,
            pageNumber,
            pageSize ?? 0
              );
            long? userId = GetCurrentUserId();
            long? organizationId = GetCurrentUserOrganizationId();
            var result = await _userMap.GetAllRoles(searchString, pageNumber, userId, organizationId, pageSize);
            return result;
            return new List<RoleViewModel>();
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
        [HttpGet("GetRolesByOrganization")]
        public async Task<IEnumerable<RoleViewModel>> GetRolesByOrganization()

        {
            var orgIdClaim = User.Claims.FirstOrDefault(c => c.Type == "OrganizationId")?.Value;


            if (string.IsNullOrEmpty(orgIdClaim))
                throw new Exception("OrganizationId not found in token.");

            int orgId = int.Parse(orgIdClaim);

            return await _userMap.GetRolesByOrganization(orgId);
        }

        [HttpGet("GetAllPermissions")]
        public async Task<List<PermissionsViewModel>> GetAllPermissions()
        {
            try
            {
                long? userId = GetCurrentUserId();
                long? organizationId = GetCurrentUserOrganizationId();
                UserType userType = UserType.SuperAdmin;
                return await _userMap.GetAllPermissions(userId, organizationId, userType);
            }
            catch (Exception ex)
            {
                loggerService.LogError(ex, "Error in GetAllPermissions");
            }
            return new List<PermissionsViewModel>();
        }
[HttpPost("AddCar")]
public async Task<IActionResult> AddCar([FromForm] CarCreateDto dto)
{
    string imagePath = dto.ImageUrl;

    if (dto.Image != null && dto.Image.Length > 0)
    {
        var rootPath = @"C:\\Users\\kodwa\\source\\repos\\Rent-a-car\\RentACarAPi\\RentACar\\RentACar\\bin\\Debug\\net8.0\\UploadedFiles";

        // Create folder if not exists
        if (!Directory.Exists(rootPath))
            Directory.CreateDirectory(rootPath);

        var fileName = Guid.NewGuid() + Path.GetExtension(dto.Image.FileName);
        var fullPath = Path.Combine(rootPath, fileName);

        using (var stream = new FileStream(fullPath, FileMode.Create))
        {
            await dto.Image.CopyToAsync(stream);
        }

        // Save relative or physical path
        imagePath = Path.Combine($"/Images/{fileName}");
    }

    var car = new Car
    {
        Id = dto.Id ?? 0,
        CarName = dto.CarName,
        Brand = dto.Brand,
        Model = dto.Model,
        Year = dto.Year,
        PricePerDay = dto.PricePerDay,
        Transmission = dto.Transmission,
        Fuel = dto.Fuel,
        Seats = dto.Seats,
        Doors = dto.Doors,
        Color = dto.Color,
        NumberPlate = dto.NumberPlate,
        Mileage = dto.Mileage,
        Vin = dto.Vin,
        BodyType = dto.BodyType,
        EngineSize = dto.EngineSize,
        Description = dto.Description,
        ImageUrl = imagePath ?? dto.ImageUrl,  // only relative path stored
        OrganizationId = dto.OrganizationId
    };

    var result = await _userMap.AddCar(car);
    return Ok(result);
}

[HttpGet("GetCars")]
public async Task<IActionResult> GetCars(int orgId)
{
    var result = await _userMap.GetCars(orgId);
    return Ok(result);
}
[HttpDelete("DeleteCar")]
public async Task<IActionResult> DeleteCar(int id)
{
    var result = await _userMap.DeleteCar(id);
    return Ok(result);
}
    }
}
//        [HttpPost("BookCar")]
//        public async Task<IActionResult> BookCar([FromForm] BookCarDto dto)
//        {
//            string carImagePath = dto.CarImageUrl;

//            // Upload Car Image
//            if (dto.CarImage != null && dto.CarImage.Length > 0)
//            {
//                var rootPath = @"C:\Users\kodwa\source\repos\Rent-a-car\RentACarAPi\RentACar\RentACar\bin\Debug\net8.0\UploadedFiles\Bookings";

//                // Create folder if not exists
//                if (!Directory.Exists(rootPath))
//                    Directory.CreateDirectory(rootPath);

//                var fileName = Guid.NewGuid() + Path.GetExtension(dto.CarImage.FileName);
//                var fullPath = Path.Combine(rootPath, fileName);

//                using (var stream = new FileStream(fullPath, FileMode.Create))
//                {
//                    await dto.CarImage.CopyToAsync(stream);
//                }

//                carImagePath = Path.Combine($"/Images/Bookings/{fileName}");
//            }

//            var booking = new CarBooking
//            {
//                FullName = dto.FullName,
//                FatherName = dto.FatherName,
//                CNIC = dto.CNIC,
//                LicenseNumber = dto.LicenseNumber,
//                Phone = dto.Phone,
//                Age = dto.Age,
//                Address = dto.Address,
//                City = dto.City,
//                PickupDate = dto.PickupDate,
//                DropoffDate = dto.DropoffDate,
//                CarId = dto.CarId,
//                OrganizationId = dto.OrganizationId,
//                CarImageUrl = carImagePath
//            };

//            var result = await _userMap.BookCar(booking);

//            if (result)
//                return Ok(new { success = true, message = "Car booked successfully" });
//            else
//                return BadRequest(new { success = false, message = "Booking failed" });
//        }
//        [HttpGet("GetAllBookings")]
//        public async Task<IActionResult> GetAllBookings()
//        {
//            var result = await _userMap.GetAllBookings();
//            return Ok(result);
//        }
//        [HttpDelete("CancelBooking/{id}")]
//        public async Task<IActionResult> CancelBooking(int id)
//        {
//            var result = await _userMap.CancelBooking(id);

//            if (result == 1)
//                return Ok(new { success = true, message = "Booking cancelled successfully" });
//            else if (result == -2)
//                return BadRequest(new { success = false, message = "Booking is already cancelled" });
//            else if (result == 0)
//                return NotFound(new { success = false, message = "Booking not found" });
//            else
//                return StatusCode(500, new { success = false, message = "Error cancelling booking" });
//        }
//    }
//}


#endregion
