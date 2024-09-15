namespace FSU.SmartMenuWithAI.API.Payloads.Request.Payment
{
    public class ConfirmRequest
    {
        public int PaymentId { get; set; }
        public int PlanId { get; set; }
        public int UserId { get; set; }
    }
}
