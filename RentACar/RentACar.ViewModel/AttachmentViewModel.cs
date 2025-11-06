using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RentACar.ViewModel
{
    public class AttachmentViewModel
    {
        public long? Id { get; set; }
        public string? Path { get; set; }
        public string? Name { get; set; }
        public long? carId { get; set; }
        public AttachmentType? AttachmentType { get; set; }

    }
    public enum AttachmentType
    {
        Image = 1,
        Video = 2,
        Document = 3,
        Audio = 4,
        Other = 5
    }
}
