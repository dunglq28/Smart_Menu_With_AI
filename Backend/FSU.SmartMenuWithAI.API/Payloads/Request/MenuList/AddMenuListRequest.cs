using FSU.SmartMenuWithAI.Service.Models;
using FSU.SmartMenuWithAI.Service.Models.MenuList;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace FSU.SmartMenuWithAI.API.Payloads.Request.MenuList
{
    public class AddMenuListRequest
    {
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Menu ID must be a positive integer.")]
        [JsonProperty("menu-id")]
        public int MenuId { get; set; }
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Brand ID must be a positive integer.")]
        [JsonProperty("brand-id")]
        public int brandId { get; set; }
        [Required]
        [JsonProperty("list-add-to-menu")]
        public List<CreateMenuListDTO> listAddToMenu { get; set; }
    }
}
