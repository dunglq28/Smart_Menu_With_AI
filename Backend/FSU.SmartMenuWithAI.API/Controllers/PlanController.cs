using FSU.SmartMenuWithAI.API.Payloads.Responses;
using FSU.SmartMenuWithAI.API.Payloads;
using FSU.SmartMenuWithAI.Service.ISerivice;
using FSU.SmartMenuWithAI.Service.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FSU.SmartMenuWithAI.API.Common.Constants;
using FSU.SmartMenuWithAI.API.Payloads.Request.Brand;
using FSU.SmartMenuWithAI.API.Validations;
using FSU.SmartMenuWithAI.API.Payloads.Request.Plan;

namespace FSU.SmartMenuWithAI.API.Controllers
{
    public class PlanController : ControllerBase
    {
        private readonly IPlanService _planService;

        public PlanController(IPlanService planService)
        {
            _planService = planService;
        }

        //[Authorize(Roles = UserRoles.Admin)]
        [HttpGet(APIRoutes.Plan.GetByID, Name = "GetPlanByID")]
        public async Task<IActionResult> GetByIdAsync([FromQuery(Name = "plan-id")] int planId)
        {
            try
            {
                var plan = await _planService.GetByIdAsync(planId);
                if (plan == null)
                {
                    return NotFound(new BaseResponse
                    {
                        StatusCode = StatusCodes.Status404NotFound,
                        Message = "Không tìm thấy dịch vụ",
                        IsSuccess = false
                    });
                }
                return Ok(new BaseResponse
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "Tìm thành công",
                    Data = plan,
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

        //[Authorize(Roles = UserRoles.Admin)]
        [HttpGet(APIRoutes.Plan.GetAll, Name = "get-plans-async")]
        public async Task<IActionResult> GetAllAsync()
        {
            try
            {
                var plans = await _planService.GetAll();

                return Ok(new BaseResponse
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "Tải dữ liệu thành công",
                    Data = plans,
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
        
        //[Authorize(Roles = UserRoles.Admin)]
        [HttpPost(APIRoutes.Plan.Add, Name = "add-plan-async")]
        public async Task<IActionResult> AddAsync([FromForm] CreateRequest reqObj)
        {
            try
            {
                var planAdd = await _planService.Insert(reqObj.PlanName, reqObj.MaxMenu, reqObj.MaxAccount, reqObj.Price);
                return Ok(new BaseResponse
                {
                    StatusCode = StatusCodes.Status201Created,
                    Message = "Tạo dịch vụ mới thành công",
                    Data = planAdd,
                    IsSuccess = true
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    Message = "Lỗi khi tạo mới dịch vụ!" + ex.Message,
                    Data = null,
                    IsSuccess = false
                });
            }
        }

        //[Authorize(Roles = UserRoles.Admin)]
        [HttpDelete(APIRoutes.Plan.Delete, Name = "delete-plan-async")]
        public async Task<IActionResult> DeleteAsync([FromQuery(Name = "plan-id")] int planId)
        {
            try
            {
                var result = await _planService.DeleteAsync(planId);
                if (result)
                {
                    return Ok(new BaseResponse
                    {
                        StatusCode = StatusCodes.Status200OK,
                        Message = "Xóa dịch vụ thành công",
                        IsSuccess = true
                    });
                }
                return BadRequest(new BaseResponse
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    Message = "Xóa dịch vụ thất bại",
                    IsSuccess = false
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    Message = "Lỗi khi xóa dịch vụ!" + ex.Message,
                    IsSuccess = false
                });
            }
        }

        //[Authorize(Roles = UserRoles.Admin)]
        [HttpPut(APIRoutes.Plan.Update, Name = "update-plan-async")]
        public async Task<IActionResult> UpdateAsync([FromForm] int planId, [FromForm] CreateRequest reqObj)
        {
            try
            {
                var updatedPlan = await _planService.UpdateAsync(planId, reqObj.PlanName, reqObj.MaxMenu, reqObj.MaxAccount, reqObj.Price);
                if (updatedPlan != null)
                {
                    return Ok(new BaseResponse
                    {
                        StatusCode = StatusCodes.Status200OK,
                        Message = "Cập nhật dịch vụ thành công",
                        Data = updatedPlan,
                        IsSuccess = true
                    });
                }
                return BadRequest(new BaseResponse
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    Message = "Cập nhật dịch vụ thất bại",
                    IsSuccess = false
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    Message = "Lỗi khi cập nhật dịch vụ!" + ex.Message,
                    IsSuccess = false
                });
            }
        }

    }
}
