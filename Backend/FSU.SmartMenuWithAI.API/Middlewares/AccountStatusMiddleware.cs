using Microsoft.EntityFrameworkCore;
using FSU.SmartMenuWithAI.API.Payloads.Responses;
using System.IdentityModel.Tokens.Jwt;
using System.Text.Json;
using FSU.SmartMenuWithAI.Repository.Entities;

namespace FSU.SmartMenuWithAI.API.Middlewares
{
    public class AccountStatusMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IServiceScopeFactory _serviceScopeFactory;

        public AccountStatusMiddleware(RequestDelegate next, IServiceScopeFactory serviceScopeFactory, ILogger<AccountStatusMiddleware> logger)
        {
            _next = next;
            _serviceScopeFactory = serviceScopeFactory;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            using (var scope = _serviceScopeFactory.CreateScope())
            {
                var _context = scope.ServiceProvider.GetRequiredService<SmartMenuContext>();
                var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
                var userCodeClaim = "";

                if (token != null)
                {
                    var tokenHandler = new JwtSecurityTokenHandler();
                    var jwtToken = tokenHandler.ReadToken(token) as JwtSecurityToken;

                    userCodeClaim = jwtToken?.Claims.FirstOrDefault(c => c.Type == "UserCode")?.Value;
                }

                if (!string.IsNullOrEmpty(userCodeClaim))
                {
                    var user = await _context.AppUsers.FirstOrDefaultAsync(u => u.UserCode == userCodeClaim);
                    if (user != null && !user.IsActive)
                    {
                        var response = new BaseResponse
                        {
                            StatusCode = StatusCodes.Status403Forbidden,
                            Message = "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ với quản trị viên để biết thêm thông tin.",
                            Data = null,
                            IsSuccess = false
                        };
                        context.Response.StatusCode = StatusCodes.Status403Forbidden;
                        context.Response.ContentType = "application/json";
                        await context.Response.WriteAsync(JsonSerializer.Serialize(response));
                        return;
                    }
                }
            }

            await _next(context);
        }


    }
}
