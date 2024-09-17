using AutoMapper;
using FSU.SmartMenuWithAI.Repository.Entities;
using FSU.SmartMenuWithAI.Repository.UnitOfWork;
using FSU.SmartMenuWithAI.Service.ISerivice;
using FSU.SmartMenuWithAI.Service.Models.Pagination;
using FSU.SmartMenuWithAI.Service.Models;
using FSU.SmartMenuWithAI.Service.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using FSU.SmartMenuWithAI.Service.Utils.Common.Enums;

namespace FSU.SmartMenuWithAI.Service.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public PaymentService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }
        public async Task<PageEntity<PaymentDTO>?> GetAsync(string? searchKey, int? pageIndex, int? pageSize)
        {
            // Điều kiện lọc: nếu searchKey rỗng hoặc null, thì lấy hết
            Expression<Func<Payment, bool>> filter = x =>
                string.IsNullOrEmpty(searchKey) || x.Email.ToLower().Contains(searchKey.ToLower());

            // Sắp xếp theo CreatedAt giảm dần
            Func<IQueryable<Payment>, IOrderedQueryable<Payment>> orderBy = q => q.OrderByDescending(x => x.CreatedAt);

            string includeProperties = "Subscription,Subscription.Plan";

            // Lấy danh sách thực thể với bộ lọc và phân trang
            var entities = await _unitOfWork.PaymentRepository
                .Get(filter: filter, orderBy: orderBy, includeProperties: includeProperties, pageIndex: pageIndex, pageSize: pageSize);

            // Tạo đối tượng phân trang
            var pagin = new PageEntity<PaymentDTO>
            {
                List = _mapper.Map<IEnumerable<PaymentDTO>>(entities).ToList()
            };

            // Tính tổng số bản ghi dựa trên bộ lọc
            pagin.TotalRecord = await _unitOfWork.PaymentRepository.Count(filter);

            // Tính tổng số trang
            pagin.TotalPage = PaginHelper.PageCount(pagin.TotalRecord, pageSize!.Value);

            return pagin;
        }

        public async Task<PaymentDTO> Insert(int userID, decimal? amount, string email)
        {

            var payment = new Payment();
            payment.Amount = amount;
            payment.Email = email;
            payment.UserId = userID;
            payment.Status = (int)PaymentStatus.Pending;
            payment.PaymentDate = DateTime.Now;
            payment.CreatedAt = DateTime.Now;
            payment.UpdatedAt = DateTime.Now;
            payment.TransactionId = Guid.NewGuid().ToString();

            await _unitOfWork.PaymentRepository.Insert(payment);



            var result = await _unitOfWork.SaveAsync() > 0 ? true : false;
            if (result)
            {
                return _mapper?.Map<PaymentDTO>(payment)!;
            }
            return null!;
        }
        public async Task<PaymentDTO> Checkout(int userID, decimal? amount, string email, int transactionId)
        {
            var payment = new Payment();
            payment.Amount = amount;
            payment.Email = email;
            payment.UserId = userID;
            payment.Status = (int)PaymentStatus.Pending;
            payment.PaymentDate = DateTime.Now;
            payment.CreatedAt = DateTime.Now;
            payment.UpdatedAt = DateTime.Now;
            payment.TransactionId = transactionId.ToString();

            await _unitOfWork.PaymentRepository.Insert(payment);

            var result = await _unitOfWork.SaveAsync() > 0 ? true : false;
            if (result)
            {
                return _mapper?.Map<PaymentDTO>(payment)!;
            }
            return null!;
        }

        public async Task<PaymentDTO> GetByEmail(string email)
        {
            Expression<Func<Payment, bool>> condition = x => x.Email == email && (x.Status != (int)PaymentStatus.Failed);

            var entity = await _unitOfWork.PaymentRepository.GetByCondition(condition);
            if (entity == null)
            {
                return null!;
            }
            return _mapper?.Map<PaymentDTO>(entity)!;
        }
        public async Task<SubscriptionDTO> AddSubscription(int userID, string email, int planId, int paymentId)
        {
            var subscription = new Subscription();
            subscription.SubscriptionCode = Guid.NewGuid().ToString();
            subscription.Status = (int)PaymentStatus.Pending; // set the status accordingly
            subscription.StartDate = DateTime.Now; // set the start date accordingly
            subscription.EndDate = DateTime.Now.AddMonths(1); // set the end date accordingly
            subscription.UserId = userID;
            subscription.Email = email;
            subscription.PlanId = planId; // assuming planId is an integer
            subscription.PaymentId = paymentId; // set the PaymentId foreign key

            await _unitOfWork.SubscriptioRepository.Insert(subscription);

            var result = await _unitOfWork.SaveAsync() > 0 ? true : false;
            if (result)
            {
                return _mapper?.Map<SubscriptionDTO>(subscription)!;
            }
            return null!;
        }

        public async Task<bool> ConfirmPaymentAsync(int paymentId, int userId, int status)
        {
            // Lấy payment từ PaymentRepository dựa vào paymentId và userId
            var payment = await _unitOfWork.PaymentRepository.GetByID(paymentId);
            if (payment == null || payment.UserId != userId)
            {
                // Payment không tồn tại hoặc không thuộc về userId được cung cấp
                return false;
            }

            // Lấy subscription từ SubscriptionRepository dựa vào paymentId
            var subscription = await _unitOfWork.SubscriptioRepository.GetByCondition(s => s.PaymentId == paymentId);
            if (subscription == null || subscription.PaymentId != paymentId || subscription.UserId != userId)
            {
                // Subscription không tồn tại hoặc không khớp với paymentId hoặc userId
                return false;
            }

            // Cập nhật trạng thái cho payment và subscription dựa vào status truyền vào
            payment.Status = status; // 1 = Thành công, 2 = Thất bại
            payment.UpdatedAt = DateTime.Now;
            _unitOfWork.PaymentRepository.Update(payment);

            subscription.Status = status; // 1 = Thành công, 2 = Thất bại
            //if (status == 1)
            //{
                //subscription.StartDate = DateTime.Now;
                //subscription.EndDate = DateTime.Now.AddMonths(1); // Đăng ký có giá trị trong 1 tháng nếu thành công
            //}
            _unitOfWork.SubscriptioRepository.Update(subscription);

            // Cập nhật trạng thái người dùng nếu cần (chỉ nếu thanh toán thành công)
            if (status == 1)
            {
                var user = await _unitOfWork.AppUserRepository.GetByID(userId);
                if (user != null)
                {
                    user.IsActive = true; // Kích hoạt người dùng nếu thanh toán thành công
                    _unitOfWork.AppUserRepository.Update(user);
                }
            }

            // Lưu tất cả thay đổi vào database
            var result = await _unitOfWork.SaveAsync();

            return result > 0; // Nếu lưu thành công trả về true, ngược lại false
        }
    }
}
