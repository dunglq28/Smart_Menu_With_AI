using System;
using System.Collections.Generic;

namespace FSU.SmartMenuWithAI.Repository.Entities;

public partial class Store
{
    public int StoreId { get; set; }

    public string StoreCode { get; set; } = null!;

    public int UserId { get; set; }

    public DateOnly CreateDate { get; set; }

    public bool IsActive { get; set; }

    public DateOnly? UpdateDate { get; set; }

    public int Status { get; set; }

    public string Address { get; set; } = null!;

    public string City { get; set; } = null!;

    public int BrandId { get; set; }

    public virtual Brand Brand { get; set; } = null!;

    public virtual ICollection<Screen> Screens { get; set; } = new List<Screen>();

    public virtual AppUser User { get; set; } = null!;
}
