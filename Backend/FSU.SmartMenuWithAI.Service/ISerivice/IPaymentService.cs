using FSU.SmartMenuWithAI.Service.Models.Pagination;
using FSU.SmartMenuWithAI.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FSU.SmartMenuWithAI.Service.ISerivice
{
    public interface IPaymentService
    {
        Task<PageEntity<PaymentDTO>?> GetAsync(string? searchKey, int? pageIndex, int? pageSize);
        Task<PaymentDTO> GetPayment(int paymentId);
        Task<PaymentDTO> Insert(int userID, decimal? amount, string email);
        Task<PaymentDTO> GetByEmail(string email);
        Task<PaymentDTO> GetByEmail2(string email);
        Task<PaymentDTO> Checkout(int userID, decimal? amount, string email, int transactionId);
        Task<PaymentDTO> Extend(int subId, int transactionId);
        Task<bool> ConfirmPaymentAsync(int paymentId, int userId, int status, bool isRenew);

        //tạo subscription nhưng ở paymentservice
        Task<SubscriptionDTO> AddSubscription(int userID, string email, int planId, int paymentId);
        Task<SubscriptionDTO> AddExtendSubscription(int paymentId, int subId);
    }
}
