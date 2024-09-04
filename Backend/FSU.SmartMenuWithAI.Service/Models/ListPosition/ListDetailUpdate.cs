using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FSU.SmartMenuWithAI.Service.Models.ListPosition
{
    public class ListDetailUpdate
    {
        [Required(ErrorMessage = "Thiếu list id")]
        [Range(1, int.MaxValue, ErrorMessage = "Số không hợp lệ.")]
        public int ListId { get; set; }
        [Required(ErrorMessage = "Thiếu List Name")]
        public string? ListName { get; set; }

        [Required(ErrorMessage = "Thiếu số sản phẩm")]
        [Range(1, int.MaxValue, ErrorMessage = "Số không hợp lệ.")]
        public int? TotalProduct { get; set; }
    }
}
