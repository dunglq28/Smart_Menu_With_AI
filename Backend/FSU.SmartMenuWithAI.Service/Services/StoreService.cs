using Amazon.Rekognition.Model;
using AutoMapper;
using FSU.SmartMenuWithAI.Repository.Entities;
using FSU.SmartMenuWithAI.Repository.UnitOfWork;
using FSU.SmartMenuWithAI.Service.Common.Enums;
using FSU.SmartMenuWithAI.Service.ISerivice;
using FSU.SmartMenuWithAI.Service.Models;
using FSU.SmartMenuWithAI.Service.Models.Pagination;
using FSU.SmartMenuWithAI.Service.Utils;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using static Amazon.S3.Util.S3EventNotification;

namespace FSU.SmartMenuWithAI.Service.Services
{
    public class StoreService : IStoreService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        public StoreService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }


        public async Task<bool> Delete(int id, int? brandId)
        {
            var deleteStore = await _unitOfWork.StoreRepository.GetByID(id);
            if (deleteStore == null || (deleteStore.Status == (int)Status.Deleted))
            {
                return false;
            }
            if (brandId != null)
            {
                var store = await _unitOfWork.StoreRepository.GetByCondition(s => s.BrandId == brandId);
                if (store == null)
                {
                    throw new Exception("cửa hàng không trùng khớp với brand Id");
                }
            }
            deleteStore.Status = (int)Status.Deleted;
            var userStore = await _unitOfWork.AppUserRepository.GetByID(deleteStore.UserId);
            userStore.Status = (int)Status.Deleted;
            _unitOfWork.StoreRepository.Update(deleteStore);
            _unitOfWork.AppUserRepository.Update(userStore);
            var result = await _unitOfWork.SaveAsync() > 0 ? true : false;
            return result;

        }

        public async Task<PageEntity<StoreDTO>?> GetAllAsync(string? searchKey, int brandID, int? pageIndex = null, int? pageSize = null)
        {
            Expression<Func<Store, bool>> filter = searchKey != null
                ? x => x.Address.Contains(searchKey) && x.BrandId == brandID && (x.Status != (int)Status.Deleted)
                : x => x.BrandId == brandID && (x.Status != (int)Status.Deleted);
            Expression<Func<Store, bool>> filterRecord = x => x.Status != (int)Status.Deleted && x.BrandId == brandID;

            Func<IQueryable<Store>, IOrderedQueryable<Store>> orderBy = q => q.OrderByDescending(x => x.StoreId);
            string includeProperties = "Brand,User";

            var entities = await _unitOfWork.StoreRepository
                .Get(filter: filter, orderBy: orderBy, includeProperties: includeProperties, pageIndex: pageIndex, pageSize: pageSize);

            var pagin = new PageEntity<StoreDTO>();
            pagin.List = _mapper.Map<IEnumerable<StoreDTO>>(entities).ToList();
            pagin.TotalRecord = await _unitOfWork.StoreRepository.Count(filterRecord);
            pagin.TotalPage = PaginHelper.PageCount(pagin.TotalRecord, pageSize!.Value);
            return pagin;
        }

        public async Task<StoreDTO?> GetAsync(int id)
        {
            var store = await _unitOfWork.StoreRepository.GetByID(id);
            if (store == null || (store.Status == (int)Status.Deleted))
            {
                return null!;
            }
            var mapDTO = _mapper.Map<StoreDTO>(store);

            return mapDTO;
        }

        public async Task<BrandDTO> GetBrandOfStoreByUserID(int userId)
        {
            Expression<Func<Store, bool>> condition = x => x.UserId == userId && x.Status != (int)Status.Deleted;
            var storeEntity = await _unitOfWork.StoreRepository.GetByCondition(condition);
            if (storeEntity != null)
            {
                var brandEntity = await _unitOfWork.BrandRepository.GetByCondition(x => x.BrandId == storeEntity!.BrandId && x.Status != (int)Status.Deleted);
                return _mapper.Map<BrandDTO?>(brandEntity)!;
            }
            return null!;
        }

        public async Task<bool> Insert(StoreDTO entity)
        {
            var store = new Store();
            store.StoreCode = Guid.NewGuid().ToString();
            store.Address = entity.Address!;
            store.UserId = entity.UserId!.Value;
            store.UpdateDate = DateOnly.FromDateTime(DateTime.Now);
            store.CreateDate = DateOnly.FromDateTime(DateTime.Now);
            store.IsActive = true;
            store.City = entity.City!;
            store.Status = (int)Status.Exist;
            store.BrandId = entity.BrandId!.Value;

            await _unitOfWork.StoreRepository.Insert(store);
            var result = await _unitOfWork.SaveAsync() > 0 ? true : false;
            return result;
        }

        public async Task<bool> UpdateAsync(int id, StoreDTO entityToUpdate, int? brandId)
        {
            Expression<Func<Store, bool>> condition = x => x.StoreId == id && x.Status != (int)Status.Deleted;
            var store = await _unitOfWork.StoreRepository.GetByCondition(condition);
            if (store == null)
            {
                return false;
            }

            if (brandId != null)
            {
                var store1 = await _unitOfWork.StoreRepository.GetByCondition(s => s.BrandId == brandId);
                if (store1 == null)
                {
                    throw new Exception("cửa hàng không trùng khớp với brand Id");
                }
            }
            store.IsActive = entityToUpdate.IsActive;

            if (!string.IsNullOrEmpty(entityToUpdate.Address))
            {
                store.Address = entityToUpdate.Address;
            }

            if (!string.IsNullOrEmpty(entityToUpdate.City))
            {
                store.City = entityToUpdate.City;
            }

            store.UpdateDate = DateOnly.FromDateTime(DateTime.Now);

            _unitOfWork.StoreRepository.Update(store);
            var result = await _unitOfWork.SaveAsync() > 0 ? true : false;
            return result;
        }
    }
}

