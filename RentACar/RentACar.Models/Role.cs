using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Kodware.API.ViewModels;

namespace RentACar.Models
{
    public class Role
    {
        public int RoleId { get; set; }
        public string RoleName { get; set; } = string.Empty;
        public long OrganizationId { get; set; }
        public string? OrganizationName { get; set; } // for join result
        public DateTime CreatedDate { get; set; }
        public List<PermissionIdViewModel>? SelectedPermissions { get; set; }
        public List<PermissionIdViewModel> Permission { get; set; }
    }
    }


