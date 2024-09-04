using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace FSU.SmartMenuWithAI.API.Payloads.Request.Attribute
{
    public class UpdateAttributeRequest
    {
        [JsonProperty("attribute-name")]
        public string AttributeName { get; set; } = null!;
        [JsonProperty("description")]
        public string? Description { get; set; }
        [JsonProperty("group-attribute-id")]
        public int GroupAttributeId { get; set; }
    }
}
