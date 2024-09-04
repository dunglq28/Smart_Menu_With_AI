using FSU.SmartMenuWithAI.Service.Models.ListPosition;
using FSU.SmartMenuWithAI.Service.Models.ListProduct;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace FSU.SmartMenuWithAI.API.Payloads.Request.ProductList
{
    public class CreateListProductList
    {
        [Required(ErrorMessage = "BrandId là bắt buộc.")]
        [JsonProperty("brand-id")]
        public int BrandId { get; set; }
        [Required(ErrorMessage = "Thiếu danh sách chi tiết")]
        public List<ListProductDetail>? ListProductDetails { get; set; }

    }
}
