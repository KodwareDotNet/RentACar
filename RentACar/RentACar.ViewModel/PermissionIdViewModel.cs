using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
namespace Kodware.API.ViewModels
{
    public class PermissionIdViewModel
    {
        [JsonIgnore]
        public long Id { get; set; }
        [JsonIgnore]
        public long RoleId { get; set; }
        public long PermissionId { get; set; }
    }
}