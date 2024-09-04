using FSU.SmartMenuWithAI.Repository.Entities;
using FSU.SmartMenuWithAI.Repository.Interfaces;
using Microsoft.Extensions.Configuration;

namespace FSU.SmartMenuWithAI.Repository.Repositories
{
    public class ListPositionRepository : GenericRepository<ListPosition>, IListPositionRepository
    {
        private readonly SmartMenuContext _context;

        public ListPositionRepository(SmartMenuContext context) : base(context)
        {
            _context = context;
        }
    }
}
