using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FSU.SmartMenuWithAI.Service.Models
{
    public class CustomerSegmentDTO
    {
        public int SegmentId { get; set; }

        public string SegmentCode { get; set; } = null!;

        public string SegmentName { get; set; } = null!;

        public DateOnly CreateDate { get; set; }

        public DateOnly? UpdateDate { get; set; }

        public int Status { get; set; }

        public int BrandId { get; set; }

        public List<SegmentAttributeDTO> SegmentAttributes { get;} = new List<SegmentAttributeDTO>();
    }
}
