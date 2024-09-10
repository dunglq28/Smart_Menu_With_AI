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
    }
}
