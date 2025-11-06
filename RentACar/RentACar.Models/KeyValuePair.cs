using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RentACar.Models
{
    public class KeyValuePair
    {
        public string? Key { get; set; }
        public string? Value { get; set; }
        public string OtherValue { get; set; }
    }
    public enum KeyValuePairType : Int16
    {
        None = 0,
        Categories = 1,
    }
}
