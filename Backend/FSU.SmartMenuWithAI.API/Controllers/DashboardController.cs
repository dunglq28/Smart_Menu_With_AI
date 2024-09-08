using FSU.SmartMenuWithAI.API.Payloads.Responses;
using FSU.SmartMenuWithAI.API.Payloads;
using FSU.SmartMenuWithAI.API.Validations;
using FSU.SmartMenuWithAI.Service.ISerivice;
using FSU.SmartMenuWithAI.Service.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FSU.SmartMenuWithAI.API.Common.Constants;

namespace FSU.SmartMenuWithAI.API.Controllers
{
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;

        public DashboardController(IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        //[Authorize(Roles = UserRoles.Admin)]
        [HttpGet(APIRoutes.Dashboard.GetAll, Name = "get-dashboard-async")]
        public async Task<IActionResult> GetAllAsync()
        {
            try
            {
                var dashboard = await _dashboardService.GetDashboard();

                return Ok(new BaseResponse
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "Tải dữ liệu thành công",
                    Data = dashboard,
                    IsSuccess = true
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    Message = "Tải dữ liệu thất bại!" + ex.Message,
                    Data = null,
                    IsSuccess = false
                });
            }
        }
    }
}
