using System;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RentACar.ViewModel
{
    public class CarCreateDto
    {
        public string CarName { get; set; }
        public string Model { get; set; }
        public int? Id { get; set; }
        public string NumberPlate { get; set; }
        public int OrganizationId { get; set; }
        public string Brand { get; set; }
        public string Year { get; set; }
        public string PricePerHour { get; set; }

        public string Color { get; set; }
        public string? ImageUrl { get; set; }
        public IFormFile? Image { get; set; } // 👈 NEW
        public string BodyType { get; set; }
        
        //public string LicensePlate { get; set; }

        public int Doors { get; set; }
        public string Description { get; set; }
        public double EngineSize { get; set; }
        public string Vin { get; set; }
        public double Mileage { get; set; }
        public int Seats { get; set; }
        public string Fuel { get; set; }
        public string Transmission { get; set; }
        public int? MileageDueMaintenance { get; set; }
    }

}

