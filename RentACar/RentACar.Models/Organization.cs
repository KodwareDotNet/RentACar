using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using RentACar.ViewModel;

namespace RentACar.Models
{
    public class Organization
    {
        public int Id { get; set; }
        public string OrganizationName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public string?  password { get; set; }
        public DateTime CreatedDate { get; set; }
        public string Name { get; set; }
        public int OrganizationId { get; set; }
        public UserType? UserType { get; set; }
    }
}
