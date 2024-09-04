using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace FSU.SmartMenuWithAI.API.Payloads.Request.Product
{
    public class UpdateProductRequest
    {
        [StringLength(100, ErrorMessage = "Product name must be less than 100 characters.")]
        [JsonProperty("product-name")]
        public string? ProductName { get; set; }

        [DataType(DataType.Upload)]
        [JsonProperty("spotlight-Video")]
        public IFormFile? SpotlightVideo { get; set; }

        [DataType(DataType.Upload)]
        [JsonProperty("iamge")]
        public IFormFile? Image { get; set; }

        [JsonProperty("description")]

        [StringLength(500, ErrorMessage = "Description must be less than 500 characters.")]
        public string? Description { get; set; }

        [JsonProperty("price")]
        public decimal? Price { get; set; }
    }
}
