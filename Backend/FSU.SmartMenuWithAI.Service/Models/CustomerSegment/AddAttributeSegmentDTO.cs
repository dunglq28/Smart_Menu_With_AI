using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace FSU.SmartMenuWithAI.Service.Models.CustomerSegment
{
    public class AddAttributeSegmentDTO
    {
        [JsonProperty("attribute-id")]
        public int AttributeId { get; set; }
        [JsonProperty("value")]
        public string Value { get; set; } = null!;
    }
}
