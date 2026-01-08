//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;

//namespace RentACar.ViewModel
//{
//    public class CarMileageHistoryDto
//    {
//        public int Id { get; set; }

//        public int CarId { get; set; }
//        public int BookingId { get; set; }
//        public int ReceiveId { get; set; }

//        public string? CarName { get; set; }
//        public string? CarBrand { get; set; }
//        public string? Color { get; set; }
//        public string? NumberPlate { get; set; }

//        public decimal? PickupMileage { get; set; }
//        public decimal? ReturnMileage { get; set; }
//        public decimal? TotalMileageCovered { get; set; }


//        public DateTime CreatedAt { get; set; }
//    }
//    public class InsertCarMileageHistoryRequest
//    {
//        public int ReceiveId { get; set; }
//    }

//    public class ApiResponse<T>
//    {
//        public bool Success { get; set; }
//        public string Message { get; set; }
//        public T Data { get; set; }
//    }


//}
