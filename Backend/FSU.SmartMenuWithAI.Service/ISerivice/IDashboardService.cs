using FSU.SmartMenuWithAI.Service.Models.ViewDashboard;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FSU.SmartMenuWithAI.Service.ISerivice
{
    public interface IDashboardService
    {
        Task<DashboardDTO> GetDashboard();

    }
}
