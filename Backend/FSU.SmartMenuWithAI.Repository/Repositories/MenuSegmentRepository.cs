using FSU.SmartMenuWithAI.Repository.Entities;
using FSU.SmartMenuWithAI.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace FSU.SmartMenuWithAI.Repository.Repositories
{
    public class MenuSegmentRepository : GenericRepository<MenuSegment>, IMenuSegmentRepository
    {
        private readonly SmartMenuContext _context;
        private readonly IConfiguration _configuration;

        public MenuSegmentRepository(SmartMenuContext context, IConfiguration configuration) : base(context)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<MenuSegment> HighestMenuSegment(int segmentId, int BrandId)
        {
            var highestMenuPriority = await _context.MenuSegments
                .Include(x => x.Menu)
                //.Include(x => x.Segment)
                .Where(ms => ms.SegmentId == segmentId
            && ms.Menu.BrandId == BrandId).OrderBy( ms => ms.Priority).FirstOrDefaultAsync();
            if (highestMenuPriority != null)
            {
                return highestMenuPriority;
            }
            return null!;
        }

    }
}
