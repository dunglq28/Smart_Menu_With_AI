using FSU.SmartMenuWithAI.Repository.Entities;
using FSU.SmartMenuWithAI.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FSU.SmartMenuWithAI.Repository.Repositories
{
    public class SegmentAttributeRepository : GenericRepository<SegmentAttribute>, ISegmentAttributeRepository
    {
        private readonly SmartMenuContext _context;

        public SegmentAttributeRepository(SmartMenuContext context) : base(context)
        {
            _context = context;
        }
        public virtual async Task UpdateAsync(SegmentAttribute entityToUpdate)
        {
            dbSet.Attach(entityToUpdate);
            context.Entry(entityToUpdate).State = EntityState.Modified;
            await context.SaveChangesAsync();
        }
        public async Task BatchUpdate(IEnumerable<SegmentAttribute> entities)
        {
            foreach (var entity in entities)
            {
                // Attach entity to the context if not already attached
                if (!_context.Set<SegmentAttribute>().Local.Any(e => e.SegmentId == entity.SegmentId))
                {
                    _context.Attach(entity);
                }

                // Mark entity state as modified to trigger an update
                _context.Entry(entity).State = EntityState.Modified;
            }

            // Save changes asynchronously
            await _context.SaveChangesAsync();
        }

    }
}
