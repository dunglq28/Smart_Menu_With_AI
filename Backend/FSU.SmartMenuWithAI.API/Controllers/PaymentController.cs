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
        [HttpPut(APIRoutes.Payment.Update, Name = "update-status-payment")]
        public async Task<IActionResult> ConfirmPayment([FromBody] ConfirmRequest request)
        {
            if (request == null)
            {
                return BadRequest(new BaseResponse
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    Message = "Dữ liệu yêu cầu không hợp lệ.",
                    Data = null,
                    IsSuccess = false
                });
            }

            try
            {
                var result = await _paymentService.ConfirmPaymentAsync(request.PaymentId, request.UserId, request.Status, request.IsRenew);

                if (!result)
                {
                    return NotFound(new BaseResponse
                    {
                        StatusCode = StatusCodes.Status404NotFound,
                        Message = "Không tìm thấy thanh toán hoặc đăng ký, hoặc dữ liệu không hợp lệ.",
                        Data = null,
                        IsSuccess = false
                    });
                }

                return Ok(new BaseResponse
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "Cập nhật trạng thái thanh toán thành công.",
                    Data = null,
                    IsSuccess = true
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new BaseResponse
                {
                    StatusCode = StatusCodes.Status500InternalServerError,
                    Message = $"Lỗi xảy ra: {ex.Message}",
                    Data = null,
                    IsSuccess = false
                });
            }
        }

        //[Authorize(Roles = UserRoles.Admin)]
        [HttpGet(APIRoutes.Payment.GetByEmail, Name = "get-payment-by-email")]
        public async Task<IActionResult> GetByEmailAsync([FromQuery(Name = "email")] string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest(new BaseResponse
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    Message = "Email không hợp lệ.",
                    Data = null,
                    IsSuccess = false
                });
            }

            try
            {
                var payments = await _paymentService.GetByEmail(email);

                if (payments == null)
                {
                    return NotFound(new BaseResponse
                    {
                        StatusCode = StatusCodes.Status404NotFound,
                        Message = "Không tìm thấy thanh toán nào cho email này.",
                        Data = null,
                        IsSuccess = false
                    });
                }

                return Ok(new BaseResponse
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "Tìm thông tin thanh toán thành công.",
                    Data = payments,
                    IsSuccess = true
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new BaseResponse
                {
                    StatusCode = StatusCodes.Status500InternalServerError,
                    Message = $"Lỗi xảy ra: {ex.Message}",
                    Data = null,
                    IsSuccess = false
                });
            }
        }

        //[Authorize(Roles = UserRoles.Admin)]
        [HttpGet(APIRoutes.Payment.GetByEmail2, Name = "get-payment-unsuccess-by-email")]
        public async Task<IActionResult> CheckExistEmail([FromQuery(Name = "email")] string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest(new BaseResponse
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    Message = "Email không hợp lệ.",
                    Data = null,
                    IsSuccess = false
                });
            }

            try
            {
                var payments = await _paymentService.GetByEmail2(email);

                if (payments == null)
                {
                    return Ok(new BaseResponse
                    {
                        StatusCode = StatusCodes.Status200OK,
                        Message = "Không tìm thấy thanh toán nào cho email này.",
                        Data = null,
                        IsSuccess = true
                    });
                }

                return Ok(new BaseResponse
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "Tìm thông tin thanh toán thành công.",
                    Data = payments,
                    IsSuccess = true
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new BaseResponse
                {
                    StatusCode = StatusCodes.Status500InternalServerError,
                    Message = $"Lỗi xảy ra: {ex.Message}",
                    Data = null,
                    IsSuccess = false
                });
            }
        }
    }
}
