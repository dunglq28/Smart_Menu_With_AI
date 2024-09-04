using FSU.SmartMenuWithAI.Repository.Entities;
using FSU.SmartMenuWithAI.Service.Models.MenuList;

namespace FSU.SmartMenuWithAI.Service.Models
{
    public class ListPositionDTO
    {
        public int ListId { get; set; }

        public string ListCode { get; set; } = null!;

        public int? TotalProduct { get; set; }

        public DateOnly CreateDate { get; set; }

        public int BrandId { get; set; }
        public string? ListName { get; set; }

        public virtual ICollection<MenuListDTO> MenuLists { get; set; } = new List<MenuListDTO>();

        public virtual ICollection<ProductListDTO> ProductLists { get; set; } = new List<ProductListDTO>();
    }
}
