using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FSU.SmartMenuWithAI.Service.Models
{
    public class CreateProductMenuDTO
    {
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Price must be a positive integer.")]
        [JsonProperty("price")]
        public int Price { get; set; }
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Product ID must be a positive integer.")]
        [JsonProperty("product-id")]
        public int ProductId { get; set; }
        [JsonProperty("display-index")]
        public int? DisplayIndex { get; set; }
    }
}
