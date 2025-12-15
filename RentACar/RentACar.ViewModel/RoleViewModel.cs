using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;
using Kodware.API.ViewModels;

namespace RentACar.ViewModel
{
    public class RoleViewModel
    {
        public int RoleId { get; set; }
        public string RoleName { get; set; } = string.Empty;
        public long OrganizationId { get; set; }
        public string? OrganizationName { get; set; } // for GetAll join
        public List<PermissionIdViewModel>? SelectedPermissions { get; set; }
    }
}




