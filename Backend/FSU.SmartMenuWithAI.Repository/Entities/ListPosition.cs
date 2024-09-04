using System;
using System.Collections.Generic;

namespace FSU.SmartMenuWithAI.Repository.Entities;

public partial class ListPosition
{
    public int ListId { get; set; }

    public string ListCode { get; set; } = null!;

    public int? TotalProduct { get; set; }

    public DateOnly CreateDate { get; set; }

    public int BrandId { get; set; }

    public string? ListName { get; set; }

    public virtual ICollection<MenuList> MenuLists { get; set; } = new List<MenuList>();

    public virtual ICollection<ProductList> ProductLists { get; set; } = new List<ProductList>();
}
