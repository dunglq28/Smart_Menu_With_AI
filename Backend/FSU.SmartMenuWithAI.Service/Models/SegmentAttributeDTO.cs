using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FSU.SmartMenuWithAI.Service.Models
{
    public class SegmentAttributeDTO
    {
        public int SegmentId { get; set; }

        public int AttributeId { get; set; }

        public string Value { get; set; } = null!;
        public string AttributeName { get; set; }

        public int BrandId { get; set; }
    }
}
