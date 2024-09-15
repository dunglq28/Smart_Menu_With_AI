using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace FSU.SmartMenuWithAI.API.Payloads.Request.Plan
{
    public class CreateRequest
    {
        [Required(ErrorMessage = "Nhập tên dịch vụ")]
        [MaxLength(100)]
        [JsonProperty("plan-name")]
        public string PlanName { get; set; } = null!;

        [Required(ErrorMessage = "Nhập số lượng tối đa menu")]
        [Range(1, int.MaxValue, ErrorMessage = "Số lượng menu phải là số dương")]
        [JsonProperty("max-menu")]
        public int MaxMenu { get; set; }

        [Required(ErrorMessage = "Nhập số lượng tài khoản tối đa")]
        [Range(1, int.MaxValue, ErrorMessage = "Số lượng tài khoản phải là số dương")]
        [JsonProperty("max-account")]
        public int MaxAccount { get; set; }

        [Required(ErrorMessage = "Nhập giá")]
        [Range(0, (double)decimal.MaxValue, ErrorMessage = "Giá phải là số dương")]
        [JsonProperty("price")]
        public decimal Price { get; set; }
    }
}
