using System;
using System.Globalization;
using System.Security.Claims;
using System.Threading;
using System.Web;
using System.Diagnostics;
using System.Configuration;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Authorization;

namespace RentACar.Controllers
{
    public abstract class TsmController : ControllerBase
    {
        protected const int SaltSize = 16; // 128 bit
        protected const int Iterations = 10000; // Number of PBKDF2 iterations
   
        public static (string Hash, string Salt) HashPassword(string password)
        {
            try
            {
                using (var rng = new RNGCryptoServiceProvider())
                {
                    byte[] salt = new byte[SaltSize];
                    rng.GetBytes(salt);
                    using (var pbkdf2 = new Rfc2898DeriveBytes(password, salt, Iterations))
                    {
                        byte[] hash = pbkdf2.GetBytes(32); // 32 bytes is a good hash size
                        return (Convert.ToBase64String(hash), Convert.ToBase64String(salt));
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error occurred in HashPassword: {ex.Message}");
                return (null, null);
            }
        }
    }
}
