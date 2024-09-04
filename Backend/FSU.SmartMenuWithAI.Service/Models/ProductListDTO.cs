using FSU.SmartMenuWithAI.Repository.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FSU.SmartMenuWithAI.Service.Models
{
    public class ProductListDTO
    {
        public int ProductId { get; set; }

        public int ListId { get; set; }

        //public int Price { get; set; }

        public int IndexInList { get; set; }

        public int BrandId { get; set; }
        public virtual ListPositionDTO List { get; set; } = null!;

        public virtual ProductDTO Product { get; set; } = null!;
    }
}
