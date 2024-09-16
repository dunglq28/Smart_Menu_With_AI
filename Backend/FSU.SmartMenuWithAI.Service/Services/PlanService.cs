using Amazon.Auth.AccessControlPolicy;
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
    public class PlanService : IPlanService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        public PlanService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }
        public async Task<PlanDTO?> GetByIdAsync(int id)
        {
            Expression<Func<Plan, bool>> condition = x => x.PlanId == id;
            var entity = await _unitOfWork.PlanRepository.GetByCondition(condition);
            return _mapper?.Map<PlanDTO?>(entity)!;
        }
        public async Task<List<PlanDTO>?> GetAll()
        {
            var entity = await _unitOfWork.PlanRepository.Get();
            return _mapper?.Map<List<PlanDTO>?>(entity)!;
        }
        public async Task<PlanDTO> Insert(string planName, int maxMenu, int maxAccount, decimal price)
        {
            // Kiểm tra nếu giá trị của price không dương
            if (price <= 0)
            {
                throw new Exception("Giá phải lớn hơn 0");
            }
            var plan = new Plan();
            plan.PlanName = planName;
            plan.MaxMenu = maxMenu;
            plan.MaxAccount = maxAccount; 
            plan.Price = price;

            Expression<Func<Plan, bool>> condition = x => x.PlanName == plan.PlanName;
            var entity = await _unitOfWork.PlanRepository.GetByCondition(condition);
            if (entity != null)
            {
                throw new Exception("Tên đã tồn tại");
            }
            await _unitOfWork.PlanRepository.Insert(plan);
            var result = await _unitOfWork.SaveAsync() > 0 ? true : false;
            if (result)
            {
                return _mapper?.Map<PlanDTO>(plan)!;
            }
            return null!;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            // Tìm kiếm kế hoạch theo id
            var entity = await _unitOfWork.PlanRepository.GetByCondition(x => x.PlanId == id);
            if (entity == null)
            {
                throw new Exception("Không tìm thấy dịch vụ");
            }

            // Xóa kế hoạch
            _unitOfWork.PlanRepository.Delete(entity);

            // Lưu thay đổi
            var result = await _unitOfWork.SaveAsync() > 0;

            return result;
        }

        public async Task<PlanDTO?> UpdateAsync(int id, string planName, int maxMenu, int maxAccount, decimal price)
        {
            // Tìm kế hoạch theo id
            var plan = await _unitOfWork.PlanRepository.GetByCondition(x => x.PlanId == id);
            if (plan == null)
            {
                throw new Exception("Không tìm thấy dịch vụ");
            }

            // Kiểm tra nếu giá trị của price không dương
            if (price <= 0)
            {
                throw new Exception("Giá phải lớn hơn 0");
            }
            Expression<Func<Plan, bool>> condition = x => x.PlanName == plan.PlanName && x.PlanId != id;
            var entity = await _unitOfWork.PlanRepository.GetByCondition(condition);
            if (entity != null)
            {
                throw new Exception("Tên đã tồn tại");
            }
            // Cập nhật các thuộc tính của kế hoạch
            plan.PlanName = planName;
            plan.MaxAccount = maxAccount;
            plan.MaxMenu = maxMenu;
            plan.Price = price;

            // Lưu thay đổi
            _unitOfWork.PlanRepository.Update(plan);
            var result = await _unitOfWork.SaveAsync() > 0;

            if (result)
            {
                return _mapper.Map<PlanDTO>(plan);
            }

            return null;
        }

    }
}
