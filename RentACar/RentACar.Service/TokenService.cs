//using System;
//using System.Collections.Generic;
//using System.IdentityModel.Tokens.Jwt;
//using System.Linq;
//using System.Security.Claims;
//using System.Security.Cryptography;
//using System.Text;
//using System.Text.Json;
//using System.Threading.Tasks;
//using Microsoft.Extensions.Configuration;
//using Microsoft.IdentityModel.Tokens;
//using RentACar.Interfaces.ServiceInterface;
//using RentACar.Models;

//namespace RentACar.Service
//{
//    public class TokenService : ITokenService
//    {
//        private readonly IConfiguration _config;

//        public TokenService(IConfiguration config)
//        {
//            _config = config ?? throw new ArgumentNullException(nameof(config));
//        }

//        /// <summary>
//        /// Creates a signed JWT access token for the given user.
//        /// </summary>
//        public string CreateToken(User user, out DateTime expiresAt)
//        {
//            if (user == null) throw new ArgumentNullException(nameof(user));

//            var key = _config["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key is missing in configuration.");
//            var issuer = _config["Jwt:Issuer"] ?? string.Empty;
//            var audience = _config["Jwt:Audience"] ?? string.Empty;
//            var expireMinutes = int.TryParse(_config["Jwt:ExpireMinutes"], out int minutes) ? minutes : 30;

//            // ✅ Fixed claims: Use custom "Permission" instead of ClaimTypes.Permission
//            var claims = new List<Claim>
//{
//                 new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
//                 new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
//                 new Claim(ClaimTypes.Name, user.Name ?? string.Empty),
//                 new Claim(ClaimTypes.Email, user.Email ?? string.Empty),
//                 new Claim(ClaimTypes.Role, user.Role ?? string.Empty),
//                 new Claim("Permission", user.Permission ?? "CanBeLogin"),
//                 new Claim("CategoryPermissions", JsonSerializer.Serialize(user.CategoryPermissions ?? new List<string>()))

//};

//            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
//            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

//            expiresAt = DateTime.UtcNow.AddMinutes(expireMinutes);

//            var token = new JwtSecurityToken(
//                issuer: issuer,
//                audience: audience,
//                claims: claims,
//                expires: expiresAt,
//                signingCredentials: credentials
//            );

//            return new JwtSecurityTokenHandler().WriteToken(token);
//        }


//        /// <summary>
//        /// Generates a secure, random refresh token.
//        /// </summary>
//        public string GenerateRefreshToken()
//        {
//            var randomBytes = new byte[32];
//            using var rng = RandomNumberGenerator.Create();
//            rng.GetBytes(randomBytes);

//            return Convert.ToBase64String(randomBytes);
//        }
//    }
//}

using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using RentACar.Interfaces.ServiceInterface;
using RentACar.Models;

namespace RentACar.Service
{
    public class TokenService : ITokenService
    {
        private readonly IConfiguration _config;

        public TokenService(IConfiguration config)
        {
            _config = config ?? throw new ArgumentNullException(nameof(config));

        }

        /// <summary>
        /// Creates a signed JWT access token for the given user.
        /// </summary>
        public string CreateToken(User user, out DateTime expiresAt)
        {
            if (user == null) throw new ArgumentNullException(nameof(user));

            var key = _config["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key is missing in configuration.");
            var issuer = _config["Jwt:Issuer"] ?? string.Empty;
            var audience = _config["Jwt:Audience"] ?? string.Empty;
            var expireMinutes = int.TryParse(_config["Jwt:ExpireMinutes"], out int minutes) ? minutes : 30;

            // ✅ Fixed claims: Use custom "Permission" instead of ClaimTypes.Permission
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Name ?? string.Empty),
                new Claim(ClaimTypes.Email, user.Email ?? string.Empty),
                new Claim(ClaimTypes.Role, user.Role ?? string.Empty),
                new Claim("OrganizationId", user.OrganizationId.ToString()), // ✅ ADDED THIS LINE
                new Claim("Permission", user.Permission ?? "CanBeLogin"),
                new Claim("UserType", ((int)user.UserType).ToString()),
                new Claim("CategoryPermissions", JsonSerializer.Serialize(user.CategoryPermissions ?? new List<string>()))
            };

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            expiresAt = DateTime.UtcNow.AddMinutes(expireMinutes);

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: expiresAt,
                signingCredentials: credentials
            );


            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        //public string GenerateToken(User user, out DateTime expiresAt)
        //{
        //    if (user == null) throw new ArgumentNullException(nameof(user));

        //    var key = _config["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key missing");
        //    var issuer = _config["Jwt:Issuer"] ?? "";
        //    var audience = _config["Jwt:Audience"] ?? "";
        //    var expireMinutes = int.TryParse(_config["Jwt:ExpireMinutes"], out int minutes) ? minutes : 30;

        //    var claims = new List<Claim>
        //{
        //    new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
        //    new Claim(ClaimTypes.Name, user.Name ?? ""),
        //    new Claim(ClaimTypes.Email, user.Email ?? ""),
        //    new Claim(ClaimTypes.Role, user.Role ?? "")
        //};

        //    var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
        //    var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        //    expiresAt = DateTime.UtcNow.AddMinutes(expireMinutes);

        //    var token = new JwtSecurityToken(
        //        issuer: issuer,
        //        audience: audience,
        //        claims: claims,
        //        expires: expiresAt,
        //        signingCredentials: credentials
        //    );

        //    return new JwtSecurityTokenHandler().WriteToken(token);
        //}

        public string GenerateRefreshToken()
        {
            var randomBytes = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomBytes);
            return Convert.ToBase64String(randomBytes);
        }
    }
}
