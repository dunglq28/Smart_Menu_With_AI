using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace FSU.SmartMenuWithAI.API.Payloads.Request.Product
{
    
    public class AddProductRequest
    {
        [Required]
        [StringLength(100, MinimumLength = 3)]
        [JsonPropertyName("product-name")]
        public string ProductName { get; set; } = null!;
        [JsonPropertyName("sportlight-video")]
        public IFormFile? SpotlightVideo { get; set; } = null!;

        [JsonPropertyName("image")]
        public IFormFile Image { get; set; } = null!;

        [Required]
        [StringLength(300, MinimumLength = 5)]
        [JsonPropertyName("description")]
        public string? Description { get; set; }

        [Required]
        [JsonPropertyName("price")]
        [Range(1, int.MaxValue, ErrorMessage = "giá không hợp lệ")]
        public decimal Price { get; set; }
        [Required]
        [JsonPropertyName("category-id")]
        public int CategoryId { get; set; }
        [Required]
        [JsonPropertyName("brand-id")]
        public int BrandId { get; set; }

    }

}
