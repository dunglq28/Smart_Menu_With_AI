using System.ComponentModel.DataAnnotations;

namespace FSU.SmartMenuWithAI.Service.Models.ListPosition
{
    public class ListDetail
    {

        [Required(ErrorMessage = "Thiếu List Name")]
        public string? ListName { get; set; }

        [Required(ErrorMessage = "Thiếu số sản phẩm")]
        [Range(1, int.MaxValue, ErrorMessage = "Số không hợp lệ.")]
        public int? TotalProduct { get; set; }
    }
}
