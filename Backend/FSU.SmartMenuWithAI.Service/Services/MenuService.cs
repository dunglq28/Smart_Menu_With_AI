using AutoMapper;
using FSU.SmartMenuWithAI.Repository.Entities;
using FSU.SmartMenuWithAI.Repository.UnitOfWork;
using FSU.SmartMenuWithAI.Service.Common.Constants;
using FSU.SmartMenuWithAI.Service.ISerivice;
using FSU.SmartMenuWithAI.Service.Models;
using FSU.SmartMenuWithAI.Service.Models.Pagination;
using FSU.SmartMenuWithAI.Service.Utils;
using Microsoft.AspNetCore.Http;
using Microsoft.IdentityModel.Tokens;
using System.Linq.Expressions;

namespace FSU.SmartMenuWithAI.Service.Services
{
    public class MenuService : IMenuService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IS3Service _s3Service;
        private readonly ISegmentAttributeService _segmentAttributeService;
        public MenuService(IUnitOfWork context, IMapper mapper, IS3Service s3Service, ISegmentAttributeService segmentAttributeService)
        {
            _unitOfWork = context;
            _mapper = mapper;
            _s3Service = s3Service;
            _segmentAttributeService = segmentAttributeService;
        }

        public async Task<bool> Delete(int id)
        {
            var deleteMenu = await _unitOfWork.MenuRepository.GetByCondition(x => x.MenuId == id);
            if (deleteMenu == null)
            {
                return false;
            }
            foreach (var menuSegment in deleteMenu.MenuSegments) 
            {
                _unitOfWork.MenuSegmentRepository.Delete(menuSegment);

            }
            // Xóa tất cả các ProductLists
            foreach (var menuList in deleteMenu.MenuLists)
            {
                foreach (var productList in menuList.List.ProductLists)
                {
                    _unitOfWork.ProductListRepository.Delete(productList);
                }
                // Xóa MenuLists sau khi xóa ProductLists
                _unitOfWork.MenuListRepository.Delete(menuList);
                _unitOfWork.ListPositionRepository.Delete(menuList.List);
            }
            _unitOfWork.MenuRepository.Delete(deleteMenu);
            var result = await _unitOfWork.SaveAsync() > 0 ? true : false;
            return result;
        }

        public async Task<PageEntity<MenuDTO>?> GetAllAsync(int brandID, int? pageIndex, int? pageSize)
        {
            Expression<Func<Menu, bool>> filter = brandID > 0 ? x => x.BrandId == brandID : null!;

            Func<IQueryable<Menu>, IOrderedQueryable<Menu>> orderBy = q => q.OrderByDescending(x => x.MenuId);
            string includeProperties = "Brand,MenuLists,MenuSegments";

            var entities = await _unitOfWork.MenuRepository
                .Get(filter: filter, orderBy: orderBy, includeProperties: includeProperties, pageIndex: pageIndex, pageSize: pageSize);
            var pagin = new PageEntity<MenuDTO>();
            pagin.List = _mapper.Map<IEnumerable<MenuDTO>>(entities).ToList();
            Expression<Func<Menu, bool>> countMenuInBrand = x => x.BrandId == brandID;
            pagin.TotalRecord = await _unitOfWork.MenuRepository.Count(countMenuInBrand);
            pagin.TotalPage = PaginHelper.PageCount(pagin.TotalRecord, pageSize!.Value);
            return pagin;
        }

        public async Task<MenuDTO?> GetAsync(int id)
        {
            Expression<Func<Menu, bool>> filter = x => x.MenuId == id;

            var menu = await _unitOfWork.MenuRepository.GetByCondition(filter);
            var mapDTO = _mapper.Map<MenuDTO>(menu);
            return mapDTO;
        }

        public async Task<MenuDTO> Insert(MenuDTO reqObj, List<int> segmentIds, int priority)
        {
            if (segmentIds.IsNullOrEmpty())
            {
                throw new Exception("Chưa có phân khúc khách hàng sử dụng");
            }
            var menuSegments = new List<MenuSegment>();
            string includeProperties = "Menu,Segment";

            foreach (var segId in segmentIds)
            {
                Expression<Func<MenuSegment, bool>> checkPriorityExist = x => x.Priority == priority && x.Menu.BrandId == reqObj.BrandId && x.SegmentId == segId;
                var priorityExist = await _unitOfWork.MenuSegmentRepository.GetByCondition(checkPriorityExist, includeProperties);
                if (priorityExist != null)
                {
                    throw new Exception($"Phân khúc khách hàng '{priorityExist.Segment.SegmentName}' đã tồn tại Ưu tiên '{priority}'");
                }
                else
                {
                    menuSegments.Add(new MenuSegment
                    {
                        Priority = priority,
                        SegmentId = segId
                    });
                }
            }

            string generateCode = CodeHelper.GenerateCode();

            var menu = new Menu
            {
                MenuCode = generateCode,
                CreateDate = DateOnly.FromDateTime(DateTime.Now),
                IsActive = reqObj.IsActive!.Value,
                BrandId = reqObj.BrandId!.Value,
                Priority = priority,
                Description = reqObj.Description,
                //MenuImage = _s3Service.GetPreSignedURL(generateCode, FolderRootImg.Menu),
                MenuSegments = menuSegments
            };
            await _unitOfWork.MenuRepository.Insert(menu);
            var result = await _unitOfWork.SaveAsync() > 0 ? true : false;
            if (result == true)
            {
                var mapdto = _mapper.Map<MenuDTO>(menu);
                return mapdto;
            }
            return null!;
        }

