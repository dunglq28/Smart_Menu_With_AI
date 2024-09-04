using FSU.SmartMenuWithAI.Repository.Entities;
using FSU.SmartMenuWithAI.Repository.Interfaces;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FSU.SmartMenuWithAI.Repository.Repositories
{
    public class ProductListRepository : GenericRepository<ProductList>, IProductListRepository
    {
        private readonly SmartMenuContext _context;

        public ProductListRepository(SmartMenuContext context) : base(context)
        {
            _context = context;
        }
    }
}
