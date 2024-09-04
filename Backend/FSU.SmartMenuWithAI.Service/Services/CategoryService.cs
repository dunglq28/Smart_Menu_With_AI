using AutoMapper;
using FSU.SmartMenuWithAI.Repository.Entities;
using FSU.SmartMenuWithAI.Repository.UnitOfWork;
using FSU.SmartMenuWithAI.Service.Common.Enums;
using FSU.SmartMenuWithAI.Service.ISerivice;
using FSU.SmartMenuWithAI.Service.Models;
using FSU.SmartMenuWithAI.Service.Models.Pagination;
using FSU.SmartMenuWithAI.Service.Models.ViewModel;
using FSU.SmartMenuWithAI.Service.Utils;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq.Expressions;
using static Amazon.S3.Util.S3EventNotification;

namespace FSU.SmartMenuWithAI.Service.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        public CategoryService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<bool> Insert(CategoryDTO reqObj)
        {
            var category = new Category();
            category.CategoryCode = Guid.NewGuid().ToString();
            category.CategoryName = reqObj.CategoryName;
            category.UpdateDate = DateOnly.FromDateTime(DateTime.Now);
            category.CreateDate = DateOnly.FromDateTime(DateTime.Now);
            category.Status = (int)Status.Exist;
            category.BrandId = reqObj.BrandId;

            Expression<Func<Category, bool>> duplicateName = x => x.BrandId == reqObj.BrandId && x.CategoryName.Equals(category.CategoryName) && (x.Status != (int)Status.Deleted);
            var exist = await _unitOfWork.CategoryRepository.GetByCondition(duplicateName);
            if (exist != null)
            {
                throw new DbUpdateException("Tên đã tồn tại");
            }
            await _unitOfWork.CategoryRepository.Insert(category);
            var result = await _unitOfWork.SaveAsync() > 0 ? true : false;
            return result;
        }

        public async Task<bool> UpdateAsync(int id, string cagetoryName, int brandId)
        {
            Expression<Func<Category, bool>> condition = x =>
            x.CategoryName.Equals(cagetoryName)
            && x.BrandId == brandId
            && x.CategoryId != id
            && (x.Status != (int)Status.Deleted);
            var exist = await _unitOfWork.CategoryRepository.GetByCondition(condition);
            if (exist != null)
            {
                throw new Exception("Tên đã tồn tại");
            }
            var category = await _unitOfWork.CategoryRepository.GetByID(id);
            if (category == null)
            {
                return false;
            }
            if (!string.IsNullOrEmpty(category.CategoryName))
            {
                category.CategoryName = cagetoryName;

            }
            category.UpdateDate = DateOnly.FromDateTime(DateTime.Now);


            _unitOfWork.CategoryRepository.Update(category);
            var result = await _unitOfWork.SaveAsync() > 0 ? true : false;
            return result;
        }

        public async Task<PageEntity<CategoryDTO>?> GetAllAsync(string? searchKey, int brandID, int? pageIndex, int? pageSize)
        {
            Expression<Func<Category, bool>> filter = searchKey != null
                ? x => x.CategoryName.Contains(searchKey) && x.BrandId == brandID && (x.Status != (int)Status.Deleted)
                : x => x.BrandId == brandID && (x.Status != (int)Status.Deleted);
            //Expression<Func<Category, bool>> filterRecord =  x =>  (x.Status != (int)Status.Deleted) && x.BrandId == brandID;


            Func<IQueryable<Category>, IOrderedQueryable<Category>> orderBy = q => q.OrderByDescending(x => x.CategoryId);
            string includeProperties = "Brand";

            var entities = await _unitOfWork.CategoryRepository
                .Get(filter: filter, orderBy: orderBy, includeProperties: includeProperties, pageIndex: pageIndex, pageSize: pageSize);
            var pagin = new PageEntity<CategoryDTO>();
            pagin.List = _mapper.Map<IEnumerable<CategoryDTO>>(entities).ToList();
            pagin.TotalRecord = await _unitOfWork.CategoryRepository.Count(filter);
            pagin.TotalPage = PaginHelper.PageCount(pagin.TotalRecord, pageSize!.Value);
            return pagin;
        }

        public async Task<CategoryDTO?> GetAsync(int id)
        {
            Expression<Func<Category, bool>> condition = x => x.CategoryId == id && (x.Status != (int)Status.Deleted);

            var category = await _unitOfWork.CategoryRepository.GetByCondition(condition);
            if (category == null)
            {
                return null!;
            }
            var mapDTO = _mapper.Map<CategoryDTO>(category);
            return mapDTO;
        }

        public async Task<bool> Delete(int id)
        {
            var deleteCategory = await _unitOfWork.CategoryRepository.GetByID(id);
            if (deleteCategory == null)
            {
                return false;
            }
            deleteCategory.Status = (int)Status.Deleted;

            _unitOfWork.CategoryRepository.Update(deleteCategory);
            var result = await _unitOfWork.SaveAsync() > 0 ? true : false;
            return result;
        }

        public async Task<List<CategoryViewModel>> GetByBrandID(int brandId)
        {
            Expression<Func<Category, bool>> condition = x => x.BrandId == brandId && (x.Status != (int)Status.Deleted);
            var listCategory = await _unitOfWork.CategoryRepository.GetAllNoPaging(filter: condition, orderBy: null!, includeProperties: null!);
            var mapDTO = _mapper.Map<IEnumerable<CategoryViewModel>>(listCategory);
            return mapDTO.ToList();
        }
    }
}
