using FSU.SmartMenuWithAI.Repository.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FSU.SmartMenuWithAI.Service.Models.MenuList
{
    public class MenuListDTO
    {
        public int MenuId { get; set; }

        public int ListId { get; set; }

        public int ListIndex { get; set; }

        public int BrandId { get; set; }

        public virtual ListPositionDTO List { get; set; } = null!;

        public virtual MenuDTO Menu { get; set; } = null!;

    }
}
