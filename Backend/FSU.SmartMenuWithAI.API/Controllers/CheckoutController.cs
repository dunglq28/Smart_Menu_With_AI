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

namespace FSU.SmartMenuWithAI.API.Controllers
{
    [ApiController]
    public class CheckoutController : ControllerBase
    {
        private readonly PayOSSetting _payOSSetting;

        public CheckoutController(IOptions<PayOSSetting> payOSSetting)
        {
            _payOSSetting = payOSSetting.Value;
        }

        //[Authorize(Roles = UserRoles.Admin)]
        [HttpPost(APIRoutes.Checkout.CheckoutPayOs, Name = "CheckoutPayOs")]
        public async Task<IActionResult> Create()
        {
            //viết ở đây
            // Tạo payment history với status đang thanh toán
            // Cần request: id gói, tên gói, giá tiền, email, userid,
            // var transactionid = orderCode = int.Parse(DateTimeOffset.Now.ToString("ffffff"))

            var payOS = new PayOS(_payOSSetting.ClientID, _payOSSetting.ApiKey, _payOSSetting.ChecksumKey);

            var domain = _payOSSetting.domain;

            var paymentLinkRequest = new PaymentData(
                orderCode: int.Parse(DateTimeOffset.Now.ToString("ffffff")),
                amount: 2000,
                description: "Thanh toan don hang",
                items: [new("Mì tôm hảo hảo ly", 1, 2000)],
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
    }
}
