using FSU.SmartMenuWithAI.Service.Models;
using FSU.SmartMenuWithAI.Service.Models.CustomerSegment;
using FSU.SmartMenuWithAI.Service.Models.Pagination;

namespace FSU.SmartMenuWithAI.Service.ISerivice
{
    public interface ICustomerSegmentService
    {
        Task<PageEntity<ViewCustomerSegment>> GetAllAsync(
            string? searchKey
            , int? pageIndex
            , int? pageSize
            , int brandId);
        Task<IEnumerable<ViewCustomerSegment>> GetAllNoPaingAsync(int brandId);
        Task<ViewCustomerSegment?> GetByID(int SegmentId);

        Task<List<ViewCustomerSegment>?> GetByMenuID(int menuId);
        Task<IEnumerable<ViewCustomerSegment>> Insert(string customerSegmentName , string age, List<string> gender, List<string> session, int brandID);

        Task<bool> Delete(int SegmentId);

        Task<IEnumerable<ViewCustomerSegment>> Update(int segmentId, string segmentName);
        Task<IEnumerable<ViewCustomerSegment>> UpdateSegmentValue(int segmentId, string age, string gender, string session, string segmentName, int brandID);
    }
}
