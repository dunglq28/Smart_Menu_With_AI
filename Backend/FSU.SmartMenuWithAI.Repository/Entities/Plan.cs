using System;
using System.Collections.Generic;

namespace FSU.SmartMenuWithAI.Repository.Entities;

public partial class Plan
{
    public int PlanId { get; set; }

    public string PlanName { get; set; } = null!;

    public int MaxMenu { get; set; }

    public int MaxAccount { get; set; }

    public decimal? Price { get; set; }

    public virtual ICollection<Subscription> Subscriptions { get; set; } = new List<Subscription>();
}
