using Amazon.Rekognition.Model;
using AutoMapper;
using Azure.Core;
using FSU.SmartMenuWithAI.Repository.Entities;
using FSU.SmartMenuWithAI.Repository.UnitOfWork;
using FSU.SmartMenuWithAI.Service.Common.Enums;
using FSU.SmartMenuWithAI.Service.ISerivice;
using FSU.SmartMenuWithAI.Service.Models;
using FSU.SmartMenuWithAI.Service.Models.ListPosition;
using FSU.SmartMenuWithAI.Service.Models.Pagination;
using FSU.SmartMenuWithAI.Service.Utils;
using System.Linq.Expressions;

namespace FSU.SmartMenuWithAI.Service.Services
{
    public class ListPositionService : IListPositionService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ListPositionService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }
        public async Task<ListPositionDTO> GetByID(int id)
        {
            Expression<Func<ListPosition, bool>> condition = x => x.ListId == id;
            var entity = await _unitOfWork.ListPositionRepository.GetByCondition(condition);
            return _mapper?.Map<ListPositionDTO?>(entity)!;
        }

        public async Task<PageEntity<ListPositionDTO>> GetListPositionByBrandID(int searchKey, int? pageIndex = null, int? pageSize = null)
        {

            Expression<Func<ListPosition, bool>> filter = x => x.BrandId == searchKey;

            var entities = await _unitOfWork.ListPositionRepository.Get(filter: filter, pageIndex: pageIndex, pageSize: pageSize);
            var pagin = new PageEntity<ListPositionDTO>();
            pagin.List = _mapper.Map<IEnumerable<ListPositionDTO>>(entities).ToList();
            pagin.TotalRecord = await _unitOfWork.ListPositionRepository.Count(filter);
            pagin.TotalPage = PaginHelper.PageCount(pagin.TotalRecord, pageSize!.Value);
            return pagin;
        }
        public async Task<ListPositionDTO> UpdateAsync(int id, int totalProduct, string listName)
        {
            var listPosition = await _unitOfWork.ListPositionRepository.GetByID(id);
            if (listPosition == null)
                return null!;
            if (listPosition == null)
                return null!;

            // Validate listName
            if (string.IsNullOrEmpty(listName))
                return null!;

            // Validate totalProduct
            if (totalProduct <= 0)
                return null!;
            listPosition.TotalProduct = totalProduct;
            listPosition.ListName = listName;
            _unitOfWork.ListPositionRepository.Update(listPosition);
            var result = await _unitOfWork.SaveAsync() > 0 ? true : false;
            return _mapper.Map<ListPositionDTO>(listPosition);
        }
        public async Task<ListPositionDTO> Insert(int totalProduct, int brandId, string listName)
        {
            var listPosition = new ListPosition();
            listPosition.ListCode = Guid.NewGuid().ToString();
            listPosition.BrandId = brandId;
            listPosition.TotalProduct = totalProduct;
            listPosition.ListName = listName;
            listPosition.CreateDate = DateOnly.FromDateTime(DateTime.Now);

            Expression<Func<Brand, bool>> condition = x => x.BrandId == brandId && (x.Status != (int)Status.Deleted);
            var entity = await _unitOfWork.BrandRepository.GetByCondition(condition);
            if (entity == null)
            {
                throw new Exception("Không tìm thấy brand");
            }
            await _unitOfWork.ListPositionRepository.Insert(listPosition);
            var result = await _unitOfWork.SaveAsync() > 0 ? true : false;
            if (result)
            {
                return _mapper?.Map<ListPositionDTO>(listPosition)!;
            }
            return null!;
        }
        public async Task<List<ListPositionDTO>> Insert2(int brandId, List<ListDetail> listDetails)
        {
            // Kiểm tra nếu listDetails là null hoặc không có phần tử nào
            if (listDetails == null || !listDetails.Any())
            {
                throw new ArgumentException("ListDetails cannot be null or empty.");
            }
            Expression<Func<Brand, bool>> condition = x => x.BrandId == brandId && (x.Status != (int)Status.Deleted);
            var entity = await _unitOfWork.BrandRepository.GetByCondition(condition);
            if (entity == null)
            {
                throw new Exception("Không tìm thấy brand");
            }

            var listPositionDTOs = new List<ListPositionDTO>();

            foreach (var detail in listDetails)
            {
                var listPosition = new ListPosition
                {
                    ListCode = Guid.NewGuid().ToString(),
                    BrandId = brandId,
                    TotalProduct = detail.TotalProduct,
                    ListName = detail.ListName,
                    CreateDate = DateOnly.FromDateTime(DateTime.Now)
                };
                await _unitOfWork.ListPositionRepository.Insert(listPosition);
                var result = await _unitOfWork.SaveAsync() > 0 ? true : false;
                if (result)
                {
                    var listPositionDTO = _mapper?.Map<ListPositionDTO>(listPosition);
                    if (listPositionDTO != null)
                    {
                        listPositionDTOs.Add(listPositionDTO);
                    }
                }
                else
                {
                    throw new Exception("Lỗi khi lưu vào cơ sở dữ liệu");
                }
            }
            // Lưu các thay đổi vào cơ sở dữ liệu
            await _unitOfWork.SaveAsync();
            return listPositionDTOs;
        }
        public async Task<bool> DeleteAsync(int id)
        {
            var listPosition = await _unitOfWork.ListPositionRepository.GetByID(id);
            if (listPosition == null)
                return false;

            _unitOfWork.ListPositionRepository.Delete(listPosition);
            await _unitOfWork.SaveAsync();
            return true;
        }
        public async Task<List<ListPositionDTO>> UpdateAsync2(int brandID, List<ListDetailUpdate> listDetailUpdates)
        {
            var listPositionDTOs = new List<ListPositionDTO>();

            foreach (var detail in listDetailUpdates)
            {
                var listPositionToUpdate = await _unitOfWork.ListPositionRepository.GetByID(detail.ListId);
                listPositionToUpdate.ListName = detail.ListName;
                listPositionToUpdate.TotalProduct = detail.TotalProduct;
                _unitOfWork.ListPositionRepository.Update(listPositionToUpdate);
                var result = await _unitOfWork.SaveAsync() > 0 ? true : false;
                if (result)
                {
                    var listPositionDTO = _mapper?.Map<ListPositionDTO>(listPositionToUpdate);
                    if (listPositionDTO != null)
                    {
                        listPositionDTOs.Add(listPositionDTO);
                    }
                }
                else
                {
                    throw new Exception("Lỗi khi cập nhật vào cơ sở dữ liệu");
                }
            }
            // Lưu các thay đổi vào cơ sở dữ liệu
            await _unitOfWork.SaveAsync();
            return listPositionDTOs;
        }
    }
}
