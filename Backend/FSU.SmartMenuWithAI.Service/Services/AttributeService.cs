using AutoMapper;
using FSU.SmartMenuWithAI.Repository.Entities;
using FSU.SmartMenuWithAI.Repository.UnitOfWork;
using FSU.SmartMenuWithAI.Service.Common.Enums;
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
using Attribute = FSU.SmartMenuWithAI.Repository.Entities.Attribute;

namespace FSU.SmartMenuWithAI.Service.Services
{
    public class AttributeService : IAttributeService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public AttributeService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }
        public async Task<AttributeDTO> Insert(string name, string description, int groupID)
        {
            Expression<Func<GroupAttribute, bool>> groupCondition = x => x.GroupAttributeId == groupID;
            var groupExists = await _unitOfWork.GroupAttributeRepository.GetByCondition(groupCondition) != null;
            if (!groupExists)
            {
                throw new Exception("nhóm thuộc tính không tồn tại");
            }
            Expression<Func<Attribute, bool>> condition = x => x.AttributeName == name && (x.Status != (int)Status.Deleted);
            var entity = await _unitOfWork.AttributeRepository.GetByCondition(condition);
            if (entity != null)
            {
                throw new Exception("Tên thuộc tính đã tồn tại");
            }
            var attribute = new Attribute();
            attribute.AttributeCode = Guid.NewGuid().ToString();
            attribute.AttributeName = name;
            attribute.Description = description;
            attribute.CreateDate = DateOnly.FromDateTime(DateTime.Now);
            attribute.Status = (int)Status.Exist;
            attribute.UpdateDate = DateOnly.FromDateTime(DateTime.Now);
            attribute.GroupAttributeId = groupID;

            await _unitOfWork.AttributeRepository.Insert(attribute);
            var result = await _unitOfWork.SaveAsync() > 0 ? true : false;
            if (result)
            {
                return _mapper?.Map<AttributeDTO>(attribute)!;
            }
            return null!;
        }
        public async Task<bool> Delete(int id)
        {
            var attributeDelete = await _unitOfWork.AttributeRepository.GetByID(id);
            if (attributeDelete == null || attributeDelete.Status == (int)Status.Deleted)
            {
                return false;
            }
            attributeDelete.Status = (int)Status.Deleted;

            _unitOfWork.AttributeRepository.Update(attributeDelete);
            var result = await _unitOfWork.SaveAsync() > 0 ? true : false;
            return result;
        }
        public async Task<AttributeDTO> Update(int id, string name, string description, int? groupID)
        {
            var attributeToUpdate = await _unitOfWork.AttributeRepository.GetByID(id);
            if (attributeToUpdate == null || (attributeToUpdate.Status == (int)Status.Deleted))
            {
                throw new Exception("Thuộc tính không tồn tại");
            }
            Expression<Func<Attribute, bool>> condition = x => x.AttributeName == name && (x.Status != (int)Status.Deleted) && (x.AttributeId != id);
            var entity = await _unitOfWork.AttributeRepository.GetByCondition(condition);
            if (entity != null)
            {
                throw new Exception("Tên đã tồn tại");
            }
            if (!string.IsNullOrEmpty(name))
            {
                attributeToUpdate.AttributeName = name;
            }

            if (!string.IsNullOrEmpty(description))
            {
                attributeToUpdate.Description = description;
            }

            if (groupID.HasValue)
            {
                Expression<Func<GroupAttribute, bool>> groupCondition = x => x.GroupAttributeId == groupID;
                var groupExists = await _unitOfWork.GroupAttributeRepository.GetByCondition(groupCondition) != null;
                if (!groupExists)
                {
                    throw new Exception("id nhóm thuộc tính không tồn tại");
                }
                attributeToUpdate.GroupAttributeId = groupID.Value;
            }
            attributeToUpdate.UpdateDate = DateOnly.FromDateTime(DateTime.Now);
            _unitOfWork.AttributeRepository.Update(attributeToUpdate);
            var result = await _unitOfWork.SaveAsync() > 0 ? true : false;
            if (result)
            {
                return _mapper?.Map<AttributeDTO>(attributeToUpdate)!;
            }
            return null!;
        }
        public async Task<PageEntity<AttributeDTO>> Get(string? searchKey, int? pageIndex = null, int? pageSize = null)
        {

            Expression<Func<Attribute, bool>> filter = x => (string.IsNullOrEmpty(searchKey) || x.AttributeName.Contains(searchKey));

            Func<IQueryable<Attribute>, IOrderedQueryable<Attribute>> orderBy = q => q.OrderByDescending(x => x.AttributeId);

            var entities = await _unitOfWork.AttributeRepository.Get(filter: filter, orderBy: orderBy, pageIndex: pageIndex, pageSize: pageSize);
            var pagin = new PageEntity<AttributeDTO>();
            pagin.List = _mapper.Map<IEnumerable<AttributeDTO>>(entities).ToList();
            pagin.TotalRecord = await _unitOfWork.AttributeRepository.Count(filter);
            pagin.TotalPage = PaginHelper.PageCount(pagin.TotalRecord, pageSize!.Value);
            return pagin;
        }
        public async Task<AttributeDTO> GetByID(int id)
        {
            Expression<Func<Attribute, bool>> condition = x => x.AttributeId == id && x.Status != (int)Status.Deleted;
            var entity = await _unitOfWork.AttributeRepository.GetByCondition(condition);
            return _mapper?.Map<AttributeDTO?>(entity)!;
        }
    }
}
