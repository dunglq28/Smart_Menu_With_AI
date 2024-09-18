using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FSU.SmartMenuWithAI.Service.Models
{
    public class SubscriptionInfoDTO
    {
        public int UserId { get; set; }
        public int SubscriptionId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        // Plan details
        public int PlanId { get; set; }
        public string PlanName { get; set; } = string.Empty;
        public decimal? Price { get; set; }
        public int MaxMenu { get; set; }
        public int MaxAccount { get; set; }

        // Additional counts
        public int MenuCount { get; set; }
        public int StoreCount { get; set; }

        // Payments for the user
        public IEnumerable<PaymentDTO> Payments { get; set; } = new List<PaymentDTO>();
    }

}
