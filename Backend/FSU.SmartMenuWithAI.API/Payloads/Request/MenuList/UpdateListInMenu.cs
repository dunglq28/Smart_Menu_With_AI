using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace FSU.SmartMenuWithAI.API.Payloads.Request.MenuList
{
    public class UpdateListInMenu
    {
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "List ID must be a positive integer.")]
        [JsonProperty("list-id")]
        public int ListId { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Menu ID must be a positive integer.")]
        [JsonProperty("menu-id")]
        public int MenuId { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Brand ID must be a positive integer.")]
        [JsonProperty("brand-id")]
        public int BrandId { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "display index must be a positive integer.")]
        [JsonProperty("display-index")]
        public int DisplayIndex { get; set; }
    }
}
