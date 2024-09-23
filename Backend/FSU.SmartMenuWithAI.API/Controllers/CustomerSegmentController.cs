using FSU.SmartMenuWithAI.API.Payloads.Request.Category;
using FSU.SmartMenuWithAI.API.Payloads.Responses;
using FSU.SmartMenuWithAI.API.Payloads;
using FSU.SmartMenuWithAI.Service.ISerivice;
using FSU.SmartMenuWithAI.Service.Models;
using FSU.SmartMenuWithAI.Service.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using FSU.SmartMenuWithAI.API.Payloads.Request.CustomerSegment;
using FSU.SmartMenuWithAI.API.Common.Constants;
using FSU.SmartMenuWithAI.API.Payloads.Request.Brand;
using FSU.SmartMenuWithAI.API.Validations;
using Microsoft.AspNetCore.Authorization;

namespace FSU.SmartMenuWithAI.API.Controllers
{
    //[Route("api/[controller]")]
    [ApiController]
    public class CustomerSegmentController : ControllerBase
    {
        private readonly ICustomerSegmentService _customerSegmentService;

        public CustomerSegmentController(ICustomerSegmentService customerSegmentService)
        {
            _customerSegmentService = customerSegmentService;
        }

        //[Authorize(Roles = UserRoles.BrandManager)]
        [HttpPost(APIRoutes.CustomerSegment.Add, Name = "AddCustomerSegmentAsync")]
        public async Task<IActionResult> AddAsync([FromBody] AddCusSegmentRequest reqObj)
        {
            try
            {
                var result = await _customerSegmentService.Insert(reqObj.SegmentName, reqObj.Age, reqObj.Gender, reqObj.Session, reqObj.BrandId);
                {
                    if (result != null)
                        return Ok(new BaseResponse
                        {
                            StatusCode = StatusCodes.Status200OK,
                            Message = "Tạo mới thành công",
                            Data = result,
                            IsSuccess = true
                        });
                }
                return NotFound(new BaseResponse
                {
                    StatusCode = StatusCodes.Status404NotFound,
                    Message = "Tạo mới thất bại",
                    Data = null,
                    IsSuccess = false
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
        [HttpDelete(APIRoutes.CustomerSegment.Delete, Name = "delete-customer-segment-async")]
        public async Task<IActionResult> DeleteAsynce([FromQuery(Name = "segment-id")] int segmendId)
        {
            try
            {
                var result = await _customerSegmentService.Delete(segmendId);
                if (!result)
                {
                    return NotFound(new BaseResponse
                    {
                        StatusCode = StatusCodes.Status404NotFound,
                        Message = "không tìm thấy phân khúc khách hàng này",
                        Data = null,
                        IsSuccess = result
                    });
                }
                return Ok(new BaseResponse
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "xoá thành công",
                    Data = result,
                    IsSuccess = result
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    Message = "Có lỗi xảy ra: " + ex.Message,
                    Data = null,
                    IsSuccess = false
                });
            }
        }

        //[Authorize(Roles = UserRoles.BrandManager)]
        //[HttpPut(APIRoutes.CustomerSegment.UpdateName, Name = "update-segment-name-async")]
        //public async Task<IActionResult> UpdateSegmenNameAsync([FromForm(Name ="segment-id")] int segmentId, [FromForm(Name ="segment-name")] string segmentName)
        //{
        //    try
        //    {
        //        var result = await _customerSegmentService.Update(segmentId, segmentName);
        //        if (result == null)
        //        {
        //            return NotFound(new BaseResponse
        //            {
        //                StatusCode = StatusCodes.Status404NotFound,
        //                Message = "Cập nhật không thành công",
        //                Data = null,
        //                IsSuccess = false
        //            });
        //        }

        //        return Ok(new BaseResponse
        //        {
        //            StatusCode = StatusCodes.Status200OK,
        //            Message = "Cập nhật thành công",
        //            Data = result,
        //            IsSuccess = true
        //        });
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BaseResponse
        //        {
        //            StatusCode = StatusCodes.Status400BadRequest,
        //            Message = "Lỗi khi cập nhật! " + ex.Message,
        //            Data = null,
        //            IsSuccess = false
        //        });
        //    }
        //}
        //[Authorize(Roles = UserRoles.BrandManager)]
        [HttpGet(APIRoutes.CustomerSegment.GetAll, Name = "get-customer-segment-async")]
        public async Task<IActionResult> GetAllAsync([FromQuery(Name = "brand-id")] int brandId, [FromQuery(Name = "search-key")] string? searchKey
            , [FromQuery(Name = "page-number")] int pageNumber = Page.DefaultPageIndex
            , [FromQuery(Name = "page-size")] int PageSize = Page.DefaultPageSize)
        {
            try
            {
                var viewCustomerSegment = await _customerSegmentService.GetAllAsync(searchKey!, pageIndex: pageNumber, pageSize: PageSize, brandId);

                return Ok(new BaseResponse
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "Tải dữ liệu thành công",
                    Data = viewCustomerSegment,
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
        [HttpPut(APIRoutes.CustomerSegment.UpdateValue, Name = "update-segment-value-async")]
        public async Task<IActionResult> UpdateSegmentValueAsync([FromBody] UpdateCustomerSegmentRequest updateReq)
        {
            
            try
            {
                var result = await _customerSegmentService.UpdateSegmentValue(updateReq.SegmentId, updateReq.Age, updateReq.Gender , updateReq.Session, updateReq.SegmentName, updateReq.BrandId);
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
                    Message = "Lỗi khi cập nhật! " + ex.Message,
                    Data = null,
                    IsSuccess = false
                });
            }
        }
        //[Authorize(Roles = UserRoles.BrandManager)]
        [HttpGet(APIRoutes.CustomerSegment.GetByID, Name = "get-by-cus-segment-id-async")]
        public async Task<IActionResult> GetAsync([FromQuery(Name = "customer-segment-id")] int segmentId)
        {
            try
            {
                var user = await _customerSegmentService.GetByID(segmentId);

                if (user == null)
                {
                    return NotFound(new BaseResponse
                    {
                        StatusCode = StatusCodes.Status404NotFound,
                        Message = "Không tìm thấy phân khúc này",
                        Data = null,
                        IsSuccess = false
                    });
                }
                return Ok(new BaseResponse
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "Tìm thành công",
                    Data = user,
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
        [HttpGet(APIRoutes.CustomerSegment.GetAllNoPaging, Name = "get-customer-segment-async-no-paging")]
        public async Task<IActionResult> GetAllNoPagingAsync([FromQuery(Name = "brand-id")] int brandId)
        {
            try
            {
                var viewCustomerSegment = await _customerSegmentService.GetAllNoPaingAsync(brandId);

                return Ok(new BaseResponse
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "Tải dữ liệu thành công",
                    Data = viewCustomerSegment,
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
        [HttpGet(APIRoutes.CustomerSegment.GetByMenuID, Name = "get-by-menu-id-async")]
        public async Task<IActionResult> GetByMenuIDAsync([FromRoute(Name = "menu-id")] int menuId)
        {
            try
            {
                var user = await _customerSegmentService.GetByMenuID(menuId);

                if (user == null)
                {
                    return NotFound(new BaseResponse
                    {
                        StatusCode = StatusCodes.Status404NotFound,
                        Message = "Không tìm thấy phân khúc này",
                        Data = null,
                        IsSuccess = false
                    });
                }
                return Ok(new BaseResponse
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "Tìm thành công",
                    Data = user,
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
