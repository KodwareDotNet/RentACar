using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RentACar.ViewModel
{
    public class CarCreateViewModel
    {
        public long? Id { get; set; }

        public string CarName { get; set; }
        public string Brand { get; set; }
        public string Model { get; set; }

        public int? Year { get; set; }
        public string PricePerHour { get; set; }

        public int? Mileage { get; set; }
        public int? MileageDueMaintenance { get; set; }

        public string Transmission { get; set; }
        public string Fuel { get; set; }

        public int? Seats { get; set; }
        public int? Doors { get; set; }

        public string Color { get; set; }
        public string NumberPlate { get; set; }

        public string EngineSize { get; set; }
        public string BodyType { get; set; }
        public string Vin { get; set; }

        public string Description { get; set; }
        public string ImageUrl { get; set; }

        public int OrganizationId { get; set; }

        public List<AttachmentViewModel> Attachments { get; set; } = new();
    }
}
