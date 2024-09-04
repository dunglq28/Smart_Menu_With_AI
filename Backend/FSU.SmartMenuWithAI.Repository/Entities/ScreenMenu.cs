using System;
using System.Collections.Generic;

namespace FSU.SmartMenuWithAI.Repository.Entities;

public partial class ScreenMenu
{
    public DateOnly FromTime { get; set; }

    public DateOnly ToTime { get; set; }

    public int Status { get; set; }

    public int ScreenId { get; set; }

    public int MenuId { get; set; }

    public virtual Menu Menu { get; set; } = null!;

    public virtual Screen Screen { get; set; } = null!;
}
