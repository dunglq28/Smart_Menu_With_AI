using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FSU.SmartMenuWithAI.API.Payloads.Request.Brand
{
    
    public class CreateBrandRequest
    {
        [Required(ErrorMessage = "Nhập tên thương hiệu")]
        [MaxLength(100)]
        [JsonProperty("brand-name")]
        public string BrandName { get; set; } = null!;
        
        [Required(ErrorMessage = "Cần có id người dùng")]
        [JsonProperty("user-id")]
        public string UserId { get; set; } = null!;

        [Required(ErrorMessage = "Cần có hình ảnh")]
        [JsonProperty("image")]
        public IFormFile Image { get; set; } = null!;

    }
}
