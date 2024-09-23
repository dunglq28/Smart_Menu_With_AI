using Amazon.Rekognition.Model;
using AutoMapper;
using FSU.SmartMenuWithAI.Repository.Common.Enums;
using FSU.SmartMenuWithAI.Repository.Entities;
using FSU.SmartMenuWithAI.Repository.UnitOfWork;
using FSU.SmartMenuWithAI.Service.ISerivice;
using FSU.SmartMenuWithAI.Service.Models;
using FSU.SmartMenuWithAI.Service.Models.CustomerSegment;
using FSU.SmartMenuWithAI.Service.Models.Pagination;
using FSU.SmartMenuWithAI.Service.Utils;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Text.RegularExpressions;

namespace FSU.SmartMenuWithAI.Service.Services
{
    public class CustomerSegmentService : ICustomerSegmentService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public CustomerSegmentService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<bool> Delete(int SegmentId)
        {
            Expression<Func<CustomerSegment, bool>> condition = x => x.SegmentId == SegmentId && x.Status == (int)Status.Exist;
            var cusSegment = await _unitOfWork.CustomerSegmentRepository.GetByCondition(condition);
            if (cusSegment != null)
            {
                cusSegment.Status = (int)Status.Deleted;
                _unitOfWork.CustomerSegmentRepository.Update(cusSegment);
                // Xóa tất cả SegmentAttribute có cùng SegmentId
                Expression<Func<SegmentAttribute, bool>> attributeCondition = x => x.SegmentId == SegmentId;
                var segmentAttributes = await _unitOfWork.SegmentAttributeRepository1.Get(attributeCondition);
                foreach (var attribute in segmentAttributes)
                {
                    _unitOfWork.SegmentAttributeRepository1.Delete(attribute);
                }

                var result = await _unitOfWork.SaveAsync() > 0 ? true : false;
                return result;
            }
            else
            {
                throw new Exception("Không tìm thấy phân khúc khách hàng");
            }
        }

        public async Task<PageEntity<ViewCustomerSegment>> GetAllAsync(string? searchKey, int? pageIndex, int? pageSize, int brandId)
        {
            Expression<Func<CustomerSegment, bool>> filter = x => x.BrandId == brandId &&
                                                                (!searchKey.IsNullOrEmpty()
                                                                ? x.SegmentName.Contains(searchKey!) && x.Status == (int)Status.Exist
                                                                : x.Status != (int)Status.Deleted);
            Func<IQueryable<CustomerSegment>, IOrderedQueryable<CustomerSegment>> orderBy = q => q.OrderByDescending(x => x.SegmentId);
            var customerSegments = await _unitOfWork.CustomerSegmentRepository.Get(filter: filter, orderBy: orderBy, includeProperties: "SegmentAttributes", pageIndex: pageIndex, pageSize: pageSize);
            var paginatedSegments = new PageEntity<ViewCustomerSegment>
            {
                List = customerSegments.Select(segment => new ViewCustomerSegment
                {
                    CustomerSegmentId = segment.SegmentId,
                    CustomerSegmentName = segment.SegmentName,
                    Demographic = segment.Demographics,
                    CreateDate = segment.CreateDate,
                    UpdateDate = segment.UpdateDate,
                    Age = segment.SegmentAttributes.FirstOrDefault(attr => attr.AttributeId == 1)?.Value! // Lấy giá trị Age từ SegmentAttributes với AttributeId = 1
                }).ToList(),
                TotalRecord = await _unitOfWork.CustomerSegmentRepository.Count(filter),
                TotalPage = PaginHelper.PageCount(await _unitOfWork.CustomerSegmentRepository.Count(filter), pageSize ?? 10) // Sử dụng pageSize hoặc mặc định 10 nếu null
            };
            return paginatedSegments;
        }
        public async Task<IEnumerable<ViewCustomerSegment>> GetAllNoPaingAsync(int brandId)
        {
            Expression<Func<CustomerSegment, bool>> filter = x => x.BrandId == brandId && x.Status != (int)Status.Deleted;
            Func<IQueryable<CustomerSegment>, IOrderedQueryable<CustomerSegment>> orderBy = q => q.OrderByDescending(x => x.SegmentId);
            var customerSegments = await _unitOfWork.CustomerSegmentRepository.Get(filter: filter, orderBy: orderBy, includeProperties: "SegmentAttributes");
            var list = customerSegments.Select(segment => new ViewCustomerSegment
            {
                CustomerSegmentId = segment.SegmentId,
                CustomerSegmentName = segment.SegmentName,
                Demographic = segment.Demographics,
                CreateDate = segment.CreateDate,
                UpdateDate = segment.UpdateDate,
                Age = segment.SegmentAttributes.FirstOrDefault(attr => attr.AttributeId == 1)?.Value! // Lấy giá trị Age từ SegmentAttributes với AttributeId = 1
            }).ToList();
            return list;
        }
        public async Task<ViewCustomerSegment?> GetByID(int SegmentId)
        {
            //Expression<Func<CustomerSegment, bool>> filterRecord = x => x.SegmentId == SegmentId && (x.Status == (int)Status.Exist);
            //var cusSegment = await _unitOfWork.CustomerSegmentRepository.GetByCondition(filterRecord);
            //var mapdto = _mapper.Map<CustomerSegmentDTO>(cusSegment);
            //return mapdto;
            Expression<Func<CustomerSegment, bool>> viewCustomerSegment = x => x.SegmentId == SegmentId && (x.Status == (int)Status.Exist);
            var customerSegments = await _unitOfWork.CustomerSegmentRepository.Get(filter: viewCustomerSegment, includeProperties: "SegmentAttributes");
            var viewCustomerSegmentList = new ViewCustomerSegment();
            foreach (var segment in customerSegments)
            {
                viewCustomerSegmentList.CustomerSegmentId = segment.SegmentId;
                viewCustomerSegmentList.CustomerSegmentName = segment.SegmentName;
                viewCustomerSegmentList.Demographic = segment.Demographics;
                viewCustomerSegmentList.CreateDate = segment.CreateDate;
                viewCustomerSegmentList.UpdateDate = segment.UpdateDate;
                viewCustomerSegmentList.Age = segment.SegmentAttributes.FirstOrDefault(attr => attr.AttributeId == 1)?.Value!;
            }
            return viewCustomerSegmentList;
        }

