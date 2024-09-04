using FSU.SmartMenuWithAI.Repository.Entities;
using FSU.SmartMenuWithAI.Service.Models;
using FSU.SmartMenuWithAI.Service.Models.Pagination;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using static Amazon.S3.Util.S3EventNotification;

namespace FSU.SmartMenuWithAI.Service.ISerivice
{
    public interface IBrandService
    {
        Task<BrandDTO> GetByID(int id);
        Task<List<BrandNameDTO>> GetAllBrandName();
        Task<BrandDTO> GetByNameAsync(string brandName);
        Task<BrandDTO> Insert(string brandName, int userID, string imgUrl, string imgName);
        Task<bool> Delete(int id);
        Task<BrandDTO> Update(int brandID, string brandName, string imgUrl, string imgName);
        Task<PageEntity<BrandDTO>> GetBrands(
            string searchKey,
        int? pageIndex = null,
        int? pageSize = null);
        Task<BrandDTO> GetBrandByUserID(int userID);

    }
}
