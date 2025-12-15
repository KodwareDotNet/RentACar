using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace RentACar.ViewModel
{
    public class PermissionsViewModel
    {
        public long Id { get; set; }
        public string? DisplayName { get; set; }
        public string? Value { get; set; }
        public string? Group { get; set; }
    }
}