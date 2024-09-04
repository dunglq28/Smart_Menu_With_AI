using FSU.SmartMenuWithAI.Repository.Entities;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace FSU.SmartMenuWithAI.Repository.Interfaces
{
    public interface IAppUserRepository
    {
        IEnumerable<AppUser> Get(
            int currentIDLogin,
            Expression<Func<AppUser, bool>> filter = null!,
            Func<IQueryable<AppUser>, IOrderedQueryable<AppUser>> orderBy = null!,
            string includeProperties = "",
            int? pageIndex = null, // Optional parameter for pagination (page number)
            int? pageSize = null); // Optional parameter for pagination (number of records per page)
    }
}