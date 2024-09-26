using FSU.SmartMenuWithAI.API.Payloads.Request.AppUser;
using FSU.SmartMenuWithAI.API.Payloads.Responses;
using FSU.SmartMenuWithAI.API.Payloads;
using FSU.SmartMenuWithAI.Service.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Net.payOS.Types;
using Net.payOS;
using FSU.SmartMenuWithAI.API.Payloads.Request;
using FSU.SmartMenuWithAI.Service.Models.PayOS;
using Microsoft.Extensions.Options;
using FSU.SmartMenuWithAI.API.Payloads.Request.Payment;
using FSU.SmartMenuWithAI.Service.ISerivice;
using Newtonsoft.Json;

namespace FSU.SmartMenuWithAI.API.Controllers
{
    [ApiController]
    public class CheckoutController : ControllerBase
    {
        private readonly IPaymentService _paymentService;
        private readonly IPayOSService _payOSService;

        public CheckoutController(IPaymentService paymentService, IPayOSService payOSService)
        {
            _paymentService = paymentService;
            _payOSService = payOSService;
        }

        //[Authorize(Roles = UserRoles.Admin)]
        [HttpPost(APIRoutes.Checkout.CheckoutPayOs, Name = "CheckoutPayOs")]
        public async Task<IActionResult> Create([FromBody] PayOsRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                //viết ở đây
                // Tạo payment history với status đang thanh toán
                var transactionid = int.Parse(DateTimeOffset.Now.ToString("ffffff"));
                var payment = await _paymentService.Checkout(request.UserId, request.Amount, request.Email, transactionid);
                if (payment != null)
                {
                    //tạo subscription sau khi đã tạo payment thành công
                    var subscription = await _paymentService.AddSubscription(request.UserId, request.Email, request.PlanId, payment.PaymentId);
                    if (subscription == null) { throw new Exception("Lỗi nghiêm trọng!!! Gói đăng kí chưa được khởi tạo"); }
                }
                else if (payment == null)
                {
                    throw new Exception("Lỗi nghiêm trọng!!! Lịch sử giao dịch chưa được khởi tạo");
                }


                ///----------------------------
                var paymentLinkResponse = await _payOSService.CreatePaymentLink(
                  transactionid,
                  request.PlanName,
                  (int)request.Amount!,
                  $"payment/payment-success?payment-id={payment.PaymentId}&user-id={request.UserId}&is-renew=false",
                  $"payment/payment-cancel?payment-id={payment.PaymentId}&user-id={request.UserId}&is-renew=false"
                );


                Response.Headers.Append("Location", paymentLinkResponse);
                return Ok(new BaseResponse
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "Tạo link thanh toán thành công",
                    Data = paymentLinkResponse,
                    IsSuccess = true
                });
                ///----------------------------
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
        [HttpPost(APIRoutes.Checkout.Extend, Name = "Extend")]
        public async Task<IActionResult> Extend([FromBody] ExtendSubscriptionRequest request)
        {
            try
            {
                //if (!ModelState.IsValid)
                //{
                //    return BadRequest(ModelState);
                //}
                //viết ở đây
                // Tạo payment history với status đang thanh toán
                var transactionid = int.Parse(DateTimeOffset.Now.ToString("ffffff"));
                var payment = await _paymentService.Extend(request.SubId, transactionid);
                if (payment != null)
                {
                    //tạo subscription sau khi đã tạo payment thành công
                    var subscription = await _paymentService.AddExtendSubscription(payment.PaymentId, request.SubId);
                    if (subscription == null) { throw new Exception("Lỗi nghiêm trọng!!! Gói đăng kí chưa được khởi tạo"); }

                }
                else if (payment == null)
                {
                    throw new Exception("Lỗi nghiêm trọng!!! Lịch sử giao dịch chưa được khởi tạo");
                }

                var paymentCreated = await _paymentService.GetPayment(payment.PaymentId);

                if (paymentCreated == null)
                {
                    throw new Exception("Không tìm thấy payment vừa được khỏi tạo để tạo link trả tiền");
                }
                else
                {
                    if (paymentCreated.PlanName == null || paymentCreated.Amount == null)
                    {
                        throw new Exception("Thông tin về tên gói và giá tiền của payment vừa khởi tạo chưa được lấy lên");
                    }
                }
                var paymentLinkResponse = await _payOSService.CreatePaymentLink(
                  transactionid,
                  paymentCreated.PlanName,
                  (int)paymentCreated.Amount!,
                  $"payment/payment-success?payment-id={payment.PaymentId}&user-id={payment.UserId}&is-renew=true",
                  $"payment/payment-cancel?payment-id={payment.PaymentId}&user-id={payment.UserId}&is-renew=true"
                );


                Response.Headers.Append("Location", paymentLinkResponse);
                return Ok(new BaseResponse
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "Tạo link thanh toán thành công",
                    Data = paymentLinkResponse,
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
