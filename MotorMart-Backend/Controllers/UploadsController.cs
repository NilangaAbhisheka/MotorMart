using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MotorMart_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UploadsController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;
        public UploadsController(IWebHostEnvironment env)
        {
            _env = env;
        }

        [HttpPost]
        [Authorize]
        [RequestSizeLimit(20_000_000)] // ~20MB
        public async Task<IActionResult> Upload([FromForm] IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0) 
                    return BadRequest(new { message = "No file uploaded" });
                
                if (file.Length > 20_000_000) 
                    return BadRequest(new { message = "File too large. Maximum size is 20MB." });
                
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
                var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
                if (!allowedExtensions.Contains(fileExtension))
                    return BadRequest(new { message = "Invalid file type. Only images are allowed." });

                var uploadsPath = Path.Combine(_env.ContentRootPath, "uploads");
                if (!Directory.Exists(uploadsPath)) 
                    Directory.CreateDirectory(uploadsPath);

                var fileName = $"{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";
                var filePath = Path.Combine(uploadsPath, fileName);
                
                await using var stream = System.IO.File.Create(filePath);
                await file.CopyToAsync(stream);

                var url = $"/uploads/{fileName}";
                return Ok(new { url });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error uploading file", error = ex.Message });
            }
        }
    }
}


