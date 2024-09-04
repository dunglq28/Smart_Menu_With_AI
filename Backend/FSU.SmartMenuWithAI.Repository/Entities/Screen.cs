using System;
using System.Collections.Generic;

namespace FSU.SmartMenuWithAI.Repository.Entities;

public partial class Screen
{
    public int ScreenId { get; set; }

    public int StoreId { get; set; }

    public virtual Store Store { get; set; } = null!;
}
