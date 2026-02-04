using Microsoft.AspNetCore.Mvc;

namespace Hotel_Booking_system.Controllers
{
    public class BookingController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
