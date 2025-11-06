using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RentACar.Interfaces;
using RentACar.Map;
using RentACar.Models;
using RentACar.Repositories.Services.Interfaces;
using RentACar.ViewModel;

namespace NewsApi.Controllers
{
    [ApiController]
    [Route("api/Car")]
    public class CarController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IRentACarMap _rentACarMap;

        public CarController(IConfiguration configuration, IRentACarMap rentACarMap)
        {
            _configuration = configuration;
            _rentACarMap = rentACarMap;
        }

        // GET: api/Car
        [HttpGet("GetAllCars")]
        [Authorize(Policy = "CanViewCar")] 
        public async Task<IEnumerable<RentACarViewModel>> GetAllCars()
        {
            var result = await _rentACarMap.GetAllCars();
            return result;
        }

        // GET: api/Car/GetAllKeyValuePair
        [HttpGet("GetAllKeyValuePair")]
        [Authorize(Policy = "CanViewCar")] 
        public async Task<IEnumerable<RentACar.Models.KeyValuePair>> GetAllKeyValuePair(int keyValuePair, long? id)
        {
            return await _rentACarMap.GetAllKeyValuePair((KeyValuePairType)keyValuePair, id);
        }

       
        [HttpPost("AddCar")]
        [Authorize(Policy = "CanAddCar")] 
        public async Task<IActionResult> CreateCars([FromBody] RentACarViewModel car)
        {
            var result = await _rentACarMap.CreateCars(car);
            return Ok(result);
        }

        // Example: Delete Car
        [HttpDelete("DeleteCar/{id}")]
        [Authorize(Policy = "CanDeleteCar")] 
        public async Task<IActionResult> DeleteCar(long id)
        {
            var result = await _rentACarMap.DeleteCar(id);
            return Ok(result);
        }
    }
}


        //[HttpGet]
        //public async Task<IActionResult> GetAll()
        //{
        //    var posts = await NewsMap.GetAllAsync();
        //    return Ok(posts);
        //}

        

        //[HttpGet("{id}")]
        //public async Task<IActionResult> GetById(long? id)
        //{
        //    var post = await _repo.GetByIdAsync(id);
        //    if (post == null) return NotFound();
        //    return Ok(post);
        //}


        //[HttpPost]
        //public async Task<bool> CreateNews(IFormCollection collection)
        //{
        //    // Get uploaded files
        //    List<IFormFile> files = (List<IFormFile>)collection.Files;

        //    // Allow imageFile to be nullable
        //    IFormFile? imageFile = files.FirstOrDefault(p => p.ContentType.Contains("image"));

        //    // Allow obj to be nullable
        //    var obj = collection["obj"];

        //    // Use null-forgiving operator because you know "obj" will be provided by frontend
        //    NewsViewModel news = JsonConvert.DeserializeObject<NewsViewModel>(obj!)!;

        //    // Use null-coalescing to handle nullable attachments
        //    List<AttachmentViewModel> attachments = new List<AttachmentViewModel>(news.attachments ?? new List<AttachmentViewModel>());

        //    // Use null-forgiving operator since you're confident this key exists in appsettings
        //    var directoryPath = Path.Combine(configuration["uploadedFilespath:FilePath"]!);

        //    var imageFilePath = string.Empty;
        //    var imageFileName = string.Empty;

        //    if (imageFile != null)
        //    {
        //        var guid = Guid.NewGuid().ToString();

        //        // Combine safely with null-forgiving operator
        //        imageFilePath = Path.Combine(directoryPath, guid + imageFile.FileName);

        //        if (!Directory.Exists(directoryPath))
        //        {
        //            Directory.CreateDirectory(directoryPath);
        //        }

        //        Utilities.Utilities.SaveFile(imageFile, imageFilePath);
        //        imageFileName = guid + imageFile.FileName;

        //        attachments.Add(new AttachmentViewModel
        //        {
        //            AttachmentType = AttachmentType.Image,
        //            Name = imageFileName,
        //            Path = imageFilePath,
        //        });

        //        // Assign attachments list back to model
        //        news.attachments = attachments;

        //        // Use null-forgiving operator since news is guaranteed non-null after deserialization

        //    }
        //    return await NewsMap.CreateNews(news!);

        //    return false;
        //}


        //[HttpDelete]
        //public async Task<bool> DeleteCar(long id)
        //{
        //    return await RentACarMap.Delete(id);
        //}



        //[HttpGet]
        //public async Task<IActionResult> GetAllNews()
        //{
        //    var newsList = await _newsService.GetAllNews();
        //    return Ok(newsList);
        //} 
 
//[HttpPut("{id}")]
//public async Task<IActionResult> Update(long? id, [FromBody] Models.News post)
//{
//    if (id == null) return BadRequest("ID cannot be null.");

//    var existing = await _repo.GetByIdAsync(id);
//    if (existing == null) return NotFound();

//    post.Id = id.Value; // Explicitly convert nullable long to long
//    await _repo.UpdateAsync(post);
//    return NoContent();
//}

//[HttpDelete("{id}")]
//public async Task<IActionResult> Delete(long? id)
//{
//    var existing = await _repo.GetByIdAsync(id);
//    if (existing == null) return NotFound();

//    await _repo.DeleteAsync(id);
//    return NoContent();
//}
//}
//}


