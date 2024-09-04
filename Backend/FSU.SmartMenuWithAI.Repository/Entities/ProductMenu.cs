using System;
using System.Collections.Generic;
using FSU.SmartMenuWithAI.Repository.Entities;

namespace FSU.SmartMenuWithAI.Repository.Entities;
public partial class ProductMenu
{
    public int Price { get; set; }

    public int ProductId { get; set; }

    public int MenuId { get; set; }

    public int? DisplayIndex { get; set; }

    public virtual Menu Menu { get; set; } = null!;

    public virtual Product Product { get; set; } = null!;
}
