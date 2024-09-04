using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartMenu.Common.Constants;
using SmartMenu.Common.Enums;
using SmartMenu.DTOs;
using SmartMenu.Entities;
using SmartMenu.Interfaces;
using SmartMenu.Payloads;
using SmartMenu.Payloads.Requests;
using SmartMenu.Payloads.Requests.BrandRequest;
using SmartMenu.Payloads.Responses;
using SmartMenu.Repositories;
using SmartMenu.Services;
using SmartMenu.Utils;
using SmartMenu.Validations;
using System.Drawing.Printing;

namespace SmartMenu.Controllers
{
    public class BrandController : ControllerBase
    {

        private readonly IUnitOfWork _unitOfWork;
        private readonly IS3Service _s3Service;
        private readonly AddBrandValidation _addBrandValidation;
        private readonly ImageFileValidator _imageFileValidator;

        public BrandController(IUnitOfWork unitOfWork, IS3Service s3Service)
        {
            _unitOfWork = unitOfWork;
            _s3Service = s3Service;
            _addBrandValidation = new AddBrandValidation();
            _imageFileValidator = new ImageFileValidator();
        }

        //[Authorize(Roles = UserRoles.Admin)]
        [HttpGet(APIRoutes.Brand.GetAll, Name = "get-brands-async")]
        public async Task<IActionResult> GetAllAsync(int pageNumber = 1 , int PageSize = 5)
        [Authorize(Roles = UserRoles.Admin)]
        [HttpGet(APIRoutes.Brand.GetAll, Name = "GetBrandsAsync")]
        public async Task<IActionResult> GetAllAsync()
        {
            try
            {
                var allBrands = await _unitOfWork.BrandRepository.GetAllAsync();
                var paging = PaginationHelper.PaginationAsync(pageNumber, allBrands, PageSize);
                return Ok(new BaseResponse
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "Thành công!",
                    Data = paging,
                    IsSuccess = true
                });
            }
            catch
            {
                return NotFound(new BaseResponse
                {
                    StatusCode = StatusCodes.Status404NotFound,
                    Message = "Không tìm thấy!",
                    Data = null,
                    IsSuccess = false
                });
            }
        }
       
