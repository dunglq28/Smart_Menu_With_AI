namespace FSU.SmartMenuWithAI.API.Payloads.Request.Payment
{
    public class ConfirmRequest
    {
        public int PaymentId { get; set; }
        public int SubscriptionId { get; set; }
        public int UserId { get; set; }
        public int Status { get; set; }
    }
}
