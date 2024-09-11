using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FSU.SmartMenuWithAI.Service.Models
{
    public class SubscriptionDTO
    {
        public int SubscriptionId { get; set; }

        public string SubscriptionCode { get; set; } = null!;

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public int Status { get; set; }

        public int UserId { get; set; }

        public string Email { get; set; } = null!;

        public int PaymentId { get; set; }

        public int PlanId { get; set; }
    }
}
