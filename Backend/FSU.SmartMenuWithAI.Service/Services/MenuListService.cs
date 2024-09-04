using AutoMapper;
using FSU.SmartMenuWithAI.Repository.Entities;
using FSU.SmartMenuWithAI.Repository.UnitOfWork;
using FSU.SmartMenuWithAI.Service.ISerivice;
using FSU.SmartMenuWithAI.Service.Models;
using FSU.SmartMenuWithAI.Service.Models.MenuList;
using FSU.SmartMenuWithAI.Service.Models.Pagination;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace FSU.SmartMenuWithAI.Service.Services
{
    public class MenuListService : IMenuListService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IProductService _productService;
        private readonly IMapper _mapper;

        public MenuListService(IUnitOfWork unitOfWork, IMapper mapper, IProductService productService)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _productService = productService;
        }

        public async Task<bool> Delete(int menuId, int listId, int brandId)
        {
            Expression<Func<MenuList, bool>> filter = x => x.MenuId == menuId && x.ListId == listId && x.BrandId == brandId;
            var deleteMenuList = await _unitOfWork.MenuListRepository.GetByCondition(filter);
            if (deleteMenuList == null)
            {
                return false;
            }
            _unitOfWork.MenuListRepository.Delete(deleteMenuList);
            var result = await _unitOfWork.SaveAsync() > 0 ? true : false;
            return result;
        }

        public async Task<IEnumerable<MenuListDTO>> GetAllAsync(int menuID, int brandId)
        {
            Expression<Func<MenuList, bool>> filter = x => x.MenuId == menuID && x.BrandId == brandId;
            Func<IQueryable<MenuList>, IOrderedQueryable<MenuList>> orderBy = q => q.OrderByDescending(x => x.ListId);
            string includeProperties = "List,Menu";

            var entities = await _unitOfWork.MenuListRepository.GetAllNoPaging(filter: filter, orderBy: orderBy, includeProperties: includeProperties);
            var mapdto = _mapper.Map<IEnumerable<MenuListDTO>?>(entities);
            return mapdto!;
        }

        public async Task<MenuListDTO?> GetByID(int menuId, int listId, int brandId)
        {
            Expression<Func<MenuList, bool>> filter = x => x.MenuId == menuId && x.ListId == listId && x.BrandId == brandId;
            var getMenuList = await _unitOfWork.MenuListRepository.GetByCondition(filter);
            var mapdto = _mapper.Map<MenuListDTO?>(getMenuList);
            return mapdto;
        }

        public async Task<List<MenuListDTO>> Insert(int MenuId, int BrandId, List<CreateMenuListDTO> dto)
        {
            var productMenus = _mapper.Map<List<MenuList>>(dto);
            foreach (var item in productMenus)
            {
                item.MenuId = MenuId;
                item.BrandId = BrandId;
                await _unitOfWork.MenuListRepository.Insert(item);
            }
            if (await _unitOfWork.SaveAsync() > 0)
            {
                return _mapper.Map<List<MenuListDTO>>(productMenus);
            }
            return null!;
        }

        public async Task<MenuListDTO> InsertNewListToMenu(MenuListDTO reqObj)
        {
            var menuLists = _mapper.Map<MenuList>(reqObj);
            Expression<Func<MenuList,bool>> existIndexCondition = x=> x.MenuId == menuLists.MenuId 
            && x.BrandId == menuLists.BrandId 
            && x.ListIndex == menuLists.ListIndex;
            var DuplicateIndex = await _unitOfWork.MenuListRepository.GetByCondition(existIndexCondition);
            if (DuplicateIndex != null)
            {
                throw new Exception("Vị trí của list sản phẩm này đã tồn tại");
            }
            await _unitOfWork.MenuListRepository.Insert(menuLists);
            if (await _unitOfWork.SaveAsync() > 0)
            {
                return reqObj;
            }
            return null!;
        }

        public async Task<MenuListDTO?> Update(MenuListDTO entityToUpdate)
        {
            Expression<Func<MenuList, bool>> condition = x => x.MenuId == entityToUpdate.MenuId
            && x.BrandId == entityToUpdate.BrandId && x.ListId == entityToUpdate.ListId;
            var updateMenuList = await _unitOfWork.MenuListRepository.GetByCondition(condition);
            if (updateMenuList == null)
            {
                return null!;
            }

            if (entityToUpdate.ListIndex != default)
            {
                updateMenuList.ListIndex = entityToUpdate.ListIndex;
            }

            _unitOfWork.MenuListRepository.Update(updateMenuList);
            var result = new MenuListDTO();
            if (await _unitOfWork.SaveAsync() > 0)
            {
                result = _mapper.Map<MenuListDTO>(updateMenuList);
            }
            return result;
        }
    }
}
