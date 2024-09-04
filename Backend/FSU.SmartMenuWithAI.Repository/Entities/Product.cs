using System;
using System.Collections.Generic;

namespace FSU.SmartMenuWithAI.Repository.Entities;

public partial class Product
{
    public int ProductId { get; set; }

    public string ProductCode { get; set; } = null!;

    public DateOnly CreateDate { get; set; }

    public string ProductName { get; set; } = null!;

    public string? SpotlightVideoImageUrl { get; set; }

    public string? SpotlightVideoImageName { get; set; }

    public string? ImageUrl { get; set; }

    public string? ImageName { get; set; }

    public string? Description { get; set; }

    public int CategoryId { get; set; }

    public int BrandId { get; set; }

    public decimal? Price { get; set; }

    public virtual Category Category { get; set; } = null!;

    public virtual ICollection<ProductList> ProductLists { get; set; } = new List<ProductList>();
}
