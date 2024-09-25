using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FSU.SmartMenuWithAI.Service.Models
{
    public class PaymentDTO
    {
        public int PaymentId { get; set; }

        public decimal? Amount { get; set; }

        public int Status { get; set; }

        public DateTime PaymentDate { get; set; }

        public string? TransactionId { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        public int UserId { get; set; }

        public string Email { get; set; } = null!;
        // Các thuộc tính từ Subscription và Plan
        public int? SubscriptionId { get; set; }
        public int? PlanId { get; set; }
        public string? PlanName { get; set; }
    }
}
