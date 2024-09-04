using System;
using System.Collections.Generic;

namespace FSU.SmartMenuWithAI.Repository.Entities;

public partial class GroupAttribute
{
    public int GroupAttributeId { get; set; }

    public string GroupAttributeName { get; set; } = null!;

    public DateOnly CreateDate { get; set; }

    public virtual ICollection<Attribute> Attributes { get; set; } = new List<Attribute>();
}
