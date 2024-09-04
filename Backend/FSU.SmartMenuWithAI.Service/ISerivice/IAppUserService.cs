using FSU.SmartMenuWithAI.Service.Models;
using FSU.SmartMenuWithAI.Service.Models.Pagination;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using static Amazon.S3.Util.S3EventNotification;

namespace FSU.SmartMenuWithAI.Service.ISerivice
{
    public interface IAppUserService
    {
        Task<PageEntity<AppUserDTO>> Get(
            int currentIDLogin,
            string searchKye,
            int? pageIndex = null, // Optional parameter for pagination (page number)
            int? pageSize = null); // Optional parameter for pagination (number of records per page)

        Task<AppUserDTO?> GetByID(int id);

        Task<int> Insert(AppUserDTO entity);

        Task<bool> Delete(int id);

        Task<bool> Update(int id, AppUserDTO entityToUpdate);

        Task<int> Count();
        
    }
}
