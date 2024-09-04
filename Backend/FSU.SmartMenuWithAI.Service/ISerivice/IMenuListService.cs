using FSU.SmartMenuWithAI.Service.Models.Pagination;
using FSU.SmartMenuWithAI.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FSU.SmartMenuWithAI.Service.Models.MenuList;

namespace FSU.SmartMenuWithAI.Service.ISerivice
{
    public interface IMenuListService
    {
        Task<IEnumerable<MenuListDTO>> GetAllAsync(
            int menuID,
            int brandID);

        Task<MenuListDTO?> GetByID(int menuId, int listId, int brandId);

        Task<List<MenuListDTO>> Insert(int MenuId, int BrandId, List<CreateMenuListDTO> entity);

        Task<bool> Delete(int menuId, int listId, int brandId);

        Task<MenuListDTO?> Update(MenuListDTO entityToUpdate);

        Task<MenuListDTO> InsertNewListToMenu(MenuListDTO reqObj);

    }
}
