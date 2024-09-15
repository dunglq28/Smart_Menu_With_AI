using FSU.SmartMenuWithAI.Repository.Entities;
using FSU.SmartMenuWithAI.Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FSU.SmartMenuWithAI.Repository.Repositories
{
    public class PlanRepository : GenericRepository<Plan>, IPlanRepository
    {
        private readonly SmartMenuContext _context;

        public PlanRepository(SmartMenuContext context) : base(context)
        {
            _context = context;
        }
    }
}
