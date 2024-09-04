using System;
using System.Collections.Generic;

namespace FSU.SmartMenuWithAI.Repository.Entities;

public partial class Attribute
{
    public int AttributeId { get; set; }

    public string AttributeCode { get; set; } = null!;

    public string AttributeName { get; set; } = null!;

    public string? Description { get; set; }

    public int Status { get; set; }

    public DateOnly CreateDate { get; set; }

    public DateOnly? UpdateDate { get; set; }

    public int GroupAttributeId { get; set; }

    public virtual GroupAttribute GroupAttribute { get; set; } = null!;

    public virtual ICollection<SegmentAttribute> SegmentAttributes { get; set; } = new List<SegmentAttribute>();

    public virtual ICollection<VisitAttribute> VisitAttributes { get; set; } = new List<VisitAttribute>();
}
