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
        string CreateToken(User user, out DateTime expiresAt);
        string GenerateRefreshToken();
    }
}
