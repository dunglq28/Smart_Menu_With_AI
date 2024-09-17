using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FSU.SmartMenuWithAI.Service.ISerivice
{
    public interface IPayOSService
    {
        Task<string> CreatePaymentLink(int transactionId, string planName, int amount, string returnUrl, string cancelUrl);
        //Task<PaymentLinkInformationResponse> GetPaymentLinkInformation(long paymentId);
    }
}
