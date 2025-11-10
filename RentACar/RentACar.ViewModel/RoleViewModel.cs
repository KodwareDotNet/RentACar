using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RentACar.ViewModel
{
    public class RoleViewModel
    {
        public int RoleId { get; set; }
        public string RoleName { get; set; } = string.Empty;
        public int OrganizationId { get; set; }
        public string? OrganizationName { get; set; } // for GetAll join
    }
    }
