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
        //public int Id { get; set; }
        public List<AttachmentViewModel> attachments { get; set; } = new List<AttachmentViewModel>();
        public int CarId { get; set; }
        public string CarName { get; set; }
        public string Brand { get; set; }
        public string Model { get; set; }
        public string Year { get; set; }
        public string PricePerHour { get; set; }
        public string Transmission { get; set; }
        public string Fuel { get; set; }
        public int Seats { get; set; }
        public int Doors { get; set; }
        public string Color { get; set; }
        public string NumberPlate { get; set; }
        public string ImageUrl { get; set; }
        public double Mileage { get; set; }
        public string Vin { get; set; }
        public string BodyType { get; set; }
        public double EngineSize { get; set; }
        public string Description { get; set; }
        public string CarData { get; set; }
        public string CarBrand { get; set; }
        public int OrganizationId { get; set; }
    }
}

        //public CarInfo Car { get; set; }


//        public class CarInfo
//        {
//            public int Id { get; set; }
//            public string CarName { get; set; }
//            public string ImageUrl { get; set; }
//            public decimal PricePerDay { get; set; }
//            public string Description { get; set; }
//            public string Transmission { get; set; }
//            public string Fuel { get; set; }
//        }
//    }
//}