        public async Task<IEnumerable<ViewCustomerSegment>> Insert(string customerSegmentName, string age, List<string> genders, List<string> sessions, int brandID)
        {
            try
            {
                // Kiểm tra customerSegmentName
                if (string.IsNullOrEmpty(customerSegmentName) || customerSegmentName.Length <= 5)
                {
                    throw new ArgumentException("Tên phân khúc phải có độ dài lớn hơn 5 ký tự.");
                }

                // Kiểm tra age
                if (!Regex.IsMatch(age, @"^\d{1,2}-\d{1,2}$"))
                {
                    throw new ArgumentException("Độ tuổi phải có định dạng 'xx-xx'.");
                }

                var ageParts = age.Split('-');
                var ageStart = int.Parse(ageParts[0]);
                var ageEnd = int.Parse(ageParts[1]);

                if (ageStart < 0 || ageStart > 99 || ageEnd < 0 || ageEnd > 99 || ageStart >= ageEnd)
                {
                    throw new ArgumentException("Khoảng độ tuổi không hợp lệ.");
                }

                // Kiểm tra genders
                var validGenders = new List<string> { "Nam", "Nữ", "Male", "Female" };
                foreach (var gender in genders)
                {
                    if (!validGenders.Contains(gender))
                    {
                        throw new ArgumentException("Giới tính không hợp lệ.");
                    }
                }

                // Kiểm tra sessions
                var validSessions = new List<string> { "Sáng", "Trưa", "Chiều", "Morning", "Afternoon", "Evening" };
                foreach (var session in sessions)
                {
                    if (!validSessions.Contains(session))
                    {
                        throw new ArgumentException("Thời gian không hợp lệ.");
                    }
                }

                var listSegmentExist = new List<CustomerSegment>();
                foreach (var gender in genders)
                {
                    foreach (var session in sessions)
                    {
                        Expression<Func<CustomerSegment, bool>> duplicateName = x => x.SegmentName == customerSegmentName
                                                                                            && x.Demographics == gender + ", " + session
                                                                                            && (x.Status == (int)Status.Exist);

                        var exist = await _unitOfWork.CustomerSegmentRepository.GetByCondition(duplicateName);
                        if (exist != null)
                        {
                            listSegmentExist.Add(exist);
                        }
                    }
                }

                if (listSegmentExist.Count != 0)
                {
                    var errorMessageBuilder = new StringBuilder();
                    errorMessageBuilder.AppendLine("Phân khúc khách hàng đã tồn tại. Thông tin các phân khúc:/n");

                    foreach (var item in listSegmentExist)
                    {
                        errorMessageBuilder.AppendLine($"Tên phân khúc: {item.SegmentName}, Nhân khẩu học: {item.Demographics}/n");
                    }
                    string errorMessage = errorMessageBuilder.ToString();
                    throw new DbUpdateException(errorMessage);
                }
                else
                {
                    foreach (var gender in genders)
                    {
                        foreach (var session in sessions)
                        {
                            var customerSegment = new CustomerSegment();
                            customerSegment.SegmentName = customerSegmentName;
                            customerSegment.SegmentCode = Guid.NewGuid().ToString();
                            customerSegment.CreateDate = DateOnly.FromDateTime(DateTime.Now);
                            customerSegment.UpdateDate = DateOnly.FromDateTime(DateTime.Now);
                            customerSegment.Demographics = gender + ", " + session;
                            customerSegment.Status = (int)Status.Exist;
                            customerSegment.BrandId = brandID;
                            await _unitOfWork.CustomerSegmentRepository.Insert(customerSegment);
                            await _unitOfWork.SaveAsync();
                            //lấy customerSegment vừa tạo ra
                            //var customerSegmentCreated = await _unitOfWork.CustomerSegmentRepository.GetByCondition(duplicateName);
                            //if (customerSegmentCreated == null)
                            //{
                            //    throw new Exception("Lỗi khi truy vấn Customer Segment vừa tạo");
                            //}
                            for (var i = 1; i <= 3; i++)
                            {
                                var segmentAttribute = new SegmentAttribute();
                                segmentAttribute.SegmentId = customerSegment.SegmentId;
                                switch (i)
                                {
                                    case 1:
                                        segmentAttribute.AttributeId = 1;
                                        segmentAttribute.Value = age;
                                        break;
                                    case 2:
                                        segmentAttribute.AttributeId = 2;
                                        segmentAttribute.Value = gender;
                                        break;
                                    case 3:
                                        segmentAttribute.AttributeId = 3;
                                        segmentAttribute.Value = session;
                                        break;
                                }
                                segmentAttribute.BrandId = brandID;
                                await _unitOfWork.SegmentAttributeRepository1.Insert(segmentAttribute);
                                //await _unitOfWork.SaveAsync();
                            }
                            await _unitOfWork.SaveAsync();
                        }
                    }
                }



                //sau khi insert đầy đủ vào 2 bảng
                Expression<Func<CustomerSegment, bool>> viewCustomerSegment = x => x.SegmentName == customerSegmentName
                                                                                            && (x.Status == (int)Status.Exist);
                var customerSegments = await _unitOfWork.CustomerSegmentRepository.Get(viewCustomerSegment);
                var viewCustomerSegmentList = new List<ViewCustomerSegment>();
                foreach (var segment in customerSegments)
                {
                    viewCustomerSegmentList.Add(new ViewCustomerSegment
                    {
                        CustomerSegmentId = segment.SegmentId,
                        CustomerSegmentName = segment.SegmentName,
                        Demographic = segment.Demographics,
                        CreateDate = segment.CreateDate,
                        UpdateDate = segment.UpdateDate,
                        Age = age,
                    });
                }
                return viewCustomerSegmentList;
            }
            catch
            {
                throw;
            }
        }


