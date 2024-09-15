using System.ComponentModel.DataAnnotations;

namespace FSU.SmartMenuWithAI.API.Payloads.Request.Email
{
    public class EmailVerificationRequest
    {
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email address format")]
        public string Email { get; set; } = null!;

        [Required(ErrorMessage = "Verification code is required")]
        [StringLength(6, MinimumLength = 6, ErrorMessage = "Verification code must be 6 digits")]
        public string VerificationCode { get; set; } = null!;

    }
}
