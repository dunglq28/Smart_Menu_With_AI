using Amazon.Rekognition.Model;
using Azure;
using FSU.SmartMenuWithAI.API.Payloads;
using FSU.SmartMenuWithAI.API.Payloads.Request.Email;
using FSU.SmartMenuWithAI.API.Payloads.Responses;
using FSU.SmartMenuWithAI.Service.ISerivice;
using FSU.SmartMenuWithAI.Service.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FSU.SmartMenuWithAI.API.Controllers
{
    [ApiController]
    public class EmailController : ControllerBase
    {
        private readonly IEmailService _emailService;
        private readonly IPaymentService _paymentService;

        public EmailController(IEmailService emailService, IPaymentService paymentService)
        {
            _emailService = emailService;
            _paymentService = paymentService;
        }

        [HttpPost(APIRoutes.Email.SendVerificationCode, Name = "SendVerificationCode")]
        public async Task<IActionResult> SendVerificationCode([FromBody] EmailVerificationRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new BaseResponse
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    Message = "Dữ liệu gửi lên không hợp lệ",
                    Data = null,
                    IsSuccess = false
                });
            }

            var email = await _paymentService.GetByEmail(request.Email);
            if (email != null)
            {
                return BadRequest(new BaseResponse
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    Message = "Email đã được đăng ký",
                    Data = null,
                    IsSuccess = false
                });
            }

            try
            {
                var subject = "Mã xác nhận của bạn";
                var body = $"Mã xác nhận của bạn là: {request.VerificationCode}";

                await _emailService.SendEmailAsync(request.Email, subject, body);

                return Ok(new BaseResponse
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "Mã xác nhận đã được gửi thành công.",
                    Data = null,
                    IsSuccess = true
                });
            }
            catch (Exception ex)
            {
                var response = new BaseResponse
                {
                    StatusCode = StatusCodes.Status500InternalServerError,
                    Message = "Đã xảy ra lỗi khi gửi email.",
                    Data = new { Error = ex.Message },
                    IsSuccess = false
                };

                return StatusCode(StatusCodes.Status500InternalServerError, response);
            }
        }

    }
}
