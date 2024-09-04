using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace FSU.SmartMenuWithAI.API.Payloads.Request.Menu
{
    public class UpdateMenuSegmentRequest
    {
        [Required]
        [JsonProperty("menu-id")]
        public int MenuId{ get; set; }
        [Required]
        [JsonProperty("segment-id")]
        public int SegmentId { get; set; }
        [Required]
        [JsonProperty("priority")]
        public int Priority { get; set; }
    }
}