        //[Authorize(Roles = UserRoles.Admin)]
        [HttpPost(APIRoutes.Brand.Add, Name = "add-brand-async")]
        public async Task<IActionResult> AddAsync(AddBrandRequest reqObj)
        {
            try
            {
                var validation = await _addBrandValidation.ValidateAsync(reqObj);
                if (!validation.IsValid)
                {
                    return BadRequest(new BaseResponse
                    {
                        StatusCode = StatusCodes.Status400BadRequest,
                        Message = "Nhập đầy đủ và hợp lệ các trường",
                        Data = null,
                        IsSuccess = false
                    });
                }
                if (reqObj.image == null || reqObj.image.Length == 0)
                {
                    return BadRequest(new BaseResponse
                    {
                        StatusCode = StatusCodes.Status400BadRequest,
                        Message = "Cần có hình ảnh",
                        Data = null,
                        IsSuccess = false
                    });
                }
                var validationResult = await _imageFileValidator.ValidateAsync(reqObj.image);
                // Kiểm tra phần mở rộng của tệp tin
                if (!validationResult.IsValid)
                {
                    return BadRequest(new BaseResponse
                    {
                        StatusCode = StatusCodes.Status400BadRequest,
                        Message = "File không phải là hình ảnh hợp lệ",
                        Data = null,
                        IsSuccess = false
                    });
                }

                string imageUrl = null!;
                string imageName = null!;

                if (reqObj.image != null)
                {
                    // Upload the image to S3 and get the URL
                    var result = await _s3Service.UploadItemAsync(reqObj.image, "brands");
                    imageName = reqObj.image.FileName;
                    imageUrl = _s3Service.GetPreSignedURL(imageName);
                }
                var existBrand = await _unitOfWork.BrandRepository.GetByNameAsync(reqObj.BrandName);
                if (existBrand != null)
                {
                    return BadRequest(new BaseResponse
                    {
                        StatusCode = StatusCodes.Status400BadRequest,
                        Message = "Tên thương hiệu đã tồn tại.",
                        Data = null,
                        IsSuccess = false
                    });
                }
                var BrandAdd = await _unitOfWork.BrandRepository.AddAsync(reqObj.BrandName, reqObj.UserId, imageUrl, imageName);
                return Ok(new BaseResponse
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "Tạo thương hiệu mới thành công.",
                    Data = BrandAdd,
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

        //[Authorize(Roles = UserRoles.Admin)]
        [HttpPut(APIRoutes.Brand.Update, Name = "UpdateAsync")]
        public async Task<IActionResult> UpdateAsync(int id, IFormFile image, string brandName, int status)
        {
            try
            {
                string imageUrl = null!;
                string imageName = null!;

                if (image != null)
                {
                    // Upload the image to S3 and get the URL
                    var result = await _s3Service.UploadItemAsync(image,"brands");
                    imageName = image.FileName;
                    imageUrl = _s3Service.GetPreSignedURL(imageName);
                }
                var existBrand = await _unitOfWork.BrandRepository.GetByIdAsync(id);
                if (brandName != existBrand.BrandName)
                {
                    var existBrandName = await _unitOfWork.BrandRepository.GetByNameAsync(brandName);
                    if (existBrand != null)
                    {
                        return BadRequest(new BaseResponse
                        {
                            StatusCode = StatusCodes.Status400BadRequest,
                            Message = "Tên thương hiệu đã tồn tại.",
                            Data = null,
                            IsSuccess = false
                        });
                    }
                }
                var updatedBrand = await _unitOfWork.BrandRepository.UpdateAsync(id, brandName, imageUrl, imageName, status);
                if (updatedBrand == null)
                {
                    return NotFound(new BaseResponse
                    {
                        StatusCode = StatusCodes.Status404NotFound,
                        Message = "Không tìm thấy thương hiệu để cập nhật!",
                        Data = null,
                        IsSuccess = false
                    });
                }
                return Ok(new BaseResponse
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "cập nhật thành công!",
                    Data = updatedBrand,
                    IsSuccess = true
                });
            }

            catch (Exception ex)
            {
                return BadRequest(new BaseResponse
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    Message = $"cập nhật lỗi! Error: {ex.Message}",
                    Data = null,
                    IsSuccess = false
                });
            }
        }

        //[Authorize(Roles = UserRoles.Admin)]
        [HttpDelete(APIRoutes.Brand.Delete, Name = "DeleteBrandAsync")]
        public async Task<IActionResult> DeleteAsync(int id)
        {
            try
            {
                // Kiểm tra xem thương hiệu có tồn tại không
                var existingBrand = await _unitOfWork.BrandRepository.GetByIdAsync(id);
                if (existingBrand == null)
                {
                    return NotFound(new BaseResponse
                    {
                        StatusCode = StatusCodes.Status404NotFound,
                        Message = "Không tìm thấy thương hiệu để xóa",
                        Data = null,
                        IsSuccess = false
                    });
                }
                // Cập nhật trạng thái của thương hiệu thành 2 để xóa
                existingBrand.Status = (int) Status.Deleted;
                await _unitOfWork.BrandRepository.UpdateAsync(id, existingBrand);
                return Ok(new BaseResponse
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "Xóa thương hiệu thành công.",
                    Data = null,
                    IsSuccess = true
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new BaseResponse
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    Message = $"Xóa thất bại! Error: {ex.Message}",
                    Data = null,
                    IsSuccess = false
                });
            }
        }

        //[Authorize(Roles = UserRoles.Admin+","+UserRoles.BrandManager)]
        [HttpPut(APIRoutes.Brand.GetByUserID, Name = "GetByUserIDAsync")]
        public async Task<IActionResult> GetByUserID(int userID, int pageNumber = 1, int PageSize = 5)
        {
            try
            {
                var brands = await _unitOfWork.BrandRepository.GetByUserIDAsync(userID);

                if (brands == null || !brands.Any())
                {
                    return NotFound(new BaseResponse
                    {
                        StatusCode = StatusCodes.Status404NotFound,
                        Message = "Không tìm thấy bất kì thương hiệu nào!",
                        Data = null,
                        IsSuccess = false
                    });
                }

                var paging = PaginationHelper.PaginationAsync(pageNumber, brands, PageSize);
                return Ok(new BaseResponse
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "Thành công!",
                    Data = paging,
                    IsSuccess = true
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new BaseResponse
                {
                    StatusCode = StatusCodes.Status500InternalServerError,
                    Message = $"Đã có lỗi xảy ra! {ex.Message}",
                    Data = null,
                    IsSuccess = false
                });
            }
        }
    }
}
