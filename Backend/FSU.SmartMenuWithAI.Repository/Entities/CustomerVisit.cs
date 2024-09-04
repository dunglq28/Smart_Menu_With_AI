using System;
using System.Collections.Generic;

namespace FSU.SmartMenuWithAI.Repository.Entities;

public partial class CustomerVisit
{
    public int CustomerVisitId { get; set; }

    public string ImageCustomerUrl { get; set; } = null!;

    public string ImageCustomerName { get; set; } = null!;

    public DateOnly CreateDate { get; set; }

    public int? SegmentId { get; set; }

    public virtual ICollection<VisitAttribute> VisitAttributes { get; set; } = new List<VisitAttribute>();
}
