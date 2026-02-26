using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RentACar.ViewModel
{
    public class OrganizationViewModel
    {
        public int Id { get; set; }
        public long? UserId { get; set; }
        public string Name { get; set; }  // Ye add karo
        public string Email { get; set; }
        public string? Phone { get; set; }
        public string?Address { get; set; }
        public string? password { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public List<RoleAndUserIdViewModel>? Roles { get; set; }
        public string? Role { get; set; }
        public int OrganizationId { get; set; }
        public UserType? UserType { get; set; }
    }
}