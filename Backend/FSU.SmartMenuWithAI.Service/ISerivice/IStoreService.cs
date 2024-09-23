
using FSU.SmartMenuWithAI.Service.Models;
using FSU.SmartMenuWithAI.Service.Models.Pagination;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FSU.SmartMenuWithAI.Service.ISerivice
{
    public interface IStoreService
    {
        Task<PageEntity<StoreDTO>?> GetAllAsync(string? searchKey, int brandID, int? pageIndex, int? pageSize);

        Task<StoreDTO?> GetAsync(int id);

        Task<bool> Insert(StoreDTO entity);

        Task<bool> Delete(int id, int? brandId);

        Task<bool> UpdateAsync(int id, StoreDTO entityToUpdate, int? brandId);
        Task<BrandDTO> GetBrandOfStoreByUserID(int userId);
    }
}
