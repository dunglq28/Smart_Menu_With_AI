using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace FSU.SmartMenuWithAI.API.Payloads.Request.Category
{
    public class AddCagetoryRequest
    {
        [Required]
        [StringLength(100, MinimumLength = 3)]
        [JsonProperty("category-name")]
        public string CategoryName { get; set; } = null!;
        [Required]
        [JsonProperty("brand-id")]
        public int BrandId { get; set; }
    }
}
