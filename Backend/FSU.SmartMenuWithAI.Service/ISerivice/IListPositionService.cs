using FSU.SmartMenuWithAI.Service.Models;
using FSU.SmartMenuWithAI.Service.Models.ListPosition;
using FSU.SmartMenuWithAI.Service.Models.Pagination;

namespace FSU.SmartMenuWithAI.Service.ISerivice
{
    public interface IListPositionService
    {
        Task<ListPositionDTO> GetByID(int id);
        Task<PageEntity<ListPositionDTO>> GetListPositionByBrandID(
           int searchKey,
           int? pageIndex = null,
           int? pageSize = null);
        Task<ListPositionDTO> Insert(int totalProduct, int brandID, string listName);
        Task<List<ListPositionDTO>> Insert2(int brandID, List<ListDetail> listName);
        Task<ListPositionDTO> UpdateAsync(int id, int totalProduct, string listName);
        Task<List<ListPositionDTO>> UpdateAsync2(int brandID, List<ListDetailUpdate> listDetailUpdates);
        Task<bool> DeleteAsync(int id);

    }
}
