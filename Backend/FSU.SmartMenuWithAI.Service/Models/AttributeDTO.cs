using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FSU.SmartMenuWithAI.Service.Models
{
    public class AttributeDTO
    {
        public int AttributeId { get; set; }

        public string AttributeCode { get; set; } = null!;

        public string AttributeName { get; set; } = null!;

        public string? Description { get; set; }

        public int Status { get; set; }

        public DateOnly CreateDate { get; set; }

        public DateOnly? UpdateDate { get; set; }

        public int GroupAttributeId { get; set; }
    }
}
