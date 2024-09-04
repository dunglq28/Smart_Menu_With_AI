using System.ComponentModel.DataAnnotations;

namespace FSU.SmartMenuWithAI.API.Payloads.Request
{
    public class ChangePasswordRequest
    {
        [Required]
        [StringLength(100, MinimumLength = 6)]
        [RegularExpression(@"^[a-zA-Z0-9]+$", ErrorMessage = "Chỉ được chứa chữ cái và số")]
        public string OldPassword { get; set; } 

        [Required]
        [StringLength(100, MinimumLength = 6)]
        [RegularExpression(@"^[a-zA-Z0-9]+$", ErrorMessage = "Chỉ được chứa chữ cái và số")]
        public string NewPassword { get; set; }
        [Required]
        [StringLength(100, MinimumLength = 6)]
        [RegularExpression(@"^[a-zA-Z0-9]+$", ErrorMessage = "Chỉ được chứa chữ cái và số")]
        public string Confirm { get; set; } 
    }
}
