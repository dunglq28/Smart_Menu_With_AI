using Azure.Core;
using FSU.SmartMenuWithAI.Repository.Entities;
using FSU.SmartMenuWithAI.Service.ISerivice;
using FSU.SmartMenuWithAI.Service.Models;
using FSU.SmartMenuWithAI.Service.Models.PayOS;
using Microsoft.Extensions.Options;
using Net.payOS;
using Net.payOS.Types;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FSU.SmartMenuWithAI.Service.Services
{
    public class PayOSService : IPayOSService
    {
        private readonly PayOSSetting _payOSSetting;

        public PayOSService(IOptions<PayOSSetting> payOSSetting)
        {
            _payOSSetting = payOSSetting.Value;
        }

        public async Task<string> CreatePaymentLink(int transactionId, string planName, int amount, string returnUrl, string cancelUrl)
        {
            var payOS = new PayOS(_payOSSetting.ClientID, _payOSSetting.ApiKey, _payOSSetting.ChecksumKey);

            var domain = _payOSSetting.domain;

            var paymentLinkRequest = new PaymentData(
                orderCode: transactionId,
                amount: amount,
                description: "Thanh toán đơn hàng",
                items: [new(planName, 1, amount)],
                returnUrl: $"{domain}/{returnUrl}",
                cancelUrl: $"{domain}/{cancelUrl}"
            );
            var response = await payOS.createPaymentLink(paymentLinkRequest);
            return response.checkoutUrl;
        }
    }
}
