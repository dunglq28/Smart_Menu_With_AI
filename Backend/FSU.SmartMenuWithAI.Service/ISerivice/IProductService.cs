using FSU.SmartMenuWithAI.Service.Models;
using FSU.SmartMenuWithAI.Service.Models.Pagination;

namespace FSU.SmartMenuWithAI.Service.ISerivice
{
    public interface IProductService
    {
        Task<bool> UpdateAsync(int id, ProductDTO reqObj, int brandId);
        Task<bool> Insert(ProductDTO reqObj);
        Task<PageEntity<ProductDTO>?> GetAllByCategoryAsync(string? searchKey, int brandID, int? categoryID, int? pageIndex, int? pageSize);
        Task<ProductDTO?> GetAsync(int id);
        Task<List<ProductDTO>?> GetAllProductInBrandAsync(int brandid);
        Task<bool> Delete(int id);
        Task<PageEntity<ProductDTO>?> GetAllAsync(string? searchKey, int brandID, int? pageIndex, int? pageSize);

    }
}
