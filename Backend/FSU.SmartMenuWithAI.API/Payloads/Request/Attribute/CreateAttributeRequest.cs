using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace FSU.SmartMenuWithAI.API.Payloads.Request.Attribute
{
    public class CreateAttributeRequest
    {
        [Required(ErrorMessage = "Cần có tên thuộc tính!")]
        [JsonProperty("attribute-name")]
        public string AttributeName { get; set; } = null!;
        [Required(ErrorMessage = "Thêm mô tả!")]
        [JsonProperty("description")]
        public string? Description { get; set; }

        [Required(ErrorMessage = "Cần id của nhóm thuộc tính!")]
        [Range(1, int.MaxValue, ErrorMessage = "id nhóm thuộc tính không hợp lệ")]
        [JsonProperty("group-attribute-id")]
        public int GroupAttributeId { get; set; }
    }
}
