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
        public string Name { get; set; }  // Ye add karo
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public string Role { get; set; }
        public int OrganizationId { get; set; }
    }
}