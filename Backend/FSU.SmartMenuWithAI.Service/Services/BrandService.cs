using AutoMapper;
using FSU.SmartMenuWithAI.Repository.UnitOfWork;
using FSU.SmartMenuWithAI.Repository.Entities;
using FSU.SmartMenuWithAI.Service.Common.Enums;
using FSU.SmartMenuWithAI.Service.ISerivice;
using FSU.SmartMenuWithAI.Service.Models;
using Microsoft.EntityFrameworkCore;
using static Amazon.S3.Util.S3EventNotification;
using FSU.SmartMenuWithAI.Service.Models.Pagination;
using FSU.SmartMenuWithAI.Service.Utils;
using System.Linq.Expressions;
using System.Reflection.Metadata;
using FSU.SmartMenuWithAI.Service.Common.Constants;
using FSU.SmartMenuWithAI.Service.Models.Brand;
using FSU.SmartMenuWithAI.Service.Models.ViewDashboard;

namespace FSU.SmartMenuWithAI.Service.Services
{
    public class BrandService : IBrandService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public BrandService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<BrandDTO> GetByID(int id)
        {
            Expression<Func<Brand, bool>> condition = x => x.BrandId == id && (x.Status != (int)Status.Deleted);
            var entity = await _unitOfWork.BrandRepository.GetByCondition(condition);
            return _mapper?.Map<BrandDTO?>(entity)!;
        }
        public async Task<List<BrandNameDTO>> GetAllBrandName()
        {
            Expression<Func<Brand, bool>> condition = x => x.Status != (int)Status.Deleted;
            var entities = await _unitOfWork.BrandRepository.GetAllByCondition(condition);

            var brandNameDTOs = entities
                .Select(b => new BrandNameDTO
                {
                    BrandId = b.BrandId,
                    BrandName = b.BrandName
                })
                .OrderBy(dto => dto.BrandName)
                .ToList();

            return brandNameDTOs;
        }
        public async Task<bool> Delete(int id)
        {
            var stores = await _unitOfWork.StoreRepository.Get(s => s.BrandId == id);
            foreach (var store in stores)
            {
                store.Status = (int)Status.Deleted;
                var userStore = await _unitOfWork.AppUserRepository.GetByID(store.UserId);
                userStore.Status = (int)Status.Deleted;
                _unitOfWork.StoreRepository.Update(store);
                _unitOfWork.AppUserRepository.Update(userStore);
            }
            var brandDelete = await _unitOfWork.BrandRepository.GetByID(id);
            if (brandDelete == null || brandDelete.Status == (int)Status.Deleted)
            {
                return false;
            }
            brandDelete.Status = (int)Status.Deleted;

            _unitOfWork.BrandRepository.Update(brandDelete);
            var result = await _unitOfWork.SaveAsync() > 0 ? true : false;
            return result;
        }

        public async Task<BrandDTO> GetByNameAsync(string brandName)
        {
            Expression<Func<Brand, bool>> condition = x => x.BrandName == brandName && (x.Status != (int)Status.Deleted);
            var entity = await _unitOfWork.BrandRepository.GetByCondition(condition);
            return _mapper?.Map<BrandDTO>(entity)!;
        }

        public async Task<BrandDTO> Insert(string brandName, int userID, string imgUrl, string imgName)
        {
            var brand = new Brand();
            brand.BrandCode = Guid.NewGuid().ToString();
            brand.BrandName = brandName;
            brand.UserId = userID;
            brand.CreateDate = DateOnly.FromDateTime(DateTime.Now);
            brand.Status = 1;
            brand.ImageName = imgName;
            brand.ImageUrl = imgUrl;

            Expression<Func<Brand, bool>> condition = x => x.BrandName == brand.BrandName && (x.Status != (int)Status.Deleted);
            var entity = await _unitOfWork.BrandRepository.GetByCondition(condition);
            if (entity != null)
            {
                throw new Exception("Tên đã tồn tại");
            }
            await _unitOfWork.BrandRepository.Insert(brand);
            var result = await _unitOfWork.SaveAsync() > 0 ? true : false;
            if (result)
            {
                return _mapper?.Map<BrandDTO>(brand)!;
            }
            return null!;
        }
        public async Task<BrandDTO> Update(int id, string brandName, string imgUrl, string imgName)
        {
            Expression<Func<Brand, bool>> condition = x => x.BrandName == brandName && (x.Status != (int)Status.Deleted) && (x.BrandId != id);
            var entity = await _unitOfWork.BrandRepository.GetByCondition(condition);
            if (entity != null)
            {
                throw new Exception("Tên đã tồn tại");
            }

            var brandToUpdate = await _unitOfWork.BrandRepository.GetByID(id);
            if (brandToUpdate == null || (brandToUpdate.Status == (int)Status.Deleted))
            {
                return null!;
            }

            if (!string.IsNullOrEmpty(brandName))
            {
                brandToUpdate.BrandName = brandName;
            }

            if (!string.IsNullOrEmpty(imgUrl))
            {
                brandToUpdate.ImageUrl = imgUrl;
            }

            if (!string.IsNullOrEmpty(imgName))
            {
                brandToUpdate.ImageName = imgName;
            }

            _unitOfWork.BrandRepository.Update(brandToUpdate);
            var result = await _unitOfWork.SaveAsync() > 0 ? true : false;
            return _mapper?.Map<BrandDTO>(brandToUpdate)!;
        }
        public async Task<PageEntity<BrandDTO>> GetBrands(string? searchKey, int? pageIndex = null, int? pageSize = null)
        {

            Expression<Func<Brand, bool>> filter = x => (string.IsNullOrEmpty(searchKey) || x.BrandName.Contains(searchKey)) && x.Status != (int)Status.Deleted;

            Expression<Func<Brand, bool>> filterRecord = x => (x.Status != (int)Status.Deleted);

            Func<IQueryable<Brand>, IOrderedQueryable<Brand>> orderBy = q => q.OrderByDescending(x => x.BrandId);

            var entities = await _unitOfWork.BrandRepository.GetBrands(filter: filter, orderBy: orderBy, pageIndex: pageIndex, pageSize: pageSize);
            var pagin = new PageEntity<BrandDTO>();
            pagin.List = _mapper.Map<IEnumerable<BrandDTO>>(entities).ToList();
            pagin.TotalRecord = await _unitOfWork.BrandRepository.Count(filter);
            pagin.TotalPage = PaginHelper.PageCount(pagin.TotalRecord, pageSize!.Value);
            return pagin;
        }

