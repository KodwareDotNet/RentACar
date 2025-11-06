using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using RentACar.ViewModel;

namespace RentACar.Models
{
    public class Car
    {
        public long Id { get; set; }
        public List<AttachmentViewModel> attachments { get; set; } = new List<AttachmentViewModel>();


    }
}
