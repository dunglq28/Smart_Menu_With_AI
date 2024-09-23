using AutoMapper;
using FSU.SmartMenuWithAI.Repository.Entities;
using FSU.SmartMenuWithAI.Repository.UnitOfWork;
using FSU.SmartMenuWithAI.Service.Common.Enums;
using FSU.SmartMenuWithAI.Service.ISerivice;
using FSU.SmartMenuWithAI.Service.Models;
using FSU.SmartMenuWithAI.Service.Models.Pagination;
using FSU.SmartMenuWithAI.Service.Utils;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using static Amazon.S3.Util.S3EventNotification;

namespace FSU.SmartMenuWithAI.Service.Services
{
    public class AppUserService : IAppUserService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        public AppUserService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }
        public async Task<int> Count()
        {
            Expression<Func<AppUser, bool>> filter = x => x.Status != (int)Status.Deleted;
            return await _unitOfWork.AppUserRepository.Count(filter: filter);
        }

        public async Task<bool> Delete(int id, int? brandId)
        {
            var deleteAppUser = await _unitOfWork.AppUserRepository.GetByID(id);
            if (deleteAppUser == null)
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
            deleteAppUser.Status = (int)Status.Deleted;

            _unitOfWork.AppUserRepository.Update(deleteAppUser);
            var result = await _unitOfWork.SaveAsync() > 0 ? true : false;
            return result;
        }

        public async Task<PageEntity<AppUserDTO>> Get(int currentIDLogin, string? searchKey, int? brandID, int? pageIndex = null, int? pageSize = null)
        {
            //Expression<Func<AppUser, bool>> filter = searchKey != null
            //    ? x => x.UserName.Contains(searchKey) && x.RoleId != (int)UserRole.Admin && !(x.Status == (int)Status.Deleted)
            //    : x => x.RoleId != (int)UserRole.Admin && !(x.Status == (int)Status.Deleted);
            //Expression<Func<AppUser, bool>> filterRecord = x => (x.Status != (int)Status.Deleted && x.RoleId != (int)UserRole.Admin);

            // Bước 1: Lấy danh sách storeUserIds nếu brandID không null
            List<int> storeUserIds = new List<int>();
            if (brandID != null)
            {

                var stores = await _unitOfWork.StoreRepository
                    .Get(s => s.BrandId == brandID); // Đợi để lấy kết quả

                storeUserIds = stores
                    .Select(s => s.UserId) // Sau khi đợi, xử lý kết quả
                    .Distinct()
                    .ToList();
            }
            Expression<Func<AppUser, bool>> filter;

            if (brandID != null)
            {
                filter = searchKey != null
                    ? x => x.UserName.Contains(searchKey) && storeUserIds.Contains(x.UserId) && x.RoleId == (int)UserRole.Store && !(x.Status == (int)Status.Deleted)
                    : x => storeUserIds.Contains(x.UserId) && x.RoleId == (int)UserRole.Store && !(x.Status == (int)Status.Deleted);
            }
            else
            {
                filter = searchKey != null
                    ? x => x.UserName.Contains(searchKey) && x.RoleId != (int)UserRole.Admin && !(x.Status == (int)Status.Deleted)
                    : x => x.RoleId != (int)UserRole.Admin && !(x.Status == (int)Status.Deleted);
            }

            Func<IQueryable<AppUser>, IOrderedQueryable<AppUser>> orderBy = q => q.OrderByDescending(x => x.UserId);
            string includeProperties = "Role";

            var entities = _unitOfWork.AppUserRepository.Get(currentIDLogin, filter: filter, orderBy: orderBy, includeProperties: includeProperties, pageIndex: pageIndex, pageSize: pageSize).ToList();
            var pagin = new PageEntity<AppUserDTO>();
            pagin.List = _mapper.Map<IEnumerable<AppUserDTO>>(entities).ToList();
            pagin.TotalRecord = await _unitOfWork.AppUserRepository.Count(filter);
            pagin.TotalPage = PaginHelper.PageCount(pagin.TotalRecord, pageSize!.Value);
            return pagin;
        }

        public async Task<AppUserDTO?> GetByID(int id)
        {
            Expression<Func<AppUser, bool>> condition = x => x.UserId == id && (x.Status != (int)Status.Deleted);
            var entity = await _unitOfWork.AppUserRepository.GetByCondition(condition);
            if (entity == null)
            {
                return null!;
            }
            return _mapper?.Map<AppUserDTO?>(entity);
        }

        public async Task<int> Insert(AppUserDTO dto)
        {
            var user = _mapper.Map<AppUser>(dto);
            user.UserCode = Guid.NewGuid().ToString();
            user.Status = (int)Status.Exist;
            user.CreateDate = DateOnly.FromDateTime(DateTime.Now);
            user.Password = PasswordHelper.ConvertToEncrypt("123456");
            //user.IsActive = false;

            Expression<Func<AppUser, bool>> duplicateName = x => x.UserName.Equals(user.UserName) && (x.Status != (int)Status.Deleted);
            var exist = await _unitOfWork.AppUserRepository.GetByCondition(duplicateName);
            if (exist != null)
            {
                throw new DbUpdateException("Tên đã tồn tại");
            }
            var newUser = await _unitOfWork.AppUserRepository.Insert(user);
            var result = await _unitOfWork.SaveAsync() > 0 ? true : false;
            if (result && newUser != null)
            {
                return newUser.UserId;
            }
            return 0;
        }

        public async Task<bool> Update(int id, AppUserDTO entityToUpdate, int? brandId)
        {
            Expression<Func<AppUser, bool>> condition = x => x.UserId == id && (x.Status != (int)Status.Deleted);
            var updateAppUser = await _unitOfWork.AppUserRepository.GetByCondition(condition);
            if (updateAppUser == null)
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
            if (!string.IsNullOrEmpty(entityToUpdate.Password))
            {
                updateAppUser.Password = PasswordHelper.ConvertToEncrypt(entityToUpdate.Password);
            }

            if (entityToUpdate.Status != default)
            {
                updateAppUser.Status = entityToUpdate.Status;
            }

            if (!string.IsNullOrEmpty(entityToUpdate.Fullname))
            {
                updateAppUser.Fullname = entityToUpdate.Fullname;
            }

            if (!string.IsNullOrEmpty(entityToUpdate.Phone))
            {
                updateAppUser.Phone = entityToUpdate.Phone;
            }

            if (entityToUpdate.Dob.HasValue)
            {
                updateAppUser.Dob = entityToUpdate.Dob.Value;
            }

            if (!string.IsNullOrEmpty(entityToUpdate.Gender))
            {
                updateAppUser.Gender = entityToUpdate.Gender;
            }

            if (!string.IsNullOrEmpty(entityToUpdate.Gender))
            {
                updateAppUser.Gender = entityToUpdate.Gender;
            }


            updateAppUser.IsActive = entityToUpdate.IsActive;


            if (entityToUpdate.UpdateBy != default)
            {
                updateAppUser.UpdateBy = entityToUpdate.UpdateBy;
            }

            updateAppUser.UpdateDate = DateOnly.FromDateTime(DateTime.Now);

            _unitOfWork.AppUserRepository.Update(updateAppUser);
            var result = await _unitOfWork.SaveAsync() > 0 ? true : false;
            return result;
        }
    }
}
