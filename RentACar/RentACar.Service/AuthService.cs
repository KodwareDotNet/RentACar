using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Google.Apis.Auth;
using Microsoft.Extensions.Configuration;
using RentACar.Interfaces.RepoInterfaces;
using RentACar.Interfaces.ServiceInterface;
using RentACar.Models;
using RentACar.Repositories.Services.Interfaces;
using RentACar.ViewModel;

namespace RentACar.Repositories.Services.Interfaces.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepo;
        private readonly ITokenService _tokenService;
        private readonly IPasswordHasher _hasher;
        private readonly IConfiguration _config;

        public AuthService(
            IUserRepository userRepo,
            ITokenService tokenService,
            IPasswordHasher hasher,
            IConfiguration config)
        {
            _userRepo = userRepo ?? throw new ArgumentNullException(nameof(userRepo));
            _tokenService = tokenService ?? throw new ArgumentNullException(nameof(tokenService));
            _hasher = hasher ?? throw new ArgumentNullException(nameof(hasher));
            _config = config ?? throw new ArgumentNullException(nameof(config));
        }
        public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
        {
            if (dto is null) throw new ArgumentNullException(nameof(dto));
            if (string.IsNullOrWhiteSpace(dto.Email)) throw new ArgumentException("Email is required.", nameof(dto.Email));
            if (string.IsNullOrWhiteSpace(dto.Password)) throw new ArgumentException("Password is required.", nameof(dto.Password));

            // 🔹 Get user by email (and not by Google)
            var user = await _userRepo.GetByEmailOrGoogleIdAsync(dto.Email, null)
                        ?? throw new UnauthorizedAccessException("Invalid credentials.");

            // 🔹 Verify password (plain or hashed)
            bool isPasswordValid =
                user.PasswordHash == dto.Password ||
                _hasher.Verify(dto.Password, user.PasswordHash);

            if (!isPasswordValid)
                throw new UnauthorizedAccessException("Invalid credentials.");

            // 🔹 Ensure user role exists
            var role = string.IsNullOrWhiteSpace(user.Role) ? "User" : user.Role;

            // 🔹 Assign category permissions BEFORE generating token
            // ✅ Replace with SQL query later if you want dynamic categories
            user.CategoryPermissions = new List<string>
            {
                
            };

            // 🔹 Generate token and refresh token
            var token = _tokenService.CreateToken(user, out var expiresAt);
            var refreshToken = _tokenService.GenerateRefreshToken();

            await _userRepo.SaveRefreshTokenAsync(user.Id, refreshToken, expiresAt.AddDays(7));

            return new AuthResponseDto
            {
                Token = token,
                RefreshToken = refreshToken,
                ExpiresAt = expiresAt,
                Role = role
            };

        }

        public async Task<AuthResponseDto> SignInWithGoogleAsync(GoogleAuthDto dto)
        {
            if (dto is null) throw new ArgumentNullException(nameof(dto));
            if (string.IsNullOrWhiteSpace(dto.IdToken))
                throw new ArgumentException("Google ID token is required.", nameof(dto.IdToken));

            var payload = await GoogleJsonWebSignature.ValidateAsync(dto.IdToken, new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = new[] { _config["Google:ClientId"] ?? throw new InvalidOperationException("Google ClientId missing.") }
            });

            var email = payload.Email ?? throw new InvalidOperationException("Google email not found.");
            var googleId = payload.Subject ?? throw new InvalidOperationException("Google Id not found.");
            var name = payload.Name ?? email;

            var existing = await _userRepo.GetByEmailOrGoogleIdAsync(email, googleId);

            User user = existing ?? new User
            {
                Name = name,
                Email = email,
                Role = "User",
                GoogleId = googleId
            };

            if (existing is null)
            {
                var id = await _userRepo.CreateAsync(user);
                user.Id = id;
            }

            // 🔹 Assign category permissions BEFORE generating token
            user.CategoryPermissions = new List<string>
            {
                "Entertainment",
                "Sports",
                "Business",
                "Technology",
                "Health",
                "Politics"
            };

            var token = _tokenService.CreateToken(user, out var expiresAt);
            var refreshToken = _tokenService.GenerateRefreshToken();

            await _userRepo.SaveRefreshTokenAsync(user.Id, refreshToken, expiresAt.AddDays(7));

            return new AuthResponseDto
            {
                Token = token,
                RefreshToken = refreshToken,
                ExpiresAt = expiresAt,
                Role = user.Role
            };
        }
        public async Task<AuthResponseDto> RefreshTokenAsync(RefreshTokenRequestDto dto)
        {
            if (dto is null || string.IsNullOrWhiteSpace(dto.RefreshToken))
                throw new ArgumentException("Refresh token is required.", nameof(dto.RefreshToken));

            var user = await _userRepo.GetUserByRefreshTokenAsync(dto.RefreshToken)
                        ?? throw new UnauthorizedAccessException("Invalid refresh token.");

            // 🔹 Assign category permissions if needed
            user.CategoryPermissions = new List<string>
            {
                "Entertainment",
                "Sports",
                "Business",
                "Technology",
                "Health",
                "Politics"
            };

            var newToken = _tokenService.CreateToken(user, out var expiresAt);

            return new AuthResponseDto
            {
                Token = newToken,
                RefreshToken = dto.RefreshToken,
                ExpiresAt = expiresAt,
                Role = user.Role
            };
        }

        // ✅ LOGOUT
        public async Task LogoutAsync(int userId)
        {
            await _userRepo.DeleteRefreshTokenAsync(userId);
        }
    }
}
