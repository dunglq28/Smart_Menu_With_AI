using FSU.SmartMenuWithAI.Service.Models;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace FSU.SmartMenuWithAI.API.Payloads.Request.Menu
{
    public class AddProductMenuRequest
    {
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Brand ID must be a positive integer.")]
        [JsonProperty("menu-id")]
        public int MenuId { get; set; }
        [Required]
        [JsonProperty("product-add-to-menu")]
        public List<CreateProductMenuDTO> ProductsAddToMenu { get; set; }
    }
}
