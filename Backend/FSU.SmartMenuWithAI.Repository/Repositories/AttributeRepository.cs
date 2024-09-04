using FSU.SmartMenuWithAI.Repository.Entities;
using FSU.SmartMenuWithAI.Repository.Interfaces;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Attribute = FSU.SmartMenuWithAI.Repository.Entities.Attribute;

namespace FSU.SmartMenuWithAI.Repository.Repositories
{
    public class AttributeRepository : GenericRepository<Attribute>, IAttributeRepository
    {
        private readonly SmartMenuContext _context;

        public AttributeRepository(SmartMenuContext context) : base(context)
        {
            _context = context;
        }
    }
}
