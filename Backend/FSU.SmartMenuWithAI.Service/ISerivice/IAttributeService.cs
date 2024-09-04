using FSU.SmartMenuWithAI.Service.Models;
using FSU.SmartMenuWithAI.Service.Models.Pagination;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FSU.SmartMenuWithAI.Service.ISerivice
{
    public interface IAttributeService
    {
        Task<AttributeDTO> GetByID(int id);

        Task<AttributeDTO> Insert(string name, string description ,int groupID);
        Task<bool> Delete(int id);
        Task<AttributeDTO> Update(int id, string name, string description, int? groupID);
        Task<PageEntity<AttributeDTO>> Get(
           string searchKey,
           int? pageIndex = null,
           int? pageSize = null);
    }
}
