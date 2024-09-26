using System.ComponentModel.DataAnnotations;

namespace FSU.SmartMenuWithAI.API.Payloads.Request.Payment
{
    public class ConfirmRequest
    {
        [Required(ErrorMessage = "PaymentId is required.")]
        [Range(1, int.MaxValue, ErrorMessage = "PaymentId must be a positive number.")]
        public int PaymentId { get; set; }

        [Required(ErrorMessage = "UserId is required.")]
        [Range(1, int.MaxValue, ErrorMessage = "UserId must be a positive number.")]
        public int UserId { get; set; }

        [Required(ErrorMessage = "Status is required.")]
        [Range(0, int.MaxValue, ErrorMessage = "Status must be a non-negative number.")]
        public int Status { get; set; }
        public bool IsRenew {  get; set; }
    }
}
