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
using Azure.Core;
using Amazon.Runtime.Internal;

namespace FSU.SmartMenuWithAI.Service.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IEmailService _emailService;

        public PaymentService(IUnitOfWork unitOfWork, IMapper mapper, IEmailService emailService)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _emailService = emailService;
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

        //api Check-successed-email
        public async Task<PaymentDTO> GetByEmail(string email)
        {
            Expression<Func<Payment, bool>> condition = x => x.Email == email && (x.Status == (int)PaymentStatus.Succeed);

            var entity = await _unitOfWork.PaymentRepository.GetByCondition(condition);
            if (entity == null)
            {
                return null!;
            }
            return _mapper?.Map<PaymentDTO>(entity)!;
        }

        // api Check-exist-email
        public async Task<PaymentDTO> GetByEmail2(string email)
        {
            Expression<Func<Payment, bool>> condition = x => x.Email == email && (x.Status != (int)PaymentStatus.Succeed);

            var entity = await _unitOfWork.PaymentRepository.GetByCondition(condition);
            if (entity == null)
            {
                return null!;
            }
            return _mapper?.Map<PaymentDTO>(entity)!;
        }
        // -> chưa đăng ký chưa kích hoạt = null (count = 0) -> create new ,
        // -> đã đăng ký thành công những chưa kích hoạt thành công = payment (count > 0) -> update -> trả payment

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

        public async Task<bool> ConfirmPaymentAsync(int paymentId, int userId, int status, bool isRenew)
        {
            // Lấy payment từ PaymentRepository dựa vào paymentId và userId
            var payment = await _unitOfWork.PaymentRepository.GetByID(paymentId);
            if (payment == null || payment.UserId != userId)
            {
                // Payment không tồn tại hoặc không thuộc về userId được cung cấp
                return false;
            }

            if (payment.Status != (int)PaymentStatus.Pending)
            {
                throw new Exception("Thanh toán này không phải trạng thái đang chờ, không thể cập nhật trạng thái");
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

                    // check if isRenew

                    var decryptedPassword = PasswordHelper.ConvertToDecrypt(user.Password!); // Giải mã mật khẩu trước khi gửi
                    if (!isRenew)
                    {
                        var subject = "Thông tin tài khoản Smart Menu của bạn";

                        var body = $@"
                    <div style='font-family: Arial, sans-serif; line-height: 1.6;'>
                        <h2 style='color: #5A3D41;'>Xin chào, {user.Fullname},</h2>
                        <p>Cảm ơn bạn đã đăng ký sử dụng dịch vụ Smart Menu. Dưới đây là thông tin đăng nhập của bạn:</p>
                        <p>
                            <strong>Username:</strong> <span style='color: #5A3D41;'>{user.UserName}</span><br />
                            <strong>Password:</strong> <span style='color: #5A3D41;'>{decryptedPassword}</span>
                        </p>
                        <p style='color: #5A3D41;'><strong>Lưu ý:</strong> Hãy đảm bảo thay đổi mật khẩu sau lần đăng nhập đầu tiên.</p>
                        <p>
                            <a href='https://drive.google.com/drive/folders/1Zr8PgOuj5YCFoKh09D5t_wviYE7UWKs8?usp=sharing' style='color: #5A3D41;'>Tải về ứng dụng và hướng dẫn cài đặt</a>
                        </p>
                        <p>Trân trọng,<br />
                        <em>Đội ngũ hỗ trợ Smart Menu</em></p>
                        <hr />
                        <footer style='font-size: 12px;'>
                            <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ chúng tôi qua email <a href='mailto:meniusvn@gmail.com' style='color: #5A3D41;'>meniusvn@gmail.com</a></p>
                        </footer>
                    </div>";
                        await _emailService.SendEmailAsync(payment.Email, subject, body);
                    }
                    else
                    {
                        // Gửi email thông báo gia hạn
                        var renewSubject = "Gia hạn gói dịch vụ Smart Menu của bạn";
                        var renewBody = $@"
                <div style='font-family: Arial, sans-serif; line-height: 1.6;'>
                    <h2 style='color: #5A3D41;'>Xin chào, {user.Fullname},</h2>
                    <p>Chúng tôi xin thông báo rằng gói dịch vụ Smart Menu của bạn đã được gia hạn thành công.</p>
                    <p>
                        <strong>Thời gian bắt đầu:</strong> {subscription.StartDate}<br />
                        <strong>Thời gian kết thúc:</strong> {subscription.EndDate}
                    </p>
                    <p>Trân trọng,<br />
                    <em>Đội ngũ hỗ trợ Smart Menu</em></p>
                    <hr />
                    <footer style='font-size: 12px;'>
                        <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ chúng tôi qua email <a href='mailto:support@smartmenu.com' style='color: #5A3D41;'>support@smartmenu.com</a></p>
                    </footer>
                </div>";
                        await _emailService.SendEmailAsync(payment.Email, renewSubject, renewBody);
                    }
                }
            }

            // Lưu tất cả thay đổi vào database
            var result = await _unitOfWork.SaveAsync();

            return result > 0; // Nếu lưu thành công trả về true, ngược lại false
        }

        public async Task<PaymentDTO> Extend(int subId, int transactionId)
        {
            var subcription = await _unitOfWork.SubscriptioRepository.GetByID(subId);

            var payment1 = await _unitOfWork.PaymentRepository.GetByID(subcription.PaymentId);

            var payment = new Payment();
            payment.Amount = payment1.Amount;
            payment.Email = payment1.Email;
            payment.UserId = payment1.UserId;
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

        public async Task<SubscriptionDTO> AddExtendSubscription(int paymentId, int subId)
        {
            var sub1 = await _unitOfWork.SubscriptioRepository.GetByID(subId);

            var latestSub = await _unitOfWork.SubscriptioRepository.Get(filter: s => s.UserId == sub1.UserId && s.Status == 1,
                                                                        orderBy: q => q.OrderByDescending(s => s.EndDate) // Sắp xếp theo EndDate giảm dần
                                                                        );
            var latestSubscription = latestSub.FirstOrDefault();

            var subscription = new Subscription();
            subscription.SubscriptionCode = Guid.NewGuid().ToString();
            subscription.Status = (int)PaymentStatus.Pending;
            if (latestSubscription != null)
            {
                subscription.StartDate = latestSubscription.EndDate; // Nếu có subscription, bắt đầu sau ngày kết thúc gần nhất
            }
            else
            {
                subscription.StartDate = DateTime.Now; // Nếu không có, bắt đầu từ ngày hiện tại
            }
            subscription.EndDate = subscription.StartDate.AddMonths(1);
            subscription.UserId = sub1.UserId;
            subscription.Email = sub1.Email;
            subscription.PlanId = sub1.PlanId;
            subscription.PaymentId = paymentId;

            await _unitOfWork.SubscriptioRepository.Insert(subscription);

            var result = await _unitOfWork.SaveAsync() > 0 ? true : false;
            if (result)
            {
                return _mapper?.Map<SubscriptionDTO>(subscription)!;
            }
            return null!;
        }

        public async Task<PaymentDTO> GetPayment(int paymentId)
        {
            Expression<Func<Payment, bool>> filter = x => x.PaymentId == paymentId;

            string includeProperties = "Subscription,Subscription.Plan";

            var payment = await _unitOfWork.PaymentRepository
                .GetByCondition(filter: filter, includeProperties: includeProperties);

            return _mapper.Map<PaymentDTO>(payment)!;
        }
    }
}
