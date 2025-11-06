using System;
using System.Security.Claims;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;

namespace RentACar.Helpers
{
    public static class PasswordHelper
    {
        /// <summary>
        /// Hash a password and generate a salt
        /// </summary>
        /// <param name="password">Plain text password</param>
        /// <returns>Tuple (hash, salt)</returns>
        public static (string Hash, string Salt) HashPassword(string password)
        {
            // Generate a 128-bit salt using a secure PRNG
            byte[] saltBytes = new byte[16];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(saltBytes);
            }

            string salt = Convert.ToBase64String(saltBytes);

            // Hash the password using PBKDF2
            string hash = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: password,
                salt: saltBytes,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 10000,
                numBytesRequested: 32));

            return (hash, salt);
        }

        public static int GetOrganizationId(this ClaimsPrincipal user)
        {
            var claim = user.FindFirst("OrganizationId")?.Value;
            return int.TryParse(claim, out var id) ? id : 0;
        }

        /// <summary>
        /// Verify a password against its hash and salt
        /// </summary>
        public static bool VerifyPassword(string password, string storedHash, string storedSalt)
        {
            byte[] saltBytes = Convert.FromBase64String(storedSalt);

            string hash = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: password,
                salt: saltBytes,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 10000,
                numBytesRequested: 32));

            return hash == storedHash;
        }
    }
}
