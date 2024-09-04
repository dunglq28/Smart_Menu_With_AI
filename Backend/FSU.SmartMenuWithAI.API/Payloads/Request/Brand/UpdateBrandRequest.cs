using Newtonsoft.Json;

namespace FSU.SmartMenuWithAI.API.Payloads.Request.Brand
{
    public class UpdateBrandRequest
    {
        [JsonProperty("brand-name")]
        public string BrandName { get; set; } = null!;

        [JsonProperty("image")]
        public IFormFile Image { get; set; } = null!;
    }
}
