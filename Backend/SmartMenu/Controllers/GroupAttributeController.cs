using Microsoft.AspNetCore.Mvc;
using SmartMenu.Interfaces;
using SmartMenu.Payloads.Responses;
using SmartMenu.Payloads;
using SmartMenu.DTOs;

namespace SmartMenu.Controllers
{
    [ApiController]
    public class GroupAttributeController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public GroupAttributeController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        //[Authorize(Roles = UserRoles.Admin)]
        [HttpGet(APIRoutes.GroupAttribute.GetAll, Name = "GetGroupAttributesAsync")]
        public async Task<IActionResult> GetAllAsync()
        {
            try
            {
                return Ok(new BaseResponse
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "Thành công!",
                    Data = await _unitOfWork.GroupAttributeRepository.GetAllAsync(),
                    IsSuccess = true
                });
            }
            catch
            {
                return NotFound(new BaseResponse
                {
                    StatusCode = StatusCodes.Status404NotFound,
                    Message = "Không tìm thấy!",
                    Data = null,
                    IsSuccess = false
                });
            }
        }
        //[Authorize(Roles = UserRoles.Admin)]
        [HttpPost(APIRoutes.GroupAttribute.Add, Name = "AddGroupAttributeAsync")]
        public async Task<IActionResult> AddAsync(string name)
        {
            try
            {
                if (await _unitOfWork.GroupAttributeRepository.GetByNameAsync(name) != null)
                {
                    return Conflict(new BaseResponse
                    {
                        StatusCode = StatusCodes.Status409Conflict,
                        Message = "Tên nhóm thuộc tính đã tồn tại!",
                        Data = null,
                        IsSuccess = false
                    });
                }

                var groupAttribute = await _unitOfWork.GroupAttributeRepository.AddAsync(name);

                return Ok(new BaseResponse
                {
                    StatusCode = StatusCodes.Status201Created,
                    Message = "Thêm thành công!",
                    Data = groupAttribute,
                    IsSuccess = true
                });
            }
            catch
            {
                return BadRequest(new BaseResponse
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    Message = "Thêm không thành công!",
                    Data = null,
                    IsSuccess = false
                });
            }
        }

        //[Authorize(Roles = UserRoles.Admin)]
        [HttpPut(APIRoutes.GroupAttribute.Update, Name = "UpdateGroupAttributeAsync")]
        public async Task<IActionResult> UpdateAsync(int id,string name)
        {
            try
            {
                var groupAttribute = await _unitOfWork.GroupAttributeRepository.GetAsync(id);
                if (groupAttribute == null)
                {
                    return NotFound(new BaseResponse
                    {
                        StatusCode = StatusCodes.Status404NotFound,
                        Message = "Không tìm thấy!",
                        Data = null,
                        IsSuccess = false
                    });
                }
                if (name != groupAttribute.GroupAttributeName)
                {
                    if (await _unitOfWork.GroupAttributeRepository.GetByNameAsync(name) != null)
                    {
                        return Conflict(new BaseResponse
                        {
                            StatusCode = StatusCodes.Status409Conflict,
                            Message = "Tên thuộc tính đã tồn tại!",
                            Data = null,
                            IsSuccess = false
                        });
                    }
                }

                groupAttribute.GroupAttributeName = name;

                await _unitOfWork.GroupAttributeRepository.UpdateAsync(id, groupAttribute);

                return Ok(new BaseResponse
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "Cập nhật thành công!",
                    Data = groupAttribute,
                    IsSuccess = true
                });
            }
            catch
            {
                return BadRequest(new BaseResponse
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    Message = "Cập nhật không thành công!",
                    Data = null,
                    IsSuccess = false
                });
            }
        }

        //[Authorize(Roles = UserRoles.Admin)]
        //[HttpDelete(APIRoutes.GroupAttribute.Delete, Name = "DeleteGroupAttributeAsync")]
        //public async Task<IActionResult> DeleteAsync(int id)
        //{
        //    try
        //    {
        //        var groupAttribute = await _unitOfWork.GroupAttributeRepository.GetAsync(id);
        //        if (groupAttribute == null)
        //        {
        //            return NotFound(new BaseResponse
        //            {
        //                StatusCode = StatusCodes.Status404NotFound,
        //                Message = "Không tìm thấy!",
        //                Data = null,
        //                IsSuccess = false
        //            });
        //        }

        //        await _unitOfWork.GroupAttributeRepository.DeleteAsync(id);

        //        return Ok(new BaseResponse
        //        {
        //            StatusCode = StatusCodes.Status200OK,
        //            Message = "Xóa thành công!",
        //            Data = null,
        //            IsSuccess = true
        //        });
        //    }
        //    catch
        //    {
        //        return BadRequest(new BaseResponse
        //        {
        //            StatusCode = StatusCodes.Status400BadRequest,
        //            Message = "Xóa không thành công!",
        //            Data = null,
        //            IsSuccess = false
        //        });
        //    }
        //}
    }
}

