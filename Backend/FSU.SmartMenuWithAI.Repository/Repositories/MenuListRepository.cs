using FSU.SmartMenuWithAI.Repository.Entities;
using FSU.SmartMenuWithAI.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FSU.SmartMenuWithAI.Repository.Repositories
{
    public class MenuListRepository : GenericRepository<MenuList>, IMenuListRepository
    {
        private readonly SmartMenuContext _context;
        private readonly IConfiguration _configuration;

        public MenuListRepository(SmartMenuContext context, IConfiguration configuration) : base(context)
        {
            _context = context;
            _configuration = configuration;
        }
    }

}
