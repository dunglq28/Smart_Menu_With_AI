using FSU.SmartMenuWithAI.Repository.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FSU.SmartMenuWithAI.Service.Models.ViewDashboard
{
    public class DashboardDTO
    {
        public int NumberOfUsers { get; set; }
        public List<ListRevenue>? ListRevenue { get; set; }
        public int NumberOfMenus { get; set; }
        public List<AppUser> LatestUsers { get; set; } = new List<AppUser>();
        public List<TransactionDTO>? RecentTransactions { get; set; }  // Thêm thuộc tính cho giao dịch
    }

    public class TransactionDTO
    {
        public int PaymentId { get; set; }
        public decimal? Amount { get; set; }
        public DateTime PaymentDate { get; set; }
        public string? TransactionId { get; set; }
    }
}
