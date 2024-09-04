using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace FSU.SmartMenuWithAI.Service.Models.ListProduct
{
    public class ListProductDetail
    {
        [Required(ErrorMessage = "ListId là bắt buộc.")]
        [JsonProperty("list-id")]
        public int ListId { get; set; }
        public List<IndexProductDetail>? IndexProducts { get; set; }
       
    }
    public class IndexProductDetail
    {
        [Required(ErrorMessage = "ProductId là bắt buộc.")]
        [JsonProperty("product-id")]
        public int ProductId { get; set; }
        [Required(ErrorMessage = "IndexInList là bắt buộc.")]
        [Range(0, int.MaxValue, ErrorMessage = "IndexInList phải là một số không âm.")]
        [JsonProperty("index-in-list")]
        public int IndexInList { get; set; }
    }
}
