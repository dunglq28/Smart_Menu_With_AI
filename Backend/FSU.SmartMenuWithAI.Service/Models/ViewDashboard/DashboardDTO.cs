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
        public int NumberOfBrands { get; set; }
        public decimal TotalRevenue { get; set; }

        public List<ListRevenue>? ListRevenue { get; set; }
        public List<AppUser> LatestUsers { get; set; } = new List<AppUser>();
        public List<TransactionDTO>? RecentTransactions { get; set; }  // Thêm thuộc tính cho giao dịch
        public List<ListBrand>? ListBrandCounts { get; set; } 

    }

    public class TransactionDTO
    {
        public int PaymentId { get; set; }
        public string? Email { get; set; }
        public int? Status { get; set; }
        public decimal? Amount { get; set; }
        public DateTime PaymentDate { get; set; }
        public string? TransactionId { get; set; }
    }
    public class ListBrand
    {
        public int Year { get; set; }
        public int Month { get; set; }
        public int TotalBrands { get; set; }
    }
}
