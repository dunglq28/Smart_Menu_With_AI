using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace FSU.SmartMenuWithAI.API.Payloads.Request.CustomerSegment
{
    public class UpdateCustomerSegmentRequest
    {
        [Required(ErrorMessage = "Thiếu ID phân khúc")]
        [JsonProperty("segment-id")]
        public int SegmentId { get; set; }
        [Required(ErrorMessage = "Nhập tên phân khúc")]
        [StringLength(500, MinimumLength = 5)]
        [JsonProperty("segment-name")]
        public string SegmentName { get; set; } = null!;

        [Required(ErrorMessage = "Nhập độ tuổi")]
        [JsonProperty("age")]
        public string Age { get; set; }
        [Required(ErrorMessage = "Chọn giới tính")]
        [JsonProperty("gender")]
        public string Gender { get; set; }
        [Required(ErrorMessage = "Chọn thời gian")]
        [JsonProperty("session")]
        public string Session { get; set; }
        [Required(ErrorMessage = "Thiếu ID thương hiệu")]
        [JsonProperty("brand-id")]
        public int BrandId { get; set; }
    }
}
