using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace FSU.SmartMenuWithAI.API.Payloads.Request.Menu
{
    public class UpdateMenuRequest
    {
        [Required]
        [JsonProperty("menu-id")]
        public int menuId { get; set; }

        [Required]
        [JsonProperty("is-avtive")]
        public bool isActive{ get; set; }

        [JsonProperty("description")]
        public string? Description { get; set; }

        [JsonProperty("menu-image")]
        public IFormFile? MenuImage { get; set; }

        [JsonProperty("priority")]
        public int Priority { get; set; }

        [JsonProperty("segment-ids")]
        public List<int> SegmentIds { get; set; }
    }
}
