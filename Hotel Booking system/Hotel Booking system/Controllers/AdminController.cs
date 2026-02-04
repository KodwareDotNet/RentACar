using Microsoft.AspNetCore.Mvc;

namespace Hotel_Booking_system.Controllers
{
    public class AdminController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