        public async Task<BrandDTO> GetBrandByUserID(int userID)
        {
            var brandEntity = new Brand();
            Expression<Func<Brand, bool>> condition = x => x.UserId == userID && x.Status != (int)Status.Deleted;
            brandEntity = await _unitOfWork.BrandRepository.GetByCondition(condition);
            return _mapper.Map<BrandDTO?>(brandEntity)!;
        }

        public async Task<UserMenuAccountDTO?> GetUserMenuAccountInfoAsync(int userId)
        {
            // Retrieve the user's last active subscription
            var subscription = await _unitOfWork.SubscriptioRepository.Get(
                filter: x => x.UserId == userId && x.Status == 1,
                orderBy: q => q.OrderByDescending(s => s.EndDate),
                includeProperties: "Plan",
                pageSize: 1
            );

            var latestSubscription = subscription.FirstOrDefault();
            if (latestSubscription == null)
            {
                return null; // No active subscription found
            }

            // Get plan details (MaxMenu and MaxAccount)
            var maxMenu = latestSubscription.Plan.MaxMenu;
            var maxAccount = latestSubscription.Plan.MaxAccount;

            // Retrieve the user's brand information
            var brand = await _unitOfWork.BrandRepository.GetByCondition(b => b.UserId == userId);
            if (brand == null)
            {
                return new UserMenuAccountDTO
                {
                    MaxMenu = maxMenu,
                    MaxAccount = maxAccount,
                    NumberMenu = 0,
                    NumberAccount = 0
                };
            }

            // Count the number of menus and accounts for the brand
            var numberMenu = await _unitOfWork.MenuRepository.Count(m => m.BrandId == brand.BrandId);
            var numberAccount = await _unitOfWork.StoreRepository.Count(a => a.BrandId == brand.BrandId && a.Status == 1);

            // Return the result
            return new UserMenuAccountDTO
            {
                MaxMenu = maxMenu,
                MaxAccount = maxAccount,
                NumberMenu = numberMenu,
                NumberAccount = numberAccount
            };
        }

        public async Task<BrandDashboardDTO> GetDashboard(int brandId)
        {
            // Initialize the dashboard DTO
            var dashboard = new BrandDashboardDTO();

            // Retrieve the number of stores associated with the brand
            dashboard.store = await _unitOfWork.StoreRepository.Count(s => s.BrandId == brandId && s.Status == 1);

            // Retrieve the number of menus associated with the brand
            dashboard.menus = await _unitOfWork.MenuRepository.Count(m => m.BrandId == brandId);

            // Retrieve the number of products associated with the brand
            dashboard.product = await _unitOfWork.ProductRepository.Count(p => p.BrandId == brandId);

            // Retrieve times recommended per menu (example logic)

            var timesRecommended = await _unitOfWork.MenuRepository.Get(
                filter: m => m.BrandId == brandId);

            // Map to TimesRecomment list
            dashboard.timesRecomments = timesRecommended
                .Select(menu => new TimesRecomment
                {
                    menuid = menu.MenuId, // Default to 0 if MenuId is null
                    times = menu.TimeRcm ?? 0,  // Default to 0 if TimeRcm is null
                    description = menu.Description
                })
                .ToList();
            // Retrieve product counts by category (example logic)


            var productsByCategory = await _unitOfWork.ProductRepository.Get(
                filter: p => p.BrandId == brandId,
                includeProperties: "Category"
            );
            dashboard.productsByCate = productsByCategory
                .GroupBy(p => p.Category.CategoryName)
                .Select(group => new ProductByCate
                {
                    cateName = group.Key,
                    numberOfProduct = group.Count()
                }).ToList();
            return dashboard;
        }

    }
}
