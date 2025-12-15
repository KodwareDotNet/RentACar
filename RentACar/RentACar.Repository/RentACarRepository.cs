using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using MenuManagement.Repositories;
using RentACar.Interfaces.RepoInterfaces;
using RentACar.Models;
using RentACar.ViewModel;

namespace RentACar.Repository
{
    public class RentACarRepository : BaseRepository, IRentACarRepository
    {
        private new readonly IDbConnection _connection;
        public RentACarRepository(IDbConnection connection) : base(connection)
        {

            _connection = connection;

        }

        public Task<long> Create(Car cars)
        {
            throw new NotImplementedException();
        }

        public async Task<long> Createcars(Car cars)
        {
            var parameters = new
            {

                pId = cars.Id,
               

            };
            DynamicParameters para = new DynamicParameters(parameters);
            para.Add("@pReturnId", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await ExecuteAsync("sp_CreateNews", para, CommandType.StoredProcedure);
            var NewsId = para.Get<int>("@pReturnId");
            return NewsId;
        }

        public async Task<bool> DeleteNews(long id)
        {

            var parameters = new
            {
                pId = id
            };
            DynamicParameters para = new DynamicParameters(parameters);
            para.Add("@pReturnId", dbType: DbType.Int32, direction: ParameterDirection.Output);
            await ExecuteAsync("uspDeleteNews", para, CommandType.StoredProcedure);
            var NewsId = para.Get<int>("@pReturnId");
            if (NewsId > 0)
            {
                return true;
            }
            return false;
        }

        public async Task<IEnumerable<Models.KeyValuePair>> GetAllKeyValuePair(KeyValuePairType keyValuePair, long? id)
        {
            var parameters = new
            {
                pKeyValueType = keyValuePair,
                pId = id,
            };
            var result = await QueryAsync<Models.KeyValuePair>("uspGetKeyValuePairs", parameters);
            return result;
        }

        public async Task<IEnumerable<Car>> GetAllNews()
        {
            var parameters = new
            {
            };
            (IEnumerable<Car> postedNews, IEnumerable<AttachmentViewModel> attachments) =
                await QueryMultipleAsync<Car, AttachmentViewModel>("sp_GetAllNews", parameters);

            foreach (Car car in postedNews)
            {
                //Associate attachments with each board if available
                car.attachments = attachments.Any()
                    ? attachments.Where(a => a.Id == car.Id).ToList()
                    : new List<AttachmentViewModel>();
            }
            return postedNews;
            //var term = await QueryAsync<News>("sp_GetAllNews", parameters);   
            //return term;
        }

        public Task<IEnumerable<Car>> GetcarsByIdAsync(long? id)
        {
            throw new NotImplementedException();
        }

        public async Task<bool> DeleteCar(long id)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@pId", id);
            parameters.Add("@pReturnId", dbType: DbType.Int32, direction: ParameterDirection.Output);

            await ExecuteAsync("sp_DeleteCar", parameters, CommandType.StoredProcedure);

            var returnId = parameters.Get<int>("@pReturnId");
            return returnId > 0;
        }
      public async Task<bool> BookCar(CarBooking booking)
        {
            var parameters = new
            {
                booking.FullName,
                booking.FatherName,
                booking.CNIC,
                booking.LicenseNumber,
                booking.Phone,
                booking.Age,
                booking.Address,
                booking.City,
                booking.PickupDate,
                booking.DropoffDate,
                booking.CarId,
                booking.OrganizationId,
                booking.CarImageUrl
            };

            var result = await _connection.ExecuteScalarAsync<int>(
                "sp_BookCar",
                parameters,
                commandType: CommandType.StoredProcedure
            );

            return result > 0;
        }
        // Interface

