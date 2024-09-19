using FSU.SmartMenuWithAI.API.Payloads.Responses;
using FSU.SmartMenuWithAI.API.Payloads;
using Microsoft.AspNetCore.Mvc;
using FSU.SmartMenuWithAI.API.Validations;
using FSU.SmartMenuWithAI.Service.ISerivice;
using FSU.SmartMenuWithAI.API.Common.Constants;
using FSU.SmartMenuWithAI.API.Payloads.Request.Menu;
using FSU.SmartMenuWithAI.Service.Models;
using Microsoft.AspNetCore.Authorization;
using FSU.SmartMenuWithAI.Service.Services;

namespace FSU.SmartMenuWithAI.API.Controllers
{
    //[Route("api/[controller]")]
    [ApiController]
    public class MenuController : ControllerBase
    {


        private readonly IMenuService _menuService;
        private readonly ImageFileValidator _imageFileValidator;
        private readonly IS3Service _s3Service;
        private readonly IMenuSegmentService _menuSegmentService;

        public MenuController(IMenuService menuService, IS3Service s3Service, IMenuSegmentService menuSegmentService)
        {
            _menuService = menuService;
            _imageFileValidator = new ImageFileValidator();
            _s3Service = s3Service;
            _menuSegmentService = menuSegmentService;
        }

