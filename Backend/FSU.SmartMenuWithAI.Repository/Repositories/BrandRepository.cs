
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
    public class BrandRepository : GenericRepository<Brand>, IBrandRepository
    {
        private readonly SmartMenuContext _context;
        private readonly IConfiguration _configuration;

        public BrandRepository(SmartMenuContext context, IConfiguration configuration) : base(context)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<Brand> GetBrandByName(string name)
        {
            var brand = await _context.Brands.FirstOrDefaultAsync(b => b.BrandName == name);
            return brand!;
        }

        public async Task<IEnumerable<Brand>> GetBrands(
           Expression<Func<Brand, bool>> filter = null!,
           Func<IQueryable<Brand>, IOrderedQueryable<Brand>> orderBy = null!,
           int? pageIndex = null, 
           int? pageSize = null) 
        {
            IQueryable<Brand> query = dbSet;

            if (filter != null)
            {
                query = query.Where(filter);
            }

            if (orderBy != null)
            {
                query = orderBy(query);
            }

            if (pageIndex.HasValue && pageSize.HasValue)
            {
                int validPageIndex = pageIndex.Value > 0 ? pageIndex.Value - 1 : 0;
                int validPageSize = pageSize.Value > 0 ? pageSize.Value : 10; 

                query = query.Skip(validPageIndex * validPageSize).Take(validPageSize);
            }

            return await query.ToListAsync();
        }
        public async Task<List<Brand>> GetAllByCondition(Expression<Func<Brand, bool>> filter)
        {
            return await _context.Brands.Where(filter).ToListAsync();
        }
    }
}
