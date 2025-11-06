using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RentACar.Models;
using RentACar.Repositories.Services.Interfaces;
using RentACar.ViewModel;
using Microsoft.AspNetCore.Mvc;
using RentACar.Interfaces.ServiceInterface;

namespace RentACar.Controllers

{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var result = await _authService.LoginAsync(dto);
            return Ok(result);
        }
        [Authorize(Roles = "Admin")]
        [HttpPost("create")]
        public IActionResult CreateUsers([FromBody] NewsDto dto)
        {
            return Ok(new { Message = $"News '{dto.Title}' created successfully by Admin." });
        }

        // ✅ Both Admin & User can view
        [Authorize(Roles = "Admin,User")]
        [HttpGet("view")]
        public IActionResult GetAllUsers()
        {
            var news = new[]
            {
                new { Id = 1, Title = "Breaking News 1", Content = "Sample content 1" },
                new { Id = 2, Title = "Breaking News 2", Content = "Sample content 2" }
            };

            return Ok(news);
        }

        // ✅ Google Sign-in
        [HttpPost("google-signin")]
        public async Task<IActionResult> GoogleSignIn([FromBody] GoogleAuthDto dto)
        {
            var result = await _authService.SignInWithGoogleAsync(dto);
            return Ok(result);
        }

        // ✅ Refresh Token
        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequestDto dto)
        {
            var result = await _authService.RefreshTokenAsync(dto);
            return Ok(result); 
        }

        // ✅ Logout
        [HttpPost("logout/{userId}")]
        public async Task<IActionResult> Logout(int userId)
        {
            await _authService.LogoutAsync(userId);
            return Ok(new { Message = "Logged out successfully." });
        }
    }
}