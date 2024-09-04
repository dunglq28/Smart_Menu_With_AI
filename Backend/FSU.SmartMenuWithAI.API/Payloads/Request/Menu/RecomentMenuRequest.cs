using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace FSU.SmartMenuWithAI.API.Payloads.Request.Menu
{
    public class RecomentMenuRequest
    {
        [Required]
        [JsonProperty("face-image")]
        public IFormFile faceImage { get; set; }

        [Required]
        [JsonProperty("brand-id")]
        public int BrandId { get; set; }
    }
}
