using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
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

//    public class Categoryviewmodel
//    {
//        public string categoryname { get; set; }
//        public int categoryId { get; set; }
//        public string Description { get; set; }
//        public int Createdat { get; set; }
//        public int Updatedat { get; set; }
//        public bool isactive { get; set; }
//    }
//}


