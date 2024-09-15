using FSU.SmartMenuWithAI.Repository.Entities;
using FSU.SmartMenuWithAI.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace FSU.SmartMenuWithAI.Repository.Repositories
{
    public class PaymentRepository : GenericRepository<Payment>, IPaymentRepository
    {
        private readonly SmartMenuContext _context;

        public PaymentRepository(SmartMenuContext context) : base(context)
        {
            _context = context;
        }
    }
}