        public async Task<IEnumerable<ViewCustomerSegment>> Update(int segmentId, string segmentName)
        {
            var cusSegToUpdate = await _unitOfWork.CustomerSegmentRepository.GetByID(segmentId);
            if (cusSegToUpdate == null || (cusSegToUpdate.Status == (int)Status.Deleted))
            {
                throw new Exception("Không tìm thấy phân khúc khách hàng");
            }
            Expression<Func<CustomerSegment, bool>> duplicateName = x => x.SegmentName == segmentName && (x.Status == (int)Status.Exist) && x.SegmentId != segmentId && x.Demographics == cusSegToUpdate.Demographics;
            var exist = await _unitOfWork.CustomerSegmentRepository.GetByCondition(duplicateName);
            if (exist != null)
            {
                throw new DbUpdateException("Tên đã tồn tại");
            }
            if (!string.IsNullOrEmpty(segmentName))
            {
                cusSegToUpdate.SegmentName = segmentName;
            }

            _unitOfWork.CustomerSegmentRepository.Update(cusSegToUpdate);
            var result = await _unitOfWork.SaveAsync() > 0 ? true : false;
            if (result)
            {
                Expression<Func<CustomerSegment, bool>> viewCustomerSegment = x => x.SegmentId == segmentId && (x.Status == (int)Status.Exist);
                var customerSegments = await _unitOfWork.CustomerSegmentRepository.Get(filter: viewCustomerSegment, includeProperties: "SegmentAttributes");
                var viewCustomerSegmentList = new List<ViewCustomerSegment>();
                foreach (var segment in customerSegments)
                {
                    viewCustomerSegmentList.Add(new ViewCustomerSegment
                    {
                        CustomerSegmentId = segment.SegmentId,
                        CustomerSegmentName = segment.SegmentName,
                        Demographic = segment.Demographics,
                        CreateDate = segment.CreateDate,
                        UpdateDate = segment.UpdateDate,
                        Age = segment.SegmentAttributes.FirstOrDefault(attr => attr.AttributeId == 1)?.Value!,
                    });
                }
                return viewCustomerSegmentList;
            }
            return null!;
        }

