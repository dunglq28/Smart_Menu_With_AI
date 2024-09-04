using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FSU.SmartMenuWithAI.Service.Models
{
    public class CategoryDTO
    {
        public int CategoryId { get; set; }

        public string CategoryCode { get; set; } = null!;

        public string CategoryName { get; set; } = null!;

        public DateOnly CreateDate { get; set; }

        public DateOnly? UpdateDate { get; set; }

        public int Status { get; set; }

        public int BrandId { get; set; }
        public string BrandName { get; set; } = null!;
    }
}
