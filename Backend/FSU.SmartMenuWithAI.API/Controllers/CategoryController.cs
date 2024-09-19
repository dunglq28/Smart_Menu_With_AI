using FSU.SmartMenuWithAI.API.Payloads.Responses;
using FSU.SmartMenuWithAI.API.Payloads;
using FSU.SmartMenuWithAI.API.Validations;
using FSU.SmartMenuWithAI.Service.ISerivice;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using FSU.SmartMenuWithAI.API.Common.Constants;
using FSU.SmartMenuWithAI.API.Payloads.Request.Category;
using FSU.SmartMenuWithAI.Service.Models;
using Microsoft.AspNetCore.Authorization;

namespace FSU.SmartMenuWithAI.API.Controllers
{
    //[Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoryController(ICategoryService appUserService)
        {
            _categoryService = appUserService;
        }

        //[Authorize(Roles = UserRoles.BrandManager)]
        [HttpPost(APIRoutes.Category.Add, Name = "AddCategoryAsync")]
        public async Task<IActionResult> AddAsync([FromBody] AddCagetoryRequest reqObj)
        {
            try
            {
                var category = new CategoryDTO();
                category.CategoryName = reqObj.CategoryName;
                category.BrandId = reqObj.BrandId;
                var result = await _categoryService.Insert(category); 
                if (!result)
                {
                    return NotFound(new BaseResponse
                    {
                        StatusCode = StatusCodes.Status404NotFound,
                        Message = "Can not delete this category",
                        Data = null,
                        IsSuccess = false
                    });
                }
                return Ok(new BaseResponse
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "New category successfully",
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
        [HttpDelete(APIRoutes.Category.Delete, Name = "DeleteCategoryAsync")]
        public async Task<IActionResult> DeleteAsync([FromQuery] int id)
        {
            try
            {
                var result = await _categoryService.Delete(id);
                if (!result)
                {
                    return NotFound(new BaseResponse
                    {
                        StatusCode = StatusCodes.Status404NotFound,
                        Message = "Can not delete this category",
                        Data = null,
                        IsSuccess = false
                    });
                }
                return Ok(new BaseResponse
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "Delete category successfully",
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
        [HttpPut(APIRoutes.Category.Update, Name = "UpdateCategoryAsync")]
        public async Task<IActionResult> UpdateCategoryAsync(int id, [FromBody] AddCagetoryRequest reqObj)
        {
            try
            {

                if (reqObj.CategoryName.IsNullOrEmpty())
                {
                    return BadRequest(new BaseResponse
                    {
                        StatusCode = StatusCodes.Status400BadRequest,
                        Message = "Thông tin không được để trống",
                        Data = null,
                        IsSuccess = false
                    });
                }
                var result = await _categoryService.UpdateAsync(id, reqObj.CategoryName, reqObj.BrandId);

                if (!result)
                {
                    return NotFound(new BaseResponse
                    {
                        StatusCode = StatusCodes.Status404NotFound,
                        Message = "Can not update this category",
                        Data = null,
                        IsSuccess = false
                    });
                }
                return Ok(new BaseResponse
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "Update category successfully",
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

        //[Authorize(Roles = UserRoles.BrandManager + "," + UserRoles.Store)]
        [HttpGet(APIRoutes.Category.GetAll, Name = "GetCategoriesAsync")]
        public async Task<IActionResult> GetAllAsync([FromQuery(Name = "brand-id")] int brandID
            , [FromQuery(Name = "search-key")] string? searchKey = null
            , [FromQuery(Name = "page-number")] int pageNumber = Page.DefaultPageIndex
            , [FromQuery(Name = "page-size")] int PageSize = Page.DefaultPageSize)
        {
            try
            {
                var allAccount = await _categoryService.GetAllAsync(searchKey:searchKey!, brandID: brandID, pageIndex: pageNumber, pageSize: PageSize);

                return Ok(new BaseResponse
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "get cagetory successfully",
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

        //[Authorize(Roles = UserRoles.BrandManager + "," + UserRoles.Store)]
        [HttpGet(APIRoutes.Category.GetByID, Name = "GetCategoryByID")]
        public async Task<IActionResult> GetAsync([FromQuery] int Id)
        {
            try
            {
                var category = await _categoryService.GetAsync(Id);

                if (category == null)
                {
                    return NotFound(new BaseResponse
                    {
                        StatusCode = StatusCodes.Status404NotFound,
                        Message = "Can not find this category",
                        Data = null,
                        IsSuccess = false
                    });
                }
                return Ok(new BaseResponse
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "get category successfully",
                    Data = category,
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

        //[Authorize(Roles = UserRoles.BrandManager + "," + UserRoles.Store)]
        [HttpGet(APIRoutes.Category.GetByBrandID, Name = "GetCategoryByBrandID")]
        public async Task<IActionResult> GetByBrandIdAsync([FromQuery(Name = "brand-id")] int brandId)
        {
            try
            {
                var category = await _categoryService.GetByBrandID(brandId: brandId);

                if (category == null)
                {
                    return NotFound(new BaseResponse
                    {
                        StatusCode = StatusCodes.Status404NotFound,
                        Message = "Can not find this category",
                        Data = null,
                        IsSuccess = false
                    });
                }
                return Ok(new BaseResponse
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "Get category successfully",
                    Data = category,
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
