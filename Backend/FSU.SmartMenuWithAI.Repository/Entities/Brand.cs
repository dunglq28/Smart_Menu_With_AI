using System;
using System.Collections.Generic;

namespace FSU.SmartMenuWithAI.Repository.Entities;

public partial class Brand
{
    public int BrandId { get; set; }

    public string BrandCode { get; set; } = null!;

    public string BrandName { get; set; } = null!;

    public int UserId { get; set; }

    public DateOnly CreateDate { get; set; }

    public int Status { get; set; }

    public string? ImageUrl { get; set; }

    public string? ImageName { get; set; }

    public virtual ICollection<Category> Categories { get; set; } = new List<Category>();

    public virtual ICollection<CustomerSegment> CustomerSegments { get; set; } = new List<CustomerSegment>();

    public virtual ICollection<Menu> Menus { get; set; } = new List<Menu>();

    public virtual ICollection<Store> Stores { get; set; } = new List<Store>();

    public virtual AppUser User { get; set; } = null!;
}
