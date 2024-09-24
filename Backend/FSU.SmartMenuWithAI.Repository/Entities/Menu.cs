using System;
using System.Collections.Generic;

namespace FSU.SmartMenuWithAI.Repository.Entities;

public partial class Menu
{
    public int MenuId { get; set; }

    public string MenuCode { get; set; } = null!;

    public DateOnly CreateDate { get; set; }

    public bool IsActive { get; set; }

    public string? MenuImage { get; set; }

    public string? Description { get; set; }

    public int? Priority { get; set; }

    public int BrandId { get; set; }

    public int? TimeRcm { get; set; }

    public virtual Brand Brand { get; set; } = null!;

    public virtual ICollection<MenuList> MenuLists { get; set; } = new List<MenuList>();

    public virtual ICollection<MenuSegment> MenuSegments { get; set; } = new List<MenuSegment>();
}
