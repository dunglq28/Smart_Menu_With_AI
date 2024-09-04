using FSU.SmartMenuWithAI.Repository.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace FSU.SmartMenuWithAI.Repository.Interfaces
{
    public interface IBrandRepository
    {
        Task<Brand> GetBrandByName(string name);
        Task<IEnumerable<Brand>> GetBrands(
           Expression<Func<Brand, bool>> filter = null!,
           Func<IQueryable<Brand>, IOrderedQueryable<Brand>> orderBy = null!,
           int? pageIndex = null,
           int? pageSize = null);
        Task<List<Brand>> GetAllByCondition(Expression<Func<Brand, bool>> filter);

    }
}
