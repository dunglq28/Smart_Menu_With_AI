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

            // Lấy danh sách thực thể với bộ lọc và phân trang
            var entities = await _unitOfWork.PaymentRepository
                .Get(filter: filter, orderBy: orderBy, pageIndex: pageIndex, pageSize: pageSize);

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

<<<<<<< HEAD
        public async Task<PaymentDTO> Insert(int userID, decimal? amount , string email)
        {

            var payment = new Payment();
            payment.Amount = amount;
            payment.Email = email;
            payment.UserId = userID;
            payment.Status = (int)PaymentStatus.Waiting;
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
=======
        public async Task<PaymentDTO> GetByEmail(string email)
        {
            Expression<Func<Payment, bool>> condition = x => x.Email == email && (x.Status != (int)PaymentStatus.Failed);

            var entity = await _unitOfWork.PaymentRepository.GetByCondition(condition);
            if (entity == null)
            {
                return null!;
            }
            return _mapper?.Map<PaymentDTO>(entity)!;
>>>>>>> bc4921325180e8ec4c657e4d1ee42975362b463a
        }
    }
}
