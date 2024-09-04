using AutoMapper;
using FSU.SmartMenuWithAI.Repository.Entities;
using FSU.SmartMenuWithAI.Repository.UnitOfWork;
using FSU.SmartMenuWithAI.Service.ISerivice;
using FSU.SmartMenuWithAI.Service.Models;
using FSU.SmartMenuWithAI.Service.Models.Menu;
using FSU.SmartMenuWithAI.Service.Models.MenuList;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace FSU.SmartMenuWithAI.Service.Services
{
    public class MenuSegmentService : IMenuSegmentService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public MenuSegmentService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<bool> Delete(int menuId, int SegmentID)
        {
            Expression<Func<MenuSegment, bool>> condition = x => x.MenuId == menuId && x.SegmentId == SegmentID;
            var menuSegment = await _unitOfWork.MenuSegmentRepository.GetByCondition(condition);
            if (menuSegment == null)
            {
                return false;
            }
            _unitOfWork.MenuSegmentRepository.Delete(menuSegment);
            var result = await _unitOfWork.SaveAsync() > 0 ? true : false;
            return result;
        }

        public async Task<MenuSegmentDTO?> GetByID(int menuId, int SegmentId)
        {
            Expression<Func<MenuSegment, bool>> condition = x => x.MenuId == menuId && x.SegmentId == SegmentId;
            var menuSegment = await _unitOfWork.MenuSegmentRepository.GetByCondition(condition);
            var mapdto = _mapper.Map<MenuSegmentDTO>(menuSegment);
            return mapdto;
        }

        public async Task<List<MenuSegmentDTO>> Insert(int MenuId, int Priority, List<CreateMenuSegmentDTO> segmentIds)
        {
            var menuSegs = new List<MenuSegment>();
            foreach (var item in segmentIds)
            {
                var menuSegment = new MenuSegment
                {
                    MenuId = MenuId,
                    Priority = Priority,
                    SegmentId = item.SegmentId
                };
                await _unitOfWork.MenuSegmentRepository.Insert(menuSegment);
                menuSegs.Add(menuSegment);
            }
            var result = await _unitOfWork.SaveAsync() > 0 ? true : false;
            if (result)
            {
               var mapdtos = _mapper.Map<List<MenuSegmentDTO>>(menuSegs);
                return mapdtos;
            }
            return null!;
        }

        public async Task<MenuSegmentDTO?> Update(MenuSegmentDTO entityToUpdate)
        {
            Expression<Func<MenuSegment, bool>> condition = x => x.MenuId == entityToUpdate.MenuId && x.SegmentId == entityToUpdate.SegmentId;
            var menuSegment = await _unitOfWork.MenuSegmentRepository.GetByCondition(condition);
            if (menuSegment != null)
            {
                _unitOfWork.MenuSegmentRepository.Update(menuSegment);
            }
            var result = await _unitOfWork.SaveAsync() > 0 ? true : false;
            if (!result)
            {
                return entityToUpdate;
            }
            return null!;
        }
    }
}
