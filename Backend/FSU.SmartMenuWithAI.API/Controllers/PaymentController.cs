using FSU.SmartMenuWithAI.API.Payloads.Responses;
using FSU.SmartMenuWithAI.API.Payloads;
using FSU.SmartMenuWithAI.Service.ISerivice;
using FSU.SmartMenuWithAI.Service.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FSU.SmartMenuWithAI.API.Common.Constants;
using FSU.SmartMenuWithAI.API.Payloads.Request.ListPosition;
using FSU.SmartMenuWithAI.API.Payloads.Request.Payment;
using FSU.SmartMenuWithAI.API.Payloads.Request.MenuList;
using FSU.SmartMenuWithAI.Service.Models.MenuList;

namespace FSU.SmartMenuWithAI.API.Controllers
{
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentService _paymentService;

        public PaymentController(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        //[Authorize(Roles = UserRoles.Admin)]
        [HttpGet(APIRoutes.Payment.Get, Name = "get-payments")]
        public async Task<IActionResult> GetAllAsync([FromQuery(Name = "search-key")] string? searchKey
            , [FromQuery(Name = "page-number")] int pageNumber = Page.DefaultPageIndex
            , [FromQuery(Name = "page-size")] int PageSize = Page.DefaultPageSize)
        {
            try
            {
                var payments = await _paymentService.GetAsync(searchKey: searchKey, pageIndex: pageNumber, pageSize: PageSize);

                return Ok(new BaseResponse
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "Tìm thông tin thành công",
                    Data = payments,
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
        //[HttpPost(APIRoutes.Payment.Add, Name = "add-payment")]
        //public async Task<IActionResult> CreateAsync([FromBody] CreatePaymentRequest request)
        //{
        //    try
        //    {
        //        var createdListPosition = await _paymentService.Insert(request.UserId, request.Amount, request.Email);
        //        return Ok(new BaseResponse
        //        {
        //            StatusCode = StatusCodes.Status200OK,
        //            Message = "Tạo thanh toan thành công",
        //            Data = createdListPosition,
        //            IsSuccess = true
        //        });
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new BaseResponse
        //        {
        //            StatusCode = StatusCodes.Status400BadRequest,
        //            Message = "Lỗi khi tạo!" + ex.Message,
        //            IsSuccess = false
        //        });
        //    }
        //}

        //[Authorize(Roles = UserRoles.Admin)]
        //[HttpPut(APIRoutes.Payment.Update, Name = "update-status-payment")]
        //public async Task<IActionResult> ConfirmPayment([FromBody] ConfirmRequest request)
        //{
        //    try
        //    {
        //        var result = await _paymentService.Update(dto);

        //        if (result == null)
        //        {
        //            return NotFound(new BaseResponse
        //            {
        //                StatusCode = StatusCodes.Status404NotFound,
        //                Message = "Không tìm thấy thông tin menu",
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
        //            Message = ex.Message,
        //            Data = null,
        //            IsSuccess = false
        //        });
        //    }
        //}
    }
}
