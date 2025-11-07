using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RentACar.ViewModel
{
    public class LoginResponseDto
    {
        public string Token { get; set; } = "";             // JWT token is string
        public DateTime TokenExpiresAt { get; set; }
        public string Name { get; set; } = "";
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
    }
}
