using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FSU.SmartMenuWithAI.Service.Models
{
    public class PlanDTO
    {
        public int PlanId { get; set; }

        public string PlanName { get; set; } = null!;

        public int MaxMenu { get; set; }

        public int MaxAccount { get; set; }

        public decimal? Price { get; set; }
    }
}
