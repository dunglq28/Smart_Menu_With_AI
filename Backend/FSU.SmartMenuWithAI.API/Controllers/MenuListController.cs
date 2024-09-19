using FSU.SmartMenuWithAI.API.Common.Constants;
using FSU.SmartMenuWithAI.API.Payloads;
using FSU.SmartMenuWithAI.API.Payloads.Request.Menu;
using FSU.SmartMenuWithAI.API.Payloads.Request.MenuList;
using FSU.SmartMenuWithAI.API.Payloads.Responses;
using FSU.SmartMenuWithAI.Service.ISerivice;
using FSU.SmartMenuWithAI.Service.Models.MenuList;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FSU.SmartMenuWithAI.API.Controllers
{
    //[Route("api/[controller]")]
    [ApiController]
    public class MenuListController : ControllerBase
    {
        private readonly IMenuListService _menuListService;

        public MenuListController(IMenuListService menuListService)
        {
            _menuListService = menuListService;
        }

        //[Authorize(Roles = UserRoles.BrandManager)]
        [HttpPost(APIRoutes.MenuList.Add, Name = "AddListToMenuAsync")]
        public async Task<IActionResult> AddAsync([FromBody] AddMenuListRequest reqObj)
        {
            try
            {
                var productAddToMenu = await _menuListService.Insert(MenuId:reqObj.MenuId, BrandId:reqObj.brandId , entity:reqObj.listAddToMenu);
                return Ok(new BaseResponse
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "Thêm sản phẩm vào menu thành công",
                    Data = productAddToMenu,
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
        [HttpPost(APIRoutes.MenuList.AddOneRow, Name = "add-1-list-to-menu-async")]
        public async Task<IActionResult> Add1ListAsync([FromBody] MenuListDTO reqObj)
        {
            try
            {
                var productAddToMenu = await _menuListService.InsertNewListToMenu(reqObj);
                return Ok(new BaseResponse
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "Thêm sản phẩm vào menu thành công",
                    Data = productAddToMenu,
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
        [HttpDelete(APIRoutes.MenuList.Delete, Name = "DeleteListInMenuAsync")]
        public async Task<IActionResult> DeleteAsync([FromQuery(Name = "menu-id")] int menuId, [FromQuery(Name = "list-id")] int listId, [FromQuery(Name = "brand-id")] int brandId)
        {
            try
            {
                var result = await _menuListService.Delete(menuId: menuId, listId:listId, brandId: brandId);
                if (!result)
                {
                    return NotFound(new BaseResponse
                    {
                        StatusCode = StatusCodes.Status404NotFound,
                        Message = "Không tồn tại sản phẩm trong menu",
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
        [HttpPut(APIRoutes.MenuList.Update, Name = "UpdateListInMenuAsync")]
        public async Task<IActionResult> UpdateUserAsync([FromBody] UpdateListInMenu reqObj)
        {
            try
            {
                var dto = new MenuListDTO
                {
                    MenuId = reqObj.MenuId,
                    ListId = reqObj.ListId,
                    BrandId = reqObj.BrandId,
                    ListIndex = reqObj.DisplayIndex,
                };
                var result = await _menuListService.Update(dto);

                if (result == null)
                {
                    return NotFound(new BaseResponse
                    {
                        StatusCode = StatusCodes.Status404NotFound,
                        Message = "Không tìm thấy thông tin menu",
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
        [HttpGet(APIRoutes.MenuList.GetAll, Name = "GetListInMenuAsync")]
        public async Task<IActionResult> GetAllAsync([FromQuery(Name = "menu-id")] int menuId
            , [FromQuery(Name = "brand-id")] int brandId )
        {
            try
            {
                var menus = await _menuListService.GetAllAsync(menuID: menuId, brandID: brandId);

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
        [HttpGet(APIRoutes.MenuList.GetByID, Name = "GetListMenuByID")]
        public async Task<IActionResult> GetAsync([FromQuery(Name = "menu-id")] int menuId, [FromQuery(Name = "list-id")] int listId, [FromQuery(Name = "brand-id")] int brandId)
        {
            try
            {
                var user = await _menuListService.GetByID(menuId: menuId, listId: listId, brandId: brandId);

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
    }
}