        public async Task<IEnumerable<ViewCustomerSegment>> UpdateSegmentValue(int segmentId, string age, string gender, string session, string segmentName, int brandID)
        {
            // Kiểm tra customerSegmentName
            if (string.IsNullOrEmpty(segmentName) || segmentName.Length <= 5)
            {
                throw new ArgumentException("Tên phân khúc phải có độ dài lớn hơn 5 ký tự.");
            }

            // Kiểm tra age
            if (!Regex.IsMatch(age, @"^\d{1,2}-\d{1,2}$"))
            {
                throw new ArgumentException("Độ tuổi phải có định dạng 'xx-xx'.");
            }

            var ageParts = age.Split('-');
            var ageStart = int.Parse(ageParts[0]);
            var ageEnd = int.Parse(ageParts[1]);

            if (ageStart < 0 || ageStart > 99 || ageEnd < 0 || ageEnd > 99 || ageStart >= ageEnd)
            {
                throw new ArgumentException("Khoảng độ tuổi không hợp lệ.");
            }

            // Kiểm tra genders
            var validGenders = new List<string> { "Nam", "Nữ", "Male", "Female" };

            if (!validGenders.Contains(gender))
            {
                throw new ArgumentException("Giới tính không hợp lệ.");
            }


            // Kiểm tra sessions
            var validSessions = new List<string> { "Sáng", "Trưa", "Chiều", "Morning", "Afternoon", "Evening" };

            if (!validSessions.Contains(session))
            {
                throw new ArgumentException("Thời gian không hợp lệ.");
            }

            var cusSegToUpdate = await _unitOfWork.CustomerSegmentRepository.GetByID(segmentId);
            if (cusSegToUpdate == null || (cusSegToUpdate.Status == (int)Status.Deleted))
            {
                throw new Exception("Không tìm thấy phân khúc khách hàng");
            }
            Expression<Func<CustomerSegment, bool>> duplicateName = x => x.SegmentName == segmentName && (x.Status == (int)Status.Exist) && x.SegmentId != segmentId && x.Demographics == cusSegToUpdate.Demographics;
            var exist = await _unitOfWork.CustomerSegmentRepository.GetByCondition(duplicateName);
            if (exist != null)
            {
                throw new DbUpdateException("Tên phân khúc đã tồn tại");
            }
            if (!string.IsNullOrEmpty(segmentName))
            {
                cusSegToUpdate.SegmentName = segmentName;
            }
            Expression<Func<SegmentAttribute, bool>> condition = x => x.SegmentId != segmentId && (x.AttributeId == 1 && x.Value == age);
            var segmentAttributes = await _unitOfWork.SegmentAttributeRepository1.Get(condition);

            // Prepare a list to batch update
            //List<SegmentAttribute> attributesToUpdate = new List<SegmentAttribute>();
            foreach (var segmentAttribute in segmentAttributes)
            {
                var matchingSegment = await _unitOfWork.CustomerSegmentRepository
                    .GetByCondition(cs =>
                        cs.SegmentId != segmentId &&
                        cs.SegmentName == cusSegToUpdate.SegmentName &&
                        cs.Demographics == gender + ", " + session &&
                        cs.SegmentId == segmentAttribute.SegmentId
                    );

                if (matchingSegment != null)
                {
                    throw new Exception($"Phân khúc khách hàng đã tồn tại: {matchingSegment.SegmentId}");
                }
            }
            cusSegToUpdate.Demographics = gender + ", " + session;
            cusSegToUpdate.UpdateDate = DateOnly.FromDateTime(DateTime.Now);
            _unitOfWork.CustomerSegmentRepository.Update(cusSegToUpdate);
            await _unitOfWork.SaveAsync();
            for (var i = 1; i <= 3; i++)
            {
                var segmentAttribute = new SegmentAttribute();
                segmentAttribute.SegmentId = segmentId;
                switch (i)
                {
                    case 1:
                        segmentAttribute.AttributeId = 1;
                        segmentAttribute.Value = age;
                        break;
                    case 2:
                        segmentAttribute.AttributeId = 2;
                        segmentAttribute.Value = gender;
                        break;
                    case 3:
                        segmentAttribute.AttributeId = 3;
                        segmentAttribute.Value = session;
                        break;
                }
                segmentAttribute.BrandId = cusSegToUpdate.BrandId;
                //attributesToUpdate.Add(segmentAttribute);
                try
                {
                    var segmentAttribute1 = await _unitOfWork.SegmentAttributeRepository1.GetByCondition(sa => sa.SegmentId == segmentId && sa.AttributeId == i);

                    if (segmentAttribute1 != null)
                    {
                        _unitOfWork.SegmentAttributeRepository1.Delete(segmentAttribute1);
                        await _unitOfWork.SaveAsync();
                    }
                    await _unitOfWork.SegmentAttributeRepository1.Insert(segmentAttribute);
                    //await Task.Delay(10000);
                }
                catch (DbUpdateConcurrencyException ex)
                {
                    throw new Exception("Cập nhật thuộc tính phân khúc thất bại do cạnh tranh cập nhật", ex);
                }
            }
            await _unitOfWork.SaveAsync();
            Expression<Func<CustomerSegment, bool>> viewCustomerSegment = x => x.SegmentId == segmentId && (x.Status == (int)Status.Exist);
            var customerSegments = await _unitOfWork.CustomerSegmentRepository.Get(filter: viewCustomerSegment, includeProperties: "SegmentAttributes");
            var viewCustomerSegmentList = new List<ViewCustomerSegment>();
            foreach (var segment in customerSegments)
            {
                viewCustomerSegmentList.Add(new ViewCustomerSegment
                {
                    CustomerSegmentId = segment.SegmentId,
                    CustomerSegmentName = segment.SegmentName,
                    Demographic = segment.Demographics,
                    CreateDate = segment.CreateDate,
                    UpdateDate = segment.UpdateDate,
                    Age = age,
                });
            }
            return viewCustomerSegmentList;
        }

