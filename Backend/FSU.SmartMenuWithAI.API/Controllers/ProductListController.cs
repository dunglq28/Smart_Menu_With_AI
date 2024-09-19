using FSU.SmartMenuWithAI.API.Payloads.Responses;
using FSU.SmartMenuWithAI.API.Payloads;
using FSU.SmartMenuWithAI.Service.ISerivice;
using Microsoft.AspNetCore.Mvc;
using FSU.SmartMenuWithAI.API.Payloads.Request.ProductList;
using static System.Runtime.InteropServices.JavaScript.JSType;
using Microsoft.AspNetCore.Authorization;
using FSU.SmartMenuWithAI.API.Common.Constants;

namespace FSU.SmartMenuWithAI.API.Controllers
{
    public class ProductListController : ControllerBase
    {
        private readonly IProductListService _productListService;

        public ProductListController(IProductListService productListService)
        {
            _productListService = productListService;
        }

        //[Authorize(Roles = UserRoles.BrandManager)]
        [HttpGet(APIRoutes.ProductList.GetByID, Name = "GetProductListByID")]
        public async Task<IActionResult> GetByIdAsync([FromQuery(Name = "product-id")] int productId, [FromQuery(Name = "list-id")] int listId)
        {
            try
            {
                var productList = await _productListService.GetByID(productId, listId);
                if (productList == null)
                {
                    return NotFound(new BaseResponse
                    {
                        StatusCode = StatusCodes.Status404NotFound,
                        Message = "Không tìm thấy sản phẩm",
                        IsSuccess = false
                    });
                }
                return Ok(new BaseResponse
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "Tìm thành công",
                    Data = productList,
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
        [HttpPost(APIRoutes.ProductList.Add, Name = "AddProductList")]
        public async Task<IActionResult> CreateAsync([FromBody] CreateProducListRequest request)
        {
            try
            {
                var createdProductList = await _productListService.Insert(request.ProductId, request.ListId, request.IndexInList, request.BrandId);
                if (createdProductList != null)
                {
                    return Ok(new BaseResponse
                    {
                        StatusCode = StatusCodes.Status200OK,
                        Message = "Tạo mới thành công",
                        Data = createdProductList,
                        IsSuccess = true
                    });
                }
                else
                {
                    return BadRequest(new BaseResponse
                    {
                        StatusCode = StatusCodes.Status400BadRequest,
                        Message = "Tạo mới không thành công " ,
                        Data = createdProductList,
                        IsSuccess = false
                    });
                }
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
        [HttpPost(APIRoutes.ProductList.AddListProduct, Name = "AddListProductList")]
        public async Task<IActionResult> CreateListProductListAsync([FromBody] CreateListProductList request)
        {
            try
            {
                var createdProductList = await _productListService.Insert2(request.BrandId, request.ListProductDetails);
                if (createdProductList != null)
                {
                    return Ok(new BaseResponse
                    {
                        StatusCode = StatusCodes.Status200OK,
                        Message = "Tạo mới thành công",
                        Data = createdProductList,
                        IsSuccess = true
                    });
                }
                else
                {
                    return BadRequest(new BaseResponse
                    {
                        StatusCode = StatusCodes.Status400BadRequest,
                        Message = "Tạo mới không thành công ",
                        Data = createdProductList,
                        IsSuccess = false
                    });
                }
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
        [HttpPut(APIRoutes.ProductList.UpdateListProduct, Name = "UpdateListProductList")]
        public async Task<IActionResult> UpdateListProductListAsync([FromBody] CreateListProductList request)
        {   
            try
            {
                var updatedProductList = await _productListService.Update2(request.BrandId, request.ListProductDetails);
                if (updatedProductList != null)
                {
                    return Ok(new BaseResponse
                    {
                        StatusCode = StatusCodes.Status200OK,
                        Message = "Cập nhật thành công",
                        Data = updatedProductList,
                        IsSuccess = true
                    });
                }
                else
                {
                    return BadRequest(new BaseResponse
                    {
                        StatusCode = StatusCodes.Status400BadRequest,
                        Message = "Cập nhật không thành công ",
                        Data = updatedProductList,
                        IsSuccess = false
                    });
                }
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
        [HttpPut(APIRoutes.ProductList.Update, Name = "update-product-list")]
        public async Task<IActionResult> UpdateAsync([FromForm(Name = "product-id")] int productId,
                                                        [FromForm(Name = "list-id")] int listId,
                                                        [FromForm(Name = "index-in-list")] int index,
                                                        [FromForm(Name = "new-product-id")] int newProductId)
        {
            try
            {
                var updatedProductList = await _productListService.UpdateAsync(productId, listId, index, newProductId);
                if (updatedProductList == null)
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
                    Data = updatedProductList,
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
        [HttpDelete(APIRoutes.ProductList.Delete, Name = "delete-product-list")]
        public async Task<IActionResult> DeleteAsync([FromQuery(Name = "product-id")] int productId, [FromQuery(Name = "list-id")] int listId)
        {
            try
            {
                var isDeleted = await _productListService.DeleteAsync(productId, listId);
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
