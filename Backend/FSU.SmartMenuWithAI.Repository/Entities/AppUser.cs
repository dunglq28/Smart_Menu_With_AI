using System;
using System.Collections.Generic;

namespace FSU.SmartMenuWithAI.Repository.Entities;

public partial class AppUser
{
    public int UserId { get; set; }

    public string UserCode { get; set; } = null!;

    public string UserName { get; set; } = null!;

    public string Password { get; set; } = null!;

    public int RoleId { get; set; }

    public DateOnly CreateDate { get; set; }

    public bool IsActive { get; set; }

    public int Status { get; set; }

    public string? Fullname { get; set; }

    public string? Phone { get; set; }

    public DateOnly? Dob { get; set; }

    public string? Gender { get; set; }

    public int? UpdateBy { get; set; }

    public DateOnly? UpdateDate { get; set; }

    public virtual ICollection<Brand> Brands { get; set; } = new List<Brand>();

    public virtual ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();

    public virtual Role Role { get; set; } = null!;

    public virtual ICollection<Store> Stores { get; set; } = new List<Store>();
}