        // Implementation
        public async Task<List<PersonWithCarDto>> GetAllBookings()
        {
            var result = await _connection.QueryAsync<BookCarDto>(
                "sp_GetAllBookings",
                commandType: CommandType.StoredProcedure
            );

            if (result == null || !result.Any())
            {
                return new List<PersonWithCarDto>();
            }

            // Direct mapping - jo SQL se aaya wahi use karo
            var personData = result.Select(b => new PersonWithCarDto
            {
                BookingId = b.Id,
                OrganizationId = b.OrganizationId,

                // Person Info
                FullName = b.FullName,
                FatherName = b.FatherName,
                CNIC = b.CNIC,
                LicenseNumber = b.LicenseNumber,
                Phone = b.Phone,
                Age = b.Age,
                Address = b.Address,
                City = b.City,
                PickupDate = b.PickupDate,
                DropoffDate = b.DropoffDate,

                // Car Info - Direct SQL se jo aaya
                Car = new CarInfoDto
                {
                    CarId = b.CarId,
                    CarName = b.CarName,           
                    Model = b.Model,               
                    PricePerDay = b.PricePerDay,   
                    Transmission = b.Transmission, 
                    Fuel = b.Fuel,                 // No
                    Description = b.Description,   // No default
                    ImageUrl = string.IsNullOrEmpty(b.ImageUrl) ? b.CarImageUrl : b.ImageUrl
                }
            }).ToList();

            return personData;
        }
        public async Task<bool> UpdateBooking(UpdateBookingDto booking)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@Id", booking.Id);
            parameters.Add("@CarId", booking.CarId);
            parameters.Add("@OrganizationId", booking.OrganizationId);
            parameters.Add("@FullName", booking.FullName);
            parameters.Add("@FatherName", booking.FatherName);
            parameters.Add("@CNIC", booking.CNIC);
            parameters.Add("@LicenseNumber", booking.LicenseNumber);
            parameters.Add("@Phone", booking.Phone);
            parameters.Add("@Age", booking.Age);
            parameters.Add("@Address", booking.Address);
            parameters.Add("@City", booking.City);
            parameters.Add("@PickupDate", booking.PickupDate);
            parameters.Add("@DropoffDate", booking.DropoffDate);
            parameters.Add("@CarImageUrl", booking.CarImageUrl);

            var result = await _connection.QueryFirstOrDefaultAsync<int>(
                "sp_UpdateBooking",
                parameters,
                commandType: CommandType.StoredProcedure
            );

            return result > 0;
        }
        //public async Task<BookCarDto> GetBookingWithCar(int bookingId)
        //{
        //    var result = await _connection.QueryAsync<BookCarDto>(
        //        "sp_GetBookingWithCar",
        //        (booking, car) =>
        //        {
        //            booking.Car = car;  // Car object assign karo
        //            return booking;
        //        },
        //        new { BookingId = bookingId },
        //        splitOn: "CarId",  // Car data yahan se start hota hai
        //        commandType: CommandType.StoredProcedure
        //    );

        //    return result.FirstOrDefault();
        //}
        //public async Task<int> UpdateBooking(int id, BookCarDto bookingDto)
        //{
        //    string carImageUrl = null;

        //    // Agar nayi image upload hui hai
        //    if (bookingDto.CarImage != null)
        //    {
        //        var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/Images/Bookings");

        //        if (!Directory.Exists(uploadsFolder))
        //            Directory.CreateDirectory(uploadsFolder);

        //        var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(bookingDto.CarImage.FileName);
        //        var filePath = Path.Combine(uploadsFolder, uniqueFileName);

        //        using (var fileStream = new FileStream(filePath, FileMode.Create))
        //        {
        //            await bookingDto.CarImage.CopyToAsync(fileStream);
        //        }

        //        carImageUrl = "/Images/Bookings/" + uniqueFileName;
        //    }

        //    var parameters = new DynamicParameters();
        //    parameters.Add("@BookingId", id);
        //    parameters.Add("@FullName", bookingDto.FullName);
        //    parameters.Add("@FatherName", bookingDto.FatherName);
        //    parameters.Add("@CNIC", bookingDto.CNIC);
        //    parameters.Add("@LicenseNumber", bookingDto.LicenseNumber);
        //    parameters.Add("@Phone", bookingDto.Phone);
        //    parameters.Add("@Age", bookingDto.Age);
        //    parameters.Add("@Address", bookingDto.Address);
        //    parameters.Add("@City", bookingDto.City);
        //    parameters.Add("@PickupDate", bookingDto.PickupDate);
        //    parameters.Add("@DropoffDate", bookingDto.DropoffDate);
        //    parameters.Add("@CarId", bookingDto.CarId);
        //    parameters.Add("@OrganizationId", bookingDto.OrganizationId);

        //    // Agar nayi image hai toh update karo, warna null pass karo (SP mein handle hoga)
        //    if (carImageUrl != null)
        //        parameters.Add("@CarImageUrl", carImageUrl);
        //    else
        //        parameters.Add("@CarImageUrl", DBNull.Value);

        //    var result = await _connection.ExecuteAsync(
        //        "sp_UpdateBooking",
        //        parameters,
        //        commandType: CommandType.StoredProcedure
        //    );

        //    return result;
        //}

        public async Task<int> CancelBooking(int id)
        {
            var result = await _connection.ExecuteScalarAsync<int>(
                "sp_CancelBooking",
                new { Id = id },
                commandType: CommandType.StoredProcedure
            );
            return result;
        }
    }
}
