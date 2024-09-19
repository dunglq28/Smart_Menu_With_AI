using FSU.SmartMenuWithAI.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FSU.SmartMenuWithAI.Service.ISerivice
{
    public interface ISubscriptionService
    {
        Task<SubscriptionInfoDTO?> GetUserSubscriptionInfoAsync(int userId);
    }
}