        //[Authorize(Roles = UserRoles.BrandManager)]
        [HttpPost(APIRoutes.Menu.Add, Name = "AddMenuAsync")]
        public async Task<IActionResult> AddAsync([FromForm] AddMenuRequest reqObj)
        {
            try
            {
                if (reqObj.MenuImage != null)
                {

                    var validationImg = await _imageFileValidator.ValidateAsync(reqObj.MenuImage!);
                    if (!validationImg.IsValid)
                    {
                        return BadRequest(new BaseResponse
                        {
                            StatusCode = StatusCodes.Status400BadRequest,
                            Message = "File không phải là hình ảnh hợp lệ",
                            Data = null,
                            IsSuccess = false
                        });
                    }

                }
                var dto = new MenuDTO
                {
                    BrandId = reqObj.BrandId,
                    IsActive = reqObj.IsActive,
                    Description = reqObj.Description,
                };
                var menuAdd = await _menuService.Insert(dto, priority:reqObj.Priority, segmentIds: reqObj.SegmentIds);


                // tạo thành công
                if (menuAdd != null)
                {
                    if (reqObj.MenuImage != null)
                    {
                        //await _s3Service.UploadItemAsync(reqObj.MenuImage,menuAdd.MenuCode!, FolderRootImg.Menu);
                    }
                    return Ok(new BaseResponse
                    {
                        StatusCode = StatusCodes.Status200OK,
                        Message = "Thêm Menu thành công",
                        Data = menuAdd,
                        IsSuccess = true
                    });
                }
                // thất bại
                return BadRequest(new BaseResponse
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    Message = "Lỗi khi tạo Menu.",
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
        [HttpDelete(APIRoutes.Menu.Delete, Name = "DeleteMenuAsync")]
        public async Task<IActionResult> DeleteAsynce([FromQuery] int id)
        {
            try
            {
                var result = await _menuService.Delete(id);
                if (!result)
                {
                    return NotFound(new BaseResponse
                    {
                        StatusCode = StatusCodes.Status404NotFound,
                        Message = "Menu không tồn tại",
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

        //[Authorize(Roles = UserRoles.BrandManager)]
        [HttpPut(APIRoutes.Menu.Update, Name = "UpdateMenuAsync")]
        public async Task<IActionResult> UpdateMenuAsync([FromForm] UpdateMenuRequest reqObj)
        {
            try
            {
                var menuInDB = await _menuService.GetAsync(reqObj.menuId);
                if (reqObj.MenuImage != null && menuInDB != null)
                {
                    //await _s3Service.UploadItemAsync(reqObj.MenuImage, menuInDB!.MenuCode!, FolderRootImg.Menu);
                }
                // không cần update hình ở db vì đè lên đường dẫn cũ trên aws là hình thay đổi mà vẫn giữ tên
                var dto = new MenuDTO
                {
                    MenuId = reqObj.menuId,
                    Description = reqObj.Description,
                    IsActive = reqObj.isActive,
                    Priority = reqObj.Priority,

                };
                var result = await _menuService.UpdateAsync(segmentIds:reqObj.SegmentIds,dtoToUpdate: dto );

                if (result == false)
                {
                    return NotFound(new BaseResponse
                    {
                        StatusCode = StatusCodes.Status404NotFound,
                        Message = "Cập nhật thất bại.",
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

        //[Authorize(Roles = UserRoles.BrandManager)]
        [HttpGet(APIRoutes.Menu.GetAll, Name = "GetMenuAsync")]
        public async Task<IActionResult> GetAllAsync([FromQuery(Name = "brand-id")] int brandID
            , [FromQuery(Name = "page-number")] int pageNumber = Page.DefaultPageIndex
            , [FromQuery(Name = "page-size")] int PageSize = Page.DefaultPageSize)
        {
            try
            {
                var menus = await _menuService.GetAllAsync(brandID: brandID, pageIndex: pageNumber, pageSize: PageSize);

                return Ok(new BaseResponse
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "Lấy thông tin thành công",
                    Data = menus,
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
        [HttpGet(APIRoutes.Menu.GetByID, Name = "GetMenuByID")]
        public async Task<IActionResult> GetAsync([FromQuery] int Id)
        {
            try
            {
                var menu = await _menuService.GetAsync(Id);

                if (menu == null)
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
                    Data = menu,
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
        //[Authorize(Roles = UserRoles.BrandManager + "," +UserRoles.Store)]
        [HttpPost(APIRoutes.Menu.RecommendMenu, Name = "recommend-menu-async")]
        public async Task<IActionResult> RecommendMenuAsync([FromForm] RecomentMenuRequest reqobj)
        {
            try
            {
                var validationImg = await _imageFileValidator.ValidateAsync(reqobj.faceImage);
                if (!validationImg.IsValid)
                {
                    return BadRequest(new BaseResponse
                    {
                        StatusCode = StatusCodes.Status400BadRequest,
                        Message = "File không phải là hình ảnh hợp lệ",
                        Data = null,
                        IsSuccess = false
                    });
                }


                var menuRecomend = await _menuService.RecomendMenu(reqobj.faceImage, reqobj.BrandId);

                if (menuRecomend == null)
                {
                    return NotFound(new BaseResponse
                    {
                        StatusCode = StatusCodes.Status404NotFound,
                        Message = "Phân tích không thành công",
                        Data = null,
                        IsSuccess = false
                    });
                }
                return Ok(new BaseResponse
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "Phân tích thành công",
                    Data = menuRecomend,
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
        [HttpGet(APIRoutes.Menu.GetMenuSegmentByID, Name = "get-menu-segment-by-id")]
        public async Task<IActionResult> GetMenuSegmentAsync([FromQuery(Name = "menu-id")] int MenuId, [FromQuery(Name = "segment-id")] int segmentId)
        {
            try
            {
                var menu = await _menuSegmentService.GetByID(menuId: MenuId, SegmentId: segmentId);

                if (menu == null)
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
                    Data = menu,
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
        [HttpDelete(APIRoutes.Menu.DeleteMenuSegment, Name = "delete-menu-segment")]
        public async Task<IActionResult> DeleteMenuSegmentAsync([FromQuery(Name ="menu-id")] int Menuid, [FromQuery(Name = ("segment-id"))]int segmentId)
        {
            try
            {
                var result = await _menuSegmentService.Delete(menuId: Menuid, SegmentID: segmentId);
                if (!result)
                {
                    return NotFound(new BaseResponse
                    {
                        StatusCode = StatusCodes.Status404NotFound,
                        Message = "Menu không tồn tại",
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

        //[Authorize(Roles = UserRoles.BrandManager)]
        [HttpPut(APIRoutes.Menu.UpdateMenuSegment, Name = "update-menu-segment")]
        public async Task<IActionResult> UpdateMenuSegmentAsync([FromBody] UpdateMenuSegmentRequest reqObj)
        {
            try
            {
                var menuSegInDB = await _menuSegmentService.GetByID(menuId:reqObj.MenuId, SegmentId:reqObj.SegmentId);
                if (menuSegInDB != null)
                {
                    return NotFound(new BaseResponse
                    {
                        StatusCode = StatusCodes.Status404NotFound,
                        Message = "Không tìm thấy thông tin.",
                        Data = null,
                        IsSuccess = false
                    });
                }
                var menuSegDTO = new MenuSegmentDTO
                {
                    SegmentId = reqObj.SegmentId,
                    MenuId = reqObj.MenuId,
                    Priority = reqObj.Priority
                };
                var result = await _menuSegmentService.Update(menuSegDTO);

                if (result == null)
                {
                    return NotFound(new BaseResponse
                    {
                        StatusCode = StatusCodes.Status404NotFound,
                        Message = "Cập nhật thất bại.",
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
    }
}
