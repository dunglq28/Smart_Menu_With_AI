using FSU.SmartMenuWithAI.Repository.Entities;
using FSU.SmartMenuWithAI.Service.Models.MenuList;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FSU.SmartMenuWithAI.Service.Models
{
    public class MenuDTO
    {
        public int? MenuId { get; set; }

        public string? MenuCode { get; set; } = null!;

        public DateOnly? CreateDate { get; set; }

        public bool? IsActive { get; set; }

        public int? BrandId { get; set; }

        public string? MenuImage { get; set; }

        public string? BrandName { get; set; }

        public string? Description { get; set; }

        public int? Priority { get; set; }

        public int? TimeRcm { get; set; }

        public virtual ICollection<MenuListDTO> MenuLists { get; set; } = new List<MenuListDTO>();

        public virtual ICollection<MenuSegmentDTO> MenuSegments { get; set; } = new List<MenuSegmentDTO>();
    }
}
