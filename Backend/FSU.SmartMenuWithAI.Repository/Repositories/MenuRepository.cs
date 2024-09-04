using FSU.SmartMenuWithAI.Repository.Entities;
using FSU.SmartMenuWithAI.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace FSU.SmartMenuWithAI.Repository.Repositories
{
    public class MenuRepository : GenericRepository<Menu>, IMenuRepository
    {
        private readonly SmartMenuContext _context;
        private readonly DbSet<Menu> _dbset;

        public MenuRepository(SmartMenuContext context) : base(context)
        {
            _context = context;
            this.dbSet = context.Set<Menu>();

        }

        public async Task<Menu> GetByCondition(Expression<Func<Menu, bool>> filter = null!)
        {
            var query = await _context.Menus.Where(filter).Include(x => x.MenuLists)
                .ThenInclude(x => x.List)
                .ThenInclude(x => x.ProductLists)
                .ThenInclude(x => x.Product)
                .Include(x => x.MenuSegments)
                .ThenInclude(x => x.Segment)
                .Include(x => x.Brand).FirstOrDefaultAsync();

            return query!;
        }
    }
}
