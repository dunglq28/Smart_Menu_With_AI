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

        [Required(ErrorMessage = "Nhập mô tả")]
        [JsonProperty("description")]
        public string? Description { get; set; }

        [Required(ErrorMessage = "Nhập giá")]
        [Range(0, (double)decimal.MaxValue, ErrorMessage = "Giá phải là số dương")]
        [JsonProperty("price")]
        public decimal Price { get; set; }
    }
}
