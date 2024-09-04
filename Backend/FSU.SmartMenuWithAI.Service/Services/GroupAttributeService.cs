using AutoMapper;
using FSU.SmartMenuWithAI.Repository.Entities;
using FSU.SmartMenuWithAI.Repository.UnitOfWork;
using FSU.SmartMenuWithAI.Service.ISerivice;
using FSU.SmartMenuWithAI.Service.Models;
using FSU.SmartMenuWithAI.Service.Models.Pagination;
using FSU.SmartMenuWithAI.Service.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace FSU.SmartMenuWithAI.Service.Services
{
    public class GroupAttributeService : IGroupAttributeService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public GroupAttributeService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }
        public async Task<GroupAttributeDTO> Insert(string groupName)
        {
            var group = new GroupAttribute();
            group.GroupAttributeName = groupName;
            group.CreateDate = DateOnly.FromDateTime(DateTime.Now);

            Expression<Func<GroupAttribute, bool>> condition = x => x.GroupAttributeName == group.GroupAttributeName /*&& (x.Status != (int)Status.Deleted)*/;
            var entity = await _unitOfWork.GroupAttributeRepository.GetByCondition(condition);
            if (entity != null)
            {
                throw new Exception("Tên đã tồn tại");
            }
            await _unitOfWork.GroupAttributeRepository.Insert(group);
            var result = await _unitOfWork.SaveAsync() > 0 ? true : false;
            if (!result)
            {
                throw new Exception("Lỗi khi thêm vào database!");
            }
            return _mapper?.Map<GroupAttributeDTO>(group)!;
        }

        public async Task<bool> Delete(int id)
        {
            var brandDelete = await _unitOfWork.GroupAttributeRepository.GetByID(id);
            if (brandDelete == null)
            {
                return false;
            }
            _unitOfWork.GroupAttributeRepository.Delete(brandDelete);
            var result = await _unitOfWork.SaveAsync() > 0 ? true : false;
            return result;
        }

        public async Task<GroupAttributeDTO> Update(int id, string name)
        {
            Expression<Func<GroupAttribute, bool>> condition = x => x.GroupAttributeName == name && (x.GroupAttributeId != id);
            var entity = await _unitOfWork.GroupAttributeRepository.GetByCondition(condition);
            if (entity != null)
            {
                throw new Exception("Tên đã tồn tại");
            }

            var entityToUpdate = await _unitOfWork.GroupAttributeRepository.GetByID(id);

            if (!string.IsNullOrEmpty(name))
            {
                entityToUpdate.GroupAttributeName = name;
            }

            _unitOfWork.GroupAttributeRepository.Update(entityToUpdate);
            var result = await _unitOfWork.SaveAsync() > 0 ? true : false;

            return _mapper?.Map<GroupAttributeDTO>(entityToUpdate)!;
        }
        public async Task<PageEntity<GroupAttributeDTO>> Get(string? searchKey, int? pageIndex = null, int? pageSize = null)
        {

            Expression<Func<GroupAttribute, bool>> filter = x => (string.IsNullOrEmpty(searchKey) || x.GroupAttributeName.Contains(searchKey));

            Func<IQueryable<GroupAttribute>, IOrderedQueryable<GroupAttribute>> orderBy = q => q.OrderByDescending(x => x.GroupAttributeId);

            var entities = await _unitOfWork.GroupAttributeRepository.Get(filter: filter, orderBy: orderBy, pageIndex: pageIndex, pageSize: pageSize);
            var pagin = new PageEntity<GroupAttributeDTO>();
            pagin.List = _mapper.Map<IEnumerable<GroupAttributeDTO>>(entities).ToList();
            pagin.TotalRecord = await _unitOfWork.GroupAttributeRepository.Count(filter);
            pagin.TotalPage = PaginHelper.PageCount(pagin.TotalRecord, pageSize!.Value);
            return pagin;
        }
        public async Task<GroupAttributeDTO> GetByID(int id)
        {
            Expression<Func<GroupAttribute, bool>> condition = x => x.GroupAttributeId == id;
            var entity = await _unitOfWork.GroupAttributeRepository.GetByCondition(condition);
            return _mapper?.Map<GroupAttributeDTO?>(entity)!;
        }
    }
}
