using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FSU.SmartMenuWithAI.Service.Models
{
    public class BrandDTO
    {
        public int BrandId { get; set; }

        public string BrandCode { get; set; } = null!;

        public string BrandName { get; set; } = null!;

        public int UserId { get; set; }

        public DateOnly CreateDate { get; set; }

        public int Status { get; set; }

        public string? ImageUrl { get; set; }

        public string? ImageName { get; set; }
    }
}
