using FSU.SmartMenuWithAI.Service.Models;
using FSU.SmartMenuWithAI.Service.Models.Pagination;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FSU.SmartMenuWithAI.Service.ISerivice
{
    public interface IMenuService
    {
        Task<bool> UpdateAsync(List<int> segmentIds, MenuDTO dtoToUpdate);
        Task<MenuDTO> Insert(MenuDTO reqObj, List<int> segmentIds, int priority);
        Task<PageEntity<MenuDTO>?> GetAllAsync( int brandID, int? pageIndex, int? pageSize);
        Task<MenuDTO?> GetAsync(int id);
        Task<bool> Delete(int id);
        Task<MenuDTO> RecomendMenu(IFormFile fileImage, int brandId);
    }
}
