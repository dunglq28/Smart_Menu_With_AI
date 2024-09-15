using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace FSU.SmartMenuWithAI.API.Payloads.Request
{
    public class PayOsRequest
    {
        [Required(ErrorMessage = "Thiếu số tiền")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Số tiền phải lớn hơn 0")]
        public decimal? Amount { get; set; }
        [Required(ErrorMessage = "Thiếu id người dùng")]
        [Range(1, int.MaxValue, ErrorMessage = "id người dùng phải là số dương")]
        [JsonProperty("user-id")]
        public int UserId { get; set; }

        [Required(ErrorMessage = "Thiếu Email")]
        [MaxLength(100)]
        [JsonProperty("email")]
        public string Email { get; set; } = null!;
        [Required(ErrorMessage = "Thiếu id gói")]
        [Range(1, int.MaxValue, ErrorMessage = "id gói phải là số dương")]
        [JsonProperty("plna-id")]
        public int PlanId { get; set; }
        [Required(ErrorMessage = "Thiếu tên gói")]
        [MaxLength(100)]
        [JsonProperty("plan-name")]
        public string PlanName { get; set; }
    }
}
