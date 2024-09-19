using FSU.SmartMenuWithAI.API.Common.Constants;
using FSU.SmartMenuWithAI.API.Payloads;
using FSU.SmartMenuWithAI.API.Payloads.Request.ListPosition;
using FSU.SmartMenuWithAI.API.Payloads.Responses;
using FSU.SmartMenuWithAI.Service.ISerivice;
using FSU.SmartMenuWithAI.Service.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FSU.SmartMenuWithAI.API.Controllers
{
    public class ListPositionController : ControllerBase
    {
        private readonly IListPositionService _listPositionService;

        public ListPositionController(IListPositionService listPositionService)
        {
            _listPositionService = listPositionService;
        }

        //[Authorize(Roles = UserRoles.BrandManager)]
        [HttpGet(APIRoutes.ListPosition.GetByID, Name = "GetListPositionByID")]
        public async Task<IActionResult> GetByIdAsync(int id)
        {
            try
            {
                var listPosition = await _listPositionService.GetByID(id);
                if (listPosition == null)
                {
                    return NotFound(new BaseResponse
                    {
                        StatusCode = StatusCodes.Status404NotFound,
                        Message = "Không tìm thấy vị trí",
                        IsSuccess = false
                    });
                }
                return Ok(new BaseResponse
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "Tìm thành công",
                    Data = listPosition,
                    IsSuccess = true
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    Message = "Lỗi khi tải!" + ex.Message,
                    IsSuccess = false
                });
            }
        }
        [Authorize(Roles = UserRoles.BrandManager)]
        [HttpGet(APIRoutes.ListPosition.GetByBrandID, Name = "get-by-brand-id-async")]
        public async Task<IActionResult> GetAllAsync([FromQuery(Name = "search-key")] int searchKey
            , [FromQuery(Name = "page-number")] int pageNumber = Page.DefaultPageIndex
            , [FromQuery(Name = "page-size")] int PageSize = Page.DefaultPageSize)
        {
            try
            {
                var listPs = await _listPositionService.GetListPositionByBrandID(searchKey, pageIndex: pageNumber, pageSize: PageSize);

                if (listPs == null)
                {
                    return NotFound(new BaseResponse
                    {
                        StatusCode = StatusCodes.Status404NotFound,
                        Message = "Không tìm thấy vị trí",
                        IsSuccess = false
                    });
                }
                return Ok(new BaseResponse
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "Tìm thành công",
                    Data = listPs,
                    IsSuccess = true
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    Message = "Lỗi khi tải!" + ex.Message,
                    IsSuccess = false
                });
            }
        }
        //[Authorize(Roles = UserRoles.BrandManager)]
        [HttpPost(APIRoutes.ListPosition.Add, Name = "AddListPosition")]
        public async Task<IActionResult> CreateAsync([FromBody] CreateListPositionRequest request)
        {
            try
            {
                var createdListPosition = await _listPositionService.Insert(request.TotalProduct, request.BrandId, request.ListName);
                return Ok(new BaseResponse
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "Tạo mới thành công",
                    Data = createdListPosition,
                    IsSuccess = true
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    Message = "Lỗi khi tạo mới!" + ex.Message,
                    IsSuccess = false
                });
            }
        }

        //[Authorize(Roles = UserRoles.BrandManager)]
        [HttpPost(APIRoutes.ListPosition.AddListList, Name = "AddListListPosition")]
        public async Task<IActionResult> CreateListListAsync([FromBody] CreateListList request)
        {
            try
            {
                // Kiểm tra nếu request là null
                if (request == null)
                {
                    throw new ArgumentException("Tổng số sản phẩm không được để trống.");
                }

                // Kiểm tra yêu cầu
                if (request.ListDetails == null || !request.ListDetails.Any())
                {
                    throw new ArgumentException("Danh sách chi tiết không được để trống.");
                }

                // Kiểm tra từng cặp ListDetail
                foreach (var detail in request.ListDetails)
                {
                    if (detail.TotalProduct <= 0)
                    {
                        throw new ArgumentException("Tổng số sản phẩm phải lớn hơn 0 và không được để trống.");
                    }
                    if (string.IsNullOrWhiteSpace(detail.ListName))
                    {
                        throw new ArgumentException("Tên danh sách không được để trống.");
                    }
                }
                var createdListPosition = await _listPositionService.Insert2(request.BrandId, request.ListDetails);
                return Ok(new BaseResponse
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "Tạo mới thành công",
                    Data = createdListPosition,
                    IsSuccess = true
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    Message = "Lỗi khi tạo mới!" + ex.Message,
                    IsSuccess = false
                });
            }
        }

        //[Authorize(Roles = UserRoles.BrandManager)]
        [HttpPut(APIRoutes.ListPosition.UpdateListList, Name = "UpdateListListPosition")]
        public async Task<IActionResult> UpdtateListListAsync([FromBody] UpdateListListPosition request)
        {
            try
            {
                // Kiểm tra nếu request là null
                if (request == null)
                {
                    throw new ArgumentException("Số không được để trống.");
                }

                // Kiểm tra yêu cầu
                if (request.ListDetails == null || !request.ListDetails.Any())
                {
                    throw new ArgumentException("Danh sách chi tiết không được để trống.");
                }

                // Kiểm tra từng cặp ListDetail
                foreach (var detail in request.ListDetails)
                {
                    if (detail.TotalProduct <= 0)
                    {
                        throw new ArgumentException("Tổng số sản phẩm phải lớn hơn 0 và không được để trống.");
                    }
                    if (string.IsNullOrWhiteSpace(detail.ListName))
                    {
                        throw new ArgumentException("Tên danh sách không được để trống.");
                    }
                }
                var updatedListPosition = await _listPositionService.UpdateAsync2(request.BrandId, request.ListDetails);
                return Ok(new BaseResponse
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "Cập nhật thành công",
                    Data = updatedListPosition,
                    IsSuccess = true
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    Message = "Lỗi khi cập nhật!" + ex.Message,
                    IsSuccess = false
                });
            }
        }
        //[Authorize(Roles = UserRoles.BrandManager)]
        [HttpPut(APIRoutes.ListPosition.Update, Name = "UpdateListPosition")]
        public async Task<IActionResult> UpdateAsync([FromForm] int id, [FromForm(Name = "total-product")] int totalProduct, [FromForm(Name = "list-name")] string listName)
        {
            try
            {
                var updatedListPosition = await _listPositionService.UpdateAsync(id, totalProduct, listName);
                if (updatedListPosition == null)
                {
                    return NotFound(new BaseResponse
                    {
                        StatusCode = StatusCodes.Status404NotFound,
                        Message = "Cập nhật không thành công",
                        IsSuccess = false
                    });
                }
                return Ok(new BaseResponse
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "Cập nhật thành công",
                    Data = updatedListPosition,
                    IsSuccess = true
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    Message = "Lỗi khi cập nhật!" + ex.Message,
                    IsSuccess = false
                });
            }
        }

        //[Authorize(Roles = UserRoles.BrandManager)]
        [HttpDelete(APIRoutes.ListPosition.Delete, Name = "DelListPosition")]
        public async Task<IActionResult> DeleteAsync(int id)
        {
            try
            {
                var isDeleted = await _listPositionService.DeleteAsync(id);
                if (!isDeleted)
                {
                    return NotFound(new BaseResponse
                    {
                        StatusCode = StatusCodes.Status404NotFound,
                        Message = "Xoá không thành công",
                        IsSuccess = false
                    });
                }
                return Ok(new BaseResponse
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "Xoá thành công",
                    IsSuccess = true
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    Message = "Lỗi khi xoá!" + ex.Message,
                    IsSuccess = false
                });
            }
        }
    }
}
