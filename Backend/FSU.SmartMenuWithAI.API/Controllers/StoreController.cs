using FSU.SmartMenuWithAI.API.Payloads.Responses;
using FSU.SmartMenuWithAI.API.Payloads;
using FSU.SmartMenuWithAI.API.Validations;
using FSU.SmartMenuWithAI.Service.ISerivice;
using Microsoft.AspNetCore.Mvc;
using FSU.SmartMenuWithAI.API.Common.Constants;
using FSU.SmartMenuWithAI.API.Payloads.Request.Store;
using FSU.SmartMenuWithAI.Service.Models;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;
using FSU.SmartMenuWithAI.Service.Services;

namespace FSU.SmartMenuWithAI.API.Controllers
{
    //[Route("api/[controller]")]
    [ApiController]
    public class StoreController : ControllerBase
    {
        private readonly IStoreService _storeService;


        public StoreController(IStoreService storeService)
        {
            _storeService = storeService;

        }
        //[Authorize(Roles = UserRoles.Admin)]
        [HttpPost(APIRoutes.Store.Add, Name = "AddStoreAsync")]
        public async Task<IActionResult> AddAsync([FromBody] AddStoreRequest reqObj)
        {
            try
            {
                var dto = new StoreDTO
                {
                    UserId = reqObj.UserId,
                    Address = reqObj.Address,
                    City = reqObj.City,
                    BrandId = reqObj.BrandId
                };
                var result = await _storeService.Insert(dto);

                if (!result)
                {
                    return NotFound(new BaseResponse
                    {
                        StatusCode = StatusCodes.Status404NotFound,
                        Message = "Cửa hàng không tồn tại",
                        Data = null,
                        IsSuccess = false
                    });
                }
                return Ok(new BaseResponse
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "Thêm cửa hàng thành công",
                    Data = result,
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

        //[Authorize(Roles = UserRoles.Admin+","+UserRoles.BrandManager)]
        [HttpDelete(APIRoutes.Store.Delete, Name = "DeleteStoreAsync")]
        public async Task<IActionResult> DeleteAsynce([FromQuery] int id, [FromQuery(Name = "brand-id")] int? brandId)
        {
            try
            {
                var result = await _storeService.Delete(id, brandId);
                if (!result)
                {
                    return NotFound(new BaseResponse
                    {
                        StatusCode = StatusCodes.Status404NotFound,
                        Message = "Cửa hàng không tồn tại",
                        Data = null,
                        IsSuccess = false
                    });
                }
                return Ok(new BaseResponse
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "Xoá thành công",
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

        //[Authorize(Roles = UserRoles.Admin+","+UserRoles.BrandManager)]
        [HttpPut(APIRoutes.Store.Update, Name = "UpdateStoreAsync")]
        public async Task<IActionResult> UpdateUserAsync(int id, [FromBody] UpdateStoreRequest reqObj, [FromQuery(Name = "brand-id")] int? brandId)
        {
            try
            {
                var dto = new StoreDTO
                {
                    IsActive = reqObj.IsActive,
                    Address = reqObj.Address,
                    City   = reqObj.City,
                };
                var result = await _storeService.UpdateAsync(id, dto, brandId);

                if (!result)
                {
                    return NotFound(new BaseResponse
                    {
                        StatusCode = StatusCodes.Status404NotFound,
                        Message = "Không tìm thấy thông tin cửa hàng",
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
                    Message = ex.Message,
                    Data = null,
                    IsSuccess = false
                });
            }
        }

        //[Authorize(Roles = UserRoles.Admin + "," + UserRoles.BrandManager)]
        [HttpGet(APIRoutes.Store.GetAll, Name = "GetStoreAsync")]
        public async Task<IActionResult> GetAllAsync([FromQuery(Name = "brand-id")] int brandID
            , [FromQuery(Name = "search-key")] string? searchKey
            , [FromQuery(Name = "page-number")] int pageNumber = Page.DefaultPageIndex
            , [FromQuery(Name = "page-size")] int PageSize = Page.DefaultPageSize)
        {
            try
            {
                var stores = await _storeService.GetAllAsync(searchKey: searchKey!, brandID: brandID, pageIndex: pageNumber, pageSize: PageSize); ;

                return Ok(new BaseResponse
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "Lấy thông tin thành công",
                    Data = stores,
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

        //[Authorize(Roles = UserRoles.Admin+","+UserRoles.BrandManager)]
        [HttpGet(APIRoutes.Store.GetByID, Name = "GetStoreByID")]
        public async Task<IActionResult> GetAsync([FromQuery] int Id)
        {
            try
            {
                var user = await _storeService.GetAsync(Id);

                if (user == null)
                {
                    return NotFound(new BaseResponse
                    {
                        StatusCode = StatusCodes.Status404NotFound,
                        Message = "Không tìm thấy thông tin",
                        Data = null,
                        IsSuccess = false
                    });
                }
                return Ok(new BaseResponse
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "Lấy thông tin thành công",
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

        //[Authorize(Roles = UserRoles.BrandManager + "," + UserRoles.Admin + "," + UserRoles.Store)]
        [HttpGet(APIRoutes.Store.GetByUserID, Name = "get-brand-of-store-by-user-id")]
        public async Task<IActionResult> GetBrandOfStoreByUserIdAsync([FromQuery(Name = "user-id")] int userId)
        {
            try
            {

                var brands = await _storeService.GetBrandOfStoreByUserID(userId);

                if (brands == null)
                {
                    return NotFound(new BaseResponse
                    {
                        StatusCode = StatusCodes.Status404NotFound,
                        Message = "Không tìm thấy thương hiệu cho người dùng này",
                        Data = null,
                        IsSuccess = false
                    });
                }

                return Ok(new BaseResponse
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "Tìm thành công",
                    Data = brands,
                    IsSuccess = true
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    Message = "Lỗi khi tìm kiếm!" + ex.Message,
                    Data = null,
                    IsSuccess = false
                });
            }
        }
    }
}

