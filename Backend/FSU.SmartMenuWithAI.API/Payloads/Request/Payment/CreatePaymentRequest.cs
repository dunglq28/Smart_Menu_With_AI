namespace FSU.SmartMenuWithAI.API.Payloads.Request.Payment
{
    public class CreatePaymentRequest
    {
        public decimal? Amount { get; set; }

        public int UserId { get; set; }

        public string Email { get; set; } = null!;

    }
}
