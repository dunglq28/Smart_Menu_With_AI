using System;
using System.Collections.Generic;

namespace FSU.SmartMenuWithAI.Repository.Entities;

public partial class Payment
{
    public int PaymentId { get; set; }

    public decimal? Amount { get; set; }

    public int Status { get; set; }

    public DateTime PaymentDate { get; set; }

    public string? TransactionId { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public int UserId { get; set; }

    public string Email { get; set; } = null!;

    public virtual Subscription? Subscription { get; set; }

    public virtual AppUser User { get; set; } = null!;
}
