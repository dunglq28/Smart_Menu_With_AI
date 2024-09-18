using FSU.SmartMenuWithAI.API.Common.Constants;
using FSU.SmartMenuWithAI.API.Payloads;
using FSU.SmartMenuWithAI.API.Payloads.Responses;
using FSU.SmartMenuWithAI.Service.ISerivice;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FSU.SmartMenuWithAI.API.Controllers
{
    public class SubscriptionController : ControllerBase
    {
        private readonly ISubscriptionService _subscriptionService;

        public SubscriptionController(ISubscriptionService subscriptionService)
        {
            _subscriptionService = subscriptionService;
        }

        //[Authorize(Roles = UserRoles.BrandManager)]
        [HttpGet(APIRoutes.Subscription.GetInfo, Name = "get-subscription-by-user-id")]
        public async Task<IActionResult> GetSubscriptionInfoAsync(int userId)
        {
            try
            {
                var subscription = await _subscriptionService.GetUserSubscriptionInfoAsync(userId);

                if (subscription == null)
                {
                    return NotFound(new BaseResponse
                    {
                        StatusCode = StatusCodes.Status404NotFound,
                        Message = "Subscription not found for the given user ID.",
                        Data = null,
                        IsSuccess = false
                    });
                }

                return Ok(new BaseResponse
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "Subscription information retrieved successfully.",
                    Data = subscription,
                    IsSuccess = true
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new BaseResponse
                {
                    StatusCode = StatusCodes.Status500InternalServerError,
                    Message = $"An error occurred: {ex.Message}",
                    Data = null,
                    IsSuccess = false
                });
            }
        }
    }
}
