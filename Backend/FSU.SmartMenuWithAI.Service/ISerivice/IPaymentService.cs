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
<<<<<<< HEAD
        Task<PaymentDTO> Insert(int userID, decimal? amount, string email);
=======
        Task<PaymentDTO> GetByEmail(string email);

>>>>>>> bc4921325180e8ec4c657e4d1ee42975362b463a
    }
}