        public async Task<bool> UpdateAsync(List<int> segmentIds, MenuDTO dtoToUpdate)
        {
            try
            {
                Expression<Func<Menu, bool>> filter = x => x.MenuId == dtoToUpdate.MenuId;
                string includeProperties = "Brand,MenuSegments,MenuSegments";
                var menu = await _unitOfWork.MenuRepository.GetByCondition(filter, includeProperties);
                if (menu == null)
                {
                    return false;
                }
                if (dtoToUpdate.Priority.HasValue)
                {
                    menu.Priority = dtoToUpdate.Priority.Value;
                }
                if (!string.IsNullOrEmpty(dtoToUpdate.Description))
                {
                    menu.Description = dtoToUpdate.Description;
                }
                if (!string.IsNullOrEmpty(dtoToUpdate.MenuImage))
                {
                    menu.MenuImage = dtoToUpdate.MenuImage;
                }
                if (dtoToUpdate.IsActive.HasValue)
                {
                    menu.IsActive = dtoToUpdate.IsActive.Value;
                }

                menu.MenuSegments.Clear();

                foreach (var newSegmentId in segmentIds)
                {
                    var newMenuSegment = new MenuSegment { SegmentId = newSegmentId, Priority = dtoToUpdate.Priority!.Value };
                    menu.MenuSegments.Add(newMenuSegment);
                }

                _unitOfWork.MenuRepository.Update(menu);
                var result = await _unitOfWork.SaveAsync() > 0;
                return result;
            }
            catch (Exception ex)
            {
                throw new Exception("UpdateAsync method failed.", ex);
            }
        }

        public async Task<MenuDTO> RecomendMenu(IFormFile fileImage, int brandId)
        {
            try
            {
                // lay duoc hinh anh phan tich ra attribute
                var customerAtt = await _s3Service.AnalyzeFacesInImage(fileImage);
                if (customerAtt == null || customerAtt.Emotions.IsNullOrEmpty() || customerAtt.Session.IsNullOrEmpty() || customerAtt.Age == 0)
                {
                    var menuRecomend = await _unitOfWork.MenuRepository.GetByCondition(x => x.BrandId == brandId);
                    //var mapdto = _mapper.Map<MenuDTO>(menuRecomend);
                    menuRecomend.TimeRcm = menuRecomend.TimeRcm == null ? 1 : menuRecomend.TimeRcm + 1;
                    _unitOfWork.MenuRepository.Update(menuRecomend);
                    await _unitOfWork.SaveAsync();
                    //return mapdto;
                    return await GetAsync(menuRecomend.MenuId);
                }
                // tim customer segment
                var customerSegment = await _segmentAttributeService.GetCusSegmentAsync(customerAtt);
                if (customerSegment == null)
                {
                    throw new Exception("Không có phân khúc cho khách hàng này");
                }
                // tim menu cos priority cao nhat trong bang MenuSegment
                Func<IQueryable<MenuSegment>, IOrderedQueryable<MenuSegment>> orderBy = q => q.OrderBy(x => x.Priority);
                var menuSegment = await _unitOfWork.MenuSegmentRepository.HighestMenuSegment(segmentId: customerSegment.SegmentId, BrandId: brandId);
                // tim menu theo id da lay duoc
                if (menuSegment != null)
                {
                    //var menuRecomend = await _unitOfWork.MenuRepository.GetByID(menuSegment!.MenuId);
                    //var mapdto1 = _mapper.Map<MenuDTO>(menuRecomend);
                    //return mapdto1;
                    var menuRCM = await _unitOfWork.MenuRepository.GetByCondition(m => m.MenuId == menuSegment.MenuId && m.BrandId == brandId); /*GetAsync(menuSegment.MenuId);*/
                    menuRCM.TimeRcm = menuRCM.TimeRcm == null ? 1 : menuRCM.TimeRcm + 1;
                    //var menu = _mapper.Map<Menu>(menuRCM);
                    _unitOfWork.MenuRepository.Update(menuRCM);
                    await _unitOfWork.SaveAsync();
                    return _mapper.Map<MenuDTO>(menuRCM) /*menuRCM*/;


                }
                var menuDefault = await _unitOfWork.MenuRepository.GetAllNoPaging(x => x.BrandId == brandId, x => x.OrderByDescending(x => x.MenuId));
                //var mapdto2 = _mapper.Map<MenuDTO>(menuDefault.FirstOrDefault());

                var menu2 = await _unitOfWork.MenuRepository.GetByCondition(m => m.MenuId == menuDefault.FirstOrDefault().MenuId);
                menu2.TimeRcm = menu2.TimeRcm == null ? 1 : menu2.TimeRcm + 1;
                _unitOfWork.MenuRepository.Update(menu2);
                await _unitOfWork.SaveAsync();
                return _mapper.Map<MenuDTO>(menu2);
            }
            catch
            {
                var menuDefault = await _unitOfWork.MenuRepository.GetByCondition(x => x.BrandId == brandId);
                menuDefault.TimeRcm = menuDefault.TimeRcm == null ? 1 : menuDefault.TimeRcm + 1;
                _unitOfWork.MenuRepository.Update(menuDefault);
                await _unitOfWork.SaveAsync();
                var mapdto2 = _mapper.Map<MenuDTO>(menuDefault);
                return mapdto2;
            }

        }
    }
}
