using FSU.SmartMenuWithAI.Service.Models;
using FSU.SmartMenuWithAI.Service.Models.Pagination;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FSU.SmartMenuWithAI.Service.ISerivice
{
    public interface IGroupAttributeService
    {
        Task<GroupAttributeDTO> Insert(string groupName);
        Task<bool> Delete(int id);
        Task<GroupAttributeDTO> Update(int id, string name);
        Task<PageEntity<GroupAttributeDTO>> Get(
            string searchKey,
            int? pageIndex = null, 
            int? pageSize = null);
        Task<GroupAttributeDTO> GetByID(int id);

    }
}
