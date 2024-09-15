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

namespace FSU.SmartMenuWithAI.API.Controllers
{
    [ApiController]
    public class CheckoutController : ControllerBase
    {
        private readonly PayOSSetting _payOSSetting;
        private readonly IPaymentService _paymentService;

        public CheckoutController(IOptions<PayOSSetting> payOSSetting, IPaymentService paymentService)
        {
            _payOSSetting = payOSSetting.Value;
            _paymentService = paymentService;
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
                var payOS = new PayOS(_payOSSetting.ClientID, _payOSSetting.ApiKey, _payOSSetting.ChecksumKey);

                var domain = _payOSSetting.domain;

                var paymentLinkRequest = new PaymentData(
                    orderCode: transactionid,
                    amount: (int)request.Amount!,
                    description: "Thanh toán đơn hàng",
                    items: [new(request.PlanName, 1, (int)request.Amount!)],
                    returnUrl: domain + "/success.html",
                    cancelUrl: domain + "/payment/payment-infor?is-success=false"
                );
                var response = await payOS.createPaymentLink(paymentLinkRequest);

                Response.Headers.Append("Location", response.checkoutUrl);
                return Ok(new BaseResponse
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "Tạo link thanh toán thành công",
                    Data = response.checkoutUrl,
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
