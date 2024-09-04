using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FSU.SmartMenuWithAI.Service.Models
{
    public class ProductDTO
    {
        public int ProductId { get; set; }

        public string ProductCode { get; set; } = null!;

        public DateOnly CreateDate { get; set; }

        public string ProductName { get; set; } = null!;

        public string? SpotlightVideoImageUrl { get; set; }

        public string? SpotlightVideoImageName { get; set; }

        public string? ImageUrl { get; set; }

        public string? ImageName { get; set; }

        public string? Description { get; set; }

        public int CategoryId { get; set; }

        public int BrandId { get; set; }

        public decimal? Price { get; set; }
        public string? CategoryName { get; set; }
    }
}
