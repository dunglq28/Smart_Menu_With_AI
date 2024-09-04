using FSU.SmartMenuWithAI.Repository.Entities;
using FSU.SmartMenuWithAI.Service.Models;
using FSU.SmartMenuWithAI.Service.Models.ListProduct;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FSU.SmartMenuWithAI.Service.ISerivice
{
    public interface IProductListService
    {
        Task<ProductListDTO> GetByID(int productId, int listId);
        Task<ProductListDTO> Insert(int productId, int listId, int indexInList, int brandId);
        Task<List<ProductListDTO>> Insert2(int brandId, List<ListProductDetail> listProductDetails);
        Task<List<ProductListDTO>> Update2(int brandId, List<ListProductDetail> listProductDetails);
        Task<ProductListDTO> UpdateAsync(int productId, int listId, int index, int newProductId);
        Task<bool> DeleteAsync(int productId, int listId);

    }
}
