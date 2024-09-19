using FSU.SmartMenuWithAI.API.Common.Constants;
using FSU.SmartMenuWithAI.API.Payloads.Request.Brand;
using FSU.SmartMenuWithAI.API.Payloads.Responses;
using FSU.SmartMenuWithAI.API.Payloads;
using FSU.SmartMenuWithAI.API.Validations;
using FSU.SmartMenuWithAI.Service.ISerivice;
using FSU.SmartMenuWithAI.Service.Services;
using Microsoft.AspNetCore.Mvc;
using FSU.SmartMenuWithAI.API.Payloads.Request.Attribute;
using Microsoft.AspNetCore.Authorization;

namespace FSU.SmartMenuWithAI.API.Controllers
{
    public class AttributeController : ControllerBase
    {
        private readonly IAttributeService _attributeService;

        public AttributeController(IAttributeService attributeService)
        {
            _attributeService = attributeService;
        }
        //[Authorize(Roles = UserRoles.BrandManager + "," + UserRoles.Admin)]
        [HttpPost(APIRoutes.Attribute.Add, Name = "add-attribute-async")]
        public async Task<IActionResult> AddAsync([FromForm] CreateAttributeRequest reqObj)
        {
            try
            {
                var attributeAdd = await _attributeService.Insert(reqObj.AttributeName, reqObj.Description!, reqObj.GroupAttributeId);
                return Ok(new BaseResponse
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "Tạo thuộc tính mới thành công",
                    Data = attributeAdd,
                    IsSuccess = true
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    Message = "Lỗi khi tạo mới thuộc tính!" + ex.Message,
                    Data = null,
                    IsSuccess = false
                });
            }
        }

        //[Authorize(Roles = UserRoles.BrandManager + "," + UserRoles.Admin)]
        [HttpDelete(APIRoutes.Attribute.Delete, Name = "delete-attribute-async")]
        public async Task<IActionResult> DeleteAsynce([FromQuery] int id)
        {
            try
            {
                var result = await _attributeService.Delete(id);
                if (!result)
                {
                    return NotFound(new BaseResponse
                    {
                        StatusCode = StatusCodes.Status404NotFound,
                        Message = "không tìm thấy thuộc tính",
                        Data = null,
                        IsSuccess = false
                    });
                }
                return Ok(new BaseResponse
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "xoá thuộc tính thành công",
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

        //[Authorize(Roles = UserRoles.BrandManager+","+UserRoles.Admin)]
        [HttpPut(APIRoutes.Attribute.Update, Name = "update-attribute-async")]
        public async Task<IActionResult> UpdateUserAsync([FromForm] int id, [FromForm] UpdateAttributeRequest reqObj)
        {
            try
            {
                var result = await _attributeService.Update(id, reqObj.AttributeName, reqObj.Description!, reqObj.GroupAttributeId);
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

        //[Authorize(Roles = UserRoles.BrandManager+","+UserRoles.Admin)]
        [HttpGet(APIRoutes.Attribute.GetAll, Name = "get-attributes-async")]
        public async Task<IActionResult> GetAllAsync([FromQuery(Name = "search-key")] string? searchKey
            , [FromQuery(Name = "page-number")] int pageNumber = Page.DefaultPageIndex
            , [FromQuery(Name = "page-size")] int PageSize = Page.DefaultPageSize)
        {
            try
            {
                var allBrands = await _attributeService.Get(searchKey!, pageIndex: pageNumber, pageSize: PageSize);

                return Ok(new BaseResponse
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "Tải dữ liệu thành công",
                    Data = allBrands,
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

        //[Authorize(Roles = UserRoles.BrandManager+","+UserRoles.Admin)]
        [HttpGet(APIRoutes.Attribute.GetByID, Name = "GetAttributeByID")]
        public async Task<IActionResult> GetAsync([FromQuery] int id)
        {
            try
            {
                var attribute = await _attributeService.GetByID(id);

                if (attribute == null)
                {
                    return NotFound(new BaseResponse
                    {
                        StatusCode = StatusCodes.Status404NotFound,
                        Message = "Không tìm thấy thuộc tính",
                        Data = null,
                        IsSuccess = false
                    });
                }
                return Ok(new BaseResponse
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "Tìm thành công",
                    Data = attribute,
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
