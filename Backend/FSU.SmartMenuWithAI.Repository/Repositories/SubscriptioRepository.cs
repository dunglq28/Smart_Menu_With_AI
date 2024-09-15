using FSU.SmartMenuWithAI.Repository.Entities;
using FSU.SmartMenuWithAI.Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FSU.SmartMenuWithAI.Repository.Repositories
{
    public class SubscriptioRepository : GenericRepository<Subscription>, ISubscriptionRepository
    {
        private readonly SmartMenuContext _context;

        public SubscriptioRepository(SmartMenuContext context) : base(context)
        {
            _context = context;
        }
    }
}
