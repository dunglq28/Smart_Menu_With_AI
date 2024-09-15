using FSU.SmartMenuWithAI.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FSU.SmartMenuWithAI.Service.ISerivice
{
    public interface IPlanService
    {
        Task<PlanDTO?> GetByIdAsync(int id);
        Task<List<PlanDTO>?> GetAll();
        Task<PlanDTO> Insert(string planName, int maxMenu, int maxAccount, decimal price);
        Task<bool> DeleteAsync(int id);
        Task<PlanDTO?> UpdateAsync(int id, string planName, int maxMenu, int maxAccount, decimal price);


    }
}
