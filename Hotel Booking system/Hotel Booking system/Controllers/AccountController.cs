using Microsoft.AspNetCore.Mvc;

namespace Hotel_Booking_system.Controllers
{
    public class AccountController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
