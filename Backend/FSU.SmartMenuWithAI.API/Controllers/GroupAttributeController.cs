using FSU.SmartMenuWithAI.API.Payloads.Request.Brand;
using FSU.SmartMenuWithAI.API.Payloads.Responses;
using FSU.SmartMenuWithAI.API.Payloads;
using FSU.SmartMenuWithAI.API.Validations;
using FSU.SmartMenuWithAI.Service.ISerivice;
using FSU.SmartMenuWithAI.Service.Services;
using Microsoft.AspNetCore.Mvc;
using FSU.SmartMenuWithAI.API.Payloads.Request.GroupAttribute;
using FSU.SmartMenuWithAI.API.Common.Constants;
using Microsoft.AspNetCore.Authorization;

namespace FSU.SmartMenuWithAI.API.Controllers
{
    public class GroupAttributeController : ControllerBase
    {
        private readonly IGroupAttributeService _groupAttributeService;

        public GroupAttributeController(IGroupAttributeService groupAttributeService)
        {
            _groupAttributeService = groupAttributeService;
        }

        //[Authorize(Roles = UserRoles.BrandManager)]
        [HttpPost(APIRoutes.GroupAttribute.Add, Name = "AddGroupAttributeAsync")]
        public async Task<IActionResult> AddAsync([FromForm] CreateGroupAttributeRequest reqObj)
        {
            try
            {
              
                var groupAttributeAdd = await _groupAttributeService.Insert(reqObj.GroupAttributeName);
                return Ok(new BaseResponse
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "Tạo nhóm thuộc tính mới thành công",
                    Data = groupAttributeAdd,
                    IsSuccess = true
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    Message = "Lỗi khi tạo mới nhóm thuộc tính! " + ex.Message,
                    Data = null,
                    IsSuccess = false
                });
            }
        }

        //[Authorize(Roles = UserRoles.BrandManager)]
        [HttpDelete(APIRoutes.GroupAttribute.Delete, Name = "DeleteGroupAttributeAsync")]
        public async Task<IActionResult> DeleteAsynce([FromQuery] int id)
        {
            try
            {
                var result = await _groupAttributeService.Delete(id);
                if (!result)
                {
                    return NotFound(new BaseResponse
                    {
                        StatusCode = StatusCodes.Status404NotFound,
                        Message = "không tìm thấy nhóm thuộc tính",
                        Data = null,
                        IsSuccess = false
                    });
                }
                return Ok(new BaseResponse
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "xoá nhóm thuộc tính thành công",
                    Data = null,
                    IsSuccess = true
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    Message = ex.Message,
                    Data = null,
                    IsSuccess = false
                });
            }
        }
        //[Authorize(Roles = UserRoles.BrandManager)]
        [HttpPut(APIRoutes.GroupAttribute.Update, Name = "UpdateGroupAttributeAsync")]
        public async Task<IActionResult> UpdateUserAsync([FromForm] int id, [FromForm] string name)
        {
            try
            {
                var result = await _groupAttributeService.Update(id, name);
                if (result == null)
                {
                    return NotFound(new BaseResponse
                    {
                        StatusCode = StatusCodes.Status404NotFound,
                        Message = "Cập nhật không thành công",
                        Data = null,
                        IsSuccess = false
                    });
                }

                return Ok(new BaseResponse
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "Cập nhật thành công",
                    Data = result,
                    IsSuccess = true
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    Message = "Lỗi khi cập nhật!" + ex.Message,
                    Data = null,
                    IsSuccess = false
                });
            }
        }
        //[Authorize(Roles = UserRoles.BrandManager)]
        [HttpGet(APIRoutes.GroupAttribute.GetAll, Name = "getGroupAttributeAsync")]
        public async Task<IActionResult> GetAllAsync([FromQuery(Name = "search-key")] string? searchKey
            , [FromQuery(Name = "page-number")] int pageNumber = Page.DefaultPageIndex
            , [FromQuery(Name = "page-size")] int PageSize = Page.DefaultPageSize)
        {
            try
            {
                var groups = await _groupAttributeService.Get(searchKey!, pageIndex: pageNumber, pageSize: PageSize);

                return Ok(new BaseResponse
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "Tải dữ liệu thành công",
                    Data = groups,
                    IsSuccess = true
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    Message = "Tải dữ liệu thất bại!" + ex.Message,
                    Data = null,
                    IsSuccess = false
                });
            }
        }
        //[Authorize(Roles = UserRoles.BrandManager)]
        [HttpGet(APIRoutes.GroupAttribute.GetByID, Name = "GetGroupAttributeByID")]
        public async Task<IActionResult> GetAsync([FromQuery] int id)
        {
            try
            {
                var group = await _groupAttributeService.GetByID(id);

                if (group == null)
                {
                    return NotFound(new BaseResponse
                    {
                        StatusCode = StatusCodes.Status404NotFound,
                        Message = "Không tìm thấy nhóm thuộc tính",
                        Data = null,
                        IsSuccess = false
                    });
                }
                return Ok(new BaseResponse
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "Tìm thành công",
                    Data = group,
                    IsSuccess = true
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    Message = ex.Message,
                    Data = null,
                    IsSuccess = false
                });
            }
        }
    }
}
