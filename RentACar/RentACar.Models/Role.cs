using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RentACar.Models
{
    public class Role
    {
        public int RoleId { get; set; }
        public string RoleName { get; set; } = string.Empty;
        public int OrganizationId { get; set; }
        public string? OrganizationName { get; set; } // for join result
        public DateTime CreatedDate { get; set; }
    }
    }


