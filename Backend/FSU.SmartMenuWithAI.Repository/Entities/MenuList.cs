using System;
using System.Collections.Generic;

namespace FSU.SmartMenuWithAI.Repository.Entities;

public partial class MenuList
{
    public int MenuId { get; set; }

    public int ListId { get; set; }

    public int ListIndex { get; set; }

    public int BrandId { get; set; }

    public virtual ListPosition List { get; set; } = null!;

    public virtual Menu Menu { get; set; } = null!;
}
