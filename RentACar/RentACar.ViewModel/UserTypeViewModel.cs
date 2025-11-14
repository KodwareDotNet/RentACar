using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RentACar.ViewModel
{
    public class UserTypeViewModel
    {
            public UserType UserType { get; set; }
        }
        public enum UserType : Int16
        {
            None = 0,
            SuperAdmin = 1,
            Admin = 2,
            User = 3,
        }
    }

    