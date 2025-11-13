using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using RentACar.Models;

namespace RentACar.Interfaces.ServiceInterface
{
    public interface ITokenService
    {
        /// <summary>
        /// Generates a JWT access token for the given user.
        /// </summary>
        //string CreateToken(User user, out DateTime expiresAt);
        string CreateToken(User user, out DateTime expiresAt);
        //string GenerateToken(User user, out DateTime expiresAt);

        /// <summary>
        /// Generates a secure random refresh token.
        /// </summary>
        string GenerateRefreshToken();
    }
}
