using FSU.SmartMenuWithAI.Repository.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace FSU.SmartMenuWithAI.Repository.Interfaces
{
    public interface ICustomerSegmentRepository
    {
        public Task<IEnumerable<CustomerSegment>> Get(
           Expression<Func<CustomerSegment, bool>> filter = null!,
           Func<IQueryable<CustomerSegment>, IOrderedQueryable<CustomerSegment>> orderBy = null!,
           string includeProperties = "",
           int? pageIndex = null, 
           int? pageSize = null);
        public Task<CustomerSegment> getCusByAttribute(int ageId, int genderId, int sessionId, int ageValue, string gender, string session);
        
        }
}
