using AutoMapper;
using FSU.SmartMenuWithAI.Repository.Entities;
using FSU.SmartMenuWithAI.Repository.UnitOfWork;
using FSU.SmartMenuWithAI.Service.ISerivice;
using FSU.SmartMenuWithAI.Service.Models;
using FSU.SmartMenuWithAI.Service.Models.ListPosition;
using FSU.SmartMenuWithAI.Service.Models.ListProduct;
using Microsoft.IdentityModel.Tokens;
using System.Collections.Generic;
using System.Linq.Expressions;
using static Amazon.S3.Util.S3EventNotification;

namespace FSU.SmartMenuWithAI.Service.Services
{
    public class ProductListService : IProductListService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ProductListService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<ProductListDTO> GetByID(int productId, int listId)
        {
            Expression<Func<ProductList, bool>> condition = x => x.ProductId == productId && x.ListId == listId;
            var entity = await _unitOfWork.ProductListRepository.GetByCondition(condition);
            return _mapper?.Map<ProductListDTO?>(entity)!;
        }
        public async Task<ProductListDTO> Insert(int productId, int listId, int indexInList, int brandId)
        {
            // Check if the listId exists in the ListPosition table
            var listPosition = await _unitOfWork.ListPositionRepository.GetByID(listId);
            if (listPosition == null)
            {
                throw new Exception("List ID không tồn tại.");
            }

            // Check if the productId exists in the Product table
            var product = await _unitOfWork.ProductRepository.GetByID(productId);
            if (product == null)
            {
                throw new Exception("Product ID không tồn tại");
            }

            // Check if the brandId matches the brandId of the product
            if (product.BrandId != brandId)
            {
                throw new Exception("Brand ID không khớp với Product.");
            }

            // Check if the product already exists in the list
            var existProductInList = await _unitOfWork.ProductListRepository.GetByCondition(p => p.ProductId == productId && p.ListId == listId);
            if (existProductInList != null)
            {
                throw new Exception("Product đã tồn tại trong List.");
            }

            // Check if indexInList is valid
            if (indexInList < 0)
            {
                throw new Exception("Index không hợp lệ.");
            }

            var productList = new ProductList
            {
                ProductId = productId,
                ListId = listId,
                IndexInList = indexInList,
                BrandId = brandId
            };

            await _unitOfWork.ProductListRepository.Insert(productList);
            var result = await _unitOfWork.SaveAsync() > 0 ? true : false;
            if (result)
            {
                return _mapper?.Map<ProductListDTO?>(productList)!;
            }
            return null!;
        }
        public async Task<List<ProductListDTO>> Insert2(int brandId, List<ListProductDetail> listProductDetails)
        {
            var listPositionDTOs = new List<ProductListDTO>();
            foreach (var detail in listProductDetails)
            {
                foreach (var detailIndex in detail.IndexProducts!)
                {
                    // Check if the listId exists in the ListPosition table
                    var listPosition = await _unitOfWork.ListPositionRepository.GetByID(detail.ListId);
                    if (listPosition == null)
                    {
                        throw new Exception("List ID không tồn tại.");
                    }

                    // Check if the productId exists in the Product table
                    var product = await _unitOfWork.ProductRepository.GetByID(detailIndex.ProductId);
                    if (product == null)
                    {
                        throw new Exception("Product ID không tồn tại");
                    }

                    // Check if the brandId matches the brandId of the product
                    if (product.BrandId != brandId)
                    {
                        throw new Exception("Brand ID không khớp với Product.");
                    }

                    // Check if the product already exists in the list
                    var existProductInList = await _unitOfWork.ProductListRepository.GetByCondition(p => p.ProductId == detailIndex.ProductId && p.ListId == detail.ListId);
                    if (existProductInList != null)
                    {
                        throw new Exception("Product đã tồn tại trong List.");
                    }

                    // Check if indexInList is valid
                    if (detailIndex.IndexInList < 0)
                    {
                        throw new Exception("Index không hợp lệ.");
                    }
                    var productList = new ProductList()
                    {
                        BrandId = brandId,
                        ListId = detail.ListId,
                        ProductId = detailIndex.ProductId,
                        IndexInList = detailIndex.IndexInList,
                    };
                    await _unitOfWork.ProductListRepository.Insert(productList);
                    var result = await _unitOfWork.SaveAsync() > 0 ? true : false;
                    if (result)
                    {
                        var listPositionDTO = _mapper?.Map<ProductListDTO>(productList);
                        if (listPositionDTO != null)
                        {
                            listPositionDTOs.Add(listPositionDTO);
                        }
                    }
                    else
                    {
                        throw new Exception("Lỗi khi lưu vào cơ sở dữ liệu");
                    }
                }
            }
            // Lưu các thay đổi vào cơ sở dữ liệu
            await _unitOfWork.SaveAsync();
            return listPositionDTOs;
        }
        public async Task<List<ProductListDTO>> Update2(int brandId, List<ListProductDetail> listProductDetails)
        {
            var listPositionDTOs = new List<ProductListDTO>();
            foreach (var detail in listProductDetails)
            {
                var porductListToupdate = await _unitOfWork.ProductListRepository.Get(p => p.ListId == detail.ListId);
                foreach (var listProduct in porductListToupdate)
                {
                    _unitOfWork.ProductListRepository.Delete(listProduct);
                }
                foreach (var detailIndex in detail.IndexProducts!)
                {
                    // Check if the listId exists in the ListPosition table
                    var listPosition = await _unitOfWork.ListPositionRepository.GetByID(detail.ListId);
                    if (listPosition == null)
                    {
                        throw new Exception("List ID không tồn tại.");
                    }

                    // Check if the productId exists in the Product table
                    var product = await _unitOfWork.ProductRepository.GetByID(detailIndex.ProductId);
                    if (product == null)
                    {
                        throw new Exception("Product ID không tồn tại");
                    }

                    // Check if the brandId matches the brandId of the product
                    if (product.BrandId != brandId)
                    {
                        throw new Exception("Brand ID không khớp với Product.");
                    }

                    // Check if indexInList is valid
                    if (detailIndex.IndexInList < 0)
                    {
                        throw new Exception("Index không hợp lệ.");
                    }
                    var productList = new ProductList()
                    {
                        BrandId = brandId,
                        ListId = detail.ListId,
                        ProductId = detailIndex.ProductId,
                        IndexInList = detailIndex.IndexInList,
                    };
                    await _unitOfWork.ProductListRepository.Insert(productList);
                    var result = await _unitOfWork.SaveAsync() > 0 ? true : false;
                    var listPositionDTO = _mapper?.Map<ProductListDTO>(productList);
                    if (listPositionDTO != null)
                    {
                        listPositionDTOs.Add(listPositionDTO);
                    }
                }
            }
            return listPositionDTOs;
        }
        public async Task<ProductListDTO> UpdateAsync(int productId, int listId, int index, int newProductId)
        {
            // Retrieve the existing product list item from the repository
            var existingProductList = await _unitOfWork.ProductListRepository.GetByCondition(p => p.ProductId == productId && p.ListId == listId);
            if (existingProductList == null)
            {
                throw new Exception("Không tìm thấy sản phẩm trong danh sách.");
            }

            //Trường hợp thay đổi product mới vào list
            if (productId != newProductId && newProductId > 0)
            {
                var existingNewProductList = await _unitOfWork.ProductListRepository.GetByCondition(p => p.ProductId == newProductId && p.ListId == listId);
                if (existingNewProductList != null)
                {
                    throw new Exception("Sản phẩm cần thêm vào đã tồn tại trong danh sách");
                }
                //thêm product mới thế chỗ product cũ trong list
                else
                {
                    // Check if the newproductId exists in the Product table
                    var product = await _unitOfWork.ProductRepository.GetByID(newProductId);
                    if (product == null)
                    {
                        throw new Exception("Product ID mới không tồn tại");
                    }

                    // Check if the brandId matches the brandId of the product
                    if (product.BrandId != existingProductList!.BrandId)
                    {
                        throw new Exception("Brand ID không khớp với Product mới");
                    }
                    // Create a new ProductList entry with the new product
                    var newProductList = new ProductList
                    {
                        ProductId = newProductId,
                        ListId = listId,
                        IndexInList = existingProductList.IndexInList,
                        BrandId = existingProductList.BrandId,
                    };

                    // Update properties with new values if they are not null
                    if (index > 0)
                    {
                        newProductList.IndexInList = index;
                    }

                    // Remove the existing product from the list
                    _unitOfWork.ProductListRepository.Delete(existingProductList);
                    await _unitOfWork.ProductListRepository.Insert(newProductList);
                    var resultIf = await _unitOfWork.SaveAsync() > 0 ? true : false;
                    // Map the updated entity to DTO if necessary
                    if (resultIf)
                    {
                        return _mapper?.Map<ProductListDTO>(newProductList)!;
                    }
                    else
                    {
                        throw new Exception("Lỗi khi lưu thay đổi vào cơ sở dữ liệu.");
                    }
                }
            }
            //Trường hợp chỉnh sửa thông tin của product hiện tại của list
            else
            {
                // Update properties with new values if they are not null
                if (index > 0)
                {
                    existingProductList.IndexInList = index;
                }

                // Perform the update in the repository
                _unitOfWork.ProductListRepository.Update(existingProductList);

                var result = await _unitOfWork.SaveAsync() > 0 ? true : false;
                // Map the updated entity to DTO if necessary
                if (result)
                {
                    return _mapper?.Map<ProductListDTO>(existingProductList)!;
                }
                else
                {
                    throw new Exception("Lỗi khi lưu thay đổi vào cơ sở dữ liệu.");
                }
            }
        }
        public async Task<bool> DeleteAsync(int productId, int listId)
        {
            Expression<Func<ProductList, bool>> condition = x => x.ProductId == productId && x.ListId == listId;
            var entity = await _unitOfWork.ProductListRepository.GetByCondition(condition);
            if (entity == null)
            {
                throw new Exception("Không tìm thấy sản phẩm trong danh sách.");
            }
            _unitOfWork.ProductListRepository.Delete(entity);
            await _unitOfWork.SaveAsync();
            return true;
        }
    }
}
