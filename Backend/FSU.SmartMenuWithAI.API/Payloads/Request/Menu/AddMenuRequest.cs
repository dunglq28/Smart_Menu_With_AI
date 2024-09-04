using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FSU.SmartMenuWithAI.API.Payloads.Request.Menu
{
    
    public class AddMenuRequest
    {
        [Required]
        [JsonProperty("is-active")]
        public bool IsActive { get; set; }

        [Required]
        [JsonProperty("brand-id")]
        [Range(1, int.MaxValue, ErrorMessage = "Brand ID must be a positive integer.")]
        public int BrandId { get; set; }

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
