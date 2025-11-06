using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RentACar.Models
{
    public class Attachment
    {
        public long? Id { get; set; }
        public string? Path { get; set; }
        public string? Name { get; set; }
        public long? NewsId { get; set; }
    }
}
