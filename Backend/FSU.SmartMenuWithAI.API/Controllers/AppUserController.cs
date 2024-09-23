using FSU.SmartMenuWithAI.API.Payloads.Responses;
using FSU.SmartMenuWithAI.API.Common.Constants;
using FSU.SmartMenuWithAI.Service.ISerivice;
using Microsoft.AspNetCore.Mvc;
using FSU.SmartMenuWithAI.API.Payloads;
using FSU.SmartMenuWithAI.API.Payloads.Request.AppUser;
using FSU.SmartMenuWithAI.Service.Models;
using Microsoft.AspNetCore.Authorization;

namespace FSU.SmartMenuWithAI.API.Controllers
{
    //[Route("api/[controller]")]
    [ApiController]
    public class AppUserController : ControllerBase
    {

        private readonly IAppUserService _appUserService;

        public AppUserController(IAppUserService appUserService)
        {
            _appUserService = appUserService;
        }

        //[Authorize(Roles = UserRoles.Admin)]
        [HttpPost(APIRoutes.AppUser.Add, Name = "AddUserAsync")]
        public async Task<IActionResult> AddAsync([FromBody] AddUserRequest reqObj)
        {
            try
            {
                var dto = new AppUserDTO();
                dto.UserName = reqObj.UserName;
                dto.IsActive = reqObj.IsActive;
                dto.RoleId = reqObj.RoleId;
                dto.Phone = reqObj.Phone;
                dto.Gender = reqObj.Gender;
                dto.Fullname = reqObj.Fullname;
                dto.Dob = reqObj.Dob!.Value;
                dto.UpdateBy = reqObj.UpdateBy;
                var UserAdd = await _appUserService.Insert(dto);
                if (UserAdd == 0)
                {
                    return NotFound(new BaseResponse
                    {
                        StatusCode = StatusCodes.Status404NotFound,
                        Message = "Thêm không thành công",
                        Data = null,
                        IsSuccess = false
                    });
                }
                return Ok(new BaseResponse
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "Thêm người dùng thành công",
                    Data = UserAdd,
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

        //[Authorize(Roles = UserRoles.Admin)]
        [HttpDelete(APIRoutes.AppUser.Delete, Name = "DeleteUserAsync")]
        public async Task<IActionResult> DeleteAsynce([FromQuery] int id, [FromQuery(Name ="brand-id")] int? brandId)
        {
            try
            {
                var result = await _appUserService.Delete(id,brandId);
                if (!result)
                {
                    return NotFound(new BaseResponse
                    {
                        StatusCode = StatusCodes.Status404NotFound,
                        Message = "Không tìm thấy người dùng",
                        Data = null,
                        IsSuccess = false
                    });
                }
                return Ok(new BaseResponse
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "Xoá người dùng thành công",
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

        //[Authorize(Roles = UserRoles.Admin)]
        [HttpPut(APIRoutes.AppUser.Update, Name = "UpdateUserAsync")]
        public async Task<IActionResult> UpdateUserAsync(int id,[FromBody] UpdateAppUserRequest reqObj, [FromQuery(Name = "brand-id")] int? brandId)
        {
            try
            {
                var dto = new AppUserDTO();
                dto.IsActive = reqObj.IsActive;
                dto.Phone = reqObj.Phone;
                dto.Gender = reqObj.Gender;
                dto.Fullname = reqObj.Fullname;
                dto.Dob = reqObj.Dob;
                dto.UpdateBy = reqObj.UpdateBy;

                var result = await _appUserService.Update(id, dto, brandId);
                if (!result)
                {
                    return NotFound(new BaseResponse
                    {
                        StatusCode = StatusCodes.Status404NotFound,
                        Message = "Không tìm thấy người dùng",
                        Data = null,
                        IsSuccess = false
                    });
                }
                return Ok(new BaseResponse
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "Cập nhật người dùng thành công",
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
        [HttpGet(APIRoutes.AppUser.GetAll, Name = "GetUsersAsync")]
        public async Task<IActionResult> GetAllAsync([FromQuery(Name = "curr-id-login")] int currIdLoginID
            , [FromQuery(Name = "search-key")] string? searchKey
            , [FromQuery(Name = "brand-id")] int? brandID
            , [FromQuery(Name = "page-number")] int pageNumber = Page.DefaultPageIndex
            , [FromQuery(Name = "page-size")] int PageSize = Page.DefaultPageSize)
        {
            try
            {
                var allAccount = await _appUserService.Get(currIdLoginID, searchKey!, brandID,pageIndex: pageNumber, pageSize: PageSize);

                return Ok(new BaseResponse
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "Tải dữ liệu thành công",
                    Data = allAccount,
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

        //[Authorize(Roles = UserRoles.Admin)]
        [HttpGet(APIRoutes.AppUser.GetByID, Name = "GetUserByID")]
        public async Task<IActionResult> GetAsync([FromQuery] int Id)
        {
            try
            {
                var user = await _appUserService.GetByID(Id);

                if (user == null)
                {
                    return NotFound(new BaseResponse
                    {
                        StatusCode = StatusCodes.Status404NotFound,
                        Message = "Không tìm thấy người dùng",
                        Data = null,
                        IsSuccess = false
                    });
                }
                return Ok(new BaseResponse
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "Tìm người dùng thành công",
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
