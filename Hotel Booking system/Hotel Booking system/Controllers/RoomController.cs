using Hotel_Booking_system.Data;
using Microsoft.AspNetCore.Mvc;

namespace Hotel_Booking_system.Controllers
{
    //public class RoomController : Controller
    //{
    //    //private readonly ApplicationDbContext _context;

    //    //public RoomController(ApplicationDbContext context)
    //    //{
    //    //    _context = context;
    //    //}

    //    // ✅ CALL #1: Get All Rooms
    //    public IActionResult Index()
    //    {
    //        var rooms = _context.Rooms
    //                            .Include(r => r.RoomType)
    //                            .ToList();

    //        return View(rooms);
    //    }
    //}
    };
//public IActionResult Details(int id)
//{
//    var room = _context.Rooms
//                       .Include(r => r.RoomType)
//                       .FirstOrDefault(r => r.Id == id);

//    if (room == null)
//        return NotFound();

//    return View(room);
//}

//// ✅ POST: /Room/Book/5
//[HttpPost]
//public IActionResult Book(int roomId, DateTime checkIn, DateTime checkOut)
//{
//    if (checkIn >= checkOut)
//    {
//        TempData["Error"] = "Check-out date must be after Check-in date!";
//        return RedirectToAction("Details", new { id = roomId });
//    }

//    // Check availability
//    var bookings = _context.Bookings
//                           .Where(b => b.RoomId == roomId &&
//                                       ((checkIn >= b.CheckIn && checkIn < b.CheckOut) ||
//                                        (checkOut > b.CheckIn && checkOut <= b.CheckOut)))
//                           .ToList();

//    if (bookings.Any())
//    {
//        TempData["Error"] = "Room is not available for selected dates!";
//        return RedirectToAction("Details", new { id = roomId });
//    }

//    // Add booking
//    var booking = new Booking
//    {
//        RoomId = roomId,
//        UserId = 1, // TODO: Replace with logged-in user id
//        CheckIn = checkIn,
//        CheckOut = checkOut,
//        BookingDate = DateTime.Now
//    };

//    _context.Bookings.Add(booking);
//    _context.SaveChanges();

//    TempData["Success"] = "Room booked successfully!";
//    return RedirectToAction("Index");
//}
//}