        public async Task<List<ViewCustomerSegment>> GetByMenuID(int menuId)
        {
            // Lấy danh sách các MenuSegment có MenuId tương ứng
            var menus = await _unitOfWork.MenuSegmentRepository.Get(m => m.MenuId == menuId);

            var viewCustomerSegmentList = new List<ViewCustomerSegment>();

            // Lặp qua từng MenuSegment
            foreach (var menu in menus)
            {
                // Lấy các CustomerSegment liên quan tới SegmentId của MenuSegment
                Expression<Func<CustomerSegment, bool>> viewCustomerSegment = x => x.SegmentId == menu.SegmentId && (x.Status == (int)Status.Exist);
                var customerSegments = await _unitOfWork.CustomerSegmentRepository.Get(filter: viewCustomerSegment, includeProperties: "SegmentAttributes");

                // Lặp qua các CustomerSegment và thêm vào danh sách ViewCustomerSegment
                foreach (var segment in customerSegments)
                {
                    var viewSegment = new ViewCustomerSegment
                    {
                        CustomerSegmentId = segment.SegmentId,
                        CustomerSegmentName = segment.SegmentName,
                        Demographic = segment.Demographics,
                        CreateDate = segment.CreateDate,
                        UpdateDate = segment.UpdateDate,
                        Age = segment.SegmentAttributes.FirstOrDefault(attr => attr.AttributeId == 1)?.Value!
                    };
                    viewCustomerSegmentList.Add(viewSegment);
                }
            }

            return viewCustomerSegmentList;
        }

    }
}

