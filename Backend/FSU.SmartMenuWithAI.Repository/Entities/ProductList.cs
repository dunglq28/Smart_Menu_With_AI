using System;
using System.Collections.Generic;

namespace FSU.SmartMenuWithAI.Repository.Entities;

public partial class ProductList
{
    public int ProductId { get; set; }

    public int ListId { get; set; }

    public int IndexInList { get; set; }

    public int BrandId { get; set; }

    public virtual ListPosition List { get; set; } = null!;

    public virtual Product Product { get; set; } = null!;
}
