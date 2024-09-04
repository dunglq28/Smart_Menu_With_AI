using System;
using System.Collections.Generic;

namespace FSU.SmartMenuWithAI.Repository.Entities;

public partial class MenuSegment
{
    public int Priority { get; set; }

    public int MenuId { get; set; }

    public int SegmentId { get; set; }

    public virtual Menu Menu { get; set; } = null!;

    public virtual CustomerSegment Segment { get; set; } = null!;
}
