using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace FSU.SmartMenuWithAI.API.Payloads.Request.ProductList
{
    public class CreateProducListRequest
    {
        [Required(ErrorMessage = "ProductId là bắt buộc.")]
        [JsonProperty("product-id")]
        public int ProductId { get; set; }

        [Required(ErrorMessage = "ListId là bắt buộc.")]
        [JsonProperty("list-id")]
        public int ListId { get; set; }

        //[Required(ErrorMessage = "Price là bắt buộc.")]
        //[Range(0, int.MaxValue, ErrorMessage = "Price phải là một số không âm.")]
        //[JsonProperty("price")]
        //public int Price { get; set; }

        [Required(ErrorMessage = "IndexInList là bắt buộc.")]
        [Range(0, int.MaxValue, ErrorMessage = "IndexInList phải là một số không âm.")]
        [JsonProperty("index-in-list")]
        public int IndexInList { get; set; }

        [Required(ErrorMessage = "BrandId là bắt buộc.")]
        [JsonProperty("brand-id")]
        public int BrandId { get; set; }
    }
}
