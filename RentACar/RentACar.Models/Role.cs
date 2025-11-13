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

//    public class Category
//    {
//        public string categoryname { get; set; }
//        public int categoryId { get; set; }
//        public string description { get; set; }
//        public int Createdat { get; set; }
//        public int Updatedat { get; set; }
//        public bool isActive { get; set; }
//    }

//}

