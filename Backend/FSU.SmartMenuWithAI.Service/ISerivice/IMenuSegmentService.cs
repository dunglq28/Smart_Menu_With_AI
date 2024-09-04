using FSU.SmartMenuWithAI.Service.Models;
using FSU.SmartMenuWithAI.Service.Models.Menu;
using FSU.SmartMenuWithAI.Service.Models.MenuList;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FSU.SmartMenuWithAI.Service.ISerivice
{
    public interface IMenuSegmentService
    {
        Task<MenuSegmentDTO?> GetByID(int menuId, int SegmentId);

        Task<List<MenuSegmentDTO>> Insert(int MenuId, int Priority, List<CreateMenuSegmentDTO> entity);

        Task<bool> Delete(int menuId, int SegmentID);

        Task<MenuSegmentDTO?> Update(MenuSegmentDTO entityToUpdate);
    }
}
